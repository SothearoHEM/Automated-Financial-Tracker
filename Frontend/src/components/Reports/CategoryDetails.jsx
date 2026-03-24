import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

function CategoryDetails({ currency }) {
    const { categoryChartDataKHR, totalExpensesKHR, categoryChartDataUSD, totalExpensesUSD } = useContext(FinanceContext);
    const data = currency === 'USD' ? categoryChartDataUSD : categoryChartDataKHR;
    const totalExpenses = currency === 'USD' ? totalExpensesUSD : totalExpensesKHR;

    // Memoize sorted data (by amount descending)
    const sortedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return [...data].sort((a, b) => b.value - a.value);
    }, [data]);

    if (!sortedData || sortedData.length === 0) {
        return null; // Return null if no data to show
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">
                    Category Details ({currency})
                </h3>
                {totalExpenses > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                        Total: {formatCurrency(totalExpenses, currency)}
                    </span>
                )}
            </div>
            <div className="space-y-4 overflow-y-auto max-h-75 pr-2 custom-scrollbar">
                {sortedData.map((item, index) => {
                    const percentage = totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0;
                    const color = COLORS[index % COLORS.length];

                    return (
                        <div key={item.name} className="w-full group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm font-medium text-gray-700 truncate" title={item.name}>
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 ml-2 flex-shrink-0">
                                    {formatCurrency(item.value, currency)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                        backgroundColor: color,
                                    }}
                                />
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-xs text-gray-500 font-medium">{percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryDetails;
