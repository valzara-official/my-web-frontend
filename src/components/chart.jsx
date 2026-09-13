import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function OverviewChart({ nodes = [], users = [] }) {
  const totalNodes = nodes.length;
  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);
  const totalUsers = users.length;
  const avgViewTime = nodes.length > 0 ? '1 phút 45 giây' : '0 giây';

  // 1. Phân tách danh sách User và Leader
  const standardUsers = users.filter(u => u.role === 'USER');
  const leaderUsers = users.filter(u => u.role === 'LEADER');

  // Biểu đồ cột 1: Lượt click theo Node
  const barChartData = {
    labels: nodes.map(n => n.title),
    datasets: [
      {
        label: 'Lượt click',
        data: nodes.map(n => n.clicks || n.click_count || 0),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  // 2. Biểu đồ cột mới: Thời gian hoạt động của riêng các LEADER (tính bằng phút)
  const leaderBarChartData = {
    labels: leaderUsers.map(l => l.username),
    datasets: [
      {
        label: 'Thời gian hoạt động (Phút)',
        data: leaderUsers.map(l => l.totalActiveMinutes || 0),
        backgroundColor: 'rgba(147, 51, 234, 0.8)', // Tím đặc trưng cho Leader
        borderRadius: 6,
      },
    ],
  };

  // Biểu đồ tròn: Phân bổ vai trò User (Tổng quan)
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const doughnutChartData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: ['#9333ea', '#4f46e5', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Tổng quan hoạt động hệ thống</h2>
      
      {/* Các thẻ chỉ số */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
          <div className="text-sm font-medium text-indigo-600">Tổng số Nodes</div>
          <div className="text-3xl font-bold text-indigo-800 mt-2">{totalNodes}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
          <div className="text-sm font-medium text-emerald-600">Tổng lượt truy cập</div>
          <div className="text-3xl font-bold text-emerald-800 mt-2">{totalClicks}</div>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-5 rounded-xl">
          <div className="text-sm font-medium text-purple-600">Tổng số tài khoản</div>
          <div className="text-3xl font-bold text-purple-800 mt-2">{totalUsers}</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
          <div className="text-sm font-medium text-amber-600">Thời gian view TB</div>
          <div className="text-2xl font-bold text-amber-800 mt-2">{avgViewTime}</div>
        </div>
      </div>

      {/* Khu vực biểu đồ phân chia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Biểu đồ 1: Lượt click theo Nodes */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">📊 Lượt click theo liên kết (Nodes)</h3>
          {nodes.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-10 text-center">Chưa có dữ liệu nodes.</p>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          )}
        </div>

        {/* Biểu đồ 2: Phân bổ tài khoản người dùng (Doughnut) */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">👥 Phân bố tài khoản người dùng</h3>
          {totalUsers === 0 ? (
            <p className="text-sm text-gray-400 italic py-10 text-center">Chưa có dữ liệu tài khoản.</p>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          )}
        </div>

        {/* Biểu đồ 3: Riêng thời gian hoạt động của LEADER */}
        <div className="bg-white p-5 rounded-xl border shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-purple-700 mb-4">⏱️ Thống kê thời gian hoạt động của Leader (Phút)</h3>
          {leaderUsers.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-10 text-center">Chưa có tài khoản Leader nào hoạt động.</p>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Bar data={leaderBarChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}