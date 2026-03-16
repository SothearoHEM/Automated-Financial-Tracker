import React, { useContext } from 'react'
import { FiFilter } from "react-icons/fi";
import { FinanceContext } from '../../Contexts/FinanceContext';

function Filter() {
    const {categories, currencies, types, filter, setFilter} = useContext(FinanceContext);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

  return (
    <div className='w-full bg-white border border-gray-300 rounded-lg flex flex-col p-4'>
        <div className='py-3 flex items-center gap-2'>
            <span className='text-gray-500 text-xl'><FiFilter /></span>
            <h2 className='text-lg font-semibold'>Filter</h2>
        </div>
        <div className='w-full flex md:flex-row flex-col items-center gap-4 justify-between'>
            <div className='flex flex-col gap-2 w-full'>
                <h1>Type</h1>
                <select 
                    name="type" 
                    value={filter.type} 
                    onChange={handleFilterChange} 
                    className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    {types.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <h1>Category</h1>
                <select 
                    name="category" 
                    value={filter.category} 
                    onChange={handleFilterChange} 
                    className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <h1>Currency</h1>
                <select 
                    name="currency" 
                    value={filter.currency} 
                    onChange={handleFilterChange} 
                    className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    {currencies.map((currency, index) => (
                        <option key={index} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>
        </div>
    </div>
  )
}

export default Filter