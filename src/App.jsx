import React, { useState, useEffect } from 'react';

// Tự động lấy URL từ file .env hoặc Vercel, nếu không có sẽ lấy fallback Render
const API_BASE = import.meta.env?.VITE_API_URL;

export default function App() {
  const [view, setView] = useState('INDEX'); // 'INDEX' | 'LOGIN' | 'ADMIN'
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (view === 'INDEX') {
      fetch(`${API_BASE}/public/nodes`)
        .then(res => res.json())
        .then(data => setNodes(data))
        .catch(err => console.error('Lỗi kết nối API:', err));
    } else if (view === 'ADMIN' && token) {
      fetchAdminNodes();
    }
  }, [view, token]);

  const fetchAdminNodes = () => {
    fetch(`${API_BASE}/admin/nodes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setNodes(data))
      .catch(err => console.error(err));
  };

  const handleNodeClick = (node) => {
    fetch(`${API_BASE}/public/nodes/${node.id}/click`, { method: 'POST' });
    window.open(node.target_url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header Navigation */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1 
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => setView('INDEX')}
        >
          🌐 Navigation Portal
        </h1>
        <div>
          {view === 'INDEX' && (
            <button
              onClick={() => setView(token ? 'ADMIN' : 'LOGIN')}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
            >
              {token ? 'Trang Admin' : 'Đăng nhập Admin'}
            </button>
          )}
          {view !== 'INDEX' && (
            <button
              onClick={() => setView('INDEX')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
            >
              Về Trang Chủ
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        {view === 'INDEX' && <IndexView nodes={nodes} onNodeClick={handleNodeClick} />}
        {view === 'LOGIN' && <LoginView setToken={setToken} setView={setView} />}
        {view === 'ADMIN' && (
          <AdminView 
            token={token} 
            nodes={nodes} 
            refreshNodes={fetchAdminNodes} 
            setToken={setToken} 
            setView={setView} 
          />
        )}
      </div>
    </div>
  );
}

// 1. TRANG INDEX (Dành cho người dùng)
function IndexView({ nodes, onNodeClick }) {
  return (
    <div>
      <div className="text-center my-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Cổng Điều Hướng Hệ Thống</h2>
        <p className="text-gray-500 mt-2">Chọn các dịch vụ hoặc phân hệ cần truy cập bên dưới</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => onNodeClick(node)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition flex items-start space-x-4 group"
          >
            <div className="text-4xl p-3 bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
              {node.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {node.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{node.description}</p>
              <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span className="text-blue-500 font-medium">Truy cập ngay &rarr;</span>
                <span>{node.click_count} lượt click</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. TRANG ĐĂNG NHẬP ADMIN
function LoginView({ setToken, setView }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('admin_token', data.token);
          setToken(data.token);
          setView('ADMIN');
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng Nhập Admin</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="admin"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="admin123"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Đăng Nhập
        </button>
      </form>
    </div>
  );
}

// 3. TRANG ADMIN (Quản lý các Nhánh)
function AdminView({ token, nodes, refreshNodes, setToken, setView }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '🌐',
    target_url: '',
    status: 'ACTIVE'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/admin/nodes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    }).then(() => {
      refreshNodes();
      setFormData({ title: '', description: '', icon: '🌐', target_url: '', status: 'ACTIVE' });
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhánh này?')) {
      fetch(`${API_BASE}/admin/nodes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => refreshNodes());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setView('INDEX');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bảng Quản Lý Các Nhánh</h2>
        <button 
          onClick={handleLogout} 
          className="text-red-600 hover:underline text-sm font-medium"
        >
          Đăng xuất
        </button>
      </div>

      {/* Form Tạo Nhánh Mới */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Tạo Nhánh Điều Hướng Mới</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tên Nhánh (VD: Cửa Hàng Online)"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="p-2 border rounded-md outline-none focus:border-blue-500"
            required
          />
          <input
            type="url"
            placeholder="URL Đích (https://example.com)"
            value={formData.target_url}
            onChange={e => setFormData({ ...formData, target_url: e.target.value })}
            className="p-2 border rounded-md outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Icon Emoji (VD: 🛒)"
            value={formData.icon}
            onChange={e => setFormData({ ...formData, icon: e.target.value })}
            className="p-2 border rounded-md outline-none focus:border-blue-500"
          />
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="p-2 border rounded-md outline-none focus:border-blue-500"
          >
            <option value="ACTIVE">Hiển thị (ACTIVE)</option>
            <option value="INACTIVE">Ẩn (INACTIVE)</option>
          </select>
          <textarea
            placeholder="Mô tả ngắn gọn về nhánh"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="p-2 border rounded-md outline-none focus:border-blue-500 md:col-span-2"
            rows="2"
          ></textarea>
          <button
            type="submit"
            className="md:col-span-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium transition"
          >
            + Thêm Nhánh Mới
          </button>
        </form>
      </div>

      {/* Danh sách các nhánh đã tạo */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="p-4">Icon</th>
              <th className="p-4">Tên Nhánh</th>
              <th className="p-4">URL Đích</th>
              <th className="p-4">Lượt Click</th>
              <th className="p-4">Trạng Thái</th>
              <th className="p-4">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {nodes.map(node => (
              <tr key={node.id} className="hover:bg-gray-50">
                <td className="p-4 text-2xl">{node.icon}</td>
                <td className="p-4 font-semibold">{node.title}</td>
                <td className="p-4 text-blue-600 truncate max-w-xs">{node.target_url}</td>
                <td className="p-4 font-mono">{node.click_count}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    node.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {node.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(node.id)}
                    className="text-red-600 hover:underline font-medium"
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
  );
}