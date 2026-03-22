import React from 'react'
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdOutlineDashboard } from "react-icons/md";
import { TbReceiptDollar } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";
import { FiTarget } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../Contexts/UserContext';

function Navbar() {
    const { logout, currentUser, logoutLoading } = useContext(UserContext);
    const Nav = [
        { name: 'Dashboard', link: '/' ,logo : <MdOutlineDashboard />},
        { name: 'Transactions', link: '/transactions', logo: <TbReceiptDollar /> },
        { name: 'Budgets', link: '/budgets', logo: <FiTarget /> },
        { name: 'Reports', link: '/reports', logo: <VscGraph /> },
    ];
    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await logout();
        }
    }
  return (
    <div className='w-full bg-white border-b border-gray-300 p-4 flex items-center'>
        <div className='w-7xl mx-auto flex items-center justify-between lg:px-4 xl:px-8'>
            <div className='text-xl font-bold flex items-center'>
                <span className='text-4xl text-blue-500'><RiMoneyDollarCircleLine /></span>
                FinanceTracker
            </div>
            <div className='flex items-center space-x-4'>
                <nav className='hidden md:block'>
                    <ul className='flex space-x-6'>
                        {Nav.map((item, index) => (
                            <li key={index}>
                                <NavLink to={item.link} className={({ isActive }) => isActive ? 'text-blue-500 bg-blue-100 p-2 rounded-lg font-semibold flex items-center' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 p-2 rounded-lg flex items-center'}>
                                    {item.logo}
                                    <span className='ml-2'>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className='border-l border-gray-300 h-7 flex items-center pl-4'>
                    <p className='text-gray-800 font-semibold text-xl'>{currentUser?.name}</p>
                    <button
                        className='ml-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center disabled:bg-blue-300 disabled:cursor-not-allowed'
                        onClick={handleLogout}
                        disabled={logoutLoading}
                    >
                        {logoutLoading ? (
                            <span className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full'></span>
                        ) : (
                            <>
                                <span><FiLogOut /></span>
                                <span className='ml-2 md:block hidden'>Logout</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar