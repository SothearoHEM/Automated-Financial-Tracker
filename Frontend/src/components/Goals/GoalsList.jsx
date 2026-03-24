import React, { useContext, useState } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { getCurrencySymbol } from '../../utils/Currency';
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditGoalModal from './EditGoalModal';

function GoalsList() {
    const {
        goals,
        getGoalProgress,
        deleteGoal,
        error,
        setError,
        goalStatus,
        goalStatusFilter,
        setGoalStatusFilter,
        filteredGoals,
        updateGoal
    } = useContext(FinanceContext);

    const [selectedGoalId, setSelectedGoalId] = useState('');
    const [updateAmount, setUpdateAmount] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await deleteGoal(id);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete goal');
            }
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const handleEditClick = (goal) => {
        setCurrentGoal(goal);
        setIsEditModalOpen(true);
        setUpdateError(null); // Clear update error when opening edit modal
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setUpdateError(null);
    };

    const handleUpdateGoal = async () => {
        if (!selectedGoalId) {
            setUpdateError('Please select a goal to update');
            return;
        }
        if (!updateAmount || parseFloat(updateAmount) < 0) {
            setUpdateError('Please enter a valid amount');
            return;
        }

        // Find the selected goal to get all required fields
        const goalToUpdate = goals.find(g => g.id.toString() === selectedGoalId);
        if (!goalToUpdate) {
            setUpdateError('Selected goal not found');
            return;
        }

        setUpdateLoading(true);
        setUpdateError(null);
        try {
            // Send all required fields, updating only current_amount
            // Only include required fields to avoid validation errors
            const updateData = {
                name: goalToUpdate.name,
                target_amount: goalToUpdate.target_amount,
                currency: goalToUpdate.currency,
                target_date: goalToUpdate.target_date,
                current_amount: parseFloat(updateAmount)
            };
            // Only add optional fields if they exist
            if (goalToUpdate.description) {
                updateData.description = goalToUpdate.description;
            }
            // Don't send status - backend auto-calculates it
            await updateGoal(selectedGoalId, updateData);
            setUpdateAmount('');
            setSelectedGoalId('');
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Failed to update goal amount');
        } finally {
            setUpdateLoading(false);
        }
    };

    const getStatusBadgeClass = (status, daysLeft) => {
        if (status === 'Completed') return 'bg-green-100 text-green-700';
        if (status === 'Abandoned' || daysLeft < 0) return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className='w-full'>
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <div className='mb-4 flex md:flex-row flex-col items-center gap-4'>
                {/* Filters */}
                <div className='md:mb-4 mb-0 flex items-center gap-4 w-full md:w-auto'>
                    <div className='flex items-center gap-2 w-full'>
                        <label htmlFor="statusFilter" className='text-gray-700 font-medium'>Status:</label>
                        <select
                            id="statusFilter"
                            value={goalStatusFilter}
                            onChange={(e) => setGoalStatusFilter(e.target.value)}
                            className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-auto w-full'
                        >
                            {goalStatus.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='mb-4 flex flex-col w-full gap-2'>
                    <div className='flex md:flex-row flex-col items-center gap-2'>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Enter new current amount"
                            value={updateAmount}
                            onChange={(e) => {
                                setUpdateAmount(e.target.value);
                                setUpdateError(null);
                            }}
                            className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-2/8 w-full'
                        />
                        <select
                            name="goal"
                            value={selectedGoalId}
                            onChange={(e) => {
                                setSelectedGoalId(e.target.value);
                                setUpdateError(null);
                            }}
                            className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-auto w-full'
                        >
                            <option value="">Select Goal by Name to Update</option>
                            {goals.map((goal) => (
                                <option key={goal.id} value={goal.id}>
                                    {goal.name} ({getCurrencySymbol(goal.currency)}{goal.current_amount.toFixed(2)})
                                </option>
                            ))}
                        </select>
                        <button
                            className='flex items-center gap-2 md:w-auto w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed'
                            onClick={handleUpdateGoal}
                            disabled={updateLoading}
                        >
                            <CiCirclePlus className='text-xl' />
                            {updateLoading ? 'Updating...' : 'Update Goal'}
                        </button>
                    </div>
                </div>
            </div>
            {updateError && (
                <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm mb-4">
                    {updateError}
                </div>
            )}
            {filteredGoals.length === 0 ? (
                <div className='w-full bg-white border border-gray-300 rounded-lg flex flex-col p-4 items-center justify-center py-10'>
                    <div className='text-7xl text-gray-500'><CiCirclePlus /></div>
                    <p className='text-gray-800 text-lg'>No goals found.</p>
                    <p className='text-gray-500'>Set your first financial goal to start tracking.</p>
                </div>
            ) : (
                <div className='w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredGoals.map((goal) => {
                        const { progress, remaining } = getGoalProgress(goal);
                        const isCompleted = goal.status === 'Completed';
                        const isOverTarget = goal.current_amount >= goal.target_amount;

                        return (
                            <div key={goal.id} className='border border-gray-300 p-5 bg-white rounded-lg flex flex-col relative'>
                                {/* Header: Title and top-right info */}
                                <div className='w-full flex items-start justify-between mb-4'>
                                    <div className='flex flex-col items-start gap-1 flex-1'>
                                        <p className='text-lg font-semibold'>{goal.name}</p>
                                        <p className='text-sm text-gray-500'>{goal.description}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(goal.status, goal.days_left)}`}>
                                            {goal.status}
                                        </div>
                                        <span className='text-xs text-gray-500'>{goal.currency}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className='w-full mb-4'>
                                    <div className='flex justify-between text-sm mb-1'>
                                        <span className='text-gray-600'>Progress</span>
                                        <span className={`font-semibold ${isCompleted || isOverTarget ? 'text-green-600' : 'text-blue-600'}`}>
                                            {progress.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isCompleted || isOverTarget ? 'bg-green-500' : 'bg-blue-500'}`}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Amount Details */}
                                <div className='flex justify-between items-center mb-3'>
                                    <div>
                                        <p className='text-xs text-gray-500'>Current</p>
                                        <p className='text-lg font-bold text-gray-800'>
                                            {getCurrencySymbol(goal.currency)}{goal.current_amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-xs text-gray-500'>Target</p>
                                        <p className='text-lg font-bold text-gray-800'>
                                            {getCurrencySymbol(goal.currency)}{goal.target_amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-xs text-gray-500'>Left</p>
                                        <p className={`text-lg font-bold ${remaining <= 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                            {remaining > 0 ? getCurrencySymbol(goal.currency) + remaining.toFixed(2) : '✓'}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom: Left - Due info, Right - Actions */}
                                <div className='flex justify-between items-center text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100'>
                                    <div className='flex flex-col gap-1'>
                                        {goal.days_left !== null && (
                                            <p className={`text-xs font-medium ${goal.days_left < 0 ? 'text-red-600' : goal.days_left === 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                                                {goal.days_left < 0
                                                    ? `Overdue by ${Math.abs(goal.days_left)} days`
                                                    : goal.days_left === 0
                                                        ? 'Due today'
                                                        : `${goal.days_left} days left`
                                                }
                                            </p>
                                        )}
                                        <p className='text-xs text-gray-400'>
                                            Due: {formatDate(goal.target_date)}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button
                                            className='text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-100 rounded-lg transition-colors'
                                            onClick={() => handleEditClick(goal)}
                                        >
                                            <MdOutlineEdit />
                                        </button>
                                        <button
                                            className='text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors'
                                            onClick={() => handleDelete(goal.id)}
                                        >
                                            <RiDeleteBin6Line />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <div>
                {isEditModalOpen && <EditGoalModal goal={currentGoal} setIsEditModalOpen={handleCloseEditModal} />}
            </div>
        </div>
    );
}

export default GoalsList;
