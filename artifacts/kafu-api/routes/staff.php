<?php

use App\Http\Controllers\AdminStaffController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\StaffAuthController;
use App\Http\Controllers\StaffProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Staff Portal API Routes
|--------------------------------------------------------------------------
| Public: /staff/login, /staff/password/reset-request, /staff/password/reset
| Protected: Sanctum auth, ability "staff"
*/

// Public auth routes
Route::prefix('staff')->group(function () {
    Route::post('/login', [StaffAuthController::class, 'login']);
    Route::post('/password/reset-request', [StaffAuthController::class, 'resetRequest']);
    Route::post('/password/reset', [StaffAuthController::class, 'resetConfirm']);
});

// Staff authenticated routes
Route::prefix('staff')
    ->middleware(['auth:sanctum'])
    ->group(function () {
        // Auth
        Route::get('/me', [StaffAuthController::class, 'me']);
        Route::post('/logout', [StaffAuthController::class, 'logout']);
        Route::post('/password/change', [StaffAuthController::class, 'changePassword']);

        // Profile
        Route::get('/profile', [StaffProfileController::class, 'getProfile']);
        Route::put('/profile/section/{section}', [StaffProfileController::class, 'updateSection']);
        Route::post('/profile/submit', [StaffProfileController::class, 'submit']);
        Route::post('/profile/withdraw', [StaffProfileController::class, 'withdraw']);
        Route::get('/profile/submissions', [StaffProfileController::class, 'getSubmissions']);
        Route::post('/profile/upload-photo', [StaffProfileController::class, 'uploadPhoto']);
        Route::post('/profile/upload-cv', [StaffProfileController::class, 'uploadCv']);

        // Consent
        Route::post('/consent/accept', [StaffProfileController::class, 'acceptConsent']);
    });

// Reviewer routes
Route::prefix('reviewer')
    ->middleware(['auth:sanctum'])
    ->group(function () {
        // Submission queue & workflow
        Route::get('/queue', [ReviewerController::class, 'queue']);
        Route::get('/submissions/{id}', [ReviewerController::class, 'show']);
        Route::post('/submissions/{id}/review', [ReviewerController::class, 'review']);
        Route::post('/submissions/{id}/approve', [ReviewerController::class, 'approve']);
        Route::post('/submissions/{id}/request-revision', [ReviewerController::class, 'requestRevision']);
        Route::post('/submissions/{id}/reject', [ReviewerController::class, 'reject']);
        Route::post('/submissions/{id}/comments', [ReviewerController::class, 'addComment']);

        // Staff profiles — full CRUD
        Route::get('/staff', [ReviewerController::class, 'staffIndex']);
        Route::post('/staff', [ReviewerController::class, 'staffProvision']);
        Route::get('/staff/{id}', [ReviewerController::class, 'staffShow']);
        Route::put('/staff/{id}/section/{section}', [ReviewerController::class, 'staffUpdateSection']);
        Route::post('/staff/{id}/upload-cv', [ReviewerController::class, 'staffUploadCv']);
        Route::post('/staff/{id}/upload-photo', [ReviewerController::class, 'staffUploadPhoto']);
        Route::delete('/staff/{id}', [ReviewerController::class, 'staffDeactivate']);
        Route::post('/staff/{id}/reactivate', [ReviewerController::class, 'staffReactivate']);
    });

// ICT Admin routes
Route::prefix('admin/staff-accounts')
    ->middleware(['auth:sanctum'])
    ->group(function () {
        Route::get('/', [AdminStaffController::class, 'index']);
        Route::post('/', [AdminStaffController::class, 'provision']);
        Route::get('/security-events', [AdminStaffController::class, 'securityEvents']);
        Route::get('/{id}', [AdminStaffController::class, 'show']);
        Route::put('/{id}', [AdminStaffController::class, 'update']);
        Route::post('/{id}/lock', [AdminStaffController::class, 'lock']);
        Route::post('/{id}/unlock', [AdminStaffController::class, 'unlock']);
        Route::post('/{id}/deactivate', [AdminStaffController::class, 'deactivate']);
        Route::post('/{id}/reset-password', [AdminStaffController::class, 'resetPassword']);
    });
