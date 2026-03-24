import React, { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

function SpendingbyCategory({ currency }) {
    const { categoryChartDataKHR, categoryChartDataUSD } = useContext(FinanceContext);
    const data = currency === 'USD' ? categoryChartDataUSD : categoryChartDataKHR;

    // Memoize processed data
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map((item, index) => ({
            ...item,
            color: COLORS[index % COLORS.length]
        }));
    }, [data]);

    if (!processedData || processedData.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm flex flex-col items-center justify-center h-75">
                <p className="text-gray-500 text-center">
                    No spending by category data available.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    Add expense transactions to see your category breakdown.
                </p>
            </div>
        );
    }

    const total = processedData.reduce((sum, item) => sum + item.value, 0);

    const renderCustomLabel = ({ name, percent }) => {
        if (percent < 0.05) return null; // Hide labels for small slices
        return `${name} ${(percent * 100).toFixed(0)}%`;
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">
                Spending by Category ({currency})
            </h3>
            <div className="w-full h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={processedData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => formatCurrency(value, currency)}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SpendingbyCategory;
