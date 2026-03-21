import {BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Transactions from '../Pages/Transactions';
import Budgets from '../Pages/Budgets';
import Reports from '../Pages/Reports';
import Login from '../Pages/Login';
import { useContext } from 'react';
import { UserContext } from '../Contexts/UserContext';
import Register from '../Pages/Register';
import Navbar from '../components/common/Navbar';
import MobileNavbar from '../components/common/MobileNavbar';

function AppRoutes() {
    const { currentUser } = useContext(UserContext);
    if (!currentUser) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Login />} />
                </Routes>
            </Router>
        );
    }
  return (
    <Router>
        <Navbar></Navbar>
        <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/reports" element={<Reports />} />
        </Routes>
        <MobileNavbar />
    </Router>
  )
}

export default AppRoutes