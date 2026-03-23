<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GoalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $targetDate = $this->target_date ? $this->target_date->format('Y-m-d') : null;
        $daysLeft = null;

        if ($targetDate) {
            $target = \Carbon\Carbon::parse($targetDate);
            $now = \Carbon\Carbon::now();
            $daysLeft = (int) $now->diffInDays($target, false); // Cast to integer
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'description' => $this->description,
            'target_amount' => (string) $this->target_amount,
            'current_amount' => (string) $this->current_amount,
            'currency' => $this->currency,
            'target_date' => $targetDate,
            'days_left' => $daysLeft,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
