import React from 'react'
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { PiLockKeyLight } from "react-icons/pi";
import { PiUser } from "react-icons/pi";

function Login() {
  return (
    <div className='bg-blue-100 flex flex-col items-center justify-center min-h-screen px-2'>
        <form action="" className='bg-white shadow-lg p-6 rounded-xl flex flex-col gap-4 items-center md:w-120 w-full max-w-md'>
            <div className='text-7xl text-blue-500'><RiMoneyDollarCircleLine /></div>
            <h2 className='text-2xl font-bold text-center'>FinanceTracker</h2>
            <p className='text-gray-600 text-center'>Manage your finances with ease</p>
            <div className='relative w-full'>
                <div className='absolute left-3 top-3 text-gray-600'><PiUser /></div>
                <input type="text" placeholder='Username' className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10' />
            </div>
            <div className='relative w-full'>
                <div className='absolute left-3 top-3 text-gray-600'><PiLockKeyLight /></div>
                <input type="password" placeholder='Password' className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10' />
            </div>
            <button className='bg-blue-500 text-white rounded-xl px-4 py-2 w-full hover:bg-blue-600'>Login</button>
        </form>
    </div>
  )
}

export default Login