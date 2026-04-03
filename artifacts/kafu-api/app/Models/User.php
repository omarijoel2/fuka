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
        ];
    }

    public function hasRole(string|array $roles): bool
    {
        return in_array($this->role, (array) $roles);
    }

    public function isCentralAdmin(): bool
    {
        return $this->hasRole(['super_admin', 'ict_admin', 'communications_admin']);
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
            'communications_admin' => 'Communications Admin',
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
