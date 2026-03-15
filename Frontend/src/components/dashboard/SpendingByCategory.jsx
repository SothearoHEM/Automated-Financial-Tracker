import React from 'react'
import { useContext } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { getCurrencySymbol } from '../../utils/Currency';
import { calculateTotal } from '../../utils/Currency';
import { convertCurrency } from '../../utils/Currency';

function SpendingByCategory() {
    const { transactions } = useContext(FinanceContext);

    const spentByCategory = transactions
        .filter(transaction => transaction.type.toLowerCase() === 'expense')
        .reduce((acc, transaction) => {
            const amountInKHR = transaction.currency === 'USD' ? convertCurrency(transaction.amount, 'USD', 'KHR') : transaction.amount;
            acc[transaction.category] = (acc[transaction.category] || 0) + amountInKHR;
            return acc;
        }, {});

    const totalExpenses = calculateTotal(transactions, 'expense');

    const spendingProgress = Object.entries(spentByCategory).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }));
  return (
    <div className='w-full bg-white border border-gray-300 rounded-lg p-4 mb-5'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>Spending by Category</h2>
        {transactions.length === 0 ? (
            <p className='text-gray-500 text-center py-10'>
                No transactions yet. Start adding your income and expenses to see them here.
            </p>
        ) : (
            <ul className='space-y-2'>
                {spendingProgress.map(({ category, amount, percentage }) => (
                    <li key={category} className='flex flex-col justify-between items-center border-b border-gray-200 pb-2'>
                        <div className='flex justify-between items-center w-full mb-2'>
                            <p className='text-gray-700 font-medium'>{category}</p>
                            <p className={`text-lg font-semibold text-gray-500`}>
                                -{getCurrencySymbol('USD')}{convertCurrency(amount, 'KHR', 'USD').toFixed(2)} / {getCurrencySymbol('KHR')}{amount.toFixed(2)}
                            </p>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div className='bg-blue-500 h-2 rounded-full' style={{ width: `${percentage}%` }}></div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default SpendingByCategory