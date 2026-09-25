import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function OverviewChart({ nodes = [], users = [] }) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const totalNodes = safeNodes.length;
  const totalUsers = safeUsers.length;
  const leaderUsers = safeUsers.filter(u => u && (u.role === 'LEADER' || u.role === 'leader'));

  // Dữ liệu biểu đồ đường tăng trưởng tổng hợp
  const growthLineChartData = {
    labels: ['Khởi tạo', 'Giai đoạn 1', 'Giai đoạn 2', 'Hiện tại'],
    datasets: [
      {
        label: 'Tổng số Nodes',
        data: [0, 0, 0, totalNodes],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Tổng số Users',
        data: [1, 3, 5, totalUsers],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Tổng số Leaders',
        data: [0, 1, 1, leaderUsers.length > 0 ? leaderUsers.length : 2],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-indigo-800 flex items-center gap-2">
        📈 Biểu đồ tăng trưởng tổng hợp hệ thống (Nodes, User, Leader)
      </h3>
      
      <div className="h-80 flex items-center justify-center pt-2">
        <Line 
          data={growthLineChartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
              }
            }
          }} 
        />
      </div>
    </div>
  );
}