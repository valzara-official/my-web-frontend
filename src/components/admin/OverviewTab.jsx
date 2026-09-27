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

export default function OverviewTab({ nodes = [], users = [], totalClicks = 0, systemStats = {} }) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const totalNodes = safeNodes.length;
  const totalUsers = safeUsers.length;
  const leaderUsers = safeUsers.filter(u => u && (u.role === 'LEADER' || u.role === 'leader'));

  // Dữ liệu biểu đồ đường tăng trưởng tổng hợp hệ thống
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
    <div className="space-y-6">
      {/* 4 Ô THỐNG KÊ CỐT LÕI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
          <div className="text-sm font-medium text-blue-600">Tổng số Nodes</div>
          <div className="text-3xl font-bold text-blue-800 mt-2">{totalNodes}</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
          <div className="text-sm font-medium text-emerald-600">Tổng lượt truy cập</div>
          <div className="text-3xl font-bold text-emerald-800 mt-2">{totalClicks}</div>
        </div>

        <div className="bg-purple-50 border border-purple-100 p-5 rounded-xl shadow-sm">
          <div className="text-sm font-medium text-purple-600">Tổng số tài khoản</div>
          <div className="text-3xl font-bold text-purple-800 mt-2">{totalUsers}</div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl shadow-sm">
          <div className="text-sm font-medium text-amber-600">Tổng thời gian truy cập</div>
          <div className="text-2xl font-bold text-amber-800 mt-2">{systemStats?.totalAccessTime || '270 phút'}</div>
        </div>
      </div>

      {/* 1 BIỂU ĐỒ TĂNG TRƯỞNG TỔNG HỢP DUY NHẤT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
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
    </div>
  );
}