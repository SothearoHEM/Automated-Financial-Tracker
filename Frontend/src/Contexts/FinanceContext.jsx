import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { convertCurrency } from '../utils/Currency';
import { transactionsAPI } from '../api/transactions';
import { budgetsAPI } from '../api/budgets';
import { authAPI } from '../api/auth';
import { useContext } from 'react';
import { UserContext } from './UserContext';

// eslint-disable-next-line react-refresh/only-export-components
export const FinanceContext = createContext();

function getWeek(date) {
    const d = new Date(date);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
}

function getMonth(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export const FinanceProvider = ({ children }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(() => {
        const savedRate = localStorage.getItem('exchangeRate');
        const parsed = savedRate ? parseFloat(savedRate) : 4000;
        return isNaN(parsed) ? 4000 : parsed;
    });

    // Sync exchange rate with currentUser's exchange_rate
    useEffect(() => {
        if (currentUser?.exchange_rate) {
            setExchangeRate(currentUser.exchange_rate);
            localStorage.setItem('exchangeRate', currentUser.exchange_rate.toString());
        }
    }, [currentUser]);

    const updateExchangeRate = async (newRate) => {
        try {
            // Persist to server first
            await authAPI.updateExchangeRate(newRate);
            // Then update local state
            setExchangeRate(newRate);
            localStorage.setItem('exchangeRate', newRate.toString());
            // Update currentUser to reflect the new exchange rate
            if (currentUser) {
                setCurrentUser({ ...currentUser, exchange_rate: newRate });
            }
        } catch (error) {
            console.error('Failed to update exchange rate:', error);
            throw error;
        }
    };

    // Fetch data when user logs in
    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setBudgets([]);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [txRes, budgetsRes] = await Promise.all([
                    transactionsAPI.getAll(),
                    budgetsAPI.getAll(),
                ]);
                // Transform transactions: ensure amount is number and capitalize type
                const transactionsData = (txRes.data.transactions || []).map(t => ({
                    ...t,
                    amount: isNaN(parseFloat(t.amount)) ? 0 : parseFloat(t.amount),
                    type: t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'Other'
                }));
                setTransactions(transactionsData);

                // Transform budgets: rename limit_amount to amount and capitalize period
                const budgetsData = (budgetsRes.data.budgets || []).map(b => ({
                    ...b,
                    amount: isNaN(parseFloat(b.limit_amount)) ? 0 : parseFloat(b.limit_amount),
                    period: b.period ? b.period.charAt(0).toUpperCase() + b.period.slice(1) : 'Monthly'
                }));
                setBudgets(budgetsData);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError(err.response?.data?.message || 'Failed to load data. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    const types = useMemo(() => {
        const allTypes = transactions.map(t => t.type).filter(Boolean);
        return ['All Types', ...Array.from(new Set(allTypes))];
    }, [transactions]);

    const categories = useMemo(() => {
        const allCategories = transactions.map(t => t.category).filter(Boolean);
        return ['All Categories', ...Array.from(new Set(allCategories))];
    }, [transactions]);

    const currencies = useMemo(() => {
        const allCurrencies = transactions.map(t => t.currency).filter(Boolean);
        return ['All Currencies', ...Array.from(new Set(allCurrencies))];
    }, [transactions]);

    const budgetPeriods = useMemo(() => {
        const allPeriods = budgets.map(b => b.period).filter(Boolean);
        return ['All Periods', ...Array.from(new Set(allPeriods))];
    }, [budgets]);

    const [filter, setFilter] = useState({
        type: 'All Types',
        category: 'All Categories',
        currency: 'All Currencies'
    });

    const [budgetPeriodFilter, setBudgetPeriodFilter] = useState('All Periods');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const typeMatch = filter.type === 'All Types' || transaction.type === filter.type;
            const categoryMatch = filter.category === 'All Categories' || transaction.category === filter.category;
            const currencyMatch = filter.currency === 'All Currencies' || transaction.currency === filter.currency;
            return typeMatch && categoryMatch && currencyMatch;
        });
    }, [transactions, filter]);

    const filteredBudgets = useMemo(() => {
        return budgets.filter(budget => {
            return budgetPeriodFilter === 'All Periods' || budget.period === budgetPeriodFilter;
        });
    }, [budgets, budgetPeriodFilter]);

    const addTransaction = async (transaction) => {
        try {
            // Transform to match backend expectations
            const transactionForApi = {
                ...transaction,
                type: transaction.type.toLowerCase(),
                date: transaction.date // ensure date is YYYY-MM-DD
            };
            const response = await transactionsAPI.create(transactionForApi);
            // Transform response: ensure amount is number and preserve original case for UI
            const newTransaction = {
                ...response.data.transaction,
                amount: parseFloat(response.data.transaction.amount),
                type: response.data.transaction.type.charAt(0).toUpperCase() + response.data.transaction.type.slice(1) // Capitalize for UI
            };
            setTransactions(prev => [newTransaction, ...prev]);
            return response.data;
        } catch (error) {
            console.error('Failed to create transaction:', error);
            throw error;
        }
    };

    const updateTransaction = async (id, transactionData) => {
        try {
            // Transform to match backend expectations
            const transactionForApi = {
                ...transactionData,
                type: transactionData.type.toLowerCase(),
                date: transactionData.date
            };
            const response = await transactionsAPI.update(id, transactionForApi);
            const updatedTransaction = {
                ...response.data.transaction,
                amount: parseFloat(response.data.transaction.amount),
                type: response.data.transaction.type.charAt(0).toUpperCase() + response.data.transaction.type.slice(1)
            };
            setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
            return response.data;
        } catch (error) {
            console.error('Failed to update transaction:', error);
            throw error;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await transactionsAPI.delete(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete transaction:', error);
            throw error;
        }
    };

    const addBudget = async (budget) => {
        try {
            // Transform to match backend expectations
            const budgetForApi = {
                category: budget.category,
                limit_amount: budget.amount,
                currency: budget.currency,
                period: budget.period.toLowerCase() // backend expects lowercase
            };
            const response = await budgetsAPI.create(budgetForApi);
            const newBudget = {
                ...response.data.budget,
                amount: parseFloat(response.data.budget.limit_amount),
                period: response.data.budget.period.charAt(0).toUpperCase() + response.data.budget.period.slice(1) // Capitalize for UI
            };
            setBudgets(prev => {
                const exists = prev.find(b => b.category === newBudget.category && b.period === newBudget.period && b.currency === newBudget.currency);
                if (exists) {
                    return prev.map(b => (b.category === newBudget.category && b.period === newBudget.period && b.currency === newBudget.currency) ? newBudget : b);
                }
                return [...prev, newBudget];
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create budget:', error);
            throw error;
        }
    };

    const updateBudget = async (id, budgetData) => {
        try {
            // Transform to match backend expectations
            const budgetForApi = {
                ...budgetData,
                limit_amount: budgetData.amount,
                period: budgetData.period.toLowerCase()
            };
            const response = await budgetsAPI.update(id, budgetForApi);
            const updatedBudget = {
                ...response.data.budget,
                amount: parseFloat(response.data.budget.limit_amount),
                period: response.data.budget.period.charAt(0).toUpperCase() + response.data.budget.period.slice(1)
            };
            setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
            return response.data;
        } catch (error) {
            console.error('Failed to update budget:', error);
            throw error;
        }
    };

    const deleteBudget = async (id) => {
        try {
            await budgetsAPI.delete(id);
            setBudgets(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete budget:', error);
            throw error;
        }
    };

    const getBudgetStats = useCallback((budget) => {
        const spent = transactions.reduce((total, transaction) => {
            if (transaction.type.toLowerCase() === 'expense' && transaction.category === budget.category) {
                const amount = transaction.currency === budget.currency
                    ? transaction.amount
                    : convertCurrency(transaction.amount, transaction.currency, budget.currency);
                return total + amount;
            }
            return total;
        }, 0);

        const remaining = budget.amount - spent;
        return { spent, remaining };
    }, [transactions]);

    const [reportType, setReportType] = useState('monthly');
    const [timeRange, setTimeRange] = useState('1');

    const reportTransactions = useMemo(() => {
        const now = new Date();
        const range = parseInt(timeRange);

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const diffTime = Math.abs(now - transactionDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (reportType === 'weekly') {
                return diffDays <= range * 7;
            } else {
                const monthDiff = (now.getFullYear() - transactionDate.getFullYear()) * 12 + (now.getMonth() - transactionDate.getMonth());
                return monthDiff < range && monthDiff >= 0;
            }
        });
    }, [transactions, timeRange, reportType]);

    const periodDataKHR = useMemo(() => {
        const data = reportTransactions.reduce((acc, transaction) => {
            const period = reportType === 'weekly' ? getWeek(transaction.date) : getMonth(transaction.date);
            if (!acc[period]) {
                acc[period] = { period, income: 0, expenses: 0 };
            }
            const amountInKHR = transaction.currency === 'USD'
                ? convertCurrency(transaction.amount, 'USD', 'KHR')
                : transaction.amount;

            if (transaction.type.toLowerCase() === 'income') {
                acc[period].income += amountInKHR;
            } else {
                acc[period].expenses += amountInKHR;
            }
            return acc;
        }, {});
        return Object.values(data).sort((a, b) => a.period.localeCompare(b.period));
    }, [reportTransactions, reportType]);

    const periodDataUSD = useMemo(() => {
        const data = reportTransactions.reduce((acc, transaction) => {
            const period = reportType === 'weekly' ? getWeek(transaction.date) : getMonth(transaction.date);
            if (!acc[period]) {
                acc[period] = { period, income: 0, expenses: 0 };
            }
            const amountInUSD = transaction.currency === 'KHR'
                ? convertCurrency(transaction.amount, 'KHR', 'USD')
                : transaction.amount;

            if (transaction.type.toLowerCase() === 'income') {
                acc[period].income += amountInUSD;
            } else {
                acc[period].expenses += amountInUSD;
            }
            return acc;
        }, {});
        return Object.values(data).sort((a, b) => a.period.localeCompare(b.period));
    }, [reportTransactions, reportType]);

    const savingsTrendDataKHR = useMemo(() => {
        const data = reportTransactions.reduce((acc, transaction) => {
            const period = reportType === 'weekly' ? getWeek(transaction.date) : getMonth(transaction.date);
            if (!acc[period]) {
                acc[period] = { period, savings: 0 };
            }
            const amountInKHR = transaction.currency === 'USD'
                ? convertCurrency(transaction.amount, 'USD', 'KHR')
                : transaction.amount;
            if (transaction.type.toLowerCase() === 'income') {
                acc[period].savings += amountInKHR;
            } else {
                acc[period].savings -= amountInKHR;
            }
            return acc;
        }, {});
        return Object.values(data).sort((a, b) => a.period.localeCompare(b.period));
    }, [reportTransactions, reportType]);

    const savingsTrendDataUSD = useMemo(() => {
        const data = reportTransactions.reduce((acc, transaction) => {
            const period = reportType === 'weekly' ? getWeek(transaction.date) : getMonth(transaction.date);
            if (!acc[period]) {
                acc[period] = { period, savings: 0 };
            }
            const amountInUSD = transaction.currency === 'KHR'
                ? convertCurrency(transaction.amount, 'KHR', 'USD')
                : transaction.amount;
            if (transaction.type.toLowerCase() === 'income') {
                acc[period].savings += amountInUSD;
            } else {
                acc[period].savings -= amountInUSD;
            }
            return acc;
        }, {});
        return Object.values(data).sort((a, b) => a.period.localeCompare(b.period));
    }, [reportTransactions, reportType]);

    const categoryChartDataKHR = useMemo(() => {
        const data = reportTransactions
            .filter(t => t.type.toLowerCase() === 'expense')
            .reduce((acc, transaction) => {
                const amountInKHR = transaction.currency === 'USD'
                    ? convertCurrency(transaction.amount, 'USD', 'KHR')
                    : transaction.amount;

                if (!acc[transaction.category]) {
                    acc[transaction.category] = { name: transaction.category, value: 0 };
                }
                acc[transaction.category].value += amountInKHR;
                return acc;
            }, {});
        return Object.values(data);
    }, [reportTransactions]);

    const categoryChartDataUSD = useMemo(() => {
        const data = reportTransactions
            .filter(t => t.type.toLowerCase() === 'expense')
            .reduce((acc, transaction) => {
                const amountInUSD = transaction.currency === 'KHR'
                    ? convertCurrency(transaction.amount, 'KHR', 'USD')
                    : transaction.amount;

                if (!acc[transaction.category]) {
                    acc[transaction.category] = { name: transaction.category, value: 0 };
                }
                acc[transaction.category].value += amountInUSD;
                return acc;
            }, {});
        return Object.values(data);
    }, [reportTransactions]);

    const totalExpensesKHR = useMemo(() => {
        return categoryChartDataKHR.reduce((acc, item) => acc + item.value, 0);
    }, [categoryChartDataKHR]);

    const totalExpensesUSD = useMemo(() => {
        return categoryChartDataUSD.reduce((acc, item) => acc + item.value, 0);
    }, [categoryChartDataUSD]);

    const totalIncomeKHR = useMemo(() => {
        return periodDataKHR.reduce((acc, item) => acc + item.income, 0);
    }, [periodDataKHR]);

    const totalIncomeUSD = useMemo(() => {
        return periodDataUSD.reduce((acc, item) => acc + item.income, 0);
    }, [periodDataUSD]);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [txRes, budgetsRes] = await Promise.all([
                transactionsAPI.getAll(),
                budgetsAPI.getAll(),
            ]);
            // Transform transactions: ensure amount is number and capitalize type
            const transactionsData = (txRes.data.transactions || []).map(t => ({
                ...t,
                amount: isNaN(parseFloat(t.amount)) ? 0 : parseFloat(t.amount),
                type: t.type ? t.type.charAt(0).toUpperCase() + t.type.slice(1) : 'Other'
            }));
            setTransactions(transactionsData);

            // Transform budgets: rename limit_amount to amount and capitalize period
            const budgetsData = (budgetsRes.data.budgets || []).map(b => ({
                ...b,
                amount: isNaN(parseFloat(b.limit_amount)) ? 0 : parseFloat(b.limit_amount),
                period: b.period ? b.period.charAt(0).toUpperCase() + b.period.slice(1) : 'Monthly'
            }));
            setBudgets(budgetsData);
        } catch (err) {
            console.error('Failed to refresh data:', err);
            setError(err.response?.data?.message || 'Failed to refresh data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <FinanceContext.Provider value={{
            transactions,
            budgets,
            addTransaction,
            addBudget,
            updateTransaction,
            updateBudget,
            deleteTransaction,
            deleteBudget,
            types,
            categories,
            currencies,
            filter,
            setFilter,
            filteredTransactions,
            getBudgetStats,
            budgetPeriods,
            budgetPeriodFilter,
            setBudgetPeriodFilter,
            filteredBudgets,
            reportType,
            setReportType,
            timeRange,
            setTimeRange,
            periodDataKHR,
            periodDataUSD,
            savingsTrendDataKHR,
            savingsTrendDataUSD,
            categoryChartDataKHR,
            categoryChartDataUSD,
            totalExpensesKHR,
            totalExpensesUSD,
            totalIncomeKHR,
            totalIncomeUSD,
            exchangeRate,
            updateExchangeRate,
            isLoading,
            error,
            setError,
            refreshData
        }}>
            {children}
        </FinanceContext.Provider>
    );
}