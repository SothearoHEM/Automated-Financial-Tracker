<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Resources\BudgetResource;
use App\Models\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    /**
     * Display a listing of the user's budgets.
     * GET /api/budgets
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->query('period'); // weekly, monthly, yearly (optional filter)

        $query = Budget::where('user_id', $user->id)
            ->where('is_deleted', false);

        if ($period) {
            $query->where('period', $period);
        }

        $budgets = $query->orderBy('period')->orderBy('category')->get();

        return response()->json([
            'message' => 'Budgets retrieved successfully',
            'budgets' => BudgetResource::collection($budgets),
            'count' => $budgets->count()
        ]);
    }

    /**
     * Store a newly created or update existing budget (upsert).
     * POST /api/budgets
     *
     * Note: This uses "upsert" logic. If a budget exists with same user+category+period+currency,
     * it will be updated instead of creating duplicate.
     */
    public function store(StoreBudgetRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        // Check if budget already exists for this user + category + period + currency
        $existingBudget = Budget::where('user_id', $user->id)
            ->where('category', $validated['category'])
            ->where('period', $validated['period'])
            ->where('currency', $validated['currency'])
            ->where('is_deleted', false)
            ->first();

        if ($existingBudget) {
            // Update existing budget
            $existingBudget->update([
                'limit_amount' => $validated['limit_amount'],
            ]);

            return response()->json([
                'message' => 'Budget updated successfully',
                'budget' => new BudgetResource($existingBudget)
            ], 200);
        } else {
            // Create new budget
            $validated['user_id'] = $user->id;
            $budget = Budget::create($validated);

            return response()->json([
                'message' => 'Budget created successfully',
                'budget' => new BudgetResource($budget)
            ], 201);
        }
    }

    /**
     * Display the specified budget.
     * GET /api/budgets/{id}
     */
    public function show($id)
    {
        $user = Auth::user();

        $budget = Budget::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$budget) {
            return response()->json(['message' => 'Budget not found'], 404);
        }

        return response()->json([
            'message' => 'Budget retrieved successfully',
            'budget' => new BudgetResource($budget)
        ]);
    }

    /**
     * Update the specified budget.
     * PUT/PATCH /api/budgets/{id}
     */
    public function update(StoreBudgetRequest $request, $id)
    {
        $user = Auth::user();

        $budget = Budget::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$budget) {
            return response()->json(['message' => 'Budget not found'], 404);
        }

        $validated = $request->validated();
        $budget->update($validated);

        return response()->json([
            'message' => 'Budget updated successfully',
            'budget' => new BudgetResource($budget)
        ]);
    }

    /**
     * Soft delete the specified budget.
     * DELETE /api/budgets/{id}
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $budget = Budget::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$budget) {
            return response()->json(['message' => 'Budget not found'], 404);
        }

        $budget->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Budget deleted successfully'
        ]);
    }
}
