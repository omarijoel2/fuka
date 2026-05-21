<?php

namespace App\Http\Controllers;

use App\Models\ProfileSubmission;
use App\Models\ProfileSubmissionComment;
use App\Models\StaffSecurityEvent;
use App\Models\User;
use Illuminate\Http\Request;

class ReviewerController extends Controller
{
    public function queue(Request $request)
    {
        $reviewer = $request->user();
        $status = $request->get('status', 'submitted');
        $dept   = $request->get('department');

        $query = ProfileSubmission::with(['user', 'comments.author'])
            ->whereIn('workflow_status', ['submitted', 'under_review', 'revision_requested', 'approved']);

        if ($status !== 'all') {
            $query->where('workflow_status', $status);
        }

        if ($dept) {
            $query->whereHas('user', fn($q) => $q->where('department', $dept));
        }

        // Department reviewer scoped to their department
        if ($reviewer->role === 'reviewer' && $reviewer->department) {
            $query->whereHas('user', fn($q) => $q->where('department', $reviewer->department));
        }

        $submissions = $query->orderBy('submitted_at')->paginate(20);
        return response()->json($submissions);
    }

    public function show(Request $request, int $id)
    {
        $submission = ProfileSubmission::with(['user', 'comments.author', 'approvedByUser', 'reviewedByUser'])->findOrFail($id);
        return response()->json(['submission' => $submission]);
    }

    public function review(Request $request, int $id)
    {
        $submission = ProfileSubmission::findOrFail($id);

        if ($submission->workflow_status !== 'submitted') {
            return response()->json(['message' => 'Submission must be in submitted status to start review.'], 422);
        }

        $submission->update([
            'workflow_status' => 'under_review',
            'reviewed_by'     => $request->user()->id,
            'reviewed_at'     => now(),
        ]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author')]);
    }

    public function approve(Request $request, int $id)
    {
        $data = $request->validate(['notes' => 'nullable|string|max:2000']);
        $submission = ProfileSubmission::with('user')->findOrFail($id);

        if (!in_array($submission->workflow_status, ['submitted', 'under_review'])) {
            return response()->json(['message' => 'Submission is not in a reviewable state.'], 422);
        }

        $submission->update([
            'workflow_status' => 'approved',
            'approved_by'     => $request->user()->id,
            'approved_at'     => now(),
            'reviewer_summary'=> $data['notes'] ?? null,
        ]);

        if ($data['notes'] ?? null) {
            ProfileSubmissionComment::create([
                'submission_id' => $submission->id,
                'author_id'     => $request->user()->id,
                'comment'       => $data['notes'],
                'comment_type'  => 'approval',
            ]);
        }

        StaffSecurityEvent::log('profile_approved', $submission->user_id, $submission->user->email,
            ['submission_id' => $id, 'reviewer_id' => $request->user()->id]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author'), 'message' => 'Profile approved.']);
    }

    public function requestRevision(Request $request, int $id)
    {
        $data = $request->validate([
            'notes'   => 'required|string|max:3000',
            'section' => 'nullable|string|max:50',
        ]);

        $submission = ProfileSubmission::with('user')->findOrFail($id);

        if (!in_array($submission->workflow_status, ['submitted', 'under_review'])) {
            return response()->json(['message' => 'Submission is not in a reviewable state.'], 422);
        }

        $submission->update(['workflow_status' => 'revision_requested', 'reviewer_summary' => $data['notes']]);

        ProfileSubmissionComment::create([
            'submission_id' => $submission->id,
            'author_id'     => $request->user()->id,
            'section'       => $data['section'] ?? null,
            'comment'       => $data['notes'],
            'comment_type'  => 'revision_request',
        ]);

        StaffSecurityEvent::log('revision_requested', $submission->user_id, $submission->user->email,
            ['submission_id' => $id, 'reviewer_id' => $request->user()->id]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author'), 'message' => 'Revision requested.']);
    }

    public function reject(Request $request, int $id)
    {
        $data = $request->validate(['notes' => 'required|string|max:2000']);
        $submission = ProfileSubmission::with('user')->findOrFail($id);

        $submission->update(['workflow_status' => 'draft', 'reviewer_summary' => $data['notes']]);

        ProfileSubmissionComment::create([
            'submission_id' => $submission->id,
            'author_id'     => $request->user()->id,
            'comment'       => $data['notes'],
            'comment_type'  => 'rejection',
        ]);

        StaffSecurityEvent::log('profile_rejected', $submission->user_id, $submission->user->email,
            ['submission_id' => $id]);

        return response()->json(['submission' => $submission->fresh()->load('user', 'comments.author'), 'message' => 'Submission rejected.']);
    }

    public function addComment(Request $request, int $id)
    {
        $data = $request->validate([
            'comment'      => 'required|string|max:3000',
            'section'      => 'nullable|string|max:50',
            'comment_type' => 'nullable|in:note,revision_request,approval,rejection',
        ]);

        $submission = ProfileSubmission::findOrFail($id);

        $comment = ProfileSubmissionComment::create([
            'submission_id' => $submission->id,
            'author_id'     => $request->user()->id,
            'section'       => $data['section'] ?? null,
            'comment'       => $data['comment'],
            'comment_type'  => $data['comment_type'] ?? 'note',
        ]);

        return response()->json(['comment' => $comment->load('author')]);
    }
}
