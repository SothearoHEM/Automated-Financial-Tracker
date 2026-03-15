import React from 'react'
import { useContext, useState } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';

function AddTransactionModal({ isAddModalOpen, setIsAddModalOpen }) {
    const IncomeCategories = [
        'Salary',
        'Business',
        'Investment',
        'Gift',
        'Freelance',
        'Other'
    ];
    const ExpenseCategories = [
        'Food',
        'Groceries',
        'Entertainment',
        'Transportation',
        'Healthcare',
        'Education',
        'Dining Out',
        'Shopping',
        'Other'
    ];
    const {addTransaction} = useContext(FinanceContext);
    const [tranFormData, setTranFormData] = useState({
        amount: '',
        type: 'Income',
        currency: 'USD',
        category: '',
        date: '',
        description: ''
    });
    const formValid = tranFormData.amount && tranFormData.category && tranFormData.date && tranFormData.description;
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formValid) {
            alert('Please fill in all required fields');
            return;
        }
        addTransaction({
            ...tranFormData,
            amount: Number(tranFormData.amount)
        });
        setIsAddModalOpen(false);
    };

    const handleTypeChange = (type) => {
        setTranFormData({
            ...tranFormData,
            type: type
        });
    };

    const handleCancel = () => {
        setIsAddModalOpen(false);
    };
  return (
    <div className='w-full h-screen fixed top-0 left-0 bg-black/50 bg-opacity-50 flex items-center justify-center md:p-0 p-4 overflow-auto z-50'>
        <div className='w-full max-w-md bg-white rounded-lg p-6'>
            <h1 className='text-xl font-semibold mb-4'>Add New Transaction</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='text-sm font-medium'>Type</label>
                    <div className='flex items-center gap-4'>
                        <button 
                            type="button" 
                            className={`px-4 py-2 rounded-lg hover:bg-gray-300 w-full ${tranFormData.type === 'Income' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => handleTypeChange('Income')}
                        >
                            Income
                        </button>
                        <button 
                            type="button" 
                            className={`px-4 py-2 rounded-lg hover:bg-gray-300 w-full ${tranFormData.type === 'Expense' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => handleTypeChange('Expense')}
                        >
                            Expense
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium'>Amount</label>
                    <input 
                        type="number" 
                        className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={tranFormData.amount}
                        onChange={(e) => setTranFormData({...tranFormData, amount: e.target.value})}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium'>Currency</label>
                    <select 
                        name="currency" 
                        id="currency" 
                        className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={tranFormData.currency}
                        onChange={(e) => setTranFormData({...tranFormData, currency: e.target.value})}
                    >
                        <option value="USD">USD</option>
                        <option value="KHR">KHR</option>
                    </select>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium'>Category</label>
                    <select 
                        name="category" 
                        id="category" 
                        className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={tranFormData.category}
                        onChange={(e) => setTranFormData({...tranFormData, category: e.target.value})}
                    >
                        <option value="">Select Category</option>
                        {tranFormData.type === 'Income' ? (
                            IncomeCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))
                        ) : (
                            ExpenseCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))
                        )}
                    </select>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium'>Date</label>
                    <input 
                        type="date" 
                        className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={tranFormData.date}
                        onChange={(e) => setTranFormData({...tranFormData, date: e.target.value})}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-medium'>Description</label>
                    <textarea 
                        className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        rows="3"
                        value={tranFormData.description}
                        onChange={(e) => setTranFormData({...tranFormData, description: e.target.value})}
                    ></textarea>
                </div>
                <div className='flex justify-end gap-4 mt-4'>
                    <button  type="button" className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600' onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddTransactionModal