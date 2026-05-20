<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\CmsContent;
use App\Models\CmsRevision;
use App\Models\MediaFile;
use App\Models\AuditLog;
use App\Models\TaxonomyTerm;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| KAFU CMS Admin API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    // -------------------------------------------------------------------------
    // Auth
    // -------------------------------------------------------------------------
    Route::post('/auth/login', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->where('status', 'active')->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials or account inactive.'],
            ]);
        }

        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('cms-admin', ['*'], now()->addHours(8))->plainTextToken;

        AuditLog::record($user, 'login', 'user', $user->id, $user->name);

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'role_label' => User::roles()[$user->role] ?? $user->role,
                'department' => $user->department,
                'school_code' => $user->school_code,
                'avatar_url' => $user->avatar_url,
            ],
        ]);
    })->middleware('throttle:10,1');

    // ── Password Reset (public, no auth required) ─────────────────────────────
    Route::post('/auth/forgot-password', function (Request $request) {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->where('status', 'active')->first();
        $response = ['message' => 'If that email is registered, a password reset link has been sent.'];
        if ($user) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            $token = Str::random(64);
            DB::table('password_reset_tokens')->insert([
                'email'      => $request->email,
                'token'      => Hash::make($token),
                'created_at' => now(),
            ]);
            AuditLog::record($user, 'password_reset_request', 'user', $user->id, $user->email);
            if (app()->environment('local')) {
                $response['dev_token'] = $token;
                $response['dev_note'] = 'Token returned because APP_ENV=local. In production, this is sent by email only.';
            }
        }
        return response()->json($response);
    })->middleware('throttle:5,1');

    Route::post('/auth/reset-password', function (Request $request) {
        $request->validate([
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'password'              => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
        ]);
        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();
        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Invalid or expired reset token. Please request a new one.'], 422);
        }
        if (now()->diffInMinutes(\Carbon\Carbon::parse($record->created_at)) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'This reset link has expired. Please request a new one.'], 422);
        }
        $user = User::where('email', $request->email)->where('status', 'active')->first();
        if (!$user) {
            return response()->json(['message' => 'Account not found or inactive.'], 404);
        }
        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        AuditLog::record($user, 'password_reset_complete', 'user', $user->id, $user->email);
        return response()->json(['message' => 'Password reset successfully. You may now log in.']);
    })->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/auth/logout', function (Request $request) {
            $request->user()->currentAccessToken()->delete();
            AuditLog::record($request->user(), 'logout');
            return response()->json(['message' => 'Logged out successfully.']);
        });

        Route::get('/auth/me', function (Request $request) {
            $user = $request->user();
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'role_label' => User::roles()[$user->role] ?? $user->role,
                'department' => $user->department,
                'school_code' => $user->school_code,
                'avatar_url' => $user->avatar_url,
            ]);
        });

        // -------------------------------------------------------------------------
        // Dashboard
        // -------------------------------------------------------------------------
        Route::get('/dashboard', function (Request $request) {
            $user = $request->user();

            $pending = CmsContent::where('status', 'submitted')
                ->orWhere('status', 'under_review')
                ->count();

            $draft = CmsContent::where('status', 'draft')
                ->where('is_deleted', false)
                ->count();

            $published = CmsContent::where('status', 'published')
                ->where('is_deleted', false)
                ->count();

            $expiringSoon = CmsContent::where('status', 'published')
                ->where('expiry_date', '<=', now()->addDays(14))
                ->where('expiry_date', '>=', now())
                ->count();

            $byType = CmsContent::where('is_deleted', false)
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type');

            $recentActivity = AuditLog::orderByDesc('created_at')
                ->limit(10)
                ->get(['user_name', 'user_role', 'action', 'entity_type', 'entity_title', 'created_at']);

            $reviewQueue = CmsContent::whereIn('status', ['submitted', 'under_review'])
                ->where('is_deleted', false)
                ->orderBy('updated_at')
                ->limit(5)
                ->get(['id', 'type', 'title', 'status', 'department', 'updated_at']);

            return response()->json([
                'stats' => [
                    'pending_review' => $pending,
                    'draft' => $draft,
                    'published' => $published,
                    'expiring_soon' => $expiringSoon,
                    'total_content' => CmsContent::where('is_deleted', false)->count(),
                    'total_media' => MediaFile::where('status', 'active')->count(),
                    'total_users' => User::where('status', 'active')->count(),
                ],
                'by_type' => $byType,
                'recent_activity' => $recentActivity,
                'review_queue' => $reviewQueue,
            ]);
        });

        // -------------------------------------------------------------------------
        // Content CRUD
        // -------------------------------------------------------------------------
        Route::get('/content', function (Request $request) {
            $user = $request->user();

            $q = CmsContent::where('is_deleted', false)
                ->forRole($user);

            if ($request->type) $q->where('type', $request->type);
            if ($request->status) $q->where('status', $request->status);
            if ($request->department) $q->where('department', $request->department);
            if ($request->search) {
                $q->where(function ($sub) use ($request) {
                    $sub->where('title', 'like', '%' . $request->search . '%')
                        ->orWhere('summary', 'like', '%' . $request->search . '%');
                });
            }

            $content = $q->with('author:id,name,role')
                ->orderByDesc('updated_at')
                ->paginate((int) ($request->per_page ?? 20));

            return response()->json($content);
        });

        Route::post('/content', function (Request $request) {
            $user = $request->user();

            $data = $request->validate([
                'type'            => 'required|string',
                'title'           => 'required|string|max:500',
                'slug'            => 'required|string|unique:cms_content,slug',
                'summary'         => 'nullable|string',
                'body'            => 'nullable|string',
                'category'        => 'nullable|string',
                'department'      => 'nullable|string',
                'school_code'     => 'nullable|string',
                'featured_image'  => 'nullable|string',
                'featured'        => 'nullable|boolean',
                'tags'            => 'nullable|array',
                'publish_date'    => 'nullable|date',
                'expiry_date'     => 'nullable|date',
                'seo_meta'        => 'nullable|array',
                'structured_data' => 'nullable|array',
                'related_ids'     => 'nullable|array',
            ]);

            $data['author_id'] = $user->id;
            $data['status'] = 'draft';
            $data['current_version'] = 1;

            $content = CmsContent::create($data);

            CmsRevision::create([
                'content_id'     => $content->id,
                'version'        => 1,
                'status'         => 'draft',
                'snapshot'       => $content->toArray(),
                'created_by'     => $user->id,
                'change_summary' => 'Initial draft created',
            ]);

            AuditLog::record($user, 'content.create', $content->type, $content->id, $content->title,
                null, $data);

            return response()->json(['data' => $content->load('author:id,name,role')], 201);
        });

        Route::get('/content/{id}', function (Request $request, $id) {
            $user = $request->user();
            $content = CmsContent::forRole($user)->with('author:id,name,role')->findOrFail($id);
            return response()->json(['data' => $content]);
        });

        Route::put('/content/{id}', function (Request $request, $id) {
            $user = $request->user();
            $content = CmsContent::forRole($user)->findOrFail($id);

            if (!in_array($content->status, ['draft', 'unpublished'])) {
                if (!$user->isCentralAdmin()) {
                    return response()->json(['message' => 'Cannot edit content in current workflow state.'], 403);
                }
            }

            $data = $request->validate([
                'title'           => 'sometimes|string|max:500',
                'slug'            => 'sometimes|string|unique:cms_content,slug,' . $id,
                'summary'         => 'nullable|string',
                'body'            => 'nullable|string',
                'category'        => 'nullable|string',
                'department'      => 'nullable|string',
                'school_code'     => 'nullable|string',
                'featured_image'  => 'nullable|string',
                'featured'        => 'nullable|boolean',
                'tags'            => 'nullable|array',
                'publish_date'    => 'nullable|date',
                'expiry_date'     => 'nullable|date',
                'seo_meta'        => 'nullable|array',
                'structured_data' => 'nullable|array',
                'related_ids'     => 'nullable|array',
            ]);

            $before = $content->toArray();
            $newVersion = $content->current_version + 1;
            $data['current_version'] = $newVersion;

            $content->update($data);

            CmsRevision::create([
                'content_id'     => $content->id,
                'version'        => $newVersion,
                'status'         => $content->status,
                'snapshot'       => $content->fresh()->toArray(),
                'created_by'     => $user->id,
                'change_summary' => $request->change_summary ?? 'Content updated',
            ]);

            AuditLog::record($user, 'content.update', $content->type, $content->id, $content->title,
                $before, $content->fresh()->toArray());

            return response()->json(['data' => $content->fresh()->load('author:id,name,role')]);
        });

        Route::delete('/content/{id}', function (Request $request, $id) {
            $user = $request->user();

            if (!$user->isCentralAdmin() && !$user->hasRole(['department_editor'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $content = CmsContent::findOrFail($id);
            $before = $content->toArray();

            $content->update(['is_deleted' => true, 'status' => 'archived']);

            AuditLog::record($user, 'content.delete', $content->type, $content->id, $content->title,
                $before, null, 'Soft deleted');

            return response()->json(['message' => 'Content deleted (soft).']);
        });

        // -------------------------------------------------------------------------
        // Workflow Transitions
        // -------------------------------------------------------------------------
        Route::post('/content/{id}/transition', function (Request $request, $id) {
            $user = $request->user();
            $content = CmsContent::where('is_deleted', false)->findOrFail($id);

            $request->validate([
                'to_status' => 'required|string',
                'notes'     => 'nullable|string|max:500',
            ]);

            $toStatus = $request->to_status;
            $fromStatus = $content->status;

            $allowed = CmsContent::allowedTransitions()[$fromStatus] ?? [];
            if (!in_array($toStatus, $allowed)) {
                return response()->json([
                    'message' => "Cannot transition from '{$fromStatus}' to '{$toStatus}'.",
                    'allowed' => $allowed,
                ], 422);
            }

            $permittedRoles = CmsContent::roleTransitionPermissions()[$toStatus] ?? [];
            if (!$user->hasRole($permittedRoles)) {
                return response()->json([
                    'message' => 'Your role does not have permission to make this transition.',
                ], 403);
            }

            $timestamps = match ($toStatus) {
                'under_review' => ['reviewed_at' => now(), 'reviewer_id' => $user->id],
                'approved'     => ['approved_at' => now(), 'approver_id' => $user->id],
                'published'    => ['published_at' => now()],
                'archived'     => ['archived_at' => now()],
                default        => [],
            };

            $content->update(array_merge(['status' => $toStatus], $timestamps));

            AuditLog::record($user, "content.transition.{$toStatus}", $content->type, $content->id,
                $content->title, ['status' => $fromStatus], ['status' => $toStatus],
                $request->notes);

            return response()->json([
                'message' => "Content moved to '{$toStatus}'.",
                'data'    => $content->fresh(),
            ]);
        });

        // -------------------------------------------------------------------------
        // Revisions
        // -------------------------------------------------------------------------
        Route::get('/content/{id}/revisions', function (Request $request, $id) {
            $content = CmsContent::findOrFail($id);
            $revisions = $content->revisions()->get(['id', 'version', 'status', 'created_by', 'change_summary', 'created_at']);
            return response()->json(['data' => $revisions]);
        });

        Route::post('/content/{id}/revisions/{revisionId}/restore', function (Request $request, $id, $revisionId) {
            $user = $request->user();

            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Only central admins can restore revisions.'], 403);
            }

            $content = CmsContent::findOrFail($id);
            $revision = CmsRevision::where('content_id', $id)->findOrFail($revisionId);

            $before = $content->toArray();
            $snapshot = $revision->snapshot;

            $content->update(array_intersect_key($snapshot, array_flip([
                'title', 'slug', 'summary', 'body', 'category', 'department',
                'school_code', 'featured_image', 'featured', 'tags', 'seo_meta',
                'structured_data', 'related_ids', 'publish_date', 'expiry_date',
            ])));
            $content->update(['status' => 'draft']);

            AuditLog::record($user, 'content.rollback', $content->type, $content->id, $content->title,
                $before, $content->fresh()->toArray(), "Restored to v{$revision->version}");

            return response()->json(['message' => "Restored to version {$revision->version}.", 'data' => $content->fresh()]);
        });

        // -------------------------------------------------------------------------
        // Review Queue
        // -------------------------------------------------------------------------
        Route::get('/review-queue', function (Request $request) {
            $user = $request->user();
            if (!$user->canReview()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $items = CmsContent::whereIn('status', ['submitted', 'under_review'])
                ->where('is_deleted', false)
                ->with('author:id,name,role')
                ->orderBy('updated_at')
                ->paginate(30);

            return response()->json($items);
        });

        // -------------------------------------------------------------------------
        // Media Library
        // -------------------------------------------------------------------------
        Route::get('/media', function (Request $request) {
            $q = MediaFile::where('status', 'active');
            if ($request->folder) $q->where('folder', $request->folder);
            if ($request->type === 'image') $q->where('mime_type', 'like', 'image/%');
            if ($request->type === 'document') $q->where('mime_type', 'not like', 'image/%');
            if ($request->search) $q->where('original_name', 'like', '%' . $request->search . '%');

            $perPage = min(max((int)($request->per_page ?? 24), 1), 100);
            return response()->json($q->orderByDesc('created_at')->paginate($perPage));
        });

        Route::post('/media', function (Request $request) {
            $user = $request->user();

            $request->validate([
                'file'     => 'required|file|max:20480',
                'folder'   => 'nullable|string',
                'alt_text' => 'nullable|string|max:300',
            ]);

            $file = $request->file('file');
            $folder = $request->folder ?? 'general';
            $filename = uniqid() . '_' . preg_replace('/[^a-z0-9._-]/', '_', strtolower($file->getClientOriginalName()));
            $path = $file->storeAs("media/{$folder}", $filename, 'public');

            $media = MediaFile::create([
                'filename'      => $filename,
                'original_name' => $file->getClientOriginalName(),
                'mime_type'     => $file->getMimeType(),
                'extension'     => $file->getClientOriginalExtension(),
                'size'          => $file->getSize(),
                'path'          => $path,
                'url'           => asset("storage/{$path}"),
                'folder'        => $folder,
                'alt_text'      => $request->alt_text,
                'uploaded_by'   => $user->id,
                'is_public'     => true,
                'status'        => 'active',
            ]);

            AuditLog::record($user, 'media.upload', 'media_file', $media->id, $media->original_name);

            return response()->json(['data' => $media], 201);
        });

        Route::delete('/media/{id}', function (Request $request, $id) {
            $user = $request->user();
            $media = MediaFile::findOrFail($id);
            AuditLog::record($user, 'media.delete', 'media_file', $media->id, $media->original_name);
            $media->update(['status' => 'deleted']);
            return response()->json(['message' => 'Media file deleted.']);
        });

        // -------------------------------------------------------------------------
        // Users
        // -------------------------------------------------------------------------
        Route::get('/users', function (Request $request) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $q = User::select(['id', 'name', 'email', 'role', 'department', 'school_code', 'status', 'last_login_at', 'created_at']);
            if ($request->role) $q->where('role', $request->role);
            if ($request->status) $q->where('status', $request->status);
            if ($request->search) {
                $q->where(function ($sub) use ($request) {
                    $sub->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            return response()->json($q->orderBy('name')->paginate(30));
        });

        Route::get('/users/{id}', function (Request $request, $id) {
            $user = $request->user();
            if (!$user->isCentralAdmin() && $user->id !== (int) $id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            $target = User::findOrFail($id);
            return response()->json(['data' => $target->makeHidden(['password'])]);
        });

        Route::post('/users', function (Request $request) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $data = $request->validate([
                'name'        => 'required|string|max:200',
                'email'       => 'required|email|unique:users,email',
                'password'    => 'required|string|min:8',
                'role'        => 'required|string|in:' . implode(',', array_keys(User::roles())),
                'department'  => 'nullable|string',
                'school_code' => 'nullable|string',
            ]);

            $data['password'] = Hash::make($data['password']);
            $data['status'] = 'active';

            $newUser = User::create($data);

            AuditLog::record($user, 'user.create', 'user', $newUser->id, $newUser->name,
                null, ['role' => $newUser->role, 'email' => $newUser->email]);

            return response()->json(['data' => $newUser->makeHidden(['password'])], 201);
        });

        Route::put('/users/{id}', function (Request $request, $id) {
            $user = $request->user();
            $target = User::findOrFail($id);

            if (!$user->isCentralAdmin() && $user->id !== $target->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $rules = [
                'name'        => 'sometimes|string|max:200',
                'department'  => 'nullable|string',
                'avatar_url'  => 'nullable|string',
            ];

            if ($user->isCentralAdmin()) {
                $rules['role']        = 'sometimes|string|in:' . implode(',', array_keys(User::roles()));
                $rules['status']      = 'sometimes|string|in:active,inactive,suspended';
                $rules['school_code'] = 'nullable|string';
            }

            $data = $request->validate($rules);
            $before = $target->makeHidden(['password'])->toArray();
            $target->update($data);

            AuditLog::record($user, 'user.update', 'user', $target->id, $target->name,
                $before, $target->fresh()->makeHidden(['password'])->toArray());

            return response()->json(['data' => $target->fresh()->makeHidden(['password'])]);
        });

        Route::get('/users/roles/list', function () {
            return response()->json(['data' => User::roles()]);
        });

        // -------------------------------------------------------------------------
        // Taxonomy
        // -------------------------------------------------------------------------
        Route::get('/taxonomy', function (Request $request) {
            $q = TaxonomyTerm::query();
            if ($request->vocabulary) $q->where('vocabulary', $request->vocabulary);
            return response()->json([
                'vocabularies' => TaxonomyTerm::vocabularies(),
                'terms' => $q->orderBy('vocabulary')->orderBy('name')->get(),
            ]);
        });

        Route::post('/taxonomy', function (Request $request) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $data = $request->validate([
                'vocabulary'   => 'required|string',
                'name'         => 'required|string|max:200',
                'slug'         => 'required|string',
                'description'  => 'nullable|string',
                'parent_id'    => 'nullable|integer',
                'is_controlled'=> 'nullable|boolean',
            ]);
            $data['created_by_role'] = $user->role;

            $term = TaxonomyTerm::create($data);
            AuditLog::record($user, 'taxonomy.create', 'taxonomy_term', $term->id, $term->name);

            return response()->json(['data' => $term], 201);
        });

        Route::put('/taxonomy/{id}', function (Request $request, $id) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $term = TaxonomyTerm::findOrFail($id);
            $data = $request->validate([
                'name'        => 'sometimes|string|max:200',
                'description' => 'nullable|string',
                'parent_id'   => 'nullable|integer',
            ]);

            $term->update($data);
            return response()->json(['data' => $term->fresh()]);
        });

        Route::delete('/taxonomy/{id}', function (Request $request, $id) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $term = TaxonomyTerm::findOrFail($id);
            AuditLog::record($user, 'taxonomy.delete', 'taxonomy_term', $term->id, $term->name);
            $term->delete();

            return response()->json(['message' => 'Term deleted.']);
        });

        // -------------------------------------------------------------------------
        // Audit Logs
        // -------------------------------------------------------------------------
        Route::get('/audit-logs', function (Request $request) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $q = AuditLog::query();
            if ($request->action) $q->where('action', 'like', '%' . $request->action . '%');
            if ($request->entity_type) $q->where('entity_type', $request->entity_type);
            if ($request->user_id) $q->where('user_id', $request->user_id);
            if ($request->from) $q->where('created_at', '>=', $request->from);
            if ($request->to) $q->where('created_at', '<=', $request->to);
            if ($request->search) {
                $q->where(function ($sub) use ($request) {
                    $sub->where('user_name', 'like', '%' . $request->search . '%')
                        ->orWhere('entity_title', 'like', '%' . $request->search . '%');
                });
            }

            return response()->json($q->orderByDesc('created_at')->paginate(50));
        });

        // -------------------------------------------------------------------------
        // Reports
        // -------------------------------------------------------------------------
        Route::get('/reports/content-health', function (Request $request) {
            $user = $request->user();
            if (!$user->isCentralAdmin()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json([
                'by_status' => CmsContent::where('is_deleted', false)
                    ->selectRaw('status, count(*) as count')
                    ->groupBy('status')
                    ->pluck('count', 'status'),
                'by_type' => CmsContent::where('is_deleted', false)
                    ->selectRaw('type, count(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type'),
                'stale_drafts' => CmsContent::where('status', 'draft')
                    ->where('is_deleted', false)
                    ->where('updated_at', '<', now()->subDays(30))
                    ->count(),
                'overdue_reviews' => CmsContent::whereIn('status', ['submitted', 'under_review'])
                    ->where('updated_at', '<', now()->subDays(3))
                    ->count(),
                'expiring_soon' => CmsContent::where('status', 'published')
                    ->where('expiry_date', '<=', now()->addDays(14))
                    ->where('expiry_date', '>=', now())
                    ->count(),
                'no_summary' => CmsContent::where('is_deleted', false)
                    ->whereNull('summary')
                    ->orWhere('summary', '')
                    ->count(),
            ]);
        });

        // -------------------------------------------------------------------------
        // Site Settings (singleton pages: contact, stats, admissions, homepage)
        // -------------------------------------------------------------------------
        Route::prefix('site-settings')->group(function () {

            Route::get('/{key}', function (string $key) {
                $page = CmsContent::where('type', 'page')
                    ->where('slug', $key)
                    ->where('is_deleted', false)
                    ->first();
                if (!$page) {
                    return response()->json(['data' => null, 'exists' => false]);
                }
                return response()->json([
                    'data' => [
                        'id'             => $page->id,
                        'key'            => $key,
                        'status'         => $page->status,
                        'structured_data'=> $page->structured_data ?? [],
                    ],
                    'exists' => true,
                ]);
            });

            Route::put('/{key}', function (Request $request, string $key) {
                $validated = $request->validate(['structured_data' => 'required|array']);
                $user = $request->user();

                $page = CmsContent::where('type', 'page')
                    ->where('slug', $key)
                    ->where('is_deleted', false)
                    ->first();

                if ($page) {
                    $page->update([
                        'structured_data' => $validated['structured_data'],
                        'status'          => 'published',
                        'published_at'    => $page->published_at ?? now(),
                        'updated_by'      => $user->id,
                    ]);
                } else {
                    $page = CmsContent::create([
                        'type'            => 'page',
                        'slug'            => $key,
                        'title'           => ucwords(str_replace('-', ' ', $key)) . ' Settings',
                        'status'          => 'published',
                        'structured_data' => $validated['structured_data'],
                        'published_at'    => now(),
                        'created_by'      => $user->id,
                        'updated_by'      => $user->id,
                        'is_deleted'      => false,
                    ]);
                }

                return response()->json(['data' => ['id' => $page->id, 'key' => $key, 'status' => 'published']]);
            });

        }); // close site-settings prefix group

        // ============================================================
        // Research & Innovation Admin Routes (RIMS-lite)
        // ============================================================

        // --- Research Themes ---
        Route::get('/research/themes', function (Request $request) {
            $themes = \App\Models\ResearchTheme::orderBy('sort_order')->get();
            return response()->json(['data' => $themes]);
        });

        Route::post('/research/themes', function (Request $request) {
            $data = $request->validate([
                'name' => 'required|string|max:200',
                'slug' => 'required|string|unique:research_themes,slug',
                'description' => 'nullable|string',
                'sdg_goals' => 'nullable|array',
                'colour' => 'nullable|string|max:20',
                'icon' => 'nullable|string|max:50',
                'sort_order' => 'nullable|integer',
                'is_active' => 'nullable|boolean',
            ]);
            $theme = \App\Models\ResearchTheme::create($data);
            return response()->json(['data' => $theme], 201);
        });

        Route::put('/research/themes/{id}', function (Request $request, $id) {
            $theme = \App\Models\ResearchTheme::findOrFail($id);
            $data = $request->validate([
                'name' => 'sometimes|string|max:200',
                'description' => 'nullable|string',
                'sdg_goals' => 'nullable|array',
                'colour' => 'nullable|string|max:20',
                'icon' => 'nullable|string|max:50',
                'sort_order' => 'nullable|integer',
                'is_active' => 'nullable|boolean',
            ]);
            $theme->update($data);
            return response()->json(['data' => $theme->fresh()]);
        });

        Route::delete('/research/themes/{id}', function (Request $request, $id) {
            $theme = \App\Models\ResearchTheme::findOrFail($id);
            $theme->delete();
            return response()->json(['message' => 'Theme deleted.']);
        });

        // --- Research Projects ---
        Route::get('/research/projects', function (Request $request) {
            $q = \App\Models\ResearchProject::with('theme');
            if ($request->status) $q->where('status', $request->status);
            if ($request->theme_id) $q->where('theme_id', $request->theme_id);
            if ($request->search) {
                $q->where(function ($sq) use ($request) {
                    $sq->where('title', 'like', '%' . $request->search . '%')
                       ->orWhere('lead_researcher_name', 'like', '%' . $request->search . '%');
                });
            }
            $perPage = min((int) ($request->per_page ?? 20), 50);
            $p = $q->orderByDesc('updated_at')->paginate($perPage);
            return response()->json([
                'data' => $p->items(), 'total' => $p->total(),
                'last_page' => $p->lastPage(), 'current_page' => $p->currentPage(),
            ]);
        });

        Route::post('/research/projects', function (Request $request) {
            $data = $request->validate([
                'title' => 'required|string|max:500',
                'slug' => 'required|string|unique:research_projects,slug',
                'abstract' => 'required|string',
                'department' => 'nullable|string',
                'lead_researcher_name' => 'nullable|string',
                'lead_researcher_slug' => 'nullable|string',
                'co_researchers' => 'nullable|array',
                'theme_id' => 'nullable|integer|exists:research_themes,id',
                'status' => 'nullable|in:planned,active,completed,suspended',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'funding_source' => 'nullable|string',
                'grant_id' => 'nullable|string',
                'budget' => 'nullable|numeric',
                'currency' => 'nullable|string|max:3',
                'sdg_goals' => 'nullable|array',
                'featured_image_url' => 'nullable|url',
                'is_published' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);
            $project = \App\Models\ResearchProject::create($data);
            \App\Models\AuditLog::record($request->user(), 'research.project.create', 'research_project', $project->id, $project->title);
            return response()->json(['data' => $project], 201);
        });

        Route::get('/research/projects/{id}', function (Request $request, $id) {
            $p = \App\Models\ResearchProject::with('theme', 'publications', 'grant')->findOrFail($id);
            return response()->json(['data' => $p]);
        });

        Route::put('/research/projects/{id}', function (Request $request, $id) {
            $project = \App\Models\ResearchProject::findOrFail($id);
            $data = $request->validate([
                'title' => 'sometimes|string|max:500',
                'abstract' => 'sometimes|string',
                'department' => 'nullable|string',
                'lead_researcher_name' => 'nullable|string',
                'lead_researcher_slug' => 'nullable|string',
                'co_researchers' => 'nullable|array',
                'theme_id' => 'nullable|integer|exists:research_themes,id',
                'status' => 'nullable|in:planned,active,completed,suspended',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'funding_source' => 'nullable|string',
                'grant_id' => 'nullable|string',
                'budget' => 'nullable|numeric',
                'currency' => 'nullable|string|max:3',
                'sdg_goals' => 'nullable|array',
                'featured_image_url' => 'nullable|url',
                'is_published' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);
            $project->update($data);
            \App\Models\AuditLog::record($request->user(), 'research.project.update', 'research_project', $project->id, $project->title);
            return response()->json(['data' => $project->fresh()->load('theme')]);
        });

        Route::delete('/research/projects/{id}', function (Request $request, $id) {
            $project = \App\Models\ResearchProject::findOrFail($id);
            \App\Models\AuditLog::record($request->user(), 'research.project.delete', 'research_project', $project->id, $project->title);
            $project->delete();
            return response()->json(['message' => 'Project deleted.']);
        });

        // --- Publications ---
        Route::get('/research/publications', function (Request $request) {
            $q = \App\Models\Publication::with('project');
            if ($request->type) $q->where('type', $request->type);
            if ($request->year) $q->where('year', (int) $request->year);
            if ($request->search) {
                $q->where(function ($sq) use ($request) {
                    $sq->where('title', 'like', '%' . $request->search . '%')
                       ->orWhere('journal', 'like', '%' . $request->search . '%');
                });
            }
            $perPage = min((int) ($request->per_page ?? 20), 50);
            $p = $q->orderByDesc('year')->orderByDesc('created_at')->paginate($perPage);
            return response()->json([
                'data' => $p->items(), 'total' => $p->total(),
                'last_page' => $p->lastPage(), 'current_page' => $p->currentPage(),
            ]);
        });

        Route::post('/research/publications', function (Request $request) {
            $data = $request->validate([
                'title' => 'required|string|max:500',
                'slug' => 'required|string|unique:publications,slug',
                'authors' => 'required|array',
                'year' => 'required|integer|min:1900|max:2100',
                'journal' => 'nullable|string',
                'publisher' => 'nullable|string',
                'doi' => 'nullable|string|unique:publications,doi',
                'url' => 'nullable|url',
                'type' => 'nullable|in:journal,conference,book_chapter,thesis,report,book,preprint',
                'abstract' => 'nullable|string',
                'indexed_in' => 'nullable|array',
                'volume' => 'nullable|string',
                'issue' => 'nullable|string',
                'pages' => 'nullable|string',
                'project_id' => 'nullable|integer|exists:research_projects,id',
                'is_published' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);
            $pub = \App\Models\Publication::create($data);
            \App\Models\AuditLog::record($request->user(), 'research.pub.create', 'publication', $pub->id, $pub->title);
            return response()->json(['data' => $pub], 201);
        });

        Route::get('/research/publications/{id}', function (Request $request, $id) {
            $p = \App\Models\Publication::with('project')->findOrFail($id);
            return response()->json(['data' => $p]);
        });

        Route::put('/research/publications/{id}', function (Request $request, $id) {
            $pub = \App\Models\Publication::findOrFail($id);
            $data = $request->validate([
                'title' => 'sometimes|string|max:500',
                'authors' => 'sometimes|array',
                'year' => 'sometimes|integer',
                'journal' => 'nullable|string',
                'publisher' => 'nullable|string',
                'doi' => 'nullable|string',
                'url' => 'nullable|url',
                'type' => 'nullable|in:journal,conference,book_chapter,thesis,report,book,preprint',
                'abstract' => 'nullable|string',
                'indexed_in' => 'nullable|array',
                'volume' => 'nullable|string',
                'issue' => 'nullable|string',
                'pages' => 'nullable|string',
                'project_id' => 'nullable|integer|exists:research_projects,id',
                'is_published' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);
            $pub->update($data);
            \App\Models\AuditLog::record($request->user(), 'research.pub.update', 'publication', $pub->id, $pub->title);
            return response()->json(['data' => $pub->fresh()]);
        });

        Route::delete('/research/publications/{id}', function (Request $request, $id) {
            $pub = \App\Models\Publication::findOrFail($id);
            \App\Models\AuditLog::record($request->user(), 'research.pub.delete', 'publication', $pub->id, $pub->title);
            $pub->delete();
            return response()->json(['message' => 'Publication deleted.']);
        });

        // --- Grants ---
        Route::get('/research/grants', function (Request $request) {
            $q = \App\Models\ResearchGrant::with('project');
            if ($request->status) $q->where('status', $request->status);
            $perPage = min((int) ($request->per_page ?? 20), 50);
            $p = $q->orderByDesc('start_date')->paginate($perPage);
            return response()->json([
                'data' => $p->items(), 'total' => $p->total(),
                'last_page' => $p->lastPage(), 'current_page' => $p->currentPage(),
            ]);
        });

        Route::post('/research/grants', function (Request $request) {
            $data = $request->validate([
                'name' => 'required|string',
                'funder' => 'required|string',
                'funder_type' => 'nullable|string',
                'funder_country' => 'nullable|string',
                'amount' => 'nullable|numeric',
                'currency' => 'nullable|string|max:3',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'description' => 'nullable|string',
                'status' => 'nullable|in:active,completed,pending',
                'project_id' => 'nullable|integer|exists:research_projects,id',
                'grant_number' => 'nullable|string',
                'is_visible' => 'nullable|boolean',
            ]);
            $grant = \App\Models\ResearchGrant::create($data);
            return response()->json(['data' => $grant], 201);
        });

        Route::put('/research/grants/{id}', function (Request $request, $id) {
            $grant = \App\Models\ResearchGrant::findOrFail($id);
            $data = $request->validate([
                'name' => 'sometimes|string',
                'funder' => 'sometimes|string',
                'funder_type' => 'nullable|string',
                'funder_country' => 'nullable|string',
                'amount' => 'nullable|numeric',
                'currency' => 'nullable|string|max:3',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'description' => 'nullable|string',
                'status' => 'nullable|in:active,completed,pending',
                'project_id' => 'nullable|integer|exists:research_projects,id',
                'grant_number' => 'nullable|string',
                'is_visible' => 'nullable|boolean',
            ]);
            $grant->update($data);
            return response()->json(['data' => $grant->fresh()]);
        });

        Route::delete('/research/grants/{id}', function (Request $request, $id) {
            $grant = \App\Models\ResearchGrant::findOrFail($id);
            $grant->delete();
            return response()->json(['message' => 'Grant deleted.']);
        });

        // --- Partners ---
        Route::get('/research/partners', function (Request $request) {
            $q = \App\Models\ResearchPartner::query();
            if ($request->type) $q->where('type', $request->type);
            $perPage = min((int) ($request->per_page ?? 20), 50);
            $p = $q->orderByDesc('is_featured')->orderBy('name')->paginate($perPage);
            return response()->json([
                'data' => $p->items(), 'total' => $p->total(),
                'last_page' => $p->lastPage(), 'current_page' => $p->currentPage(),
            ]);
        });

        Route::post('/research/partners', function (Request $request) {
            $data = $request->validate([
                'name' => 'required|string',
                'slug' => 'required|string|unique:research_partners,slug',
                'type' => 'nullable|in:academic,government,ngo,donor,industry,international',
                'country' => 'nullable|string',
                'country_code' => 'nullable|string|max:3',
                'description' => 'nullable|string',
                'logo_url' => 'nullable|url',
                'website_url' => 'nullable|url',
                'collaboration_areas' => 'nullable|array',
                'is_active' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);
            $partner = \App\Models\ResearchPartner::create($data);
            return response()->json(['data' => $partner], 201);
        });

        Route::put('/research/partners/{id}', function (Request $request, $id) {
            $partner = \App\Models\ResearchPartner::findOrFail($id);
            $data = $request->validate([
                'name' => 'sometimes|string',
                'type' => 'nullable|in:academic,government,ngo,donor,industry,international',
                'country' => 'nullable|string',
                'country_code' => 'nullable|string|max:3',
                'description' => 'nullable|string',
                'logo_url' => 'nullable|url',
                'website_url' => 'nullable|url',
                'collaboration_areas' => 'nullable|array',
                'is_active' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);
            $partner->update($data);
            return response()->json(['data' => $partner->fresh()]);
        });

        Route::delete('/research/partners/{id}', function (Request $request, $id) {
            $partner = \App\Models\ResearchPartner::findOrFail($id);
            $partner->delete();
            return response()->json(['message' => 'Partner deleted.']);
        });

        // ── Governance: Council Members ──────────────────────────────────────────
        Route::get('/council-members', function () {
            return response()->json(['data' => \App\Models\CouncilMember::orderBy('position_order')->get()]);
        });

        Route::post('/council-members', function (Request $request) {
            $data = $request->validate([
                'name'           => 'required|string|max:255',
                'title'          => 'required|string|max:255',
                'photo_url'      => 'nullable|string|max:500',
                'bio'            => 'nullable|string',
                'credentials'    => 'nullable|array',
                'credentials.*'  => 'string|max:255',
                'category'       => 'required|string|max:50',
                'position_order' => 'integer|min:0',
                'is_active'      => 'boolean',
            ]);
            $member = \App\Models\CouncilMember::create($data);
            return response()->json(['data' => $member], 201);
        });

        Route::put('/council-members/{id}', function (Request $request, $id) {
            $member = \App\Models\CouncilMember::findOrFail($id);
            $data = $request->validate([
                'name'           => 'sometimes|string|max:255',
                'title'          => 'sometimes|string|max:255',
                'photo_url'      => 'nullable|string|max:500',
                'bio'            => 'nullable|string',
                'credentials'    => 'nullable|array',
                'credentials.*'  => 'string|max:255',
                'category'       => 'sometimes|string|max:50',
                'position_order' => 'integer|min:0',
                'is_active'      => 'boolean',
            ]);
            $member->update($data);
            return response()->json(['data' => $member]);
        });

        Route::delete('/council-members/{id}', function ($id) {
            \App\Models\CouncilMember::findOrFail($id)->delete();
            return response()->json(null, 204);
        });

        // ── Governance: Management Profiles ──────────────────────────────────────
        Route::get('/management-profiles', function () {
            return response()->json(['data' => \App\Models\ManagementProfile::orderBy('position_order')->get()]);
        });

        Route::post('/management-profiles', function (Request $request) {
            $data = $request->validate([
                'name'           => 'required|string|max:255',
                'title'          => 'required|string|max:255',
                'photo_url'      => 'nullable|string|max:500',
                'bio'            => 'nullable|string',
                'email'          => 'nullable|email|max:255',
                'office'         => 'nullable|string|max:255',
                'phone'          => 'nullable|string|max:50',
                'category'       => 'required|string|in:vc,dvc,registrar,finance,library,ict,other',
                'position_order' => 'integer|min:0',
                'is_active'      => 'boolean',
            ]);
            $profile = \App\Models\ManagementProfile::create($data);
            return response()->json(['data' => $profile], 201);
        });

        Route::put('/management-profiles/{id}', function (Request $request, $id) {
            $profile = \App\Models\ManagementProfile::findOrFail($id);
            $data = $request->validate([
                'name'           => 'sometimes|string|max:255',
                'title'          => 'sometimes|string|max:255',
                'photo_url'      => 'nullable|string|max:500',
                'bio'            => 'nullable|string',
                'email'          => 'nullable|email|max:255',
                'office'         => 'nullable|string|max:255',
                'phone'          => 'nullable|string|max:50',
                'category'       => 'sometimes|string|in:vc,dvc,registrar,finance,library,ict,other',
                'position_order' => 'integer|min:0',
                'is_active'      => 'boolean',
            ]);
            $profile->update($data);
            return response()->json(['data' => $profile]);
        });

        Route::delete('/management-profiles/{id}', function ($id) {
            \App\Models\ManagementProfile::findOrFail($id)->delete();
            return response()->json(null, 204);
        });

        // ── Governance: Directorates ─────────────────────────────────────────────
        Route::get('/directorates', function () {
            return response()->json(['data' => \App\Models\Directorate::orderBy('position_order')->get()]);
        });

        Route::post('/directorates', function (Request $request) {
            $data = $request->validate([
                'name'                => 'required|string|max:255',
                'slug'                => 'required|string|unique:directorates,slug|max:100',
                'tagline'             => 'nullable|string|max:255',
                'description'         => 'nullable|string',
                'director_name'       => 'nullable|string|max:255',
                'director_title'      => 'nullable|string|max:255',
                'director_photo_url'  => 'nullable|string|max:500',
                'director_bio'        => 'nullable|string',
                'director_email'      => 'nullable|email|max:255',
                'director_phone'      => 'nullable|string|max:50',
                'functions'           => 'nullable|array',
                'functions.*'         => 'string',
                'services'            => 'nullable|array',
                'services.*'          => 'string',
                'quick_links'         => 'nullable|array',
                'position_order'      => 'integer|min:0',
                'is_active'           => 'boolean',
            ]);
            $directorate = \App\Models\Directorate::create($data);
            return response()->json(['data' => $directorate], 201);
        });

        Route::put('/directorates/{id}', function (Request $request, $id) {
            $directorate = \App\Models\Directorate::findOrFail($id);
            $data = $request->validate([
                'name'                => 'sometimes|string|max:255',
                'slug'                => "sometimes|string|unique:directorates,slug,{$id}|max:100",
                'tagline'             => 'nullable|string|max:255',
                'description'         => 'nullable|string',
                'director_name'       => 'nullable|string|max:255',
                'director_title'      => 'nullable|string|max:255',
                'director_photo_url'  => 'nullable|string|max:500',
                'director_bio'        => 'nullable|string',
                'director_email'      => 'nullable|email|max:255',
                'director_phone'      => 'nullable|string|max:50',
                'functions'           => 'nullable|array',
                'functions.*'         => 'string',
                'services'            => 'nullable|array',
                'services.*'          => 'string',
                'quick_links'         => 'nullable|array',
                'position_order'      => 'integer|min:0',
                'is_active'           => 'boolean',
            ]);
            $directorate->update($data);
            return response()->json(['data' => $directorate]);
        });

        Route::delete('/directorates/{id}', function ($id) {
            \App\Models\Directorate::findOrFail($id)->delete();
            return response()->json(null, 204);
        });

        // ── Gallery CRUD ─────────────────────────────────────────────────────────
        Route::get('/gallery/albums', function () {
            $albums = \App\Models\GalleryAlbum::orderBy('sort_order')->orderBy('album_date', 'desc')
                ->withCount('items')->get();
            return response()->json(['data' => $albums]);
        });

        Route::post('/gallery/albums', function (Request $request) {
            $data = $request->validate([
                'title'           => 'required|string|max:255',
                'slug'            => 'required|string|unique:gallery_albums,slug|max:100',
                'description'     => 'nullable|string',
                'category'        => 'required|in:graduation,events,campus,sports,research,international,other',
                'cover_image_url' => 'nullable|string',
                'album_date'      => 'nullable|date',
                'is_published'    => 'boolean',
                'sort_order'      => 'integer',
            ]);
            return response()->json(['data' => \App\Models\GalleryAlbum::create($data)], 201);
        });

        Route::put('/gallery/albums/{id}', function (Request $request, $id) {
            $album = \App\Models\GalleryAlbum::findOrFail($id);
            $data = $request->validate([
                'title'           => 'sometimes|string|max:255',
                'slug'            => "sometimes|string|unique:gallery_albums,slug,{$id}|max:100",
                'description'     => 'nullable|string',
                'category'        => 'sometimes|in:graduation,events,campus,sports,research,international,other',
                'cover_image_url' => 'nullable|string',
                'album_date'      => 'nullable|date',
                'is_published'    => 'boolean',
                'sort_order'      => 'integer',
            ]);
            $album->update($data);
            return response()->json(['data' => $album]);
        });

        Route::delete('/gallery/albums/{id}', function ($id) {
            $album = \App\Models\GalleryAlbum::findOrFail($id);
            $album->items()->delete();
            $album->delete();
            return response()->json(null, 204);
        });

        Route::get('/gallery/albums/{id}/items', function ($id) {
            $items = \App\Models\GalleryItem::where('album_id', $id)->orderBy('sort_order')->get();
            return response()->json(['data' => $items]);
        });

        Route::post('/gallery/items', function (Request $request) {
            $data = $request->validate([
                'album_id'      => 'required|exists:gallery_albums,id',
                'title'         => 'nullable|string|max:255',
                'caption'       => 'nullable|string',
                'type'          => 'required|in:image,video',
                'media_url'     => 'nullable|string',
                'thumbnail_url' => 'nullable|string',
                'youtube_id'    => 'nullable|string|max:20',
                'sort_order'    => 'integer',
                'is_published'  => 'boolean',
            ]);
            return response()->json(['data' => \App\Models\GalleryItem::create($data)], 201);
        });

        Route::put('/gallery/items/{id}', function (Request $request, $id) {
            $item = \App\Models\GalleryItem::findOrFail($id);
            $data = $request->validate([
                'title'         => 'nullable|string|max:255',
                'caption'       => 'nullable|string',
                'type'          => 'sometimes|in:image,video',
                'media_url'     => 'nullable|string',
                'thumbnail_url' => 'nullable|string',
                'youtube_id'    => 'nullable|string|max:20',
                'sort_order'    => 'integer',
                'is_published'  => 'boolean',
            ]);
            $item->update($data);
            return response()->json(['data' => $item]);
        });

        Route::delete('/gallery/items/{id}', function ($id) {
            \App\Models\GalleryItem::findOrFail($id)->delete();
            return response()->json(null, 204);
        });

        // ── Campus CRUD ─────────────────────────────────────────────────────────
        Route::get('/campuses', function (Request $request) {
            $q = \App\Models\Campus::orderBy('sort_order')->orderBy('name');
            if ($request->query('status')) $q->where('status', $request->query('status'));
            return response()->json(['data' => $q->get()]);
        });

        Route::post('/campuses', function (Request $request) {
            $data = $request->validate([
                'name'            => 'required|string|max:255',
                'slug'            => 'required|string|unique:campuses,slug',
                'summary'         => 'nullable|string',
                'description'     => 'nullable|string',
                'address'         => 'nullable|string',
                'county'          => 'nullable|string',
                'region'          => 'nullable|string',
                'latitude'        => 'nullable|numeric|between:-90,90',
                'longitude'       => 'nullable|numeric|between:-180,180',
                'hero_image'      => 'nullable|string',
                'gallery_images'  => 'nullable|array',
                'contact_email'   => 'nullable|email',
                'contact_phone'   => 'nullable|string',
                'visitor_notes'   => 'nullable|string',
                'transport_notes' => 'nullable|string',
                'sort_order'      => 'nullable|integer',
                'status'          => 'nullable|in:active,inactive',
            ]);
            $campus = \App\Models\Campus::create($data);
            return response()->json(['data' => $campus], 201);
        });

        Route::put('/campuses/{id}', function (Request $request, $id) {
            $campus = \App\Models\Campus::findOrFail($id);
            $data = $request->validate([
                'name'            => 'sometimes|string|max:255',
                'slug'            => "sometimes|string|unique:campuses,slug,{$id}",
                'summary'         => 'nullable|string',
                'description'     => 'nullable|string',
                'address'         => 'nullable|string',
                'county'          => 'nullable|string',
                'region'          => 'nullable|string',
                'latitude'        => 'nullable|numeric|between:-90,90',
                'longitude'       => 'nullable|numeric|between:-180,180',
                'hero_image'      => 'nullable|string',
                'gallery_images'  => 'nullable|array',
                'contact_email'   => 'nullable|email',
                'contact_phone'   => 'nullable|string',
                'visitor_notes'   => 'nullable|string',
                'transport_notes' => 'nullable|string',
                'sort_order'      => 'nullable|integer',
                'status'          => 'nullable|in:active,inactive',
            ]);
            $campus->update($data);
            return response()->json(['data' => $campus->fresh()]);
        });

        Route::delete('/campuses/{id}', function (Request $request, $id) {
            \App\Models\Campus::findOrFail($id)->delete();
            return response()->json(['message' => 'Campus deleted.']);
        });

        // ── Service Points CRUD ─────────────────────────────────────────────────
        Route::get('/service-points', function (Request $request) {
            $q = \App\Models\ServicePoint::with('campus:id,name,slug')
                ->orderBy('sort_order')->orderBy('name');
            if ($request->query('campus_id')) $q->where('campus_id', $request->query('campus_id'));
            if ($request->query('category')) $q->where('category', $request->query('category'));
            if ($request->query('status')) $q->where('status', $request->query('status'));
            return response()->json(['data' => $q->get()]);
        });

        Route::post('/service-points', function (Request $request) {
            $data = $request->validate([
                'name'              => 'required|string|max:255',
                'slug'              => 'required|string|unique:service_points,slug',
                'category'          => 'required|string',
                'campus_id'         => 'nullable|exists:campuses,id',
                'building'          => 'nullable|string',
                'contact_person'    => 'nullable|string',
                'public_phone'      => 'nullable|string',
                'public_email'      => 'nullable|email',
                'whatsapp'          => 'nullable|string',
                'physical_location' => 'nullable|string',
                'latitude'          => 'nullable|numeric|between:-90,90',
                'longitude'         => 'nullable|numeric|between:-180,180',
                'operating_hours'   => 'nullable|array',
                'summary'           => 'nullable|string',
                'support_scope'     => 'nullable|string',
                'related_links'     => 'nullable|array',
                'hero_image'        => 'nullable|string',
                'sort_order'        => 'nullable|integer',
                'status'            => 'nullable|in:active,inactive',
                'seo_meta'          => 'nullable|array',
            ]);
            $sp = \App\Models\ServicePoint::create($data);
            return response()->json(['data' => $sp->load('campus:id,name,slug')], 201);
        });

        Route::put('/service-points/{id}', function (Request $request, $id) {
            $sp = \App\Models\ServicePoint::findOrFail($id);
            $data = $request->validate([
                'name'              => 'sometimes|string|max:255',
                'slug'              => "sometimes|string|unique:service_points,slug,{$id}",
                'category'          => 'sometimes|string',
                'campus_id'         => 'nullable|exists:campuses,id',
                'building'          => 'nullable|string',
                'contact_person'    => 'nullable|string',
                'public_phone'      => 'nullable|string',
                'public_email'      => 'nullable|email',
                'whatsapp'          => 'nullable|string',
                'physical_location' => 'nullable|string',
                'latitude'          => 'nullable|numeric|between:-90,90',
                'longitude'         => 'nullable|numeric|between:-180,180',
                'operating_hours'   => 'nullable|array',
                'summary'           => 'nullable|string',
                'support_scope'     => 'nullable|string',
                'related_links'     => 'nullable|array',
                'hero_image'        => 'nullable|string',
                'sort_order'        => 'nullable|integer',
                'status'            => 'nullable|in:active,inactive',
                'seo_meta'          => 'nullable|array',
            ]);
            $sp->update($data);
            return response()->json(['data' => $sp->fresh()->load('campus:id,name,slug')]);
        });

        Route::delete('/service-points/{id}', function (Request $request, $id) {
            \App\Models\ServicePoint::findOrFail($id)->delete();
            return response()->json(['message' => 'Service point deleted.']);
        });

    });

    // -------------------------------------------------------------------------
    // Site Config
    // -------------------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/site-config', [\App\Http\Controllers\Admin\SiteConfigController::class, 'all']);
        Route::get('/site-config/{group}', [\App\Http\Controllers\Admin\SiteConfigController::class, 'getGroup']);
        Route::put('/site-config/{group}', [\App\Http\Controllers\Admin\SiteConfigController::class, 'updateGroup']);

        // -------------------------------------------------------------------------
        // Redirects
        // -------------------------------------------------------------------------
        Route::get('/redirects', [\App\Http\Controllers\Admin\RedirectController::class, 'index']);
        Route::post('/redirects', [\App\Http\Controllers\Admin\RedirectController::class, 'store']);
        Route::get('/redirects/{id}', [\App\Http\Controllers\Admin\RedirectController::class, 'show']);
        Route::put('/redirects/{id}', [\App\Http\Controllers\Admin\RedirectController::class, 'update']);
        Route::delete('/redirects/{id}', [\App\Http\Controllers\Admin\RedirectController::class, 'destroy']);
        Route::post('/redirects/bulk-toggle', [\App\Http\Controllers\Admin\RedirectController::class, 'bulkToggle']);

        // -------------------------------------------------------------------------
        // Content Health
        // -------------------------------------------------------------------------
        Route::get('/content-health', [\App\Http\Controllers\Admin\ContentHealthController::class, 'index']);

        // -------------------------------------------------------------------------
        // Archive Expired Content (manual trigger)
        // -------------------------------------------------------------------------
        Route::post('/archive-expired', function (\Illuminate\Http\Request $request) {
            $user  = $request->user();
            $types = ['news', 'announcement'];

            $items = \App\Models\CmsContent::whereIn('type', $types)
                ->where('status', 'published')
                ->whereNotNull('expiry_date')
                ->where('expiry_date', '<', now())
                ->where('is_deleted', false)
                ->get();

            $archived = 0;
            foreach ($items as $item) {
                $item->update([
                    'status'      => 'archived',
                    'archived_at' => now(),
                ]);

                \App\Models\AuditLog::record(
                    $user,
                    'manual_archive_expired',
                    $item->type,
                    $item->id,
                    $item->title,
                    ['status' => 'published'],
                    ['status' => 'archived'],
                    "Manually archived via Content Health by {$user->name}."
                );

                $archived++;
            }

            return response()->json([
                'archived' => $archived,
                'message'  => $archived > 0
                    ? "Archived {$archived} expired item(s) successfully."
                    : 'No expired published news or announcements found.',
            ]);
        });

        // -------------------------------------------------------------------------
        // Workflow Queue
        // -------------------------------------------------------------------------
        Route::get('/workflow-queue', [\App\Http\Controllers\Admin\WorkflowQueueController::class, 'index']);
        Route::post('/workflow-queue/{id}/assign', [\App\Http\Controllers\Admin\WorkflowQueueController::class, 'assign']);

        // =====================================================================
        // ADMISSIONS APPLICATION MODULE — ADMIN ROUTES
        // =====================================================================

        Route::prefix('admissions')->group(function () {

            // ── Intake Management ─────────────────────────────────────────────
            Route::get('/intakes', function (Request $request) {
                $q = \Illuminate\Support\Facades\DB::table('admissions_intakes');
                if ($request->filled('status')) $q->where('status', $request->status);
                $intakes = $q->orderBy('open_at', 'desc')->get();
                // Enrich with counts
                foreach ($intakes as &$intake) {
                    $intake->application_count = \Illuminate\Support\Facades\DB::table('applications')
                        ->where('intake_id', $intake->id)->count();
                    $intake->submitted_count = \Illuminate\Support\Facades\DB::table('applications')
                        ->where('intake_id', $intake->id)->where('status','submitted')->count();
                }
                return response()->json(['data' => $intakes]);
            });

            Route::post('/intakes', function (Request $request) {
                $data = $request->validate([
                    'name'                          => 'required|string|max:120',
                    'academic_year'                 => 'required|string|max:20',
                    'intake_period'                 => 'required|in:january,may,september',
                    'open_at'                       => 'nullable|date',
                    'close_at'                      => 'nullable|date',
                    'application_fee_undergraduate' => 'nullable|numeric|min:0',
                    'application_fee_masters'       => 'nullable|numeric|min:0',
                    'application_fee_phd'           => 'nullable|numeric|min:0',
                    'allow_kuccps'                  => 'boolean',
                    'allow_self_sponsored_ug'       => 'boolean',
                    'allow_masters'                 => 'boolean',
                    'allow_phd'                     => 'boolean',
                    'notes'                         => 'nullable|string',
                ]);
                $id = \Illuminate\Support\Facades\DB::table('admissions_intakes')->insertGetId(array_merge($data, [
                    'status'     => 'draft',
                    'created_by' => $request->user()->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                return response()->json(['data' => \Illuminate\Support\Facades\DB::table('admissions_intakes')->where('id',$id)->first()], 201);
            });

            Route::put('/intakes/{id}', function (Request $request, int $id) {
                $data = $request->validate([
                    'name'                          => 'string|max:120',
                    'academic_year'                 => 'string|max:20',
                    'intake_period'                 => 'in:january,may,september',
                    'open_at'                       => 'nullable|date',
                    'close_at'                      => 'nullable|date',
                    'application_fee_undergraduate' => 'nullable|numeric|min:0',
                    'application_fee_masters'       => 'nullable|numeric|min:0',
                    'application_fee_phd'           => 'nullable|numeric|min:0',
                    'allow_kuccps'                  => 'boolean',
                    'allow_self_sponsored_ug'       => 'boolean',
                    'allow_masters'                 => 'boolean',
                    'allow_phd'                     => 'boolean',
                    'allow_late_applications'       => 'boolean',
                    'late_application_close_at'     => 'nullable|date',
                    'notes'                         => 'nullable|string',
                ]);
                \Illuminate\Support\Facades\DB::table('admissions_intakes')
                    ->where('id', $id)
                    ->update(array_merge($data, ['updated_at' => now()]));
                return response()->json(['data' => \Illuminate\Support\Facades\DB::table('admissions_intakes')->where('id',$id)->first()]);
            });

            Route::post('/intakes/{id}/publish', function (Request $request, int $id) {
                \Illuminate\Support\Facades\DB::table('admissions_intakes')
                    ->where('id', $id)
                    ->update(['is_published' => true, 'status' => 'scheduled', 'updated_at' => now()]);
                return response()->json(['message' => 'Intake published.']);
            });

            Route::post('/intakes/{id}/open', function (Request $request, int $id) {
                \Illuminate\Support\Facades\DB::table('admissions_intakes')
                    ->where('id', $id)
                    ->update(['status' => 'open', 'is_published' => true, 'open_at' => now(), 'updated_at' => now()]);
                return response()->json(['message' => 'Intake opened.']);
            });

            Route::post('/intakes/{id}/close', function (Request $request, int $id) {
                \Illuminate\Support\Facades\DB::table('admissions_intakes')
                    ->where('id', $id)
                    ->update(['status' => 'closed', 'close_at' => now(), 'updated_at' => now()]);
                return response()->json(['message' => 'Intake closed.']);
            });

            Route::post('/intakes/{id}/extend', function (Request $request, int $id) {
                $data = $request->validate(['close_at' => 'required|date', 'notes' => 'nullable|string']);
                \Illuminate\Support\Facades\DB::table('admissions_intakes')
                    ->where('id', $id)
                    ->update(['status' => 'extended', 'close_at' => $data['close_at'], 'allow_late_applications' => true, 'updated_at' => now()]);
                return response()->json(['message' => 'Deadline extended.']);
            });

            Route::delete('/intakes/{id}', function (int $id) {
                $count = \Illuminate\Support\Facades\DB::table('applications')->where('intake_id', $id)->count();
                if ($count > 0) {
                    return response()->json(['error' => 'Cannot delete intake with existing applications.'], 422);
                }
                \Illuminate\Support\Facades\DB::table('admissions_intakes')->where('id', $id)->delete();
                return response()->json(['message' => 'Intake deleted.']);
            });

            // ── Programme Admin ───────────────────────────────────────────────
            Route::get('/programmes', function (Request $request) {
                $q = \Illuminate\Support\Facades\DB::table('admission_programmes');
                if ($request->filled('level'))  $q->where('level', $request->level);
                if ($request->filled('school')) $q->where('school_code', $request->school);
                return response()->json(['data' => $q->orderBy('school_code')->orderBy('programme_name')->get()]);
            });

            Route::put('/programmes/{id}', function (Request $request, int $id) {
                $data = $request->validate([
                    'programme_name'       => 'string|max:200',
                    'school_code'          => 'string|max:20',
                    'department'           => 'nullable|string|max:100',
                    'level'                => 'string',
                    'duration'             => 'string|max:30',
                    'mode'                 => 'string|max:30',
                    'minimum_requirements' => 'nullable|string',
                    'available_intakes'    => 'nullable|array',
                    'available_pathways'   => 'nullable|array',
                    'required_documents'   => 'nullable|array',
                    'is_active'            => 'boolean',
                ]);
                if (isset($data['available_intakes']))  $data['available_intakes']  = json_encode($data['available_intakes']);
                if (isset($data['available_pathways'])) $data['available_pathways'] = json_encode($data['available_pathways']);
                if (isset($data['required_documents'])) $data['required_documents'] = json_encode($data['required_documents']);
                \Illuminate\Support\Facades\DB::table('admission_programmes')
                    ->where('id', $id)
                    ->update(array_merge($data, ['updated_at' => now()]));
                return response()->json(['data' => \Illuminate\Support\Facades\DB::table('admission_programmes')->where('id',$id)->first()]);
            });

            // ── KUCCPS Import ─────────────────────────────────────────────────
            Route::get('/kuccps/batches', function () {
                $batches = \Illuminate\Support\Facades\DB::table('kuccps_import_batches')
                    ->orderBy('created_at', 'desc')
                    ->limit(20)
                    ->get();
                foreach ($batches as &$b) {
                    $b->placements_count = \Illuminate\Support\Facades\DB::table('kuccps_placements')
                        ->where('import_batch_id', $b->id)->count();
                    $b->claimed_count = \Illuminate\Support\Facades\DB::table('kuccps_placements')
                        ->where('import_batch_id', $b->id)->where('status','claimed')->count();
                }
                return response()->json(['data' => $batches]);
            });

            Route::post('/kuccps/import', function (Request $request) {
                $request->validate([
                    'file'          => 'required|file|mimes:csv,txt',
                    'academic_year' => 'required|string|max:20',
                    'intake_period' => 'nullable|string|in:january,may,september',
                    'intake_id'     => 'nullable|integer',
                ]);

                $file = $request->file('file');
                $filename = $file->getClientOriginalName();
                $now = now();
                $user = $request->user();

                // Parse CSV
                $lines = array_map('str_getcsv', file($file->getRealPath()));
                $headers = array_map('trim', array_shift($lines));
                $headers = array_map('strtolower', $headers);

                $required = ['kcse_index_number','kcse_year','applicant_name','programme_code'];
                $missing = array_diff($required, $headers);
                if (!empty($missing)) {
                    return response()->json([
                        'error' => 'CSV missing required columns: ' . implode(', ', $missing)
                    ], 422);
                }

                $batchId = \Illuminate\Support\Facades\DB::table('kuccps_import_batches')->insertGetId([
                    'filename'      => $filename,
                    'academic_year' => $request->academic_year,
                    'intake_period' => $request->intake_period,
                    'status'        => 'validating',
                    'total_rows'    => count($lines),
                    'imported_by'   => $user->id,
                    'created_at'    => $now,
                    'updated_at'    => $now,
                ]);

                $valid = 0; $invalid = 0; $errors = [];

                foreach ($lines as $i => $row) {
                    $rec = array_combine($headers, array_pad($row, count($headers), ''));
                    $idx = trim($rec['kcse_index_number'] ?? '');
                    $yr  = trim($rec['kcse_year'] ?? '');
                    $code = trim($rec['programme_code'] ?? '');
                    $name = trim($rec['applicant_name'] ?? '');

                    if (!$idx || !$yr || !$code || !$name) {
                        $invalid++;
                        $errors[] = "Row " . ($i+2) . ": missing required fields";
                        continue;
                    }

                    // Check for duplicates
                    $dup = \Illuminate\Support\Facades\DB::table('kuccps_placements')
                        ->where('kcse_index_number', $idx)
                        ->where('kcse_year', $yr)
                        ->exists();
                    if ($dup) {
                        $invalid++;
                        $errors[] = "Row " . ($i+2) . ": duplicate index {$idx}/{$yr}";
                        continue;
                    }

                    $progId = \Illuminate\Support\Facades\DB::table('admission_programmes')
                        ->where('programme_code', $code)
                        ->value('id');

                    \Illuminate\Support\Facades\DB::table('kuccps_placements')->insert([
                        'import_batch_id'    => $batchId,
                        'kuccps_reference'   => trim($rec['kuccps_reference'] ?? ''),
                        'kcse_index_number'  => $idx,
                        'kcse_year'          => $yr,
                        'applicant_name'     => $name,
                        'id_document_number' => trim($rec['id_document_number'] ?? ''),
                        'programme_code'     => $code,
                        'programme_id'       => $progId,
                        'academic_year'      => $request->academic_year,
                        'intake_id'          => $request->intake_id,
                        'placement_category' => trim($rec['placement_category'] ?? 'category_a'),
                        'status'             => 'unverified',
                        'created_at'         => $now,
                        'updated_at'         => $now,
                    ]);
                    $valid++;
                }

                \Illuminate\Support\Facades\DB::table('kuccps_import_batches')
                    ->where('id', $batchId)
                    ->update([
                        'status'            => $invalid === count($lines) ? 'failed' : 'imported',
                        'valid_rows'        => $valid,
                        'invalid_rows'      => $invalid,
                        'validation_errors' => json_encode($errors),
                        'imported_at'       => $now,
                        'updated_at'        => $now,
                    ]);

                return response()->json([
                    'batch_id'    => $batchId,
                    'total'       => count($lines),
                    'valid'       => $valid,
                    'invalid'     => $invalid,
                    'errors'      => $errors,
                    'message'     => "Import complete: {$valid} records imported, {$invalid} skipped.",
                ]);
            });

            // ── Reports ───────────────────────────────────────────────────────
            Route::get('/reports', function (Request $request) {
                $intakeId = $request->input('intake_id');
                $q = \Illuminate\Support\Facades\DB::table('applications');
                if ($intakeId) $q->where('intake_id', $intakeId);

                $total      = (clone $q)->count();
                $byStatus   = (clone $q)->selectRaw('status, count(*) as count')->groupBy('status')->get();
                $byPathway  = (clone $q)->join('admission_pathways','applications.pathway_id','admission_pathways.id')
                    ->selectRaw('admission_pathways.name as pathway, count(*) as count')->groupBy('admission_pathways.name')->get();
                $byLevel    = (clone $q)->selectRaw('level, count(*) as count')->groupBy('level')->get();
                $paid       = (clone $q)->whereIn('payment_status',['paid','manually_verified'])->count();
                $submitted  = (clone $q)->where('status','submitted')->count();
                $kuccps     = \Illuminate\Support\Facades\DB::table('kuccps_placements')->where('status','verified')->count();

                return response()->json([
                    'data' => [
                        'total_applications' => $total,
                        'submitted'          => $submitted,
                        'paid'               => $paid,
                        'by_status'          => $byStatus,
                        'by_pathway'         => $byPathway,
                        'by_level'           => $byLevel,
                        'kuccps_verified'    => $kuccps,
                    ],
                ]);
            });
        });

        // ── Application Review Queue ──────────────────────────────────────────
        Route::prefix('admin-applications')->group(function () {

            Route::get('/', function (Request $request) {
                $q = \Illuminate\Support\Facades\DB::table('applications as a')
                    ->join('applicants as ap', 'a.applicant_id', 'ap.id')
                    ->join('admission_programmes as p', 'a.programme_id', 'p.id')
                    ->join('admissions_intakes as i', 'a.intake_id', 'i.id')
                    ->join('admission_pathways as pw', 'a.pathway_id', 'pw.id')
                    ->select(
                        'a.id','a.reference','a.application_number','a.status','a.payment_status',
                        'a.level','a.submitted_at','a.created_at','a.decision',
                        'ap.full_name','ap.email','ap.phone',
                        'p.programme_name','p.school_code',
                        'i.name as intake_name','i.intake_period','i.academic_year',
                        'pw.name as pathway_name','pw.code as pathway_code'
                    );

                if ($request->filled('status'))       $q->where('a.status', $request->status);
                if ($request->filled('intake_id'))    $q->where('a.intake_id', $request->intake_id);
                if ($request->filled('pathway'))      $q->where('pw.code', $request->pathway);
                if ($request->filled('level'))        $q->where('a.level', $request->level);
                if ($request->filled('payment_status')) $q->where('a.payment_status', $request->payment_status);
                if ($request->filled('search')) {
                    $s = $request->search;
                    $q->where(function ($sq) use ($s) {
                        $sq->where('ap.full_name','like',"%{$s}%")
                           ->orWhere('ap.email','like',"%{$s}%")
                           ->orWhere('a.application_number','like',"%{$s}%");
                    });
                }

                $perPage = min((int)($request->per_page ?? 25), 100);
                $total   = (clone $q)->count();
                $items   = $q->orderBy('a.submitted_at','desc')->orderBy('a.created_at','desc')
                             ->limit($perPage)->offset(((int)($request->page ?? 1) - 1) * $perPage)
                             ->get();

                return response()->json(['data' => $items, 'total' => $total]);
            });

            Route::get('/{ref}', function (string $ref) {
                $app = \Illuminate\Support\Facades\DB::table('applications as a')
                    ->join('applicants as ap', 'a.applicant_id', 'ap.id')
                    ->join('admission_programmes as p', 'a.programme_id', 'p.id')
                    ->join('admissions_intakes as i', 'a.intake_id', 'i.id')
                    ->join('admission_pathways as pw', 'a.pathway_id', 'pw.id')
                    ->select('a.*','ap.full_name','ap.email','ap.phone','ap.gender','ap.date_of_birth',
                             'ap.nationality','ap.id_document_type','ap.id_document_number',
                             'ap.county','ap.sub_county','ap.postal_address',
                             'ap.emergency_contact_name','ap.emergency_contact_phone',
                             'p.programme_name','p.school_code','p.level as prog_level',
                             'p.minimum_requirements','p.required_documents',
                             'i.name as intake_name','i.intake_period','i.academic_year',
                             'pw.name as pathway_name')
                    ->where('a.reference', $ref)
                    ->first();

                if (!$app) return response()->json(['error' => 'Not found'], 404);

                $qualifications = \Illuminate\Support\Facades\DB::table('academic_qualifications')
                    ->where('application_id', $app->id)->get();
                $documents = \Illuminate\Support\Facades\DB::table('application_documents')
                    ->where('application_id', $app->id)->get();
                $payment = \Illuminate\Support\Facades\DB::table('application_payments')
                    ->where('application_id', $app->id)->orderBy('id','desc')->first();
                $statusLogs = \Illuminate\Support\Facades\DB::table('application_status_logs')
                    ->where('application_id', $app->id)->orderBy('created_at','asc')->get();

                return response()->json(['data' => array_merge((array)$app, [
                    'qualifications' => $qualifications,
                    'documents'      => $documents,
                    'payment'        => $payment,
                    'status_history' => $statusLogs,
                ])]);
            });

            // Status transition actions
            Route::post('/{ref}/mark-eligible', function (Request $request, string $ref) {
                return updateApplicationStatus($ref, 'eligible', $request->input('reason'), $request->user()->id);
            });

            Route::post('/{ref}/reject', function (Request $request, string $ref) {
                $data = $request->validate(['reason' => 'required|string|min:10']);
                return updateApplicationStatus($ref, 'rejected', $data['reason'], $request->user()->id, ['decision' => 'rejected', 'decision_reason' => $data['reason']]);
            });

            Route::post('/{ref}/offer', function (Request $request, string $ref) {
                return updateApplicationStatus($ref, 'offered', $request->input('reason', 'Admission offer issued'), $request->user()->id, ['decision' => 'offered']);
            });

            Route::post('/{ref}/query-documents', function (Request $request, string $ref) {
                $data = $request->validate(['reason' => 'required|string', 'document_ids' => 'nullable|array']);
                $app = \Illuminate\Support\Facades\DB::table('applications')->where('reference',$ref)->first();
                if ($app && $request->filled('document_ids')) {
                    \Illuminate\Support\Facades\DB::table('application_documents')
                        ->whereIn('id', $data['document_ids'])
                        ->where('application_id', $app->id)
                        ->update(['status' => 'queried', 'rejection_reason' => $data['reason'], 'updated_at' => now()]);
                }
                return updateApplicationStatus($ref, 'documents_queried', $data['reason'], $request->user()->id);
            });

            Route::post('/{ref}/defer', function (Request $request, string $ref) {
                $data = $request->validate(['reason' => 'required|string']);
                return updateApplicationStatus($ref, 'deferred', $data['reason'], $request->user()->id);
            });

            Route::post('/{ref}/under-review', function (Request $request, string $ref) {
                return updateApplicationStatus($ref, 'under_review', 'Application moved to review', $request->user()->id);
            });

            // Payment verification
            Route::post('/payments/{payId}/verify', function (Request $request, int $payId) {
                $data = $request->validate(['notes' => 'nullable|string']);
                \Illuminate\Support\Facades\DB::table('application_payments')
                    ->where('id', $payId)
                    ->update([
                        'status'      => 'manually_verified',
                        'verified_by' => $request->user()->id,
                        'verified_at' => now(),
                        'manual_notes' => $data['notes'] ?? null,
                        'updated_at'  => now(),
                    ]);
                // Update application payment status
                $appId = \Illuminate\Support\Facades\DB::table('application_payments')->where('id',$payId)->value('application_id');
                \Illuminate\Support\Facades\DB::table('applications')
                    ->where('id', $appId)
                    ->update(['payment_status' => 'manually_verified', 'updated_at' => now()]);
                return response()->json(['message' => 'Payment manually verified.']);
            });
        });
    });

    // =========================================================================
    // KUCCPS IMPORT MODULE
    // =========================================================================
    Route::prefix('kuccps')->middleware('auth:sanctum')->group(function () {
        $ic = \App\Http\Controllers\Admin\KuccpsImportController::class;

        Route::post('/import-batches/upload',                     [$ic, 'upload']);
        Route::get('/import-batches',                             [$ic, 'index']);
        Route::get('/import-batches/{batch}',                     [$ic, 'show']);
        Route::get('/import-batches/{batch}/sheets',              [$ic, 'sheets']);
        Route::post('/import-batches/{batch}/select-sheet',       [$ic, 'selectSheet']);
        Route::get('/import-batches/{batch}/preview',             [$ic, 'preview']);
        Route::post('/import-batches/{batch}/map-columns',        [$ic, 'mapColumns']);
        Route::post('/import-batches/{batch}/validate',           [$ic, 'validate']);
        Route::get('/import-batches/{batch}/validation-report',   [$ic, 'validationReport']);
        Route::post('/import-batches/{batch}/resolve-programme',  [$ic, 'resolveProgramme']);
        Route::post('/import-batches/{batch}/approve',            [$ic, 'approve']);
        Route::post('/import-batches/{batch}/import',             [$ic, 'import']);
        Route::post('/import-batches/{batch}/rollback',           [$ic, 'rollback']);
        Route::post('/import-batches/{batch}/generate-letters',   [$ic, 'generateLetters']);
        Route::get('/import-batches/{batch}/placements',          [$ic, 'placements']);

        // Mapping templates
        $mt = \App\Http\Controllers\Admin\KuccpsMappingTemplateController::class;
        Route::get('/mapping-templates',          [$mt, 'index']);
        Route::post('/mapping-templates',         [$mt, 'store']);
        Route::patch('/mapping-templates/{template}', [$mt, 'update']);
        Route::delete('/mapping-templates/{template}', [$mt, 'destroy']);
    });

    // Programme aliases
    Route::prefix('programme-aliases')->middleware('auth:sanctum')->group(function () {
        $pa = \App\Http\Controllers\Admin\ProgrammeAliasController::class;
        Route::get('/',            [$pa, 'index']);
        Route::post('/',           [$pa, 'store']);
        Route::patch('/{alias}',   [$pa, 'update']);
        Route::delete('/{alias}',  [$pa, 'destroy']);
    });

    // Admission letter templates + admin letter actions
    Route::prefix('admission-letter-templates')->middleware('auth:sanctum')->group(function () {
        $al = \App\Http\Controllers\Admin\AdmissionLetterAdminController::class;
        Route::get('/',                [$al, 'templates']);
        Route::post('/',               [$al, 'storeTemplate']);
        Route::patch('/{template}',    [$al, 'updateTemplate']);
    });
    Route::prefix('admission-letters')->middleware('auth:sanctum')->group(function () {
        $al = \App\Http\Controllers\Admin\AdmissionLetterAdminController::class;
        Route::post('/generate/{placement}',   [$al, 'generateForPlacement']);
        Route::get('/{letter}',                [$al, 'show']);
        Route::post('/{letter}/revoke',        [$al, 'revoke']);
        Route::get('/{letter}/download',       [$al, 'download']);
    });

    // Admin programmes listing (for resolving unmatched)
    Route::get('/programmes/catalogue', function () {
        return response()->json(
            \App\Models\AdmissionProgramme::where('is_active', true)
                ->select('id','programme_code','programme_name','school_code','level','department')
                ->orderBy('school_code')->orderBy('programme_name')
                ->get()
        );
    })->middleware('auth:sanctum');

    // Admin intakes listing
    Route::get('/admissions/intakes', function () {
        return response()->json(
            \App\Models\AdmissionIntake::orderByDesc('created_at')
                ->select('id','name','academic_year','intake_period','status')
                ->get()
        );
    })->middleware('auth:sanctum');

    // ── Departments CRUD ─────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/departments', function () {
            $depts = \App\Models\Department::orderBy('school_code')->orderBy('sort_order')->orderBy('name')->get();
            return response()->json(['data' => $depts]);
        });

        Route::post('/departments', function (\Illuminate\Http\Request $request) {
            $data = $request->validate([
                'school_code'    => 'required|string|in:SESS,SBE,SCIT,SOS,SHS',
                'name'           => 'required|string|max:255',
                'slug'           => 'required|string|unique:departments,slug|max:255',
                'description'    => 'nullable|string',
                'vision'         => 'nullable|string|max:500',
                'hod_name'       => 'nullable|string|max:255',
                'hod_title'      => 'nullable|string|max:255',
                'hod_email'      => 'nullable|email|max:255',
                'hod_phone'      => 'nullable|string|max:50',
                'hod_photo_url'  => 'nullable|url|max:500',
                'hod_bio'        => 'nullable|string',
                'office_location'=> 'nullable|string|max:255',
                'email'          => 'nullable|email|max:255',
                'phone'          => 'nullable|string|max:50',
                'is_active'      => 'boolean',
                'sort_order'     => 'integer',
            ]);
            $dept = \App\Models\Department::create($data);
            return response()->json(['data' => $dept], 201);
        });

        Route::put('/departments/{id}', function (\Illuminate\Http\Request $request, int $id) {
            $dept = \App\Models\Department::findOrFail($id);
            $data = $request->validate([
                'school_code'    => 'sometimes|string|in:SESS,SBE,SCIT,SOS,SHS',
                'name'           => 'sometimes|string|max:255',
                'slug'           => "sometimes|string|unique:departments,slug,{$id}|max:255",
                'description'    => 'nullable|string',
                'vision'         => 'nullable|string|max:500',
                'hod_name'       => 'nullable|string|max:255',
                'hod_title'      => 'nullable|string|max:255',
                'hod_email'      => 'nullable|email|max:255',
                'hod_phone'      => 'nullable|string|max:50',
                'hod_photo_url'  => 'nullable|max:500',
                'hod_bio'        => 'nullable|string',
                'office_location'=> 'nullable|string|max:255',
                'email'          => 'nullable|email|max:255',
                'phone'          => 'nullable|string|max:50',
                'is_active'      => 'boolean',
                'sort_order'     => 'integer',
            ]);
            $dept->update($data);
            return response()->json(['data' => $dept]);
        });

        Route::delete('/departments/{id}', function (int $id) {
            \App\Models\Department::findOrFail($id)->delete();
            return response()->json(['message' => 'Deleted.']);
        });
    });

});

function updateApplicationStatus(string $ref, string $toStatus, ?string $reason, int $userId, array $extra = []) {
    $app = \Illuminate\Support\Facades\DB::table('applications')->where('reference', $ref)->first();
    if (!$app) return response()->json(['error' => 'Application not found.'], 404);

    $update = array_merge(['status' => $toStatus, 'reviewed_by' => $userId, 'reviewed_at' => now(), 'updated_at' => now()], $extra);
    \Illuminate\Support\Facades\DB::table('applications')->where('id', $app->id)->update($update);

    \Illuminate\Support\Facades\DB::table('application_status_logs')->insert([
        'application_id'  => $app->id,
        'from_status'     => $app->status,
        'to_status'       => $toStatus,
        'changed_by'      => $userId,
        'changed_by_type' => 'admin',
        'reason'          => $reason,
        'created_at'      => now(),
        'updated_at'      => now(),
    ]);

    return response()->json(['message' => 'Application status updated to ' . $toStatus . '.']);
}
