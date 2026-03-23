<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'target_amount',
        'current_amount',
        'currency',
        'target_date',
        'status',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'target_date' => 'date',
        'is_deleted' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
