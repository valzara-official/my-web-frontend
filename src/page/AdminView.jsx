import React, { useState } from 'react';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const [activeTab, setActiveTab] = useState('nodes'); // 'nodes' hoặc 'leaders'
  
  // State form thêm Node mới
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  // State form tạo tài khoản Leader
  const [leaderUsername, setLeaderUsername] = useState('');
  const [leaderPassword, setLeaderPassword] = useState('');

  // Xử lý tạo Node mới
  const handleCreateNode = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/admin/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, icon, url, status }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Thêm nhánh thành công!');
          setTitle('');
          setDescription('');
          setIcon('');
          setUrl('');
          refreshNodes();
        } else {
          alert(data.message || 'Thêm thất bại!');
        }
      })
      .catch(err => console.error('Lỗi tạo node:', err));
  };

  // Xử lý xóa Node
  const handleDeleteNode = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhánh này không?')) return;

    fetch(`${API_BASE}/admin/nodes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Xóa thành công!');
          refreshNodes();
        } else {
          alert(data.message || 'Xóa thất bại!');
        }
      })
      .catch(err => console.error('Lỗi xóa node:', err));
  };

  // Xử lý tạo tài khoản Leader
  const handleCreateLeader = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/auth/create-leader`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: leaderUsername, password: leaderPassword }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Tạo tài khoản Leader thành công!');
          setLeaderUsername('');
          setLeaderPassword('');
        } else {
          alert(data.message || 'Tạo Leader thất bại!');
        }
      })
      .catch(err => console.error('Lỗi tạo leader:', err));
  };

  // Tính toán thống kê nhanh
  const totalClicks = nodes.reduce((sum, node) => sum + (node.click_count || 0), 0);
  const activeNodesCount = nodes.filter(n => n.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header Dashboard & Đăng xuất */}
      <div className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">⚡ Quản Trị Hệ Thống (Admin Dashboard)</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý toàn bộ danh mục điều hướng và phân quyền hệ thống</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          Đăng xuất
        </button>
      </div>

      {/* Thống kê nhanh (Widgets) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tổng số Nhánh</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{nodes.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl font-bold">📂</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Nhánh đang hoạt động</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">{activeNodesCount}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-xl font-bold">🟢</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tổng lượt Click truy cập</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{totalClicks}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg text-xl font-bold">🖱️</div>
        </div>
      </div>

      {/* Thanh Menu Chuyển Tab */}
      <div className="flex space-x-2 border-b pb-2">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'nodes' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'
          }`}
        >
          Quản lý Danh Mục (Nodes)
        </button>
        <button
          onClick={() => setActiveTab('leaders')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'leaders' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'
          }`}
        >
          Cấp Tài Khoản Leader
        </button>
      </div>

      {/* TAB 1: QUẢN LÝ NODES (Thêm mới & Danh sách) */}
      {activeTab === 'nodes' && (
        <div className="space-y-6">
          {/* Form Thêm Nhánh */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ Thêm Nhánh Điều Hướng Mới</h3>
            <form onSubmit={handleCreateNode} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Công cụ AI..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Đường dẫn URL đích</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả chức năng nhánh..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon (Emoji/URL)</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="🚀"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active (Hiển thị)</option>
                    <option value="INACTIVE">Inactive (Ẩn)</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Lưu Nhánh Mới
                </button>
              </div>
            </form>
          </div>

          {/* Bảng Danh Sách Nodes */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">
              📋 Danh Sách Tất Cả Các Nhánh ({nodes.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100 text-xs uppercase text-gray-600 font-semibold">
                    <th className="p-3">Icon & Tiêu đề</th>
                    <th className="p-3">Mô tả</th>
                    <th className="p-3">URL</th>
                    <th className="p-3 text-center">Trạng thái</th>
                    <th className="p-3 text-center">Lượt Click</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {nodes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">Chưa có dữ liệu nhánh nào.</td>
                    </tr>
                  ) : (
                    nodes.map((node) => (
                      <tr key={node._id || node.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-medium flex items-center space-x-2">
                          <span className="text-xl">{node.icon || '🔗'}</span>
                          <span>{node.title}</span>
                        </td>
                        <td className="p-3 text-gray-600 truncate max-w-xs">{node.description || '---'}</td>
                        <td className="p-3 text-blue-600 truncate max-w-xs">
                          <a href={node.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {node.url}
                          </a>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            node.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {node.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-600">{node.click_count || 0}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteNode(node._id || node.id)}
                            className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-red-100 transition"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CẤP TÀI KHOẢN LEADER */}
      {activeTab === 'leaders' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🛡️ Tạo Tài Khoản Quản Lý Nhóm (Leader)</h3>
          <p className="text-sm text-gray-500 mb-6">Tài khoản Leader sẽ có quyền truy cập vào bảng điều khiển quản lý và theo dõi số liệu chung.</p>
          
          <form onSubmit={handleCreateLeader} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên tài khoản Leader</label>
              <input
                type="text"
                value={leaderUsername}
                onChange={e => setLeaderUsername(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập username leader..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu khởi tạo</label>
              <input
                type="password"
                value={leaderPassword}
                onChange={e => setLeaderPassword(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Tạo Tài Khoản Leader
            </button>
          </form>
        </div>
      )}
    </div>
  );
}