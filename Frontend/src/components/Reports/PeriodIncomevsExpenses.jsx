import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

function PeriodIncomevsExpenses({ reportType, currency }) {
    const { periodDataKHR, periodDataUSD } = useContext(FinanceContext);

    // Memoize processed data for better performance
    const data = useMemo(() => {
        const sourceData = currency === 'USD' ? periodDataUSD : periodDataKHR;
        return sourceData.map(item => ({
            ...item,
            formattedIncome: formatCurrency(item.income, currency),
            formattedExpenses: formatCurrency(item.expenses, currency)
        }));
    }, [periodDataKHR, periodDataUSD, currency]);

    const title = reportType === 'weekly' ? `Weekly Income vs Expenses (${currency})` : `Monthly Income vs Expenses (${currency})`;

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm flex flex-col items-center justify-center h-75">
                <p className="text-gray-500 text-center">
                    No {reportType === 'weekly' ? 'weekly' : 'monthly'} income vs expenses data available.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    Add transactions within the selected time range to see this chart.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">
                {title}
            </h3>
            <div className="w-full h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                            formatter={(value, name) => {
                                if (name === 'income') return formatCurrency(value, currency);
                                if (name === 'expenses') return formatCurrency(value, currency);
                                return [value, name];
                            }}
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

export default PeriodIncomevsExpenses;
