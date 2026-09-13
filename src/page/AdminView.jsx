// Đường dẫn file: src/components/AdminView.jsx
import React, { useState, useEffect } from 'react';
import ChartComponent from './chart';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [users, setUsers] = useState([]);
  
  const [systemStats, setSystemStats] = useState({
    onlineUsers: 0,
    avgActiveTime: '0 phút',
    totalAccessTime: '0 giờ'
  });

  const [nodeForm, setNodeForm] = useState({ title: '', url: '', description: '', category: '' });
  const [editingNodeId, setEditingNodeId] = useState(null);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State cho form thêm thành viên mới
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'USER',
    email: '',
    phone: ''
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Lấy danh sách users thật từ DB
  const fetchUsers = () => {
    fetch(`${API_BASE}/auth/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);

          const onlineCount = data.filter(u => u.isOnline).length;
          const totalMinutes = data.reduce((acc, u) => acc + (u.totalActiveMinutes || 0), 0);
          const avgMinutes = data.length > 0 ? Math.round(totalMinutes / data.length) : 0;

          setSystemStats({
            onlineUsers: onlineCount,
            avgActiveTime: `${avgMinutes} phút`,
            totalAccessTime: `${(totalMinutes / 60).toFixed(1)} giờ`
          });
        }
      })
      .catch(err => console.error('Lỗi lấy danh sách user:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý thêm Node
  const handleSaveNode = (e) => {
    e.preventDefault();
    const endpoint = editingNodeId ? `${API_BASE}/admin/nodes/${editingNodeId}` : `${API_BASE}/admin/nodes`;
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
      });
  };

  const handleDeleteNode = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa node này?')) return;
    fetch(`${API_BASE}/admin/nodes/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.success) refreshNodes(); });
  };

  // Xử lý thêm thành viên mới
  const handleCreateUser = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/auth/register`, { // Hoặc endpoint đăng ký/tạo user tương ứng của bạn
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.userId || data._id) {
          alert('Thêm thành viên thành công!');
          setUserForm({ username: '', password: '', role: 'USER', email: '', phone: '' });
          setShowAddUserModal(false);
          fetchUsers();
        } else {
          alert(data.message || 'Không thể tạo thành viên.');
        }
      })
      .catch(err => {
        console.error('Lỗi tạo user:', err);
        alert('Có lỗi xảy ra khi kết nối đến máy chủ.');
      });
  };

  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);

  // Hàm tạo mã định danh tùy chỉnh từ ID hoặc Index (VD: L000001, U000001)
  const formatMemberCode = (role, index, id) => {
    const prefix = (role || '').toUpperCase() === 'LEADER' ? 'L' : 'U';
    // Nếu có ID mongoDB, lấy 6 ký tự cuối hoặc dùng index + 1
    const numericPart = String(index + 1).padStart(6, '0');
    return `${prefix}${numericPart}`;
  };

  // Lọc danh sách theo từ khóa tìm kiếm (Tên, Mã, Email, SĐT)
  const filteredUsers = users.filter(user => {
    const role = (user.role || '').toUpperCase();
    if (role !== 'USER' && role !== 'LEADER') return false; // Chỉ lấy User và Leader

    const search = searchTerm.toLowerCase();
    const username = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || '').toLowerCase();
    const code = (user.code || '').toLowerCase();

    return username.includes(search) || email.includes(search) || phone.includes(search) || code.includes(search);
  });

  // Tách ra 2 danh sách riêng biệt
  const leaderList = filteredUsers.filter(u => (u.role || '').toUpperCase() === 'LEADER');
  const userList = filteredUsers.filter(u => (u.role || '').toUpperCase() === 'USER');

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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Tổng quan hoạt động hệ thống</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-blue-600">Tổng số Nodes hiện có</div>
                <div className="text-3xl font-bold text-blue-800 mt-2">{nodes.length}</div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-emerald-600">Tổng lượt truy cập (Clicks)</div>
                <div className="text-3xl font-bold text-emerald-800 mt-2">{totalClicks}</div>
              </div>

              <div className="bg-purple-50 border border-purple-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-purple-600">Tổng số Users</div>
                <div className="text-3xl font-bold text-purple-800 mt-2">{users.length}</div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-amber-600">Số User đang Online</div>
                <div className="text-3xl font-bold text-amber-800 mt-2">{systemStats.onlineUsers}</div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-indigo-600">Thời gian hoạt động TB / User</div>
                <div className="text-3xl font-bold text-indigo-800 mt-2">{systemStats.avgActiveTime}</div>
              </div>

              <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl">
                <div className="text-sm font-medium text-rose-600">Tổng thời gian truy cập hệ thống</div>
                <div className="text-3xl font-bold text-rose-800 mt-2">{systemStats.totalAccessTime}</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Biểu đồ thống kê chi tiết</h3>
              <div className="bg-gray-50 p-4 rounded-xl border">
                <ChartComponent nodes={nodes} users={users} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Quản lý các Liên kết (Nodes)</h2>
            <form onSubmit={handleSaveNode} className="bg-gray-50 p-4 rounded-xl border space-y-4">
              <h3 className="text-sm font-bold text-gray-700">{editingNodeId ? '✏️ Chỉnh sửa Node' : '➕ Thêm Node mới'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={nodeForm.title} onChange={(e) => setNodeForm({ ...nodeForm, title: e.target.value })} required className="border rounded-lg px-3 py-2 text-sm" placeholder="Tiêu đề Node" />
                <input type="url" value={nodeForm.url} onChange={(e) => setNodeForm({ ...nodeForm, url: e.target.value })} required className="border rounded-lg px-3 py-2 text-sm" placeholder="https://example.com" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">{editingNodeId ? 'Lưu thay đổi' : 'Thêm Node'}</button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b text-xs text-gray-500 bg-gray-50"><th className="p-3">Tiêu đề</th><th className="p-3">Clicks</th><th className="p-3 text-right">Hành động</th></tr></thead>
                <tbody className="divide-y text-sm">
                  {nodes.map(node => (
                    <tr key={node._id || node.id}>
                      <td className="p-3">{node.title}</td>
                      <td className="p-3">{node.clicks || node.click_count || 0}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => { setEditingNodeId(node._id || node.id); setNodeForm({ title: node.title, url: node.url || node.target_url }); }} className="text-blue-600 mr-2">Sửa</button>
                        <button onClick={() => handleDeleteNode(node._id || node.id)} className="text-red-600">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 👇 TAB QUẢN LÝ USER & LEADER (TÁCH 2 BẢNG + TÌM KIẾM + THÊM THÀNH VIÊN) */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">👥 Quản lý Thành viên</h2>
                <p className="text-sm text-gray-500">Phân loại, tìm kiếm và quản lý chi tiết thông tin tài khoản Leader và User.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
              >
                ➕ Thêm thành viên mới
              </button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="bg-gray-50 p-4 rounded-xl border">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo Tên tài khoản, Mã (L00xxxx/U00xxxx), Email hoặc Số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modal / Form thêm thành viên */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-800">➕ Thêm thành viên mới</h3>
                    <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                  </div>
                  <form onSubmit={handleCreateUser} className="space-y-4">
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu *</label>
                      <input
                        type="password"
                        required
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="Nhập mật khẩu..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Chức vụ (Role) *</label>
                        <select
                          value={userForm.role}
                          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                        >
                          <option value="USER">USER</option>
                          <option value="LEADER">LEADER</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                          type="text"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          placeholder="Nhập số điện thoại..."
                        />
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
                    <div className="flex justify-end gap-3 pt-3 border-t">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Tạo tài khoản
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* BẢNG 1: DANH SÁCH LEADER */}
            <div className="space-y-3">
              <h3 className="text-md font-bold text-purple-700 flex items-center gap-2">
                👑 Danh sách Leader ({leaderList.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase">Mã ĐD</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase">Tên tài khoản</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase">Email / SĐT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase">Hoạt động</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
                    {leaderList.length > 0 ? (
                      leaderList.map((u, idx) => (
                        <tr key={u._id || idx} className="hover:bg-purple-50/30">
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold text-purple-600">
                            {u.code || formatMemberCode('LEADER', idx, u._id)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                            <div>{u.email || 'Chưa cập nhật'}</div>
                            <div className="text-xs text-gray-400">{u.phone || ''}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                              u.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {u.isOnline ? '🟢 Online' : '⚪ Offline'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{u.totalActiveMinutes || 0} phút</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-400 italic">
                          Không tìm thấy Leader nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BẢNG 2: DANH SÁCH USER */}
            <div className="space-y-3 pt-4">
              <h3 className="text-md font-bold text-blue-700 flex items-center gap-2">
                👤 Danh sách User ({userList.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Mã ĐD</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Tên tài khoản</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Email / SĐT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Hoạt động</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
                    {userList.length > 0 ? (
                      userList.map((u, idx) => (
                        <tr key={u._id || idx} className="hover:bg-blue-50/30">
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs font-bold text-blue-600">
                            {u.code || formatMemberCode('USER', idx, u._id)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                            <div>{u.email || 'Chưa cập nhật'}</div>
                            <div className="text-xs text-gray-400">{u.phone || ''}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                              u.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {u.isOnline ? '🟢 Online' : '⚪ Offline'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-600">{u.totalActiveMinutes || 0} phút</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-400 italic">
                          Không tìm thấy User nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}