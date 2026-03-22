import React from 'react'
import { useState } from 'react';

function ExchangeRatesModal({ isOpen, onClose, exchangeRate, updateExchangeRate }) {
  const [newRate, setNewRate] = useState(() => {
    // Ensure initial value is a number
    const rate = Number(exchangeRate);
    return isNaN(rate) ? 4000 : rate;
  });

  const handleSave = () => {
    updateExchangeRate(newRate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 md:px-0 px-4'>
        <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Exchange Rates</h2>
            <p className='text-gray-500 mb-4 text-sm'>Set the exchange rate between USD and Cambodian Riel (KHR). This will affect all currency conversions in the app.</p>
            <form action="">
                <label htmlFor="exchangeRate" className='block text-gray-800 mb-2'>Exchange Rate (USD to KHR)</label>
                <input
                    type="number"
                    id="exchangeRate"
                    placeholder="Enter exchange rate"
                    className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                    step="0.01"
                    value={newRate}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setNewRate(0);
                      } else {
                        const parsed = parseFloat(value);
                        setNewRate(isNaN(parsed) ? 0 : parsed);
                      }
                    }}
                />
            </form>
            <p className='text-gray-500 text-sm mt-4'>Current: 1 USD = ៛{typeof newRate === 'number' && !isNaN(newRate) ? newRate.toFixed(2) : '0.00'} KHR</p>
            <div className='mt-6 flex justify-start gap-2 items-center'>
                <p>Quick actions:</p>
                <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300' onClick={() => setNewRate(4000)}>
                    Restore to Default
                </button>
            </div>
            <div className='mt-6 flex justify-end gap-2'>
                <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300' onClick={onClose}>
                    Cancel
                </button>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600' onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    </div>
  )
}

export default ExchangeRatesModal