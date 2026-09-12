import React, { useState, useEffect } from 'react';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'nodes', 'users'
  const [users, setUsers] = useState([]);

  // States cho quản lý Nodes (Thêm / Sửa)
  const [nodeForm, setNodeForm] = useState({ title: '', url: '', description: '', category: '' });
  const [editingNodeId, setEditingNodeId] = useState(null);

  // States cho quản lý Tài khoản
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('USER');
  
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('USER');

  // Lấy danh sách users khi sang tab users
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

  // Xử lý Thêm / Sửa Node
  const handleSaveNode = (e) => {
    e.preventDefault();
    const endpoint = editingNodeId 
      ? `${API_BASE}/admin/nodes/${editingNodeId}` 
      : `${API_BASE}/admin/nodes`;
    const method = editingNodeId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeForm),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data._id || data.id) {
          alert(editingNodeId ? 'Cập nhật node thành công!' : 'Thêm node mới thành công!');
          setNodeForm({ title: '', url: '', description: '', category: '' });
          setEditingNodeId(null);
          refreshNodes();
        } else {
          alert(data.message || 'Có lỗi xảy ra');
        }
      })
      .catch(err => console.error(err));
  };

  const handleEditNodeClick = (node) => {
    setEditingNodeId(node._id || node.id);
    setNodeForm({
      title: node.title || '',
      url: node.url || node.target_url || '',
      description: node.description || '',
      category: node.category || ''
    });
  };

  const handleDeleteNode = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa node này?')) return;
    fetch(`${API_BASE}/admin/nodes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshNodes();
        } else {
          alert(data.message || 'Lỗi khi xóa node');
        }
      })
      .catch(err => console.error(err));
  };

  // Xử lý Tài khoản
  const handleCreateUser = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/auth/create-leader`, {
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

  const handleDeleteUser = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản này?')) return;
    fetch(`${API_BASE}/auth/users/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) fetchUsers();
        else alert(data.message || 'Lỗi khi xóa tài khoản');
      })
      .catch(err => console.error(err));
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    
    // Chỉ gửi password nếu người dùng có nhập mật khẩu mới
    const updateData = { username: editUsername, role: editRole };
    if (editPassword.trim() !== '') {
      updateData.password = editPassword;
    }

    fetch(`${API_BASE}/auth/users/${editingUser._id || editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Cập nhật tài khoản thành công!');
          setEditingUser(null);
          fetchUsers();
        } else {
          alert(data.message || 'Lỗi cập nhật tài khoản');
        }
      })
      .catch(err => console.error(err));
  };

  // Tính toán số liệu thống kê cho Overview
  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* THANH CÔNG CỤ BÊN TRÁI (SIDEBAR) */}
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
            👥 Tài khoản & Phân quyền
          </button>
        </div>

        <div className="pt-4 border-t mt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition text-center"
          >
            Đăng xuất hệ thống
          </button>
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ NỘI DUNG CHÍNH BÊN PHẢI */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">
        
        {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Tổng quan hoạt động hệ thống</h2>
            
            {/* Các thẻ thống kê */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-blue-600">Tổng số Nodes hiện có</div>
                <div className="text-3xl font-bold text-blue-800 mt-2">{nodes.length}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-emerald-600">Tổng lượt truy cập (Clicks)</div>
                <div className="text-3xl font-bold text-emerald-800 mt-2">{totalClicks}</div>
              </div>
            </div>

            {/* Biểu đồ / Thống kê chi tiết theo từng Node */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Thống kê lưu lượng truy cập các liên kết</h3>
              {nodes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Chưa có dữ liệu nodes nào trong hệ thống.</p>
              ) : (
                <div className="space-y-3">
                  {nodes.map((node, index) => {
                    const clicks = node.clicks || node.click_count || 0;
                    const maxClicks = Math.max(...nodes.map(n => n.clicks || n.click_count || 0), 1);
                    const percent = (clicks / maxClicks) * 100;

                    return (
                      <div key={node._id || node.id || index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">{node.title}</span>
                          <span className="text-blue-600 font-semibold">{clicks} lượt click</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ NODES (THÊM / SỬA / XÓA) */}
        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý các Liên kết (Nodes)</h2>

            {/* Form Thêm hoặc Sửa Node */}
            <form onSubmit={handleSaveNode} className="bg-gray-50 p-4 rounded-xl border space-y-4">
              <h3 className="text-sm font-bold text-gray-700">
                {editingNodeId ? '✏️ Chỉnh sửa Node' : '➕ Thêm Node mới'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu đề Node</label>
                  <input
                    type="text"
                    value={nodeForm.title}
                    onChange={(e) => setNodeForm({ ...nodeForm, title: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Google Search"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Đường dẫn URL đích</label>
                  <input
                    type="url"
                    value={nodeForm.url}
                    onChange={(e) => setNodeForm({ ...nodeForm, url: e.target.value })}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả ngắn</label>
                  <input
                    type="text"
                    value={nodeForm.description}
                    onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả về liên kết..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nhóm / Danh mục (Category)</label>
                  <input
                    type="text"
                    value={nodeForm.category}
                    onChange={(e) => setNodeForm({ ...nodeForm, category: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Công cụ, Giải trí..."
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  {editingNodeId ? 'Lưu thay đổi' : 'Thêm Node'}
                </button>
                {editingNodeId && (
                  <button
                    type="button"
                    onClick={() => { setEditingNodeId(null); setNodeForm({ title: '', url: '', description: '', category: '' }); }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>

            {/* Danh sách Nodes hiện tại */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">Danh sách Nodes ({nodes.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-gray-500 bg-gray-50">
                      <th className="p-3">Tiêu đề & URL</th>
                      <th className="p-3">Danh mục</th>
                      <th className="p-3">Clicks</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {nodes.map((node) => (
                      <tr key={node._id || node.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium text-gray-800">{node.title}</div>
                          <a href={node.url || node.target_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 truncate max-w-xs block hover:underline">
                            {node.url || node.target_url}
                          </a>
                        </td>
                        <td className="p-3 text-gray-600">{node.category || 'Chưa phân loại'}</td>
                        <td className="p-3 font-semibold text-blue-600">{node.clicks || node.click_count || 0}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleEditNodeClick(node)}
                            className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded text-xs font-medium hover:bg-blue-100"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteNode(node._id || node.id)}
                            className="text-red-600 bg-red-50 px-2.5 py-1 rounded text-xs font-medium hover:bg-red-100"
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
          </div>
        )}

        {/* TAB 3: QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý Tài khoản & Phân quyền</h2>
            
            {/* Form cấp tài khoản mới */}
            <form onSubmit={handleCreateUser} className="bg-gray-50 p-4 rounded-xl border space-y-4">
              <h3 className="text-sm font-bold text-gray-700">➕ Cấp tài khoản mới</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tên tài khoản</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Vai trò (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="USER">USER</option>
                    <option value="LEADER">LEADER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Tạo tài khoản
              </button>
            </form>

            {/* Bảng danh sách tài khoản */}
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-3">Danh sách tài khoản hệ thống</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-gray-500 bg-gray-50">
                      <th className="p-3">Tên tài khoản</th>
                      <th className="p-3">Vai trò</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {users.map((u) => (
                      <tr key={u._id || u.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800">{u.username}</td>
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
                            onClick={() => { setEditingUser(u); setEditUsername(u.username); setEditPassword(''); setEditRole(u.role); }}
                            className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded text-xs font-medium hover:bg-blue-100"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id || u.id)}
                            className="text-red-600 bg-red-50 px-2.5 py-1 rounded text-xs font-medium hover:bg-red-100"
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
          </div>
        )}

      </div>

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
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập pass mới..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phân quyền (Role)</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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