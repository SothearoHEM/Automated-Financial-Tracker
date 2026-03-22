import React, { useContext } from 'react'
import { IoAdd } from "react-icons/io5";
import Filter from '../components/transactions/Filter';
import { FinanceContext } from '../Contexts/FinanceContext';
import TransactionsList from '../components/transactions/TransactionsList';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';

function Transactions() {
  const { filteredTransactions, isLoading, error, refreshData } = useContext(FinanceContext);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);


  if (isLoading) {
    return <Loading message="Loading transactions..." />;
  }

  return (
    <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
      {error && (
        <div className="w-full mb-4">
          <ErrorDisplay message={error} onRetry={refreshData} retryLabel="Reload Transactions" />
        </div>
      )}
      <div className='w-full h-16 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Transactions</h1>
          <p className='text-gray-500'>Manage your income and expenses</p>
        </div>
        <div>
          <button 
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className='text-xl'><IoAdd /></span>
            <span className='hidden md:block'>Add Transaction</span>
          </button>
        </div>
      </div>
      <div className='w-full mt-5'>
        <Filter></Filter>
      </div>
      <div className='w-full mt-5'>
          <TransactionsList transactions={filteredTransactions}></TransactionsList>
      </div>
      <div>
        {isAddModalOpen && <AddTransactionModal isAddModalOpen={isAddModalOpen} setIsAddModalOpen={setIsAddModalOpen} />}
      </div>
    </div>
  )
}

export default Transactions