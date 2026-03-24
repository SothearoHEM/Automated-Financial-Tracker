import React from 'react'
import { useContext, useMemo } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { convertCurrency } from '../../utils/Currency';
import { getCurrencySymbol } from '../../utils/Currency';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";

function DailyIncomeExpenseCards() {
    const { transactions } = useContext(FinanceContext);

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const todayIncomeKHR = useMemo(() => {
        return transactions
            .filter(t => t.type.toLowerCase() === 'income' && t.date === today)
            .reduce((total, transaction) => {
                return total + (transaction.currency === 'KHR' ? transaction.amount : convertCurrency(transaction.amount, transaction.currency, 'KHR'));
            }, 0);
    }, [transactions]);

    const todayExpensesKHR = useMemo(() => {
        return transactions
            .filter(t => t.type.toLowerCase() === 'expense' && t.date === today)
            .reduce((total, transaction) => {
                return total + (transaction.currency === 'KHR' ? transaction.amount : convertCurrency(transaction.amount, transaction.currency, 'KHR'));
            }, 0);
    }, [transactions]);

    const todayIncomeUSD = useMemo(() => {
        return transactions
            .filter(t => t.type.toLowerCase() === 'income' && t.date === today)
            .reduce((total, transaction) => {
                return total + (transaction.currency === 'USD' ? transaction.amount : convertCurrency(transaction.amount, transaction.currency, 'USD'));
            }, 0);
    }, [transactions]);

    const todayExpensesUSD = useMemo(() => {
        return transactions
            .filter(t => t.type.toLowerCase() === 'expense' && t.date === today)
            .reduce((total, transaction) => {
                return total + (transaction.currency === 'USD' ? transaction.amount : convertCurrency(transaction.amount, transaction.currency, 'USD'));
            }, 0);
    }, [transactions]);
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-green-100 border border-green-300 rounded-lg p-4 flex items-center justify-between'>
            <div className='flex flex-col items-start gap-1'>
            <p className='text-lg text-green-600 font-semibold'>Today's Income</p>
                <p className='text-2xl text-green-700 font-semibold'>{getCurrencySymbol('KHR')}{todayIncomeKHR.toFixed(2)}</p>
                <p className='text-lg text-green-600'>{getCurrencySymbol('USD')}{todayIncomeUSD.toFixed(2)}</p>
            </div>
            <div className='text-2xl text-green-500 bg-green-200 p-3 rounded-full'>
                <FaArrowTrendUp />
            </div>
        </div>
        <div className='bg-red-100 border border-red-300 rounded-lg p-4 flex items-center justify-between'>
            <div className='flex flex-col items-start gap-1'>
                <p className='text-lg text-red-600 font-semibold'>Today's Expenses</p>
                <p className='text-2xl text-red-700 font-semibold'>{getCurrencySymbol('KHR')}{todayExpensesKHR.toFixed(2)}</p>
                <p className='text-lg text-red-600'>{getCurrencySymbol('USD')}{todayExpensesUSD.toFixed(2)}</p>
            </div>
            <div className='text-2xl text-red-500 bg-red-200 p-3 rounded-full'>
                <FaArrowTrendDown />
            </div>
        </div>
    </div>
  )
}

export default DailyIncomeExpenseCards