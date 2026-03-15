import { createContext,useState } from "react";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            type : 'Income',
            amount: 5000,
            currency: 'USD',
            category: 'Salary',
            date: '2024-06-01',
            description: 'June Salary'
        },
        {
            id: 2,
            type : 'Income',
            amount: 2000000,
            currency: 'KHR',
            category: 'Salary',
            date: '2024-07-01',
            description: 'July Salary'
        },
        {
            id: 3,
            type : 'Expense',
            amount: 1500,
            currency: 'USD',
            category: 'Groceries',
            date: '2024-08-01',
            description: 'August Groceries'
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
            if (transaction.type === 'Expense' && transaction.category === budget.category && transaction.currency === budget.currency) {
                return total + transaction.amount;
            }
            return total;
        }, 0);

        const remaining = budget.amount - spent;
        return { spent, remaining };
    }

    return (
        <FinanceContext.Provider value={{ transactions, budgets, addTransaction, addBudget, updateTransaction, updateBudget, deleteTransaction, deleteBudget, types, categories, currencies, filter, setFilter, filteredTransactions, getBudgetStats }}>
            {children}
        </FinanceContext.Provider>
    );
}