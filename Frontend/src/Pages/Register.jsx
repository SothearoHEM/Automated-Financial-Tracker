import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { PiLockKeyLight } from "react-icons/pi";
import { PiUser } from "react-icons/pi";
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';
import { MdErrorOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Loading from '../components/common/Loading';

function Register() {
    const { register } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password.length <= 6) {
            setError('Password must be more than 6 characters');
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        // Use setTimeout to allow UI to update and show loading state
        setTimeout(() => {
            const success = register(formData.name, formData.username, formData.password, formData.password_confirmation);
            if (!success) {
                setError("Registration failed. Please try again.");
                setLoading(false);
            } else {
                setLoading(false);
                navigate('/');
            }
        }, 0);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    if (loading) {
        return <Loading message="Creating your account..." />;
    }

    return (
        <div className='bg-blue-100 flex flex-col items-center justify-center min-h-screen px-2'>
            <div className='bg-white shadow-lg p-6 rounded-xl flex flex-col gap-4 items-center md:w-120 w-full max-w-md'>
                <div className='text-7xl text-blue-500'><RiMoneyDollarCircleLine /></div>
                <h2 className='text-2xl font-bold text-center'>FinanceTracker</h2>
                <p className='text-gray-600 text-center'>Create your account</p>

                {error && (
                    <div className='text-red-600 text-sm w-full flex items-center gap-1 bg-red-50 p-3 rounded-lg'>
                        <span className='text-lg'><MdErrorOutline /></span>
                        {error}
                    </div>
                )}

                <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-2 w-full'>
                        <label className='text-sm font-medium'>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Enter your full name'
                            className='border border-gray-300 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label className='text-sm font-medium'>Username</label>
                        <div className='relative'>
                            <div className='absolute left-3 top-3 text-gray-600'><PiUser /></div>
                            <input
                                type="text"
                                name="username"
                                placeholder='Choose a username'
                                className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label className='text-sm font-medium'>Password</label>
                        <div className='relative'>
                            <div className='absolute left-3 top-3 text-gray-600'><PiLockKeyLight /></div>
                            <div className='absolute right-3 top-3 text-gray-600 hover:text-blue-500 text-lg cursor-pointer' onClick={togglePasswordVisibility}>
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder='Create a password'
                                className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <p className='text-gray-600 text-sm'>Password must be at least 7 characters</p>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <label className='text-sm font-medium'>Confirm Password</label>
                        <div className='relative'>
                            <div className='absolute left-3 top-3 text-gray-600'><PiLockKeyLight /></div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password_confirmation"
                                placeholder='Confirm your password'
                                className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                required
                                value={formData.password_confirmation}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='bg-blue-500 text-white rounded-xl px-4 py-2 w-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className='text-center text-sm text-gray-600'>
                    Already have an account?{' '}
                    <Link to="/login" className='text-blue-500 hover:text-blue-600 font-medium'>
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
