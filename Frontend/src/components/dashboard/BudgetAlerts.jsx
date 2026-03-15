import React from 'react'
import { getCurrencySymbol } from '../../utils/Currency';
import { useContext } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { MdErrorOutline } from "react-icons/md";


function BudgetAlerts({budgetAlerts}) {
    const {budgets} = useContext(FinanceContext);

  return (
    <div className='w-full bg-red-100 border border-gray-300 rounded-lg p-4'>
        <h2 className='text-xl font-semibold mb-4 text-red-800 flex items-center gap-1'><span className='text-2xl'><MdErrorOutline /></span>Budget Alerts</h2>
        <ul className='space-y-2'>
            {budgetAlerts.map((alert, index) => {
                const budget = budgets.find(b => b.category === alert.category);
                const spentAmount = budget ? (alert.rate / 100) * budget.amount : 0;
                
                return (
                <li key={index} className='flex justify-between items-center border-b border-gray-200 pb-2'>
                    <p className='text-red-600 font-medium'>
                        {alert.category}: {getCurrencySymbol(budget?.currency)}{spentAmount.toFixed(2)} / {getCurrencySymbol(budget?.currency)}{budget?.amount ? budget.amount.toFixed(2) : '0.00'}
                    </p>
                    <span className='text-red-500 font-bold text-sm'>{alert.rate.toFixed(2)}%</span>
                </li>
            )})}
        </ul>
    </div>
  )
}

export default BudgetAlerts