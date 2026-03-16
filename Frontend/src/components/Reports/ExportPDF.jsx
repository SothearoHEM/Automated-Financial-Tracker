import React, { useContext } from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import  {jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
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
        periodDataUSD,
        categoryChartDataKHR,
        categoryChartDataUSD
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
            
            // Summary section
            doc.setFontSize(14);
            doc.text('Summary', 14, 51);
            
            doc.setFontSize(10);
            doc.text(`Total Income: ${formatCurrencyForPDF(totalIncomeKHR, 'KHR')} / ${formatCurrencyForPDF(totalIncomeUSD, 'USD')}`, 14, 59);
            doc.text(`Total Expenses: ${formatCurrencyForPDF(totalExpensesKHR, 'KHR')} / ${formatCurrencyForPDF(totalExpensesUSD, 'USD')}`, 14, 65);
            doc.text(`Net Savings: ${formatCurrencyForPDF(totalIncomeKHR - totalExpensesKHR, 'KHR')} / ${formatCurrencyForPDF(totalIncomeUSD - totalExpensesUSD, 'USD')}`, 14, 71);
            doc.text(`Savings Rate: ${savingsRateKHR.toFixed(1)}% (KHR) / ${savingsRateUSD.toFixed(1)}% (USD)`, 14, 77);
            
            // Period breakdown table
            doc.setFontSize(14);
            doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Breakdown`, 14, 88);
            
            autoTable(doc, {
                startY: 93,
                head: [[reportType === 'weekly' ? 'Week' : 'Month', 'Income (KHR / USD)', 'Expenses (KHR / USD)', 'Savings (KHR / USD)']],
                body: periodDataKHR.map((m, index) => {
                    const usdData = periodDataUSD[index] || { income: 0, expenses: 0 };
                    return [
                        m.period,
                        `${formatCurrencyForPDF(m.income, 'KHR')}\n${formatCurrencyForPDF(usdData.income, 'USD')}`,
                        `${formatCurrencyForPDF(m.expenses, 'KHR')}\n${formatCurrencyForPDF(usdData.expenses, 'USD')}`,
                        `${formatCurrencyForPDF(m.income - m.expenses, 'KHR')}\n${formatCurrencyForPDF(usdData.income - usdData.expenses, 'USD')}`,
                    ];
                }),
            });

            // Category breakdown table
            if ((categoryChartDataKHR && categoryChartDataKHR.length > 0) || (categoryChartDataUSD && categoryChartDataUSD.length > 0)) {
                // Combine categories from both currencies
                const categories = Array.from(new Set([
                    ...(categoryChartDataKHR || []).map(c => c.name),
                    ...(categoryChartDataUSD || []).map(c => c.name)
                ]));

                const finalY2 = (doc).lastAutoTable.finalY + 15;
                doc.text(`Spending by Category`, 14, finalY2);

                autoTable(doc, {
                    startY: finalY2 + 5,
                    head: [['Category', 'Amount (KHR / USD)', '% of Total Expenses (KHR / USD)']],
                    body: categories.map((name) => {
                        const khrItem = categoryChartDataKHR?.find(c => c.name === name);
                        const usdItem = categoryChartDataUSD?.find(c => c.name === name);
                        
                        const khrAmt = khrItem ? khrItem.value : 0;
                        const usdAmt = usdItem ? usdItem.value : 0;
                        
                        const khrPct = totalExpensesKHR ? ((khrAmt / totalExpensesKHR) * 100).toFixed(1) + '%' : '0%';
                        const usdPct = totalExpensesUSD ? ((usdAmt / totalExpensesUSD) * 100).toFixed(1) + '%' : '0%';

                        return [
                            name,
                            `${formatCurrencyForPDF(khrAmt, 'KHR')}\n${formatCurrencyForPDF(usdAmt, 'USD')}`,
                            `${khrPct}\n${usdPct}`
                        ];
                    }),
                });
            }
            
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
