<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGoalRequest;
use App\Http\Resources\GoalResource;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    /**
     * Display a listing of the user's goals.
     * GET /api/goals
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->query('status'); // in_progress, completed, abandoned (optional filter)

        $query = Goal::where('user_id', $user->id)
            ->where('is_deleted', false);

        if ($status) {
            $query->where('status', $status);
        }

        $goals = $query->orderBy('target_date', 'desc')->get();

        return response()->json([
            'message' => 'Goals retrieved successfully',
            'goals' => GoalResource::collection($goals),
            'count' => $goals->count()
        ]);
    }

    /**
     * Store a newly created goal.
     * POST /api/goals
     */
    public function store(StoreGoalRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();
        $validated['user_id'] = $user->id;

        $goal = Goal::create($validated);

        // Auto-calculate status based on progress and due date
        $goal->status = $this->calculateGoalStatus($goal);
        $goal->save();

        return response()->json([
            'message' => 'Goal created successfully',
            'goal' => new GoalResource($goal)
        ], 201);
    }

    /**
     * Display the specified goal.
     * GET /api/goals/{id}
     */
    public function show($id)
    {
        $user = Auth::user();

        $goal = Goal::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$goal) {
            return response()->json(['message' => 'Goal not found'], 404);
        }

        return response()->json([
            'message' => 'Goal retrieved successfully',
            'goal' => new GoalResource($goal)
        ]);
    }

    /**
     * Update the specified goal.
     * PUT/PATCH /api/goals/{id}
     */
    public function update(StoreGoalRequest $request, $id)
    {
        $user = Auth::user();

        $goal = Goal::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$goal) {
            return response()->json(['message' => 'Goal not found'], 404);
        }

        $validated = $request->validated();
        $goal->update($validated);

        // Auto-calculate status based on progress and due date
        $goal->status = $this->calculateGoalStatus($goal);
        $goal->save();

        return response()->json([
            'message' => 'Goal updated successfully',
            'goal' => new GoalResource($goal)
        ]);
    }

    /**
     * Calculate goal status automatically.
     */
    private function calculateGoalStatus(Goal $goal): string
    {
        $now = now();
        $targetDate = $goal->target_date; // This is a Carbon instance due to model cast
        $targetAmount = (float) $goal->target_amount;
        $currentAmount = (float) $goal->current_amount;

        // If target amount is reached
        if ($currentAmount >= $targetAmount) {
            return 'completed';
        }

        // If target date has passed (comparing Carbon instances)
        if ($targetDate && $targetDate->isPast()) {
            return 'abandoned';
        }

        // Otherwise still in progress
        return 'in_progress';
    }

    /**
     * Soft delete the specified goal.
     * DELETE /api/goals/{id}
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $goal = Goal::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$goal) {
            return response()->json(['message' => 'Goal not found'], 404);
        }

        $goal->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Goal deleted successfully'
        ]);
    }
}
