import React from 'react';
import ChartComponent from '../modals/OverviewChart';
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
      {/* Sidebar Điều hướng */}
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

      {/* Main Content Area */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">

        {/* ================= TAB 1: TỔNG QUAN (4 PHẦN CHUYÊN SÂU) ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">

            {/* PHẦN 1: Biểu đồ tăng trưởng tổng quan & Thống kê hệ thống */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-bold text-gray-800">📈 Biểu đồ tăng trưởng hệ thống (User, Leader, Nodes)</h3>

              {/* Thẻ thống kê nhanh bổ sung tổng lượng truy cập & tổng thời gian truy cập */}
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

              {/* Thay thế biểu đồ Leader cũ bằng biểu đồ tăng trưởng web (Nodes, User, Leader) */}
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
        )}

        {/* ================= TAB 2: QUẢN LÝ NODES ================= */}
        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý các Liên kết (Nodes)</h2>
            <form onSubmit={handleSaveNode} className="bg-gray-50 p-4 rounded-xl border space-y-4">
              <h3 className="text-sm font-bold text-gray-700">{editingNodeId ? '✏️ Chỉnh sửa Node' : '➕ Thêm Node mới'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={nodeForm.title} onChange={(e) => setNodeForm({ ...nodeForm, title: e.target.value })} required className="border rounded-lg px-3 py-2 text-sm bg-white" placeholder="Tiêu đề Node" />
                <input type="url" value={nodeForm.url} onChange={(e) => setNodeForm({ ...nodeForm, url: e.target.value })} required className="border rounded-lg px-3 py-2 text-sm bg-white" placeholder="https://example.com" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  {editingNodeId ? 'Lưu thay đổi' : 'Thêm Node'}
                </button>
                {editingNodeId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingNodeId(null); setNodeForm({ title: '', url: '' }); }} 
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs text-gray-500 bg-gray-50">
                    <th className="p-3">Tiêu đề</th>
                    <th className="p-3">Clicks</th>
                    <th className="p-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {nodes?.map((node, idx) => (
                    <tr key={node._id || node.id || idx}>
                      <td className="p-3 font-medium text-gray-800">{node.title}</td>
                      <td className="p-3 text-gray-600">{node.clicks || node.click_count || 0}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => { setEditingNodeId(node._id || node.id); setNodeForm({ title: node.title, url: node.url || node.target_url }); }} className="text-blue-600 hover:underline font-medium">Sửa</button>
                        <button onClick={() => handleDeleteNode(node._id || node.id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: QUẢN LÝ USER & LEADER ================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">👥 Quản lý Thành viên</h2>
                <p className="text-sm text-gray-500">Bấm vào tiêu đề mỗi danh sách để ẩn/hiện bảng chi tiết.</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
              >
                ➕ Thêm thành viên mới
              </button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo Tên, Mã, Email, SĐT, Địa chỉ, Ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modal Thêm / Sửa thành viên */}
            {showModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl space-y-4 my-8">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {isEditingUser ? '✏️ Chỉnh sửa thông tin thành viên' : '➕ Thêm thành viên mới'}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                  </div>
                  <form onSubmit={handleSaveUser} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tên tài khoản (Username) *</label>
                        <input
                          type="text"
                          required
                          value={userForm.username}
                          onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Nhập tên tài khoản..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mật khẩu {isEditingUser && '(Để trống nếu giữ nguyên)'} *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required={!isEditingUser}
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
                            placeholder="Nhập mật khẩu..."
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                          >
                            {showPassword ? '👁️‍🗨️' : '👁️'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Chức vụ (Role) *</label>
                        <select
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
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
                          value={userForm.phone}
                          onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Nhập SĐT..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Giới tính</label>
                        <select
                          value={userForm.gender}
                          onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })}
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
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập địa chỉ email..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <input
                        type="text"
                        value={userForm.address}
                        onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập địa chỉ cư trú..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                      <textarea
                        rows="2"
                        value={userForm.note}
                        onChange={(e) => setUserForm({ ...userForm, note: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập ghi chú thêm..."
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        {isEditingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* BẢNG 1: DANH SÁCH ADMIN */}
            <div className="space-y-3">
              <div
                onClick={() => toggleSection('admin')}
                className="flex items-center justify-between cursor-pointer bg-red-50 p-3 rounded-lg border border-red-100 hover:bg-red-100/60 transition select-none"
              >
                <h3 className="text-md font-bold text-red-700 flex items-center gap-2 m-0">
                  🛡️ Danh sách Admin ({adminList?.length || 0})
                </h3>
                <span className="text-xs font-bold text-red-600 bg-white px-2.5 py-1 rounded border border-red-200">
                  {showSection?.admin ? '▲ Thu gọn' : '▼ Mở rộng'}
                </span>
              </div>

              {showSection?.admin && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                    <thead className="bg-red-50/50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Mã ĐD</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Tài khoản</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Số điện thoại</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Email</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Địa chỉ</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Giới tính</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Trạng thái</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-red-700 uppercase">Ghi chú</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-red-700 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                      {adminList?.length > 0 ? (
                        adminList.map((u, idx) => (
                          <tr key={u._id || `admin-${idx}`} className="hover:bg-red-50/30">
                            <td className="px-3 py-3 whitespace-nowrap font-mono text-xs font-bold text-red-600">
                              {u.code || formatMemberCode('ADMIN', idx)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.phone || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.email || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600 truncate max-w-xs">{u.address || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.gender || 'Khác'}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                                u.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {u.isOnline ? '🟢 Online' : '⚪ Offline'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-500 truncate max-w-xs">{u.note || '-'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm space-x-2">
                              <button onClick={() => handleOpenEditModal(u)} className="text-blue-600 hover:underline font-medium">Sửa</button>
                              <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-400 italic">
                            Không tìm thấy Admin nào phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BẢNG 2: DANH SÁCH LEADER */}
            <div className="space-y-3 pt-2">
              <div
                onClick={() => toggleSection('leader')}
                className="flex items-center justify-between cursor-pointer bg-purple-50 p-3 rounded-lg border border-purple-100 hover:bg-purple-100/60 transition select-none"
              >
                <h3 className="text-md font-bold text-purple-700 flex items-center gap-2 m-0">
                  👑 Danh sách Leader ({leaderList?.length || 0})
                </h3>
                <span className="text-xs font-bold text-purple-600 bg-white px-2.5 py-1 rounded border border-purple-200">
                  {showSection?.leader ? '▲ Thu gọn' : '▼ Mở rộng'}
                </span>
              </div>

              {showSection?.leader && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                    <thead className="bg-purple-50/50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Mã ĐD</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Tài khoản</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Số điện thoại</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Email</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Địa chỉ</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Giới tính</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Trạng thái</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-purple-700 uppercase">Ghi chú</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-purple-700 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                      {leaderList?.length > 0 ? (
                        leaderList.map((u, idx) => (
                          <tr key={u._id || `leader-${idx}`} className="hover:bg-purple-50/30">
                            <td className="px-3 py-3 whitespace-nowrap font-mono text-xs font-bold text-purple-600">
                              {u.code || formatMemberCode('LEADER', idx)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.phone || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.email || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600 truncate max-w-xs">{u.address || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.gender || 'Khác'}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                                u.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {u.isOnline ? '🟢 Online' : '⚪ Offline'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-500 truncate max-w-xs">{u.note || '-'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm space-x-2">
                              <button onClick={() => handleOpenEditModal(u)} className="text-blue-600 hover:underline font-medium">Sửa</button>
                              <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-400 italic">
                            Không tìm thấy Leader nào phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BẢNG 3: DANH SÁCH USER */}
            <div className="space-y-3 pt-2">
              <div
                onClick={() => toggleSection('user')}
                className="flex items-center justify-between cursor-pointer bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100/60 transition select-none"
              >
                <h3 className="text-md font-bold text-blue-700 flex items-center gap-2 m-0">
                  👤 Danh sách User ({userList?.length || 0})
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-white px-2.5 py-1 rounded border border-blue-200">
                  {showSection?.user ? '▲ Thu gọn' : '▼ Mở rộng'}
                </span>
              </div>

              {showSection?.user && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                    <thead className="bg-blue-50/50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Mã ĐD</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Tài khoản</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Số điện thoại</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Email</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Địa chỉ</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Giới tính</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Trạng thái</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-blue-700 uppercase">Ghi chú</th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-blue-700 uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                      {userList?.length > 0 ? (
                        userList.map((u, idx) => (
                          <tr key={u._id || `user-${idx}`} className="hover:bg-blue-50/30">
                            <td className="px-3 py-3 whitespace-nowrap font-mono text-xs font-bold text-blue-600">
                              {u.code || formatMemberCode('USER', idx)}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.phone || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.email || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600 truncate max-w-xs">{u.address || 'Chưa có'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-600">{u.gender || 'Khác'}</td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                                u.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {u.isOnline ? '🟢 Online' : '⚪ Offline'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-gray-500 truncate max-w-xs">{u.note || '-'}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm space-x-2">
                              <button onClick={() => handleOpenEditModal(u)} className="text-blue-600 hover:underline font-medium">Sửa</button>
                              <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="px-4 py-4 text-center text-sm text-gray-400 italic">
                            Không tìm thấy User nào phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}