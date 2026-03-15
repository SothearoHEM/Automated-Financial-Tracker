import React, { useContext } from 'react'
import { FinanceContext } from '../../Contexts/FinanceContext';
import { getCurrencySymbol } from '../../utils/Currency';
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditBudgetModal from './EditBudgetModal';

function BudgetsList() {
    const {budgets, getBudgetStats, deleteBudget} = useContext(FinanceContext);

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this budget?')) {
            deleteBudget(id);
        }
    }

    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [currentBudget, setCurrentBudget] = React.useState(null);
    const handleEditClick = (budget) => {
        setCurrentBudget(budget);
        setIsEditModalOpen(true);
    };

  return (
    <div className='w-full'>
        {budgets.length === 0 ? (
            <div className='w-full bg-white border border-gray-300 rounded-lg flex flex-col p-4 items-center justify-center py-10'>
                <div className='text-7xl text-gray-500'><CiCirclePlus /></div>
                <p className='text-gray-800 text-lg'>No budgets found.</p>
                <p className='text-gray-500'>Add a new budget to get started.</p>
            </div>
        ) : (
            <div className='w-full grid md:grid-cols-2 gap-4'>
                {budgets.map((budget) => {
                    const { spent, remaining } = getBudgetStats(budget);
                    return (
                        <div key={budget.id} className='border border-gray-200 p-4 rounded-lg flex flex-col items-center'>
                            <div className='w-full flex items-center gap-3 mb-4 justify-between'>
                                <div className='flex flex-col items-start gap-1'>
                                    <p className='text-lg font-semibold'>{budget.category}</p>
                                    <p className='text-sm text-gray-500'>{budget.period} - {budget.currency}</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <button className='text-blue-500 hover:text-blue-700 text-lg p-2 hover:bg-blue-100 rounded-lg' onClick={() => handleEditClick(budget)}>
                                        <MdOutlineEdit />
                                    </button>
                                    <button className='text-red-500 hover:text-red-700 text-lg p-2 hover:bg-red-100 rounded-lg' onClick={() => handleDelete(budget.id)}>
                                        <RiDeleteBin6Line />
                                    </button>
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-3 mb-4 justify-between'>
                                <div>
                                    <p className='text-lg text-gray-800 font-semibold'>Spent: {getCurrencySymbol(budget.currency)}{spent ? spent.toFixed(2) : '0.00'}</p>
                                    <p className='text-sm text-gray-500'>of Limit: {getCurrencySymbol(budget.currency)}{budget.amount ? budget.amount.toFixed(2) : '0.00'}</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <p className='text-xl text-blue-700 font-semibold'>{getCurrencySymbol(budget.currency)}{remaining ? remaining.toFixed(2) : '0.00'}</p>
                                    <p className='text-sm text-gray-500'>Remaining</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        <div>
            {isEditModalOpen && <EditBudgetModal budget={currentBudget} setIsEditModalOpen={setIsEditModalOpen} />}
        </div>
    </div>
    
  )
}

export default BudgetsList