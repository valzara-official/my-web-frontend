import React from 'react';
import ChartComponent from './chart';
import useAdminLogic from '../hooks/useAdminLogic';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const {
    activeTab, setActiveTab,
    users,
    systemStats,
    nodeForm, setNodeForm,
    editingNodeId, setEditingNodeId,
    searchTerm, setSearchTerm,
    showSection, setShowSection,
    showModal, setShowModal,
    isEditingUser,
    showPassword, setShowPassword,
    userForm, setUserForm,
    handleSaveNode, handleDeleteNode,
    handleOpenAddModal, handleOpenEditModal,
    handleDeleteUser, handleSaveUser,
    totalClicks, formatMemberCode,
    adminList, leaderList, userList
  } = useAdminLogic(API_BASE);

  const toggleSection = (sectionKey) => {
    setShowSection(prev => ({
      ...(prev || {}),
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">
        
        {/* TAB 1: TỔNG QUAN (Đã tích hợp cấu trúc 4 phần mới của bạn vào đây) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* PHẦN 1: Biểu đồ tăng trưởng tổng quan */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Biểu đồ tăng trưởng hệ thống (User, Leader, Nodes)</h3>
              <div className="bg-gray-50 p-4 rounded-xl border">
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
              {/* Bạn có thể map Top 10 nodes ở đây nếu muốn */}
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
              <div className="text-sm text-gray-500">
                Tổng số Leader hiện tại: <span className="font-bold text-gray-800">{leaderList?.length || 0}</span>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: QUẢN LÝ NODES */}
        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý các Liên kết (Nodes)</h2>
            {/* Giữ nguyên phần code quản lý Nodes cũ của bạn ở đây */}
          </div>
        )}

        {/* TAB 3: QUẢN LÝ USER & LEADER */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">👥 Quản lý Thành viên</h2>
            {/* Giữ nguyên phần code bảng User, Leader, Admin và Modal ở đây */}
          </div>
        )}

      </div>
    </div>
  );
}