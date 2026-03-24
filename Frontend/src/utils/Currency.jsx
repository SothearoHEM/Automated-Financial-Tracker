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

/**
 * Get current date in Cambodia timezone (UTC+7)
 * Returns date in YYYY-MM-DD format
 */
export const getCambodiaToday = () => {
    const now = new Date();

    // Use Intl.DateTimeFormat to get date in Cambodia timezone (Asia/Phnom_Penh = UTC+7)
    const options = {
        timeZone: 'Asia/Phnom_Penh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);

    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;

    return `${year}-${month}-${day}`;
}