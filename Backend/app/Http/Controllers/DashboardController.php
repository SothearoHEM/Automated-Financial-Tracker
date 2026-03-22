<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\Budget;

class DashboardController extends Controller
{
    /**
     * Get dashboard summary.
     * GET /api/dashboard/summary
     */
    public function summary(Request $request)
    {
        $user = Auth::user();

        // Get user's transactions (non-deleted)
        $transactions = Transaction::where('user_id', $user->id)
            ->where('is_deleted', false)
            ->get();

        $budgets = Budget::where('user_id', $user->id)
            ->where('is_deleted', false)
            ->get();

        $exchangeRate = $user->exchange_rate;

        // Calculate totals in both currencies
        $totalIncomeKHR = $transactions
            ->where('type', 'income')
            ->sum(function ($t) use ($exchangeRate) {
                return $t->currency === 'KHR' ? $t->amount : $t->amount * $exchangeRate;
            });

        $totalIncomeUSD = $transactions
            ->where('type', 'income')
            ->sum(function ($t) use ($exchangeRate) {
                return $t->currency === 'USD' ? $t->amount : $t->amount / $exchangeRate;
            });

        $totalExpenseKHR = $transactions
            ->where('type', 'expense')
            ->sum(function ($t) use ($exchangeRate) {
                return $t->currency === 'KHR' ? $t->amount : $t->amount * $exchangeRate;
            });

        $totalExpenseUSD = $transactions
            ->where('type', 'expense')
            ->sum(function ($t) use ($exchangeRate) {
                return $t->currency === 'USD' ? $t->amount : $t->amount / $exchangeRate;
            });

        $netSavingsKHR = $totalIncomeKHR - $totalExpenseKHR;
        $netSavingsUSD = $totalIncomeUSD - $totalExpenseUSD;

        // Budget vs Actual Spending
        $budgetStatus = [];
        foreach ($budgets as $budget) {
            $spent = $transactions
                ->where('type', 'expense')
                ->where('category', $budget->category)
                ->sum(function ($t) use ($budget, $exchangeRate) {
                    if ($t->currency === $budget->currency) {
                        return $t->amount;
                    }
                    // Convert to budget currency
                    if ($budget->currency === 'USD') {
                        return $t->currency === 'KHR' ? $t->amount / $exchangeRate : $t->amount;
                    } else {
                        return $t->currency === 'USD' ? $t->amount * $exchangeRate : $t->amount;
                    }
                });

            $percentage = $budget->limit_amount > 0 ? ($spent / $budget->limit_amount) * 100 : 0;

            $budgetStatus[] = [
                'category' => $budget->category,
                'budget_amount' => (string) $budget->limit_amount,
                'budget_currency' => $budget->currency,
                'spent' => round($spent, 2),
                'remaining' => round($budget->limit_amount - $spent, 2),
                'percentage' => round($percentage, 2),
                'period' => $budget->period,
            ];
        }

        // Recent transactions (last 5)
        $recentTransactions = $transactions
            ->sortByDesc('date')
            ->take(5)
            ->values();

        return response()->json([
            'message' => 'Dashboard summary retrieved successfully',
            'summary' => [
                'total_income_khr' => round($totalIncomeKHR, 2),
                'total_income_usd' => round($totalIncomeUSD, 2),
                'total_expense_khr' => round($totalExpenseKHR, 2),
                'total_expense_usd' => round($totalExpenseUSD, 2),
                'net_savings_khr' => round($netSavingsKHR, 2),
                'net_savings_usd' => round($netSavingsUSD, 2),
                'exchange_rate' => $exchangeRate,
            ],
            'budget_status' => $budgetStatus,
            'recent_transactions' => $recentTransactions,
            'transaction_count' => $transactions->count(),
        ]);
    }

    /**
     * Get reports data for charts.
     * GET /api/dashboard/reports?period=monthly&time_range=6&currency=KHR
     */
    public function reports(Request $request)
    {
        $user = Auth::user();
        $reportType = $request->query('period', 'monthly'); // weekly or monthly
        $timeRange = (int) $request->query('time_range', 6); // number of periods to look back
        $currency = $request->query('currency', 'KHR'); // KHR or USD

        $transactions = Transaction::where('user_id', $user->id)
            ->where('is_deleted', false)
            ->get();

        $exchangeRate = $user->exchange_rate;

        // Group by period
        $periodData = [];
        $now = now();

        foreach ($transactions as $transaction) {
            $txDate = \Carbon\Carbon::parse($transaction->date);

            // Filter by time range
            if ($reportType === 'weekly') {
                $periodKey = $txDate->format('Y-\WW'); // e.g., "2025-W12"
                $periodDiff = (int) $now->diffInWeeks($txDate);
            } else {
                $periodKey = $txDate->format('Y-m'); // e.g., "2025-03"
                $periodDiff = (int) $now->diffInMonths($txDate);
            }

            // Only include transactions within the time range
            if ($periodDiff >= $timeRange) {
                continue;
            }

            // Convert amount to requested currency
            if ($transaction->currency === $currency) {
                $amount = $transaction->amount;
            } else {
                if ($currency === 'USD') {
                    $amount = $transaction->currency === 'KHR' ? $transaction->amount / $exchangeRate : $transaction->amount;
                } else {
                    $amount = $transaction->currency === 'USD' ? $transaction->amount * $exchangeRate : $transaction->amount;
                }
            }

            if (!isset($periodData[$periodKey])) {
                $periodData[$periodKey] = [
                    'period' => $periodKey,
                    'income' => 0,
                    'expenses' => 0,
                ];
            }

            if ($transaction->type === 'income') {
                $periodData[$periodKey]['income'] += $amount;
            } else {
                $periodData[$periodKey]['expenses'] += $amount;
            }
        }

        // Sort by period
        $sortedData = array_values($periodData);
        usort($sortedData, function ($a, $b) {
            return strcmp($a['period'], $b['period']);
        });

        // Spending by category (only expenses)
        $categoryData = [];
        foreach ($transactions->where('type', 'expense') as $transaction) {
            // Convert to requested currency
            if ($transaction->currency === $currency) {
                $amount = $transaction->amount;
            } else {
                if ($currency === 'USD') {
                    $amount = $transaction->currency === 'KHR' ? $transaction->amount / $exchangeRate : $transaction->amount;
                } else {
                    $amount = $transaction->currency === 'USD' ? $transaction->amount * $exchangeRate : $transaction->amount;
                }
            }

            if (!isset($categoryData[$transaction->category])) {
                $categoryData[$transaction->category] = [
                    'name' => $transaction->category,
                    'value' => 0,
                ];
            }
            $categoryData[$transaction->category]['value'] += $amount;
        }

        $categoryChartData = array_values($categoryData);

        return response()->json([
            'message' => 'Reports retrieved successfully',
            'report_type' => $reportType,
            'currency' => $currency,
            'time_range' => $timeRange,
            'period_data' => $sortedData,
            'category_data' => $categoryChartData,
        ]);
    }
}
