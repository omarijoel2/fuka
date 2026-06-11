<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name', 'email', 'password',
        'role', 'department', 'school_code',
        'status', 'last_login_at', 'avatar_url',
        'payroll_number', 'staff_number', 'title', 'job_title',
        'first_login_completed', 'failed_login_count', 'locked_at', 'mfa_ready', 'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'locked_at' => 'datetime',
            'first_login_completed' => 'boolean',
            'mfa_ready' => 'boolean',
            'failed_login_count' => 'integer',
        ];
    }

    public function isLocked(): bool
    {
        return $this->status === 'locked' || $this->locked_at !== null;
    }

    public function isActiveStaff(): bool
    {
        return $this->status === 'active' && !$this->isLocked();
    }

    public function consentRecords(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\StaffConsentRecord::class);
    }

    public function profileSubmissions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(\App\Models\ProfileSubmission::class);
    }

    public function latestSubmission(): ?\App\Models\ProfileSubmission
    {
        return $this->profileSubmissions()->orderByDesc('version_number')->first();
    }

    public function hasAcceptedConsent(string $type = 'profile_publication'): bool
    {
        return $this->consentRecords()->where('consent_type', $type)->where('is_current', true)->exists();
    }

    public function hasRole(string|array $roles): bool
    {
        return in_array($this->role, (array) $roles);
    }

    public function isCentralAdmin(): bool
    {
        return $this->hasRole(['super_admin', 'ict_admin', 'communications_admin']);
    }

    public function isWebmaster(): bool
    {
        return $this->hasRole('webmaster');
    }

    /**
     * Who may access the Webmaster Operations Console.
     * Central admins plus the dedicated Webmaster role.
     */
    public function canAccessWebmasterConsole(): bool
    {
        return $this->isCentralAdmin() || $this->isWebmaster();
    }

    public function canPublish(): bool
    {
        return $this->hasRole(['super_admin', 'ict_admin', 'communications_admin']);
    }

    public function canReview(): bool
    {
        return $this->hasRole(['super_admin', 'ict_admin', 'communications_admin', 'reviewer']);
    }

    public static function roles(): array
    {
        return [
            'super_admin'          => 'Super Admin',
            'ict_admin'            => 'ICT Admin',
            'webmaster'            => 'Webmaster',
            'communications_admin' => 'Communications Admin',
            'department_content_owner' => 'Department Content Owner',
            'viewer'               => 'Viewer (Read-only)',
            'admissions_owner'     => 'Admissions Content Owner',
            'academic_owner'       => 'Academic / Faculty Content Owner',
            'department_editor'    => 'Department Content Editor',
            'procurement_owner'    => 'Procurement Content Owner',
            'hr_owner'             => 'HR / Recruitment Content Owner',
            'research_owner'       => 'Research Office Content Owner',
            'student_affairs_owner'=> 'Student Affairs Content Owner',
            'reviewer'             => 'Reviewer / Approver',
            'staff_user'           => 'Staff User',
        ];
    }
}
