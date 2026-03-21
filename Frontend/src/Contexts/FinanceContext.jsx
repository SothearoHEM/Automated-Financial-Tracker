import { createContext,useState, useMemo } from "react";
import { convertCurrency } from '../utils/Currency';

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
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            type : 'Income',
            amount: 5000,
            currency: 'USD',
            category: 'Salary',
            date: '2026-01-01',
            description: 'June Salary'
        },
        {
            id: 2,
            type : 'Income',
            amount: 2000000,
            currency: 'KHR',
            category: 'Salary',
            date: '2026-02-01',
            description: 'July Salary'
        },
        {
            id: 3,
            type : 'Expense',
            amount: 1500,
            currency: 'USD',
            category: 'Groceries',
            date: '2026-03-01',
            description: 'August Groceries'
        },
        {
            id: 4,
            type : 'Expense',
            amount: 1800000,
            currency: 'KHR',
            category: 'Entertainment',
            date: '2026-03-05',
            description: 'Movie and Dining Out'
        }
    ]);
    const [budgets, setBudgets] = useState([
        {
            id: 1,
            category: 'Groceries',
            amount: 3000,
            currency: 'USD',
            period: 'Monthly'
        },
        {
            id: 2,
            category: 'Entertainment',
            amount: 500,
            currency: 'USD',
            period: 'Monthly'
        }
    ]);
    const [exchangeRate, setExchangeRate] = useState(() => {
        const savedRate = localStorage.getItem('exchangeRate');
        return savedRate ? parseFloat(savedRate) : 4000;
    });

    const updateExchangeRate = (newRate) => {
        setExchangeRate(newRate);
        localStorage.setItem('exchangeRate', newRate.toString());
    }



    const types = ['All Types', ...Array.from(new Set(transactions.map(transaction => transaction.type)))];
    const categories = ['All Categories', ...Array.from(new Set(transactions.map(transaction => transaction.category)))];
    const currencies = ['All Currencies', ...Array.from(new Set(transactions.map(transaction => transaction.currency)))];

    const [filter, setFilter] = useState({
        type: 'All Types',
        category: 'All Categories',
        currency: 'All Currencies'
    });

    const filteredTransactions = transactions.filter(transaction => {
        const typeMatch = filter.type === 'All Types' || transaction.type === filter.type;
        const categoryMatch = filter.category === 'All Categories' || transaction.category === filter.category;
        const currencyMatch = filter.currency === 'All Currencies' || transaction.currency === filter.currency;
        return typeMatch && categoryMatch && currencyMatch;
    });

    const addTransaction = (transaction) => {
        setTransactions([...transactions, { ...transaction, id: Date.now() }]);
    }
    const addBudget = (budget) => {
        setBudgets([...budgets, { ...budget, id: Date.now() }]);
    }
    const updateTransaction = (updatedTransaction) => {
        setTransactions(transactions.map(transaction => transaction.id === updatedTransaction.id ? updatedTransaction : transaction));
    }
    const updateBudget = (updatedBudget) => {
        setBudgets(budgets.map(budget => budget.id === updatedBudget.id ? updatedBudget : budget));
    }
    const deleteTransaction = (id) => {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
    const deleteBudget = (id) => {
        setBudgets(budgets.filter(budget => budget.id !== id));
    }

    const getBudgetStats = (budget) => {
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
    }

    const [reportType, setReportType] = useState('monthly');
    const [timeRange, setTimeRange] = useState('1');

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
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
                // Approximate month as 30 days for simplicity or use date logic
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
            }
            else {
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

    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading
        }}>
            {children}
        </FinanceContext.Provider>
    );
}