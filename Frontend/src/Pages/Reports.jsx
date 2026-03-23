import React, { useState } from 'react'
import { CiCalendar } from "react-icons/ci";
import { useContext, useRef } from 'react';
import { FinanceContext } from '../Contexts/FinanceContext';
import { CiCirclePlus } from "react-icons/ci";
import ReportInfoCard from '../components/Reports/ReportInfoCard';
import PeriodIncomevsExpenses from '../components/Reports/PeriodIncomevsExpenses';
import SavingsTrend from '../components/Reports/SavingsTrend';
import SpendingbyCategory from '../components/Reports/SpendingbyCategory';
import CategoryDetails from '../components/Reports/CategoryDetails';
import ExportPDF from '../components/Reports/ExportPDF';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';

function Reports() {
  const {transactions, reportType, setReportType, timeRange, setTimeRange, isLoading, error, refreshData} = useContext(FinanceContext);
  const reportRef = useRef();
  const [currency, setCurrency] = useState('KHR');

  if (isLoading) {
    return <Loading message="Loading reports..." />;
  }

  if (error) {
    return (
      <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
        <ErrorDisplay
          message={error}
          onRetry={refreshData}
          retryLabel="Reload Reports"
        />
      </div>
    );
  }

  return (
    <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
      <div className='w-full flex md:flex-row flex-col md:items-center items-start justify-between gap-4'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Reports</h1>
          <p className='text-gray-500'>View your financial reports and insights</p>
        </div>
        <div className='flex md:flex-row flex-col items-start md:items-center gap-4 w-full md:w-auto'>
          <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 w-full md:w-auto overflow-x-auto'>
            <button className={currency === 'KHR' ? 'bg-green-500 text-white rounded-lg px-4 py-1 flex-1 md:flex-none whitespace-nowrap' : 'text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 flex-1 md:flex-none whitespace-nowrap'} onClick={() => setCurrency('KHR')}>
              KHR
            </button>
            <button className={currency === 'USD' ? 'bg-green-500 text-white rounded-lg px-4 py-1 flex-1 md:flex-none whitespace-nowrap' : 'text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 flex-1 md:flex-none whitespace-nowrap'} onClick={() => setCurrency('USD')}>
              USD
            </button>
          </div>
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
                <div className='w-full mt-5'>
                  <PeriodIncomevsExpenses reportType={reportType} currency={currency} />
                </div>
                <div className='w-full mt-5'>
                  <SavingsTrend reportType={reportType} currency={currency} />
                </div> 
                <div className='w-full mt-5'>
                  <SpendingbyCategory reportType={reportType} currency={currency} />
                </div>
                <div className='w-full mt-5'>
                  <CategoryDetails reportType={reportType} currency={currency} />
                </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Reports