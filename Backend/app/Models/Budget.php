<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'user_id',
        'category',
        'limit_amount',
        'currency',
        'period',
        'is_deleted',
    ];

    protected $casts = [
        'limit_amount' => 'decimal:2',
        'is_deleted' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
