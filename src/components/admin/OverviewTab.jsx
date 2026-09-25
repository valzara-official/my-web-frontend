import React from 'react';
import ChartComponent from '../../modals/OverviewChart';

export default function OverviewTab({ nodes, users, totalClicks, systemStats }) {
  const safeUsers = Array.isArray(users) ? users : [];
  const totalUsers = safeUsers.length;
  const totalNodes = Array.isArray(nodes) ? nodes.length : 0;

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
          <div className="text-3xl font-bold text-emerald-800 mt-2">{totalClicks || 0}</div>
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

      {/* BIỂU ĐỒ ĐƯỜNG TĂNG TRƯỞNG DUY NHẤT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <ChartComponent nodes={nodes} users={users} />
      </div>
    </div>
  );
}