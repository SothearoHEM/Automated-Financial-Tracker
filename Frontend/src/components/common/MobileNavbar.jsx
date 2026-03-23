import React from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { TbReceiptDollar } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";
import { FiTarget } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import { LuGoal } from "react-icons/lu";

function MobileNavbar() {
  const Nav = [
          { name: 'Dashboard', link: '/' ,logo : <MdOutlineDashboard />},
          { name: 'Transactions', link: '/transactions', logo: <TbReceiptDollar /> },
          { name: 'Budgets', link: '/budgets', logo: <FiTarget /> },
          { name: 'Goals', link: '/goals', logo: <LuGoal /> },
          { name: 'Reports', link: '/reports', logo: <VscGraph /> },
      ];
  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden safe-area-bottom z-50'>
      <nav className='w-full'>
        <ul className='flex items-center justify-around py-2 px-1'>
          {Nav.map((item, index) => (
            <li key={index} className='flex-1'>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  isActive
                    ? 'flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 text-blue-600 transition-colors'
                    : 'flex flex-col items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors'
                }
              >
                <span className='text-xl mb-1'>{item.logo}</span>
                <span className='text-[10px] font-medium truncate max-w-full'>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default MobileNavbar