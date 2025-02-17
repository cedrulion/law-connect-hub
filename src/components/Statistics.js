// Statistics.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Statistics = () => {
  const [cases, setCases] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch cases data from the backend instead of appointments.
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cases", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = response.data.data;
      setCases(data);
      processStatusData(data);
      processWeeklyData(data);
    } catch (error) {
      console.error("Error fetching cases data", error);
    }
  };

  // Process the status distribution for the PieChart.
  const processStatusData = (data) => {
    const statusCount = data.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    const formattedData = Object.keys(statusCount).map((key) => ({
      name: key,
      value: statusCount[key],
    }));
    setStatusData(formattedData);
  };

  // Process the weekly submissions based on the createdAt field.
  const processWeeklyData = (data) => {
    const weekCount = {};
    const startOfWeek = (dateStr) => {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().split("T")[0];
    };
    data.forEach((item) => {
      const week = startOfWeek(item.createdAt);
      weekCount[week] = (weekCount[week] || 0) + 1;
    });
    const formattedData = Object.keys(weekCount).map((week) => ({
      week,
      count: weekCount[week],
    }));
    setWeeklyData(formattedData);
  };

  // Download PDF functionality.
  const downloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const date = new Date().toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Case Statistics", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 10, 25);

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 10, 30, 180, 0);
      doc.save("Case-Statistics.pdf");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Case Statistics</h2>
          <button
            onClick={downloadPDF}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
        </div>

        <div ref={chartRef}>
          {/* Pie Chart for Case Status Distribution */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              Case Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for Weekly Case Submissions */}
          <div>
            <h3 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              Weekly Case Submissions
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
