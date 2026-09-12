import React, { useState, useEffect } from 'react';

export default function LeaderView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'nodes', 'users'
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmittingNode, setIsSubmittingNode] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // States cho quản lý Nodes (Thêm / Sửa / Xóa)
  const [nodeForm, setNodeForm] = useState({ title: '', url: '', description: '', category: '' });
  const [editingNodeId, setEditingNodeId] = useState(null);

  // States cấp tài khoản User mới
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Lấy danh sách users
  const fetchUsers = () => {
    setIsLoadingUsers(true);
    fetch(`${API_BASE}/auth/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error('Lỗi lấy danh sách user:', err))
      .finally(() => setIsLoadingUsers(false));
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Xử lý Thêm / Sửa Node
  const handleSaveNode = (e) => {
    e.preventDefault();
    setIsSubmittingNode(true);
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
      .catch(err => console.error(err))
      .finally(() => setIsSubmittingNode(false));
  };

  const handleEditNodeClick = (node) => {
    setEditingNodeId(node._id || node.id);
    setNodeForm({
      title: node.title || '',
      url: node.url || node.target_url || '',
      description: node.description || '',
      category: node.category || ''
    });
    // Cuộn lên đầu form trên mobile nếu cần
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

  // Xử lý chỉ tạo tài khoản USER
  const handleCreateUser = (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    fetch(`${API_BASE}/auth/create-leader`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: 'USER' }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Cấp tài khoản User thành công!');
          setNewUsername('');
          setNewPassword('');
          fetchUsers();
        } else {
          alert(data.message || 'Lỗi cấp tài khoản');
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsCreatingUser(false));
  };

  // Tính toán thống kê
  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* THANH CÔNG CỤ BÊN TRÁI (SIDEBAR) */}
      <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border flex flex-col justify-between shrink-0">
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Bảng điều khiển Leader</div>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Tổng quan hoạt động
          </button>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'nodes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔗 Quản lý Nodes
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Cấp & Xem tài khoản User
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-indigo-600">Tổng số Nodes hiện có</div>
                <div className="text-3xl font-bold text-indigo-800 mt-2">{nodes.length}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-emerald-600">Tổng lượt truy cập (Clicks)</div>
                <div className="text-3xl font-bold text-emerald-800 mt-2">{totalClicks}</div>
              </div>
            </div>

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
                      <div key={node._id || index} className="bg-gray-50 p-3 rounded-lg border">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">{node.title}</span>
                          <span className="text-indigo-600 font-semibold">{clicks} lượt click</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ NODES */}
        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý các Liên kết (Nodes)</h2>

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
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Mô tả về liên kết..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nhóm / Danh mục (Category)</label>
                  <input
                    type="text"
                    value={nodeForm.category}
                    onChange={(e) => setNodeForm({ ...nodeForm, category: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="VD: Công cụ, Giải trí..."
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isSubmittingNode}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isSubmittingNode ? 'Đang xử lý...' : (editingNodeId ? 'Lưu thay đổi' : 'Thêm Node')}
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
                          <a href={node.url || node.target_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 truncate max-w-xs block hover:underline">
                            {node.url || node.target_url}
                          </a>
                        </td>
                        <td className="p-3 text-gray-600">{node.category || 'Chưa phân loại'}</td>
                        <td className="p-3 font-semibold text-indigo-600">{node.clicks || node.click_count || 0}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleEditNodeClick(node)}
                            className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded text-xs font-medium hover:bg-indigo-100"
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

        {/* TAB 3: CẤP & XEM TÀI KHOẢN USER */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Cấp & Xem tài khoản User</h2>
            
            <form onSubmit={handleCreateUser} className="bg-gray-50 p-4 rounded-xl border space-y-4">
              <h3 className="text-sm font-bold text-gray-700">➕ Cấp tài khoản User mới</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tên tài khoản</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Password..."
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 italic">
                * Tài khoản được tạo sẽ tự động mang quyền hạn cấp độ <b>USER</b>.
              </div>
              <button
                type="submit"
                disabled={isCreatingUser}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isCreatingUser ? 'Đang tạo...' : 'Tạo tài khoản User'}
              </button>
            </form>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-700">Danh sách tài khoản trong hệ thống</h3>
                <button 
                  onClick={fetchUsers} 
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                  🔄 Làm mới
                </button>
              </div>

              <div className="overflow-x-auto">
                {isLoadingUsers ? (
                  <div className="text-center py-8 text-sm text-gray-500">Đang tải danh sách người dùng...</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-xs text-gray-500 bg-gray-50">
                        <th className="p-3">Tên tài khoản</th>
                        <th className="p-3">Vai trò</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="p-4 text-center text-gray-500 italic">Chưa có tài khoản nào.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id || u.id} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-800">{u.username}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                u.role === 'LEADER' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}