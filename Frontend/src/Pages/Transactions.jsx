import React, { useContext } from 'react'
import { IoAdd } from "react-icons/io5";
import Filter from '../components/transactions/Filter';
import { FinanceContext } from '../Contexts/FinanceContext';

function Transactions() {
  const { filteredTransactions } = useContext(FinanceContext);

  return (
    <div className='max-w-7xl flex flex-col items-center justify-center mx-auto mt-5 px-4'>
      <div className='w-full h-16 flex items-center justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-bold'>Transactions</h1>
          <p className='text-gray-500'>Manage your income and expenses</p>
        </div>
        <div>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'><span className='text-xl'><IoAdd /></span>Add Transaction</button>
        </div>
      </div>
      <div className='w-full mt-5'>
        <Filter></Filter>
      </div>
      <div className='w-full mt-5 bg-white rounded-lg border border-gray-300 p-4'>
        <table className='w-full text-left'>
            <thead>
                <tr className='border-b border-gray-200'>
                    <th className='py-2'>Date</th>
                    <th className='py-2'>Description</th>
                    <th className='py-2'>Category</th>
                    <th className='py-2'>Type</th>
                    <th className='py-2'>Amount</th>
                </tr>
            </thead>
            <tbody>
                {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className='border-b border-gray-100 last:border-0 hover:bg-gray-50'>
                        <td className='py-2'>{transaction.date}</td>
                        <td className='py-2'>{transaction.description}</td>
                        <td className='py-2'>{transaction.category}</td>
                        <td className='py-2 capitalize'>{transaction.type}</td>
                        <td className={`py-2 font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount} {transaction.currency}
                        </td>
                    </tr>
                ))}
                {filteredTransactions.length === 0 && (
                    <tr>
                        <td colSpan="5" className='text-center py-4 text-gray-500'>No transactions found</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions