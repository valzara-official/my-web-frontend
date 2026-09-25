import React from 'react';

export default function NodesTab({
  nodes,
  nodeForm, setNodeForm,
  editingNodeId, setEditingNodeId,
  handleSaveNode, handleDeleteNode
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Quản lý các Liên kết (Nodes)</h2>
      <form onSubmit={handleSaveNode} className="bg-gray-50 p-4 rounded-xl border space-y-4">
        <h3 className="text-sm font-bold text-gray-700">{editingNodeId ? '✏️ Chỉnh sửa Node' : '➕ Thêm Node mới'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" value={nodeForm.title} onChange={(e) => setNodeForm({ ...nodeForm, title: e.target.value })} required className="border rounded-lg px-3 py-2 text-sm bg-white" placeholder="Tiêu đề Node" />
          <input type="url" value={nodeForm.url} onChange={(e) => setNodeForm({ ...nodeForm, url: e.target.value })} required className="border rounded-lg px-3 py-2 text-sm bg-white" placeholder="https://example.com" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            {editingNodeId ? 'Lưu thay đổi' : 'Thêm Node'}
          </button>
          {editingNodeId && (
            <button 
              type="button" 
              onClick={() => { setEditingNodeId(null); setNodeForm({ title: '', url: '' }); }} 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-xs text-gray-500 bg-gray-50">
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Clicks</th>
              <th className="p-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {nodes?.map((node, idx) => (
              <tr key={node._id || node.id || idx}>
                <td className="p-3 font-medium text-gray-800">{node.title}</td>
                <td className="p-3 text-gray-600">{node.clicks || node.click_count || 0}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => { setEditingNodeId(node._id || node.id); setNodeForm({ title: node.title, url: node.url || node.target_url }); }} className="text-blue-600 hover:underline font-medium">Sửa</button>
                  <button onClick={() => handleDeleteNode(node._id || node.id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
