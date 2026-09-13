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

  // State cho Modal Thêm / Sửa thành viên
  const [showModal, setShowModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'USER',
    email: '',
    phone: '',
    address: '',
    gender: 'Khác',
    note: ''
  });

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

  // Mở modal Thêm mới
  const handleOpenAddModal = () => {
    setIsEditingUser(false);
    setSelectedUserId(null);
    setShowPassword(false);
    setUserForm({
      username: '',
      password: '',
      role: 'USER',
      email: '',
      phone: '',
      address: '',
      gender: 'Khác',
      note: ''
    });
    setShowModal(true);
  };

  // Mở modal Chỉnh sửa thông tin thành viên
  const handleOpenEditModal = (u) => {
    setIsEditingUser(true);
    setSelectedUserId(u._id);
    setShowPassword(false);
    setUserForm({
      username: u.username || '',
      password: '', // Để trống nếu không muốn đổi mật khẩu
      role: u.role || 'USER',
      email: u.email || '',
      phone: u.phone || '',
      address: u.address || '',
      gender: u.gender || 'Khác',
      note: u.note || ''
    });
    setShowModal(true);
  };

  // Xử lý xóa thành viên
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này không?')) {
      return;
    }

    fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Xóa không thành công');
        }
        return data;
      })
      .then(data => {
        alert('Xóa thành viên thành công!');
        fetchUsers(); // Tải lại danh sách sau khi xóa
      })
      .catch(err => {
        console.error('Lỗi khi xóa user:', err);
        alert(err.message || 'Có lỗi xảy ra khi kết nối đến máy chủ.');
      });
  };

  // Xử lý Lưu Thêm hoặc Sửa thành viên
  const handleSaveUser = (e) => {
    e.preventDefault();
    
    const endpoint = isEditingUser 
      ? `${API_BASE}/auth/users/${selectedUserId}` 
      : `${API_BASE}/auth/register`; 
      
    const method = isEditingUser ? 'PUT' : 'POST';

    const payload = { ...userForm };
    if (isEditingUser && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Thực hiện không thành công');
        }
        return data;
      })
      .then(data => {
        alert(isEditingUser ? 'Cập nhật thành viên thành công!' : 'Thêm thành viên thành công!');
        setShowModal(false);
        setShowPassword(false);
        fetchUsers();
      })
      .catch(err => {
        console.error('Lỗi thao tác user:', err);
        alert(err.message || 'Có lỗi xảy ra khi kết nối đến máy chủ.');
      });
  };

  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);

  const formatMemberCode = (role, index) => {
    const prefix = (role || '').toUpperCase() === 'LEADER' ? 'L' : 'U';
    return `${prefix}${String(index + 1).padStart(6, '0')}`;
  };

  const filteredUsers = users.filter(user => {
    const role = (user.role || '').toUpperCase();
    if (role !== 'USER' && role !== 'LEADER') return false;

    const search = searchTerm.toLowerCase();
    const username = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || '').toLowerCase();
    const address = (user.address || '').toLowerCase();
    const note = (user.note || '').toLowerCase();

    return username.includes(search) || 
           email.includes(search) || 
           phone.includes(search) || 
           address.includes(search) || 
           note.includes(search);
  });

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

        {/* TAB QUẢN LÝ USER & LEADER */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">👥 Quản lý Thành viên</h2>
                <p className="text-sm text-gray-500">Phân loại, tìm kiếm và quản lý chi tiết thông tin Leader và User.</p>
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

            {/* BẢNG 1: DANH SÁCH LEADER */}
            <div className="space-y-3">
              <h3 className="text-md font-bold text-purple-700 flex items-center gap-2">
                👑 Danh sách Leader ({leaderList.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                  <thead className="bg-purple-50">
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
                    {leaderList.length > 0 ? (
                      leaderList.map((u, idx) => (
                        <tr key={u._id || idx} className="hover:bg-purple-50/30">
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
                    {userList.length > 0 ? (
                      userList.map((u, idx) => (
                        <tr key={u._id || idx} className="hover:bg-blue-50/30">
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
            </div>

          </div>
        )}
      </div>
    </div>
  );
}