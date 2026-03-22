const defaultExchangeRate = 4000; // 1 USD = 4000 KHR

const getExchangeRate = () => {
    const savedRate = localStorage.getItem('exchangeRate');
    if (!savedRate) return defaultExchangeRate;
    const parsed = parseFloat(savedRate);
    return isNaN(parsed) || parsed <= 0 ? defaultExchangeRate : parsed;
}

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const rate = getExchangeRate();
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return 0;
    if (fromCurrency === 'USD' && toCurrency === 'KHR') {
        return numAmount * rate;
    }
    if (fromCurrency === 'KHR' && toCurrency === 'USD') {
        return numAmount / rate;
    }
    return numAmount;
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