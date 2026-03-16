import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

function SavingsTrendUSD({ reportType }) {
  const { savingsTrendDataUSD } = useContext(FinanceContext);
  const title = reportType === 'weekly' ? 'Weekly Savings Trend (USD)' : 'Monthly Savings Trend (USD)';

  const tooltipFormatter = (value) => formatCurrency(value, 'USD');

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 w-full shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-6 text-lg">
        {title}
      </h3>
      <div className="w-full h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={savingsTrendDataUSD} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              cursor={{ stroke: '#10B981', strokeWidth: 2 }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
              name="Savings"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SavingsTrendUSD;