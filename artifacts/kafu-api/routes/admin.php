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

        });

    });
});
