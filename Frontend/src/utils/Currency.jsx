
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const exchangeRate = 4000;
    if (fromCurrency === 'USD' && toCurrency === 'KHR') {
        return amount * exchangeRate;
    }
    if (fromCurrency === 'KHR' && toCurrency === 'USD') {
        return amount / exchangeRate;
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