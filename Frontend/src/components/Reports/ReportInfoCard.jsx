import React from 'react'
import { useContext } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { calculateTotal } from '../../utils/Currency';
import { getCurrencySymbol } from '../../utils/Currency';
import { FaArrowTrendUp,FaArrowTrendDown } from "react-icons/fa6";
import { FiPercent } from "react-icons/fi";

function ReportInfoCard() {
    const { transactions } = useContext(FinanceContext);

    const totalIncome = calculateTotal(transactions, 'income');
    const totalExpenses = calculateTotal(transactions, 'expense');
    const savingRateKHR = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const savingRateUSD = calculateTotal(transactions, 'income', 'USD') > 0 ? ((calculateTotal(transactions, 'income', 'USD') - calculateTotal(transactions, 'expense', 'USD')) / calculateTotal(transactions, 'income', 'USD')) * 100 : 0;
  return (
    <div className='w-full grid md:grid-cols-3 gap-4'>
        <div className='w-full bg-white border border-gray-300 rounded-lg flex p-4 items-center justify-between'>
            <div className='flex flex-col items-start gap-1'>
            <p className='text-lg text-gray-600'>Total Income</p>
                <p className='text-2xl text-green-600 font-semibold'>{getCurrencySymbol('KHR')}{totalIncome.toFixed(2)}</p>
                <p className='text-lg text-green-600'>{getCurrencySymbol('USD')}{calculateTotal(transactions, 'income', 'USD').toFixed(2)}</p>
            </div>
            <div className='text-2xl text-green-500 bg-green-100 p-3 rounded-full'>
                <FaArrowTrendUp />
            </div>
        </div>
        <div className='w-full bg-white border border-gray-300 rounded-lg flex p-4 items-center justify-between'>
            <div className='flex flex-col items-start gap-1'>
            <p className='text-lg text-gray-600'>Total Expenses</p>
                <p className='text-2xl text-red-600 font-semibold'>{getCurrencySymbol('KHR')}{totalExpenses.toFixed(2)}</p>
                <p className='text-lg text-red-500'>{getCurrencySymbol('USD')}{calculateTotal(transactions, 'expense', 'USD').toFixed(2)}</p>
            </div>
            <div className='text-2xl text-red-500 bg-red-100 p-3 rounded-full'>
                <FaArrowTrendDown />
            </div>
        </div>
        <div className='w-full bg-white border border-gray-300 rounded-lg flex p-4 items-center justify-between'>
            <div className='flex flex-col items-start gap-1'>
            <p className='text-lg text-gray-600'>Saving Rate</p>
                <p className='text-2xl text-blue-600 font-semibold'>{getCurrencySymbol('KHR')}{savingRateKHR.toFixed(2)}%</p>
                <p className='text-lg text-blue-500'>{getCurrencySymbol('USD')}{savingRateUSD.toFixed(2)}%</p>
            </div>
            <div className='text-2xl text-blue-500 bg-blue-100 p-3 rounded-full'>
                <FiPercent />
            </div>
        </div>
    </div>
  )
}

export default ReportInfoCard