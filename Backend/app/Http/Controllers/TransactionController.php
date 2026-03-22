<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Display a listing of the user's transactions.
     * GET /api/transactions
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Get query parameters for filtering
        $type = $request->query('type'); // income, expense
        $category = $request->query('category');
        $currency = $request->query('currency');

        // Build query
        $query = Transaction::where('user_id', $user->id)
            ->where('is_deleted', false);

        if ($type) {
            $query->where('type', $type);
        }
        if ($category) {
            $query->where('category', $category);
        }
        if ($currency) {
            $query->where('currency', $currency);
        }

        // Order by date descending (newest first)
        $transactions = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'message' => 'Transactions retrieved successfully',
            'transactions' => TransactionResource::collection($transactions),
            'count' => $transactions->count()
        ]);
    }

    /**
     * Store a newly created transaction.
     * POST /api/transactions
     */
    public function store(StoreTransactionRequest $request)
    {
        $user = Auth::user();

        // Validated data from FormRequest
        $validated = $request->validated();
        $validated['user_id'] = $user->id;

        $transaction = Transaction::create($validated);

        return response()->json([
            'message' => 'Transaction created successfully',
            'transaction' => new TransactionResource($transaction)
        ], 201);
    }

    /**
     * Display the specified transaction.
     * GET /api/transactions/{id}
     */
    public function show($id)
    {
        $user = Auth::user();

        $transaction = Transaction::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        return response()->json([
            'message' => 'Transaction retrieved successfully',
            'transaction' => new TransactionResource($transaction)
        ]);
    }

    /**
     * Update the specified transaction.
     * PUT/PATCH /api/transactions/{id}
     */
    public function update(StoreTransactionRequest $request, $id)
    {
        $user = Auth::user();

        $transaction = Transaction::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $validated = $request->validated();
        $transaction->update($validated);

        return response()->json([
            'message' => 'Transaction updated successfully',
            'transaction' => new TransactionResource($transaction)
        ]);
    }

    /**
     * Soft delete the specified transaction.
     * DELETE /api/transactions/{id}
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $transaction = Transaction::where('user_id', $user->id)
            ->where('id', $id)
            ->where('is_deleted', false)
            ->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $transaction->update(['is_deleted' => true]);

        return response()->json([
            'message' => 'Transaction deleted successfully'
        ]);
    }
}
