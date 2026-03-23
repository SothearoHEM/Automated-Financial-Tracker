import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import ErrorForm from '../common/ErrorForm';

function EditGoalModal({ goal, setIsEditModalOpen }) {
    const { updateGoal } = useContext(FinanceContext);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        target_amount: '',
        current_amount: '',
        currency: 'USD',
        target_date: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Populate form with goal data when modal opens
    useEffect(() => {
        if (goal) {
            setFormData({
                name: goal.name || '',
                description: goal.description || '',
                target_amount: goal.target_amount || '',
                current_amount: goal.current_amount || '',
                currency: goal.currency || 'USD',
                target_date: goal.target_date || ''
            });
        }
    }, [goal]);

    const formValid = formData.name && formData.target_amount && formData.target_date;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!formValid) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            // Prepare data for API
            const goalForApi = {
                name: formData.name,
                description: formData.description || null,
                target_amount: Number(formData.target_amount),
                current_amount: Number(formData.current_amount) || 0,
                currency: formData.currency,
                target_date: formData.target_date
            };
            await updateGoal(goal.id, goalForApi);
            setIsEditModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update goal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 md:p-0 p-4'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
                <h2 className='text-2xl font-bold mb-4'>Edit Goal</h2>
                {error && (
                    <div className="mb-4">
                        <ErrorForm message={error} />
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Goal Name *</label>
                        <input
                            type='text'
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Description</label>
                        <textarea
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none'
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Target Amount *</label>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                step='0.01'
                                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                            />
                            <select
                                className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="USD">USD</option>
                                <option value="KHR">KHR</option>
                            </select>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Current Amount</label>
                        <input
                            type='number'
                            step='0.01'
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={formData.current_amount}
                            onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 mb-2'>Target Date *</label>
                        <input
                            type='date'
                            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={formData.target_date}
                            onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button
                            type='button'
                            className='px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors'
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors'
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditGoalModal;
