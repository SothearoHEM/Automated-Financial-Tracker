import React, { useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

function SpendingbyCategory({ currency }) {
    const { categoryChartDataKHR, categoryChartDataUSD } = useContext(FinanceContext);
    const data = currency === 'USD' ? categoryChartDataUSD : categoryChartDataKHR;

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm flex items-center justify-center h-75">
                <p className="text-gray-500">No spending data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Spending by Category ({currency})</h3>
            <div className="w-full h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SpendingbyCategory;