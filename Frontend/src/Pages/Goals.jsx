import React from 'react';
import { IoAdd } from "react-icons/io5";
import GoalsList from '../components/Goals/GoalsList';
import AddGoalModal from '../components/Goals/AddGoalModal';
import { useContext } from 'react';
import { FinanceContext } from '../Contexts/FinanceContext';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';

function Goals() {
    const { isLoading, error, refreshData } = useContext(FinanceContext);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    if (isLoading) {
        return <Loading message="Loading goals..." />;
    }

    if (error) {
        return (
            <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
                <ErrorDisplay
                    message={error}
                    onRetry={refreshData}
                    retryLabel="Reload Goals"
                />
            </div>
        );
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 md:mb-0 mb-20 px-4 sm:px-6 lg:px-8'>
            <div className='w-full h-16 flex items-center justify-between'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold'>Goals</h1>
                    <p className='text-gray-500'>Set and track your financial goals</p>
                </div>
                <div>
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'
                        onClick={openModal}
                    >
                        <span className='text-xl'><IoAdd /></span>
                        <span className='hidden md:block'>Add Goal</span>
                    </button>
                </div>
            </div>
            <div className='w-full mt-5 mb-5'>
                <GoalsList />
            </div>
            <div>
                {isModalOpen && <AddGoalModal setIsAddModalOpen={setIsModalOpen} />}
            </div>
        </div>
    );
}

export default Goals;
