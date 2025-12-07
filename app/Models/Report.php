<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assigned_to',
        'title',
        'description',
        'category',
        'status',
        'latitude',
        'longitude',
        'address',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    protected $with = ['images'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function images()
    {
        return $this->hasMany(ReportImage::class);
    }

    public function votes()
    {
        return $this->hasMany(ReportVote::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Helper methods
    public function votesCount()
    {
        return $this->votes()->count();
    }

    public function hasVotedBy($userId)
    {
        return $this->votes()->where('user_id', $userId)->exists();
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%");
        });
    }
}
