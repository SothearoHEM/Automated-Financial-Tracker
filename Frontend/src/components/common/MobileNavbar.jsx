import React from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { TbReceiptDollar } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";
import { FiTarget } from "react-icons/fi";
import { NavLink } from 'react-router-dom';

function MobileNavbar() {
  const Nav = [
          { name: 'Dashboard', link: '/' ,logo : <MdOutlineDashboard />},
          { name: 'Transactions', link: '/transactions', logo: <TbReceiptDollar /> },
          { name: 'Budgets', link: '/budgets', logo: <FiTarget /> },
          { name: 'Reports', link: '/reports', logo: <VscGraph /> },
      ];
  return (
    <div className='fixed bottom-0 w-full bg-white border-t border-gray-300 p-1.5 flex items-center md:hidden'>
        <div className='w-full mx-auto flex items-center justify-around'>
            <nav className='w-full'>
                <ul className='flex space-x-6 justify-around w-full'>
                    {Nav.map((item, index) => (
                        <li key={index}>
                            <NavLink to={item.link} className={({ isActive }) => isActive ? 'flex flex-col text-blue-500 bg-blue-100 p-1 rounded-lg font-semibold items-center justify-center' : 'flex flex-col text-gray-600 p-1 rounded-lg items-center justify-center'}>
                                {item.logo}
                                <span className='text-sm'>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </div>
  )
}

export default MobileNavbar