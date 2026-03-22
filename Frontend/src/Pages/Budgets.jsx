import React from 'react'
import { IoAdd } from "react-icons/io5";
import BudgetsList from '../components/Budgets/BudgetsList';
import AddBudgetModal from '../components/Budgets/AddBudgetModal';
import { useContext } from 'react';
import { FinanceContext } from '../Contexts/FinanceContext';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';

function Budgets() {
  const { isLoading, error, refreshData } = useContext(FinanceContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (isLoading) {
    return <Loading message="Loading budgets..." />;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
      {error && (
        <div className="w-full mb-4">
          <ErrorDisplay message={error} onRetry={refreshData} retryLabel="Reload Budgets" />
        </div>
      )}
      <div className='w-full h-16 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Budgets</h1>
          <p className='text-gray-500'>Set and manage your budgets</p>
        </div>
        <div>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'
            onClick={openModal}
          >
            <span className='text-xl'><IoAdd /></span>
            <span className='hidden md:block'>Add Budget</span>
          </button>
        </div>
      </div>
      <div className='w-full mt-5 mb-5'>
        <BudgetsList />
      </div>
      <div>
        {isModalOpen && <AddBudgetModal setIsAddModalOpen={setIsModalOpen} />}
      </div>
    </div>
  )
}

export default Budgets
