import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { jsPDF } from "jspdf";
import { CSVLink } from "react-csv";

// Register necessary components of Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Reports: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch reports data from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/reports'); // Change to your backend reports endpoint
        setMonthlyData(response.data.monthly);
        setYearlyData(response.data.yearly);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports data:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Chart.js data for Monthly Expenses (Bar Chart)
  const monthlyChartData = {
    labels: monthlyData?.map((item: any) => item.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData?.map((item: any) => item.total),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart.js data for Yearly Expenses (Pie Chart)
  const yearlyChartData = {
    labels: yearlyData?.map((item: any) => item.category),
    datasets: [
      {
        label: 'Yearly Expenses by Category',
        data: yearlyData?.map((item: any) => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Expense Report', 20, 20);
    doc.text(`Monthly Data: ${JSON.stringify(monthlyData)}`, 20, 30);
    doc.text(`Yearly Data: ${JSON.stringify(yearlyData)}`, 20, 40);
    doc.save('expense-report.pdf');
  };

  // Button to download CSV
  const downloadCSVData = () => {
    const csvData = [
      ['Category', 'Total Expenses'],
      ...yearlyData.map((item: any) => [item.category, item.total]),
    ];
    return csvData;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Expense Reports</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
            <Bar data={monthlyChartData} />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Yearly Expenses by Category</h2>
            <Pie data={yearlyChartData} />
          </div>

          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={generatePDF}
            >
              Download PDF
            </button>
            <CSVLink
              data={downloadCSVData()}
              filename={"expense-report.csv"}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

