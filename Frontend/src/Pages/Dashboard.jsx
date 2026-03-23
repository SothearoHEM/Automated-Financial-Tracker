import DashboardInfoCards from '../components/dashboard/DashboardInfoCards';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import BudgetAlerts from '../components/dashboard/BudgetAlerts';
import ExchangeRatesModal from '../components/dashboard/ExchangeRatesModal';
import { useContext,useState } from 'react';
import { FinanceContext } from '../Contexts/FinanceContext';
import { convertCurrency } from '../utils/Currency';
import { MdCurrencyExchange } from "react-icons/md";
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';

function Dashboard() {
  const {budgets, transactions, exchangeRate , updateExchangeRate, isLoading, error, setError, refreshData} = useContext(FinanceContext);

  const [isExchangeRatesModalOpen, setIsExchangeRatesModalOpen] = useState(false);

  const spendingRate = budgets.map(budget => {
    const totalSpent = transactions
      .filter(transaction => transaction.category === budget.category && transaction.type.toLowerCase() === 'expense')
      .reduce((total, transaction) => {
        const amountInKHR = transaction.currency === 'USD' ? convertCurrency(transaction.amount, 'USD', 'KHR') : transaction.amount;
        return total + amountInKHR;
      }, 0);
    
    const budgetAmountInKHR = budget.currency === 'USD' ? convertCurrency(budget.amount, 'USD', 'KHR') : budget.amount;

    return {
      category: budget.category,
      rate: budgetAmountInKHR > 0 ? (totalSpent / budgetAmountInKHR) * 100 : 0
    };
  });

  const budgetAlerts = spendingRate.filter(item => item.rate >= 80);

  if (isLoading) {
    return <Loading message="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
        <ErrorDisplay
          message={error}
          onRetry={refreshData}
          retryLabel="Reload Dashboard"
        />
      </div>
    );
  }

  return (
    <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
        <div className='w-full h-16 flex items-center justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <p className='text-gray-500'>Overview of your finances</p>
          </div>
          <div>
            <button 
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'
              onClick={() => setIsExchangeRatesModalOpen(true)}
            >
              <span className='text-xl'><MdCurrencyExchange /></span>
              <span className='hidden md:block'>Exchange Rates</span>
            </button>
          </div>
        </div>
        <div className='w-full mt-5'>
            <DashboardInfoCards />
        </div>
        <div className={ `w-full mt-5 ${budgetAlerts.length > 0 ? '' : 'hidden'}`}>
            <BudgetAlerts budgetAlerts={budgetAlerts} />
        </div>
        <div className='w-full mt-5'>
            <RecentTransactions />
        </div>
        <div className='w-full mt-5'>
            <SpendingByCategory />
        </div>
        <div>
            {isExchangeRatesModalOpen && <ExchangeRatesModal 
              isOpen={isExchangeRatesModalOpen} 
              onClose={() => setIsExchangeRatesModalOpen(false)} 
              exchangeRate={exchangeRate} 
              updateExchangeRate={updateExchangeRate} 
            />}
        </div>
    </div>
  )
}

export default Dashboard