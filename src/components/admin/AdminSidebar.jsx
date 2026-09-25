import React from 'react';

export default function AdminSidebar({ activeTab, setActiveTab, handleLogout }) {
  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border flex flex-col justify-between shrink-0">
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Bảng điều khiển</div>
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📊 Tổng quan hoạt động
        </button>
        <button
          onClick={() => setActiveTab('nodes')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'nodes' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🔗 Quản lý Nodes
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          👥 Quản lý User & Leader
        </button>
      </div>

      <div className="pt-4 border-t mt-4">
        <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition text-center">
          Đăng xuất hệ thống
        </button>
      </div>
    </div>
  );
}