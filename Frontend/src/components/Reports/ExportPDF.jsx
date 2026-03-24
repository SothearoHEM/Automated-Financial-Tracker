import React, { useContext, useMemo } from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { format, subMonths, subWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
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
        categoryChartDataUSD,
        currentUser
    } = useContext(FinanceContext);

    // Calculate date range for the report
    const dateRange = useMemo(() => {
        const now = new Date();
        let startDate, endDate;

        if (reportType === 'weekly') {
            endDate = now;
            startDate = subWeeks(now, parseInt(timeRange));
        } else {
            endDate = now;
            startDate = subMonths(now, parseInt(timeRange));
        }

        return {
            start: format(startDate, 'MMMM d, yyyy'),
            end: format(endDate, 'MMMM d, yyyy')
        };
    }, [reportType, timeRange]);

    const formatCurrencyForPDF = (amount, currency) => {
        if (currency === 'KHR') {
            return `${new Intl.NumberFormat('en-US').format(amount.toFixed(2))} KHR`;
        }
        return formatCurrency(amount, currency);
    };

    const exportPDF = () => {
        if ((!periodDataKHR?.length || periodDataKHR.length === 0) && (!periodDataUSD?.length || periodDataUSD.length === 0)) {
            alert("No data available to export. Please add some transactions first.");
            return;
        }

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const margin = 14;
            let yPos = 20;
            const lineHeight = 7;

            // Helper function to add a new page and reset Y position
            const addPageIfNeeded = (requiredSpace = 40) => {
                if (yPos > doc.internal.pageSize.height - requiredSpace) {
                    doc.addPage();
                    yPos = 20;
                    return true;
                }
                return false;
            };

            // Header with styled title
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('Financial Report', pageWidth / 2, yPos, { align: 'center' });
            yPos += lineHeight + 2;

            // Subtitle with report type and date range
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Report`, pageWidth / 2, yPos, { align: 'center' });
            yPos += lineHeight;
            doc.text(`${dateRange.start} - ${dateRange.end}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += lineHeight + 3;

            // User info if available
            if (currentUser?.name || currentUser?.email) {
                doc.setFontSize(9);
                doc.text(`User: ${currentUser?.name || ''} ${currentUser?.email ? `(${currentUser.email})` : ''}`, margin, yPos);
                yPos += lineHeight;
                doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, margin, yPos);
                yPos += lineHeight + 4;
            }

            // Calculate totals and metrics
            const netIncomeKHR = totalIncomeKHR - totalExpensesKHR;
            const netIncomeUSD = totalIncomeUSD - totalExpensesUSD;
            const savingsRateKHR = totalIncomeKHR > 0 ? ((netIncomeKHR / totalIncomeKHR) * 100) : 0;
            const savingsRateUSD = totalIncomeUSD > 0 ? ((netIncomeUSD / totalIncomeUSD) * 100) : 0;

            // Summary Section Header
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Summary', margin, yPos);
            yPos += lineHeight + 2;

            // Draw summary box
            const boxY = yPos;
            const boxHeight = 35;
            const boxWidth = pageWidth - 2 * margin;
            doc.setDrawColor(230, 230, 230);
            doc.setFillColor(248, 248, 248);
            doc.rect(margin, boxY, boxWidth, boxHeight, 'FD');

            // Summary content in two columns
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const col1X = margin + 5;
            const col2X = margin + boxWidth / 2 + 5;

            // Column 1 - KHR
            doc.setFont('helvetica', 'bold');
            doc.text('KIRIBATI FRANC (KHR)', col1X, boxY + 6);
            doc.setFont('helvetica', 'normal');
            doc.text(`Income: ${formatCurrencyForPDF(totalIncomeKHR, 'KHR')}`, col1X, boxY + 13);
            doc.text(`Expenses: ${formatCurrencyForPDF(totalExpensesKHR, 'KHR')}`, col1X, boxY + 20);
            doc.text(`Net: ${formatCurrencyForPDF(netIncomeKHR, 'KHR')}`, col1X, boxY + 27);
            doc.text(`Savings Rate: ${savingsRateKHR.toFixed(1)}%`, col1X, boxY + 34);

            // Column 2 - USD
            doc.setFont('helvetica', 'bold');
            doc.text('US DOLLAR (USD)', col2X, boxY + 6);
            doc.setFont('helvetica', 'normal');
            doc.text(`Income: ${formatCurrencyForPDF(totalIncomeUSD, 'USD')}`, col2X, boxY + 13);
            doc.text(`Expenses: ${formatCurrencyForPDF(totalExpensesUSD, 'USD')}`, col2X, boxY + 20);
            doc.text(`Net: ${formatCurrencyForPDF(netIncomeUSD, 'USD')}`, col2X, boxY + 27);
            doc.text(`Savings Rate: ${savingsRateUSD.toFixed(1)}%`, col2X, boxY + 34);

            yPos = boxY + boxHeight + 10;

            // Period Breakdown Section
            addPageIfNeeded(60);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Breakdown`, margin, yPos);
            yPos += lineHeight + 3;

            if (periodDataKHR?.length > 0) {
                const periodTableData = periodDataKHR.map((period, index) => {
                    const usdPeriod = periodDataUSD[index] || { income: 0, expenses: 0 };
                    return [
                        period.period,
                        formatCurrencyForPDF(period.income, 'KHR'),
                        formatCurrencyForPDF(period.expenses, 'KHR'),
                        formatCurrencyForPDF(period.income - period.expenses, 'KHR'),
                        formatCurrencyForPDF(usdPeriod.income, 'USD'),
                        formatCurrencyForPDF(usdPeriod.expenses, 'USD'),
                        formatCurrencyForPDF(usdPeriod.income - usdPeriod.expenses, 'USD')
                    ];
                });

                autoTable(doc, {
                    startY: yPos,
                    head: [[
                        { content: 'Period', styles: { fillColor: [66, 139, 202], textColor: 255 } },
                        { content: 'Income (KHR)', styles: { fillColor: [66, 139, 202], textColor: 255 } },
                        { content: 'Expenses (KHR)', styles: { fillColor: [66, 139, 202], textColor: 255 } },
                        { content: 'Savings (KHR)', styles: { fillColor: [66, 139, 202], textColor: 255 } },
                        { content: 'Income (USD)', styles: { fillColor: [66, 139, 202], textColor: 255 } },
                        { content: 'Expenses (USD)', styles: { fillColor: [66, 139, 202], textColor: 255 } },
                        { content: 'Savings (USD)', styles: { fillColor: [66, 139, 202], textColor: 255 } }
                    ]],
                    body: periodTableData,
                    theme: 'grid',
                    headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    margin: { left: margin, right: margin },
                    styles: { fontSize: 9, cellPadding: 3 }
                });

                yPos = (doc.lastAutoTable.finalY) + 15;
            }

            // Category Breakdown Section
            addPageIfNeeded(60);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Spending by Category', margin, yPos);
            yPos += lineHeight + 3;

            if (categoryChartDataKHR?.length > 0 || categoryChartDataUSD?.length > 0) {
                const categories = Array.from(new Set([
                    ...(categoryChartDataKHR || []).map(c => c.name),
                    ...(categoryChartDataUSD || []).map(c => c.name)
                ]));

                const categoryTableData = categories.map((category) => {
                    const khrItem = categoryChartDataKHR?.find(c => c.name === category);
                    const usdItem = categoryChartDataUSD?.find(c => c.name === category);

                    const khrAmt = khrItem ? khrItem.value : 0;
                    const usdAmt = usdItem ? usdItem.value : 0;

                    const khrPct = totalExpensesKHR > 0 ? ((khrAmt / totalExpensesKHR) * 100) : 0;
                    const usdPct = totalExpensesUSD > 0 ? ((usdAmt / totalExpensesUSD) * 100) : 0;

                    return [
                        category,
                        formatCurrencyForPDF(khrAmt, 'KHR'),
                        `${khrPct.toFixed(1)}%`,
                        formatCurrencyForPDF(usdAmt, 'USD'),
                        `${usdPct.toFixed(1)}%`
                    ];
                });

                autoTable(doc, {
                    startY: yPos,
                    head: [[
                        { content: 'Category', styles: { fillColor: [128, 0, 128], textColor: 255 } },
                        { content: 'Amount (KHR)', styles: { fillColor: [128, 0, 128], textColor: 255 } },
                        { content: '% of Total', styles: { fillColor: [128, 0, 128], textColor: 255 } },
                        { content: 'Amount (USD)', styles: { fillColor: [128, 0, 128], textColor: 255 } },
                        { content: '% of Total', styles: { fillColor: [128, 0, 128], textColor: 255 } }
                    ]],
                    body: categoryTableData,
                    theme: 'grid',
                    headStyles: { fillColor: [128, 0, 128], textColor: 255, fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                    margin: { left: margin, right: margin },
                    styles: { fontSize: 9, cellPadding: 3 }
                });

                yPos = (doc.lastAutoTable.finalY) + 15;
            }

            // Footer (only on first page)
            doc.setFontSize(8);
            doc.setTextColor(100);
            const footerText = `Automated Financial Tracker - Page ${doc.internal.getCurrentPageInfo().pageNumber}`;
            doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

            // Save the PDF with better filename
            const filename = `financial-report-${reportType}-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
            doc.save(filename);

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to create PDF. Please try again or check browser compatibility.");
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
