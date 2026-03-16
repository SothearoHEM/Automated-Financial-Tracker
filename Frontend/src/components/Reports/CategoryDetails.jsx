import React, { useContext } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

function CategoryDetails({ currency }) {
    const { categoryChartDataKHR, totalExpensesKHR, categoryChartDataUSD, totalExpensesUSD } = useContext(FinanceContext);
    const data = currency === 'USD' ? categoryChartDataUSD : categoryChartDataKHR;
    const totalExpenses = currency === 'USD' ? totalExpensesUSD : totalExpensesKHR;

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm h-full">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Category Details ({currency})</h3>
            <div className="space-y-4 overflow-y-auto max-h-75 pr-2 custom-scrollbar">
                {data.map((item, index) => {
                    const percentage = totalExpenses ? (item.value / totalExpenses) * 100 : 0;
                    return (
                        <div key={item.name} className="w-full">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(item.value, currency)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: COLORS[index % COLORS.length],
                                    }}
                                />
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryDetails;