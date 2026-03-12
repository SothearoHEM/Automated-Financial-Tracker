import React from 'react'
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
    const Nav = [
        { name: 'Dashboard', link: '#' },
        { name: 'Transactions', link: '#' },
        { name: 'Budgets', link: '#' },
        { name: 'Reports', link: '#' },
    ];
  return (
    <div className='w-full bg-white border-b border-gray-300 p-4 flex items-center'>
        <div className='w-7xl mx-auto flex items-center justify-between'>
            <div className='text-xl font-bold flex items-center'>
                <span className='text-4xl text-blue-500'><RiMoneyDollarCircleLine /></span>
                FinanceTracker
            </div>
            <div className='flex items-center space-x-4'>
                <nav className='hidden md:block'>
                    <ul className='flex space-x-6'>
                        {Nav.map((item, index) => (
                            <li key={index}>
                                <a href={item.link} className='text-gray-600 hover:text-blue-500'>
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className='border-l border-gray-300 h-7 flex items-center pl-4'>
                    <p className='text-gray-800 font-semibold'>User Name</p>
                    <button className='ml-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center'>
                        <span><FiLogOut /></span>
                        <span className='ml-2 md:block hidden'>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar