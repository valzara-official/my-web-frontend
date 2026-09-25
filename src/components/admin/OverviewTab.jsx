import React from 'react';
import ChartComponent from '../../modals/OverviewChart';

export default function OverviewTab({ nodes, users, totalClicks, systemStats, leaderList }) {
  // Lọc chỉ đếm những tài khoản là user thông thường (nếu trong users có phân loại role, ví dụ user.role === 'user')
  // Nếu mảng users chỉ chứa toàn user, ta lấy trực tiếp users.length
  const regularUsersCount = users ? users.filter(u => !u.role || u.role === 'user' || u.role === 'User').length : 0;

  return (
    <div className="space-y-6">
      {/* 4 Ô THỐNG KÊ CỐT LÕI */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Tổng quan hoạt động hệ thống</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-blue-600">Tổng số Nodes</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">{nodes?.length || 0}</div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-emerald-600">Tổng lượt truy cập</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{totalClicks || 0}</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-purple-600">Tổng số User</div>
            <div className="text-2xl font-bold text-purple-800 mt-1">{regularUsersCount}</div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-amber-600">Tổng thời gian truy cập</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{systemStats?.totalAccessTime || '0 phút'}</div>
          </div>
        </div>
      </section>

      {/* PHẦN BIỂU ĐỒ TRỰC QUAN */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-800">📈 Phân tích & Tăng trưởng chi tiết</h3>
        
        {/* Biểu đồ tăng trưởng tổng hợp */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <div className="text-sm font-semibold text-gray-700 mb-3">Biểu đồ tổng hợp tăng trưởng (Nodes, User, Leader)</div>
          <ChartComponent nodes={nodes} users={users} />
        </div>
      </section>
    </div>
  );
}