import React from 'react';

export default function UsersTab({
  searchTerm, setSearchTerm,
  showSection, toggleSection,
  adminList, leaderList, userList,
  formatMemberCode, handleOpenAddModal,
  handleOpenEditModal, handleDeleteUser
}) {
  return (
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
  );
}