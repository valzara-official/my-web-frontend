// Đường dẫn file: src/components/AdminView.jsx (hoặc đường dẫn thực tế của file AdminView)
import React, { useState, useEffect } from 'react';
import ChartComponent from './chart'; // Đường dẫn tới file chart.jsx của bạn

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

  // Lấy danh sách users thật và tính toán số liệu thống kê
  const fetchUsers = () => {
    fetch(`${API_BASE}/auth/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);

          // 👇 TÍNH TOÁN THẬT DỰA TRÊN DỮ LIỆU TỪ DATABASE
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

  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);

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
      </div>
    </div>
  );
}