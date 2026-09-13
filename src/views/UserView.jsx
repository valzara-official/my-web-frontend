import React from 'react';

export default function UserView({ user, nodes, onNodeClick, handleLogout }) {
  const activeNodes = nodes.filter(node => !node.status || node.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* USER WELCOME HEADER */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
              {user?.role || 'USER'}
            </span>
            <span className="text-xs text-gray-400">Trạng thái: Đang hoạt động</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Xin chào, <span className="text-indigo-600">{user?.username || 'Thành viên'}</span>!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Dưới đây là các dịch vụ và công cụ bạn có quyền truy cập nhanh.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition"
        >
          Đăng xuất hệ thống
        </button>
      </div>

      {/* NODES / SERVICES GRID FOR USER */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🔗</span> Danh sách dịch vụ khả dụng ({activeNodes.length})
          </h2>
        </div>

        {activeNodes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center space-y-3 shadow-sm">
            <div className="text-4xl">📭</div>
            <p className="text-gray-500 text-sm font-medium">Hiện chưa có dịch vụ nào khả dụng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeNodes.map((node) => (
              <div
                key={node._id || node.id}
                onClick={() => onNodeClick(node)}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-500 cursor-pointer transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl p-3 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform inline-block">
                      {node.icon || '🌐'}
                    </span>
                    {node.category && (
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                        {node.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {node.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1.5 line-clamp-2">
                    {node.description || 'Chưa có mô tả chi tiết cho dịch vụ này.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-indigo-600 font-semibold">
                  <span className="truncate max-w-[180px] text-gray-400 font-normal">{node.url || node.target_url}</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-block">Truy cập ngay &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}