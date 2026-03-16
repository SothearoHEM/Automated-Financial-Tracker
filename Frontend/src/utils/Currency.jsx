const defaultExchangeRate = 4000; // 1 USD = 4000 KHR

const getExchangeRate = () => {
    const savedRate = localStorage.getItem('exchangeRate');
    return savedRate ? parseFloat(savedRate) : defaultExchangeRate;
}

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const rate = getExchangeRate();
    if (fromCurrency === 'USD' && toCurrency === 'KHR') {
        return amount * rate;
    }
    if (fromCurrency === 'KHR' && toCurrency === 'USD') {
        return amount / rate;
    }
    return amount;
}

export const getCurrencySymbol = (currency) => {
    if (currency === 'USD') {
        return '$';
    } else if (currency === 'KHR') {
        return '៛';
    }
    return '';
}

export const formatCurrency = (amount, currency) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${amount.toLocaleString()}`;
}

export const calculateTotal = (transactions, type, toCurrency = 'KHR') => {
    return transactions
        .filter(transaction => transaction.type.toLowerCase() === type.toLowerCase())
        .reduce((total, transaction) => {
            const amount = transaction.currency === toCurrency 
            ? transaction.amount 
            : convertCurrency(transaction.amount, transaction.currency, toCurrency);
            return total + amount;
        }, 0);
}