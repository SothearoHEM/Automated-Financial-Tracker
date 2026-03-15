import React from 'react'
import { useContext } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { getCurrencySymbol } from '../../utils/Currency';

function RecentTransactions() {
    const { transactions } = useContext(FinanceContext);
  return (
    <div className='w-full bg-white border border-gray-300 rounded-lg p-4'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>Recent Transactions</h2>
        {transactions.length === 0 ? (
            <p className='text-gray-500 text-center py-10'>
                No transactions yet. Start adding your income and expenses to see them here.
            </p>
        ) : (
            <ul className='space-y-2'>
                {transactions.slice(0, 5).map((transaction) => (
                    <li key={transaction.id} className='flex justify-between items-center border-b border-gray-200 pb-2'>
                        <div>
                            <p className='text-gray-700 font-medium'>{transaction.description}</p>
                            <p className='text-gray-500 text-sm'>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <p className={`text-lg font-semibold ${transaction.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                            {transaction.type === 'Income' ? '+' : '-'}{getCurrencySymbol(transaction.currency)}{transaction.amount.toFixed(2)}
                        </p>
                    </li>  
                ))}
            </ul>
        )}
    </div>
  )
}

export default RecentTransactions