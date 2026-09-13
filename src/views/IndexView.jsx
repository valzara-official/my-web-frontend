import React from 'react';

export default function IndexView({ nodes, onNodeClick, onOpenAuth }) {
  const activeNodes = nodes.filter(node => !node.status || node.status === 'ACTIVE');

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white shadow-lg flex flex-col items-center text-center">
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold mb-4 backdrop-blur-sm">
          🚀 Nền tảng quản lý & chia sẻ liên kết
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl">
          Truy cập nhanh chóng mọi dịch vụ và công cụ trực tuyến
        </h1>
        <p className="text-indigo-100 mt-4 max-w-xl text-sm md:text-base">
          Hệ thống lưu trữ các liên kết thông minh, phân quyền an toàn, hỗ trợ quản lý tài nguyên mượt mà cho đội ngũ của bạn.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={onOpenAuth}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-50 transition transform hover:-translate-y-0.5"
          >
            Đăng nhập hệ thống
          </button>
        </div>
      </div>

      {/* PUBLIC NODES / SERVICES GRID */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📌</span> Danh sách dịch vụ & công cụ nổi bật
          </h2>
          <span className="text-xs text-gray-500 font-medium">({activeNodes.length} khả dụng)</span>
        </div>

        {activeNodes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center space-y-3 shadow-sm">
            <div className="text-4xl">📭</div>
            <p className="text-gray-500 text-sm font-medium">Chưa có dịch vụ hoặc liên kết nào được công khai.</p>
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