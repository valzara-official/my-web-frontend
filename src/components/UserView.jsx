import React from 'react';

export default function UserView({ nodes, onNodeClick, handleLogout }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Không Gian Làm Việc Thành Viên</h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">Quyền: USER</span>
        </div>
        <button onClick={handleLogout} className="text-red-600 hover:underline text-sm font-medium">
          Đăng xuất
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nodes.filter(n => n.status === 'ACTIVE').map((node) => (
          <div
            key={node._id || node.id}
            onClick={() => onNodeClick(node)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition flex items-start space-x-4 group"
          >
            <div className="text-4xl p-3 bg-blue-50 rounded-lg group-hover:scale-110 transition-transform">
              {node.icon || '🌐'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {node.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{node.description}</p>
              <div className="mt-3 flex justify-between items-center text-xs text-blue-500 font-medium">
                <span>Truy cập dịch vụ &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}