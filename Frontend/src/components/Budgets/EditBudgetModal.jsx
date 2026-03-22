import React, { useContext, useState } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import ErrorDisplay from '../common/ErrorDisplay';

function EditBudgetModal({ budget, setIsEditModalOpen }) {
    const { updateBudget } = useContext(FinanceContext);
    const [formData, setFormData] = useState({
        id: budget?.id,
        category: budget?.category || '',
        amount: budget?.amount || '',
        currency: budget?.currency || 'USD',
        period: budget?.period || 'Monthly'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
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
    const formValid = formData.category && formData.amount && formData.currency;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if(!formValid) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            await updateBudget({
                ...formData,
                amount: Number(formData.amount)
            });
            setIsEditModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update budget');
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setIsEditModalOpen(false);
    };
  return (
    <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 md:p-0 p-4'>
        <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-2xl font-bold mb-4'>Edit Budget</h2>
            {error && (
                <div className="mb-4">
                    <ErrorDisplay message={error} onDismiss={() => setError(null)} />
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className='mb-4 w-full'>
                    <label className='block text-gray-700 mb-2'>Period</label>
                    <div className='flex items-center gap-1'>
                        <button type='button' className={formData.period === 'Weekly' ? 'px-4 py-2 rounded-lg bg-blue-500 text-white w-full' : 'px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 w-full'} onClick={() => setFormData({...formData, period: 'Weekly'})}>
                            Weekly
                        </button>
                        <button type='button' className={formData.period === 'Monthly' ? 'px-4 py-2 rounded-lg bg-blue-500 text-white w-full' : 'px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 w-full'} onClick={() => setFormData({...formData, period: 'Monthly'})}>
                            Monthly
                        </button>
                        <button type='button' className={formData.period === 'Yearly' ? 'px-4 py-2 rounded-lg bg-blue-500 text-white w-full' : 'px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 w-full'} onClick={() => setFormData({...formData, period: 'Yearly'})}>
                            Yearly
                        </button>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Category</label>
                    <select className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value=''>Select Category</option>
                        {ExpenseCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 mb-2'>Budget Limit</label>
                    <div className='flex items-center gap-2'>
                        <input 
                            type='number' 
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                        />
                        <select 
                            name="currency" 
                            id="currency" 
                            className='ml-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={formData.currency} 
                            onChange={(e) => setFormData({...formData, currency: e.target.value})}
                        >
                            <option value="USD">USD</option>
                            <option value="KHR">KHR</option>
                        </select>
                    </div>
                </div>
                <div className='flex justify-end gap-2'>
                    <button type='button' className='px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400' onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type='submit' className='px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300 disabled:cursor-not-allowed' disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditBudgetModal