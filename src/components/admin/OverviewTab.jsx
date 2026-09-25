import React from 'react';
import ChartComponent from '../../modals/OverviewChart';

export default function OverviewTab({ nodes, users, totalClicks, systemStats, leaderList }) {
  return (
    <div className="space-y-8">
      {/* PHẦN 1: Biểu đồ tăng trưởng tổng quan & Thống kê hệ thống */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-bold text-gray-800">📈 Biểu đồ tăng trưởng hệ thống (User, Leader, Nodes)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-blue-600">Tổng số Nodes</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">{nodes?.length || 0}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-emerald-600">Tổng lượt truy cập</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{totalClicks}</div>
          </div>
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-purple-600">Tổng số tài khoản</div>
            <div className="text-2xl font-bold text-purple-800 mt-1">{users?.length || 0}</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-amber-600">Tổng thời gian truy cập</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{systemStats?.totalAccessTime || '0 phút'}</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border">
          <div className="text-sm font-semibold text-gray-700 mb-3">Biểu đồ tổng hợp tăng trưởng (Nodes, User, Leader)</div>
          <ChartComponent nodes={nodes} users={users} />
        </div>
      </section>

      {/* PHẦN 2: Thống kê Nodes & Top 10 */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 Thống kê Nodes & Top 10 Truy Cập</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-blue-600">Tổng số Nodes</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">{nodes?.length || 0}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-emerald-600">Tổng lượt Clicks</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{totalClicks}</div>
          </div>
        </div>
      </section>

      {/* PHẦN 3: Thống kê User & Danh sách có Filter */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Thống kê User & Top Tương Tác</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-purple-600">Tổng Users</div>
            <div className="text-2xl font-bold text-purple-800 mt-1">{users?.length || 0}</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-amber-600">Đang Online</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">{systemStats?.onlineUsers || 0}</div>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
            <div className="text-xs font-medium text-indigo-600">Thời gian TB / User</div>
            <div className="text-2xl font-bold text-indigo-800 mt-1">{systemStats?.avgActiveTime || '0 phút'}</div>
          </div>
        </div>
      </section>

      {/* PHẦN 4: Thống kê Leader & Đề xuất */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">👑 Thống kê hoạt động Leader & Hiệu suất</h3>
        <div className="text-sm text-gray-600">
          Tổng số Leader hiện tại trong hệ thống: <span className="font-bold text-gray-900">{leaderList?.length || 0}</span>
        </div>
      </section>
    </div>
  );
}