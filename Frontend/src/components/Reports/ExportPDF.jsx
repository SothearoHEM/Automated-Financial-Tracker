import React, { useContext, useMemo } from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { FinanceContext } from '../../Contexts/FinanceContext';
import { formatCurrency } from '../../utils/Currency';

const ExportPDF = () => {
    const { 
        reportType, 
        timeRange, 
        totalIncomeKHR, 
        totalExpensesKHR, 
        totalIncomeUSD, 
        totalExpensesUSD,
        periodDataKHR,
        periodDataUSD
    } = useContext(FinanceContext);

    const formatCurrencyForPDF = (amount, currency) => {
        if (currency === 'KHR') {
            return `${new Intl.NumberFormat('en-US').format(amount)} KHR`;
        }
        return formatCurrency(amount, currency);
    };

    const exportPDF = () => {
        if (!periodDataKHR?.length && !periodDataUSD?.length) {
            alert("No data available to export.");
            return;
        }
        
        // Proceed with doc creation...
        try {
            const doc = new jsPDF();
            
            // Calculate savings rates (avoid division by zero)
            const savingsRateKHR = totalIncomeKHR > 0 ? ((totalIncomeKHR - totalExpensesKHR) / totalIncomeKHR) * 100 : 0;
            const savingsRateUSD = totalIncomeUSD > 0 ? ((totalIncomeUSD - totalExpensesUSD) / totalIncomeUSD) * 100 : 0;
            
            // Title
            doc.setFontSize(20);
            doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Financial Report`, 14, 20);
            
            // Date range
            doc.setFontSize(10);
            doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, 14, 28);
            doc.text(`Report Type: ${reportType === 'weekly' ? 'Weekly' : 'Monthly'}`, 14, 34);
            doc.text(`Period: Last ${timeRange} ${reportType === 'weekly' ? 'Weeks' : 'Months'}`, 14, 40);
            
            // Summary section - KHR
            doc.setFontSize(14);
            doc.text('Summary (KHR)', 14, 51);
            
            doc.setFontSize(10);
            doc.text(`Total Income: ${formatCurrencyForPDF(totalIncomeKHR, 'KHR')}`, 14, 59);
            doc.text(`Total Expenses: ${formatCurrencyForPDF(totalExpensesKHR, 'KHR')}`, 14, 65);
            doc.text(`Net Savings: ${formatCurrencyForPDF(totalIncomeKHR - totalExpensesKHR, 'KHR')}`, 14, 71);
            doc.text(`Savings Rate: ${savingsRateKHR.toFixed(1)}%`, 14, 77);
            
            // Summary section - USD
            doc.setFontSize(14);
            doc.text('Summary (USD)', 14, 88);
            
            doc.setFontSize(10);
            doc.text(`Total Income: ${formatCurrencyForPDF(totalIncomeUSD, 'USD')}`, 14, 96);
            doc.text(`Total Expenses: ${formatCurrencyForPDF(totalExpensesUSD, 'USD')}`, 14, 102);
            doc.text(`Net Savings: ${formatCurrencyForPDF(totalIncomeUSD - totalExpensesUSD, 'USD')}`, 14, 108);
            doc.text(`Savings Rate: ${savingsRateUSD.toFixed(1)}%`, 14, 114);
            
            // Period breakdown table (KHR)
            doc.setFontSize(14);
            doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Breakdown (KHR)`, 14, 125);
            
            autoTable(doc, {
                startY: 130,
                head: [[reportType === 'weekly' ? 'Week' : 'Month', 'Income', 'Expenses', 'Savings']],
                body: periodDataKHR.map((m) => [
                    m.period,
                    formatCurrencyForPDF(m.income, 'KHR'),
                    formatCurrencyForPDF(m.expenses, 'KHR'),
                    formatCurrencyForPDF(m.income - m.expenses, 'KHR'),
                ]),
            });

            // Period breakdown table (USD)
            const finalY = (doc).lastAutoTable.finalY + 15;
            doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Breakdown (USD)`, 14, finalY);

            autoTable(doc, {
                startY: finalY + 5,
                head: [[reportType === 'weekly' ? 'Week' : 'Month', 'Income', 'Expenses', 'Savings']],
                body: periodDataUSD.map((m) => [
                    m.period,
                    formatCurrencyForPDF(m.income, 'USD'),
                    formatCurrencyForPDF(m.expenses, 'USD'),
                    formatCurrencyForPDF(m.income - m.expenses, 'USD'),
                ]),
            });
            
            // Save the PDF
            doc.save(`${reportType}-financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to create PDF. Please try again.");
        }
    };

    return (
        <button 
            onClick={exportPDF} 
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex gap-2 items-center md:w-auto w-full justify-center'
        >
            <span><FaRegFilePdf /></span>
            Export PDF
        </button>
    );
};

export default ExportPDF;
