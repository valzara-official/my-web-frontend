import React from 'react';

export default function LeaderView({ nodes, handleLogout }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trang Quản Lý Nhóm (Leader)</h2>
          <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Quyền: LEADER</span>
        </div>
        <button onClick={handleLogout} className="text-red-600 hover:underline text-sm font-medium">
          Đăng xuất
        </button>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-purple-800 text-sm">
          💡 <strong>Quyền hạn Leader:</strong> Bạn có quyền xem toàn bộ danh sách nhánh và số lượng lượt click để báo cáo. Không có quyền thêm/xóa nhánh.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="p-4">Icon</th>
              <th className="p-4">Tên Nhánh</th>
              <th className="p-4">URL Đích</th>
              <th className="p-4">Lượt Click</th>
              <th className="p-4">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {nodes.map(node => (
              <tr key={node._id || node.id} className="hover:bg-gray-50">
                <td className="p-4 text-2xl">{node.icon || '🌐'}</td>
                <td className="p-4 font-semibold">{node.title}</td>
                <td className="p-4 text-blue-600 truncate max-w-xs">{node.target_url || node.url}</td>
                <td className="p-4 font-mono font-bold text-indigo-600">{node.click_count || node.clicks || 0}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {node.status || 'ACTIVE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}