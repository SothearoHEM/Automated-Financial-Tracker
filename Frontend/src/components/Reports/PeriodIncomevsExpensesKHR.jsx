import React, { useContext } from 'react';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/Currency';

function PeriodIncomevsExpensesKHR({ reportType }) {
    const { periodDataKHR } = useContext(FinanceContext);
    const title = reportType === 'weekly' ? 'Weekly Income vs Expenses (KHR)' : 'Monthly Income vs Expenses (KHR)';
    
    const tooltipFormatter = (value) => formatCurrency(value, 'KHR');
    
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">
                {title}
            </h3>
            <div className="w-full h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={periodDataKHR} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip
                            formatter={tooltipFormatter}
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ 
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar 
                            dataKey="income" 
                            fill="#10B981" 
                            name="Income" 
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                        <Bar 
                            dataKey="expenses" 
                            fill="#EF4444" 
                            name="Expenses" 
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default PeriodIncomevsExpensesKHR;