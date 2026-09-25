import React from 'react';
import ChartComponent from '../../modals/OverviewChart';

export default function OverviewTab({ nodes, users, totalClicks, systemStats }) {
  // Lọc chỉ tính User thông thường (loại trừ Admin và Leader)
  const regularUsers = users ? users.filter(u => {
    const role = (u.role || u.type || '').toLowerCase();
    return role === 'user' || (!role && role !== 'admin' && role !== 'leader');
  }) : [];

  return (
    <div className="space-y-6">
      {/* 4 Ô THỐNG KÊ DUY NHẤT (Đúng 4 chỉ số yêu cầu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <div className="text-xs font-medium text-blue-600">Tổng số Nodes</div>
          <div className="text-2xl font-bold text-blue-800 mt-1">{nodes?.length || 0}</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
          <div className="text-xs font-medium text-purple-600">Tổng số User</div>
          <div className="text-2xl font-bold text-purple-800 mt-1">{regularUsers.length}</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
          <div className="text-xs font-medium text-emerald-600">Tổng lượt truy cập</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{totalClicks || 0}</div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
          <div className="text-xs font-medium text-amber-600">Tổng thời gian truy cập</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{systemStats?.totalAccessTime || '0 phút'}</div>
        </div>
      </div>

      {/* BIỂU ĐỒ TRỰC QUAN */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-lg font-bold text-gray-800">📈 Biểu đồ tăng trưởng tổng hợp hệ thống</h3>
        <div className="bg-gray-50 p-4 rounded-xl border">
          <ChartComponent nodes={nodes} users={users} />
        </div>
      </div>
    </div>
  );
}