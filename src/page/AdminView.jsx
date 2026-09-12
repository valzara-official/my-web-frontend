import React, { useState } from 'react';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '🌐',
    url: '',
    status: 'ACTIVE'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/admin/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    }).then(() => {
      refreshNodes();
      setFormData({ title: '', description: '', icon: '🌐', url: '', status: 'ACTIVE' });
    });
  };

  const handleDeleteNode = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhánh này?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/nodes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        alert("Xóa nhánh thành công!");
        refreshNodes();
      }
    } catch (err) {
      console.error("Lỗi khi xóa nhánh:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bảng Quản Lý Admin</h2>
          <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Quyền: ADMIN</span>
        </div>
        <button onClick={handleLogout} className="text-red-600 hover:underline text-sm font-medium">
          Đăng xuất
        </button>
      </div>

      {/* Form Tạo Nhánh */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Tạo Nhánh Điều Hướng Mới</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tên Nhánh"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="p-2 border rounded-md outline-none"
            required
          />
          <input
            type="url"
            placeholder="URL Đích"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
            className="p-2 border rounded-md outline-none"
            required
          />
          <input
            type="text"
            placeholder="Icon Emoji"
            value={formData.icon}
            onChange={e => setFormData({ ...formData, icon: e.target.value })}
            className="p-2 border rounded-md outline-none"
          />
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="p-2 border rounded-md outline-none"
          >
            <option value="ACTIVE">Hiển thị (ACTIVE)</option>
            <option value="INACTIVE">Ẩn (INACTIVE)</option>
          </select>
          <textarea
            placeholder="Mô tả ngắn gọn"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="p-2 border rounded-md outline-none md:col-span-2"
            rows="2"
          ></textarea>
          <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium transition">
            + Thêm Nhánh Mới
          </button>
        </form>
      </div>

      {/* Bảng Danh Sách */}
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
            {nodes.map(node => {
              const nodeId = node._id || node.id;
              return (
                <tr key={nodeId} className="hover:bg-gray-50">
                  <td className="p-4 text-2xl">{node.icon || '🌐'}</td>
                  <td className="p-4 font-semibold">{node.title}</td>
                  <td className="p-4 text-blue-600 truncate max-w-xs">{node.target_url || node.url}</td>
                  <td className="p-4 font-mono">{node.click_count || node.clicks || 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {node.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteNode(nodeId)} className="text-red-600 hover:underline font-medium">
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}