import React, { useState, useEffect } from 'react';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('nodes'); // 'nodes' hoặc 'users'

  // Form tạo tài khoản mới
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('USER'); // Mặc định là USER, có thể chọn LEADER

  // Modal chỉnh sửa tài khoản
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('USER');

  // Lấy danh sách users
  const fetchUsers = () => {
    fetch(`${API_BASE}/auth/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error('Lỗi lấy danh sách user:', err));
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Xử lý tạo tài khoản (Cấp tài khoản)
  const handleCreateUser = (e) => {
    e.preventDefault();
    // Nếu tạo role LEADER gọi endpoint create-leader, hoặc dùng chung một API tạo tổng quát
    // Ở đây dùng endpoint /auth/create-leader hoặc bạn có thể mở rộng api backend tùy ý
    const endpoint = `${API_BASE}/auth/create-leader`; // (Hoặc /auth/create-user nếu backend hỗ trợ)
    
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Cấp tài khoản thành công!');
          setNewUsername('');
          setNewPassword('');
          setNewRole('USER');
          fetchUsers();
        } else {
          alert(data.message || 'Lỗi cấp tài khoản');
        }
      })
      .catch(err => console.error(err));
  };

  // Xử lý Xóa tài khoản
  const handleDeleteUser = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này?')) return;
    fetch(`${API_BASE}/auth/users/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchUsers();
        } else {
          alert(data.message);
        }
      });
  };

  // Mở modal chỉnh sửa
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditPassword(''); // Để trống nếu không muốn đổi pass
    setEditRole(user.role);
  };

  // Gửi thông tin cập nhật tài khoản
  const handleUpdateUser = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/auth/users/${editingUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: editUsername,
        password: editPassword,
        role: editRole
      }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Cập nhật tài khoản thành công!');
          setEditingUser(null);
          fetchUsers();
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className="space-y-6">
      {/* Header Admin */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'nodes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quản lý Nodes
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quản lý Tài khoản & Phân quyền
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          Đăng xuất
        </button>
      </div>

      {/* TAB QUẢN LÝ TÀI KHOẢN */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Cấp tài khoản mới */}
          <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Cấp tài khoản mới</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập username..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập password..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="USER">USER (Người dùng thông thường)</option>
                  <option value="LEADER">LEADER (Cấp quản lý)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên tối cao)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Tạo tài khoản
              </button>
            </form>
          </div>

          {/* Bảng danh sách tài khoản */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Danh sách tài khoản hệ thống</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-500 bg-gray-50">
                  <th className="p-3">Tài khoản</th>
                  <th className="p-3">Quyền hạn (Role)</th>
                  <th className="p-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <p className="p-3 font-medium text-gray-800">{u.username}</p>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'LEADER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 bg-blue-50 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs px-2 py-1 bg-red-50 rounded"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB QUẢN LÝ NODES (Giữ nguyên phần render nodes của bạn ở đây) */}
      {activeTab === 'nodes' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quản lý các Liên kết (Nodes)</h3>
          {/* Danh sách nodes hiện tại và nút thêm/sửa node */}
          <div className="text-sm text-gray-600">Đang hiển thị {nodes.length} nodes hệ thống.</div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA TÀI KHOẢN */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Chỉnh sửa tài khoản: {editingUser.username}</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản mới</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới (Bỏ trống nếu giữ nguyên)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nhập mật khẩu mới nếu muốn đổi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quyền hạn (Role)</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="USER">USER</option>
                  <option value="LEADER">LEADER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}