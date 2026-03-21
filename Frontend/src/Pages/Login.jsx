import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { PiLockKeyLight } from "react-icons/pi";
import { PiUser } from "react-icons/pi";
import { useContext,useState } from 'react';
import { UserContext } from '../Contexts/UserContext';
import { MdErrorOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Loading from '../components/common/Loading';


function Login() {
    const { login } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
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

        setLoading(true);
        setError('');

        setTimeout(() => {
            const success = login(formData.username, formData.password);
            if (!success) {
                setError("Invalid username or password");
            }
            setLoading(false);
        }, 0);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
        

  if (loading) {
      return <Loading message="Logging you in..." />;
  }

  return (
    <div className='bg-blue-100 flex flex-col items-center justify-center min-h-screen px-2'>
        <form action="" className='bg-white shadow-lg p-6 rounded-xl flex flex-col gap-4 items-center md:w-120 w-full max-w-md' onSubmit={handleSubmit}>
            <div className='text-7xl text-blue-500'><RiMoneyDollarCircleLine /></div>
            <h2 className='text-2xl font-bold text-center'>FinanceTracker</h2>
            <p className='text-gray-600 text-center'>Manage your finances with ease</p>
            {error && <p className='text-red-600 text-sm w-full flex items-center gap-1'><span className='text-lg'><MdErrorOutline /></span>{error}</p>}
            <div className='relative w-full'>
                <div className='absolute left-3 top-3 text-gray-600'><PiUser /></div>
                <input type="text" name="username" placeholder='Username' className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500' required onChange={handleChange} />
            </div>
            <div className='relative w-full'>
                <div className='absolute left-3 top-3 text-gray-600'><PiLockKeyLight /></div>
                <div className='absolute right-3 top-3 text-gray-600 hover:text-blue-500 text-lg' onClick={togglePasswordVisibility}>
                    {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </div>
                <input type={showPassword ? "text" : "password"} name="password" placeholder='Password' className='border border-gray-300 rounded-xl px-4 py-2 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500' required onChange={handleChange} />
                <p className='text-gray-600 text-sm mt-1'>Password must be more than 6 characters</p>
            </div>
            <button type='submit' className='bg-blue-500 text-white rounded-xl px-4 py-2 w-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed' disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <div>
                <p className='text-gray-600 text-sm'>Don't have an account? <Link to="/register" className='text-blue-500 font-semibold hover:underline'>Register Here</Link></p>
            </div>
        </form>
    </div>
  )
}

export default Login