import React from 'react'
import { CiCirclePlus } from "react-icons/ci";
import { IoIosArrowRoundUp,IoIosArrowRoundDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useContext,useState } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { getCurrencySymbol } from '../../utils/Currency';
import EditTransactionModal from './EditTransactionModal';

function TransactionsList({ transactions }) {
    const {deleteTransaction} = useContext(FinanceContext);
    
    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
        }
    }
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

    const handleEditClick = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditModalOpen(true);
    };

  return (
    <div className='w-full bg-white rounded-lg border border-gray-300 p-4 mb-5'>
        <div>
            <h1 className='text-lg font-semibold mb-4'>Transaction List</h1>
            {transactions.length === 0 ? (
                <div className='w-full h-32 flex flex-col items-center justify-center'>
                    <div className='text-7xl text-gray-500'><CiCirclePlus /></div>
                    <p className='text-gray-800 text-lg'>No transactions found.</p>
                    <p className='text-gray-500'>Add a new transaction to get started.</p>
                </div>
                
            ) : (
                transactions.map((transaction) => (
                    <div key={transaction.id} className='border-b border-gray-200 py-2 flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <div>
                                {transaction.type === 'Income' ? (
                                    <span className='text-green-500 text-5xl'><IoIosArrowRoundUp className='bg-green-200 rounded-full p-2'/></span>
                                ) : (
                                    <span className='text-red-500 text-5xl'><IoIosArrowRoundDown className='bg-red-200 rounded-full p-2'/></span>
                                )}
                            </div>
                            <div>
                                <h2 className='text-md font-medium'>{transaction.description}</h2>
                                <p className='text-sm text-gray-500'>{transaction.category} / {transaction.date}</p>
                            </div>
                        </div>
                        <div className='flex md:flex-row flex-col items-center gap-4'>
                            <p className={`text-md font-semibold ${transaction.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                                {transaction.type === 'Income' ? '+' : '-'}{getCurrencySymbol(transaction.currency)}{transaction.amount.toFixed(2)}
                            </p>
                            <div className='flex items-center gap-2'>
                                <button 
                                    className='text-blue-500 hover:bg-blue-200 rounded p-1 text-lg' 
                                    onClick={() => handleEditClick(transaction)}
                                >
                                    <MdOutlineEdit />
                                </button>
                                <button className='text-red-500 hover:bg-red-200 rounded p-1 ml-4 text-lg' onClick={() => handleDelete(transaction.id)}>
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
        <div>
            {isEditModalOpen && (
                <EditTransactionModal 
                    isEditModalOpen={isEditModalOpen} 
                    setIsEditModalOpen={setIsEditModalOpen} 
                    transactionToEdit={currentTransaction}
                />
            )}
        </div>
    </div>
  )
}

export default TransactionsList