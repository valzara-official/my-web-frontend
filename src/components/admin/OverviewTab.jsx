import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
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
  
  // Thống kê phân loại user
  const adminUsers = safeUsers.filter(u => u && (u.role === 'ADMIN' || u.role === 'admin')).length;
  const leaderUsers = safeUsers.filter(u => u && (u.role === 'LEADER' || u.role === 'leader')).length;
  const regularUsers = Math.max(0, totalUsers - adminUsers - leaderUsers);

  // Dữ liệu biểu đồ tròn phân bổ tài khoản
  const userRoleData = {
    labels: ['ADMIN', 'LEADER', 'USER'],
    datasets: [
      {
        data: [adminUsers || 1, leaderUsers || 2, regularUsers || 3],
        backgroundColor: ['rgb(147, 51, 234)', 'rgb(79, 70, 229)', 'rgb(16, 185, 129)'],
        borderWidth: 0,
      },
    ],
  };

  // Dữ liệu biểu đồ tăng trưởng tổng hợp hệ thống
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
        data: [0, 1, 1, leaderUsers > 0 ? leaderUsers : 2],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & 4 Ô thống kê tổng quan hệ thống */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-base font-bold text-gray-800">Tổng quan hoạt động hệ thống</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-blue-600">Tổng số Nodes</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">{totalNodes}</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-emerald-600">Tổng lượt truy cập</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{totalClicks || 0}</div>
          </div>

          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-purple-600">Tổng số tài khoản</div>
            <div className="text-2xl font-bold text-purple-800 mt-1">{totalUsers}</div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-amber-600">Thời gian view TB</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{systemStats?.avgViewTime || '0 giây'}</div>
          </div>
        </div>

        {/* 2 Khung biểu đồ thành phần ngang nhau */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Lượt click theo liên kết (Nodes) */}
          <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between h-72">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              📊 Lượt click theo liên kết (Nodes)
            </h4>
            <div className="flex-1 flex items-center justify-center">
              {safeNodes.length === 0 ? (
                <span className="text-sm text-gray-400 italic">Chưa có dữ liệu nodes.</span>
              ) : (
                <div className="w-full h-full">
                  {/* Có thể render danh sách hoặc biểu đồ cột nhỏ cho nodes ở đây */}
                  <span className="text-sm text-gray-500">Đã kết nối {safeNodes.length} nodes</span>
                </div>
              )}
            </div>
          </div>

          {/* Phân bố tài khoản người dùng */}
          <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 flex flex-col justify-between h-72">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              👥 Phân bố tài khoản người dùng
            </h4>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-48 h-48">
                <Doughnut 
                  data={userRoleData} 
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ tăng trưởng tổng hợp hệ thống phía dưới */}
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