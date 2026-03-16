import React from 'react'
import { CiCalendar } from "react-icons/ci";
import { useContext, useRef } from 'react';
import { FinanceContext } from '../Contexts/FinanceContext';
import { CiCirclePlus } from "react-icons/ci";
import ReportInfoCard from '../components/Reports/ReportInfoCard';
import PeriodIncomevsExpensesKHR from '../components/Reports/PeriodIncomevsExpensesKHR';
import PeriodIncomevsExpensesUSD from '../components/Reports/PeriodIncomevsExpensesUSD';
import SavingsTrendKHR from '../components/Reports/SavingsTrendKHR';
import SavingsTrendUSD from '../components/Reports/SavingsTrendUSD';
import SpendingbyCategoryKHR from '../components/Reports/SpendingbyCategoryKHR';
import SpendingbyCategoryUSD from '../components/Reports/SpendingbyCategoryUSD';
import CategoryDetailsKHR from '../components/Reports/CategoryDetailsKHR';
import CategoryDetailsUSD from '../components/Reports/CategoryDetailsUSD';
import ExportPDF from '../components/Reports/ExportPDF';

function Reports() {
  const {transactions, reportType, setReportType, timeRange, setTimeRange} = useContext(FinanceContext);
  const reportRef = useRef();

  return (
    <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
      <div className='w-full flex md:flex-row flex-col md:items-center items-start justify-between gap-4'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Reports</h1>
          <p className='text-gray-500'>View your financial reports and insights</p>
        </div>
        <div className='flex md:flex-row flex-col items-start md:items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 w-full md:w-auto overflow-x-auto'>
            <button className={reportType === 'weekly' ? 'bg-blue-500 text-white rounded-lg px-4 py-1 flex-1 md:flex-none whitespace-nowrap' : 'text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 flex-1 md:flex-none whitespace-nowrap'} onClick={() => setReportType('weekly')}>
              Weekly
            </button>
            <button className={reportType === 'monthly' ? 'bg-blue-500 text-white rounded-lg px-4 py-1 flex-1 md:flex-none whitespace-nowrap' : 'text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 flex-1 md:flex-none whitespace-nowrap'} onClick={() => setReportType('monthly')}>
              Monthly
            </button>
          </div>
          <div className='flex items-center gap-2 w-full md:w-auto'>
              <CiCalendar className='text-gray-700 text-3xl shrink-0'/>
              <select className='border border-gray-300 rounded-lg px-2 py-1 w-full md:w-auto' value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                {[1,3,6,12,24].map((option) => (
                  <option key={option} value={option}>
                    Last {option} {reportType === 'weekly' ? 'Weeks' : 'Months'}
                  </option>
                ))}
              </select>
          </div>
          <div className='w-full md:w-auto'>
            <ExportPDF reportRef={reportRef} />
          </div>
        </div>
      </div>
      <div className='w-full mt-5 mb-5'>
          {transactions.length === 0 ? (
            <div className='w-full h-64 flex flex-col items-center bg-white justify-center border border-gray-300 rounded-lg'>
              <p className='text-7xl text-gray-500'><CiCirclePlus /></p>
              <p className='text-gray-500'>No transactions to display. Start adding transactions to see your reports.</p>
            </div> 
          ) : (
            <div className='w-full flex flex-col items-center justify-center' ref={reportRef}>
                <div className='w-full mt-5'>
                  <ReportInfoCard />
                </div>
                <div className='w-full mt-5 flex flex-col items-center justify-center gap-5'>
                  <PeriodIncomevsExpensesKHR reportType={reportType} />
                  <PeriodIncomevsExpensesUSD reportType={reportType} />
                </div>
                <div className='w-full mt-5 flex flex-col items-center justify-center gap-5'>
                  <SavingsTrendKHR reportType={reportType} />
                  <SavingsTrendUSD reportType={reportType} />
                </div> 
                <div className='w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <SpendingbyCategoryKHR reportType={reportType} />
                  <SpendingbyCategoryUSD reportType={reportType} />
                </div>
                <div className='w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <CategoryDetailsKHR reportType={reportType} />
                  <CategoryDetailsUSD reportType={reportType} />
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Reports