import React from 'react';

export default function IndexView({ nodes, onNodeClick }) {
  return (
    <div>
      <div className="text-center my-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Cổng Điều Hướng Hệ Thống</h2>
        <p className="text-gray-500 mt-2">Chọn các dịch vụ hoặc phân hệ cần truy cập bên dưới</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {nodes.map((node) => (
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
              <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span className="text-blue-500 font-medium">Truy cập ngay &rarr;</span>
                <span>{node.click_count || node.clicks || 0} lượt click</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}