import React from 'react';
import useAdminLogic from '../hooks/useAdminLogic';
import Sidebar from './admin/Sidebar';
import OverviewTab from './admin/OverviewTab';
import NodesTab from './admin/NodesTab';
import LeadersSection from './admin/LeadersTab';
import UsersSection from './admin/UsersTab';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const logic = useAdminLogic(API_BASE);

  const toggleSection = (sectionKey) => {
    logic.setShowSection(prev => ({
      ...(prev || {}),
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* Sidebar điều hướng */}
      <Sidebar 
        activeTab={logic.activeTab} 
        setActiveTab={logic.setActiveTab} 
        handleLogout={handleLogout} 
      />

      {/* Khu vực nội dung chính */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">

        {/* Tab 1: Tổng quan */}
        {logic.activeTab === 'overview' && (
          <OverviewTab 
            nodes={nodes} 
            users={logic.users} 
            totalClicks={logic.totalClicks} 
            systemStats={logic.systemStats} 
            leaderList={logic.leaderList} 
          />
        )}

        {/* Tab 2: Quản lý Nodes */}
        {logic.activeTab === 'nodes' && (
          <NodesTab 
            nodes={nodes}
            nodeForm={logic.nodeForm}
            setNodeForm={logic.setNodeForm}
            editingNodeId={logic.editingNodeId}
            setEditingNodeId={logic.setEditingNodeId}
            handleSaveNode={logic.handleSaveNode}
            handleDeleteNode={logic.handleDeleteNode}
          />
        )}

        {/* Tab 3: Quản lý User & Leader (Hiển thị form, tìm kiếm chung và nhúng 2 file Leader/User vào) */}
        {logic.activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">👥 Quản lý Thành viên</h2>
                <p className="text-sm text-gray-500">Bấm vào tiêu đề mỗi danh sách để ẩn/hiện bảng chi tiết.</p>
              </div>
              <button
                onClick={logic.handleOpenAddModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
              >
                ➕ Thêm thành viên mới
              </button>
            </div>

            {/* Thanh tìm kiếm chung */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo Tên, Mã, Email, SĐT, Địa chỉ, Ghi chú..."
                value={logic.searchTerm}
                onChange={(e) => logic.setSearchTerm(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modal Thêm/Sửa Thành viên */}
            {logic.showModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl space-y-4 my-8">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {logic.isEditingUser ? '✏️ Chỉnh sửa thông tin thành viên' : '➕ Thêm thành viên mới'}
                    </h3>
                    <button onClick={() => logic.setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                  </div>
                  <form onSubmit={logic.handleSaveUser} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tên tài khoản (Username) *</label>
                        <input
                          type="text"
                          required
                          value={logic.userForm.username}
                          onChange={(e) => logic.setUserForm({ ...logic.userForm, username: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Nhập tên tài khoản..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mật khẩu {logic.isEditingUser && '(Để trống nếu giữ nguyên)'} *
                        </label>
                        <div className="relative">
                          <input
                            type={logic.showPassword ? 'text' : 'password'}
                            required={!logic.isEditingUser}
                            value={logic.userForm.password}
                            onChange={(e) => logic.setUserForm({ ...logic.userForm, password: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
                            placeholder="Nhập mật khẩu..."
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => logic.setShowPassword(!logic.showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                          >
                            {logic.showPassword ? '👁️‍🗨️' : '👁️'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Chức vụ (Role) *</label>
                        <select
                          value={logic.userForm.role}
                          onChange={(e) => logic.setUserForm({ ...logic.userForm, role: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                        >
                          <option value="USER">USER</option>
                          <option value="LEADER">LEADER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          value={logic.userForm.phone}
                          onChange={(e) => logic.setUserForm({ ...logic.userForm, phone: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Nhập SĐT..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Giới tính</label>
                        <select
                          value={logic.userForm.gender}
                          onChange={(e) => logic.setUserForm({ ...logic.userForm, gender: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={logic.userForm.email}
                        onChange={(e) => logic.setUserForm({ ...logic.userForm, email: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập địa chỉ email..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <input
                        type="text"
                        value={logic.userForm.address}
                        onChange={(e) => logic.setUserForm({ ...logic.userForm, address: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập địa chỉ cư trú..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                      <textarea
                        rows="2"
                        value={logic.userForm.note}
                        onChange={(e) => logic.setUserForm({ ...logic.userForm, note: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập ghi chú thêm..."
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t">
                      <button
                        type="button"
                        onClick={() => logic.setShowModal(false)}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        {logic.isEditingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Gọi File nhỏ Quản lý Leader */}
            <LeadersSection 
              leaderList={logic.leaderList}
              showSection={logic.showSection}
              toggleSection={toggleSection}
              formatMemberCode={logic.formatMemberCode}
              handleOpenEditModal={logic.handleOpenEditModal}
              handleDeleteUser={logic.handleDeleteUser}
            />

            {/* Gọi File nhỏ Quản lý User */}
            <UsersSection 
              userList={logic.userList}
              showSection={logic.showSection}
              toggleSection={toggleSection}
              formatMemberCode={logic.formatMemberCode}
              handleOpenEditModal={logic.handleOpenEditModal}
              handleDeleteUser={logic.handleDeleteUser}
            />
          </div>
        )}

      </div>
    </div>
  );
}