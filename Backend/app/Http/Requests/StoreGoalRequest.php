<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreGoalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authenticated users can create/update goals
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'target_amount' => 'required|numeric|min:0.01',
            'current_amount' => 'nullable|numeric|min:0',
            'currency' => 'required|string|in:USD,KHR',
            'target_date' => 'required|date|after:today',
            'status' => 'nullable|string|in:in_progress,completed,abandoned',
        ];
    }
}
