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
      <div className='w-full flex md:flex-row flex-col md:items-center items-start justify-between gap-4 mb-6'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold text-gray-900'>Financial Reports</h1>
          <p className='text-gray-500'>Analyze your income, expenses, and savings trends</p>
        </div>
        <div className='flex md:flex-row flex-col items-start md:items-center gap-3 w-full md:w-auto'>
          <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-1 py-1  w-full md:w-auto'>
            <button
              className={currency === 'KHR' ? 'bg-green-500 text-white rounded px-1 py-1 flex-1 md:flex-none whitespace-nowrap transition-colors' : 'text-gray-700 px-1 py-1 rounded hover:bg-gray-100 flex-1 md:flex-none whitespace-nowrap'}
              onClick={() => setCurrency('KHR')}
            >
              KHR
            </button>
            <button
              className={currency === 'USD' ? 'bg-green-500 text-white rounded px-1 py-1 flex-1 md:flex-none whitespace-nowrap transition-colors' : 'text-gray-700 px-1 py-1 rounded hover:bg-gray-100 flex-1 md:flex-none whitespace-nowrap'}
              onClick={() => setCurrency('USD')}
            >
              USD
            </button>
          </div>
          <div className='flex items-center gap-2 border border-gray-300 rounded-lg p-1 w-full md:w-auto'>
            <button
              className={reportType === 'weekly' ? 'bg-blue-500 text-white rounded px-1 py-1 flex-1 md:flex-none whitespace-nowrap transition-colors' : 'text-gray-700 px-1 py-1 rounded hover:bg-gray-100 flex-1 md:flex-none whitespace-nowrap'}
              onClick={() => setReportType('weekly')}
            >
              Weekly
            </button>
            <button
              className={reportType === 'monthly' ? 'bg-blue-500 text-white rounded px-1 py-1 flex-1 md:flex-none whitespace-nowrap transition-colors' : 'text-gray-700 px-1 py-1 rounded hover:bg-gray-100 flex-1 md:flex-none whitespace-nowrap'}
              onClick={() => setReportType('monthly')}
            >
              Monthly
            </button>
          </div>
          <div className='flex items-center gap-2 w-full md:w-auto'>
            <CiCalendar className='text-gray-700 text-3xl shrink-0' />
            <select
              className='border border-gray-300 rounded-lg px-3 py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {[1, 3, 6, 12, 24].map((option) => (
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

      <div className='w-full'>
        {transactions.length === 0 ? (
          <div className='w-full h-96 flex flex-col items-center bg-white justify-center border border-gray-300 rounded-lg'>
            <p className='text-8xl text-gray-400 mb-4'><CiCirclePlus /></p>
            <p className='text-xl font-semibold text-gray-700 mb-2'>No Transaction Data</p>
            <p className='text-gray-500 max-w-md text-center'>
              Start by adding income and expense transactions to generate financial reports and insights.
            </p>
          </div>
        ) : (
          <div className='w-full flex flex-col items-center' ref={reportRef}>
            <div className='w-full mt-5'>
              <ReportInfoCard />
            </div>
            <div className='w-full mt-5 grid grid-cols-1 xl:grid-cols-2 gap-5'>
              <div className='w-full'>
                <PeriodIncomevsExpenses reportType={reportType} currency={currency} />
              </div>
              <div className='w-full'>
                <SavingsTrend reportType={reportType} currency={currency} />
              </div>
            </div>
            <div className='w-full mt-5 mb-7 grid grid-cols-1 lg:grid-cols-2 gap-5'>
              <div className='w-full'>
                <SpendingbyCategory currency={currency} />
              </div>
              <div className='w-full'>
                <CategoryDetails currency={currency} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Reports