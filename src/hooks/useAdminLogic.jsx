import { useState, useEffect, useCallback } from 'react';

export default function useAdminLogic(rawApiBase) {
  // 🛡️ Xử lý an toàn: Nếu lỡ truyền nhầm object, cố gắng lấy thuộc tính URL hoặc gán về string rỗng
  const API_BASE = typeof rawApiBase === 'object' && rawApiBase !== null
    ? (rawApiBase.url || rawApiBase.baseURL || '') 
    : (rawApiBase || '');

  const [nodes, setNodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalClicks: 0, activeNodes: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách Nodes từ API
  const fetchNodes = useCallback(async () => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/nodes`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNodes(data);
        const totalClicks = data.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);
        const activeNodes = data.filter(n => (n.status ? n.status === 'ACTIVE' : true)).length;
        setStats(prev => ({ ...prev, totalClicks, activeNodes }));
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách nodes:', err);
    }
  }, [API_BASE]);

  // Lấy danh sách Users từ API (Yêu cầu quyền Admin/Leader)
  const fetchUsers = useCallback(async () => {
    if (!API_BASE) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/auth/users`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        setStats(prev => ({ ...prev, totalUsers: data.length }));
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchNodes();
    fetchUsers();
  }, [fetchNodes, fetchUsers]);

  const saveNode = async (nodeForm, editingNodeId) => {
    const endpoint = editingNodeId 
      ? `${API_BASE}/admin/nodes/${editingNodeId}` 
      : `${API_BASE}/admin/nodes`;
    const method = editingNodeId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeForm),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success || data._id || data.id) {
      await fetchNodes();
      return { success: true, message: editingNodeId ? 'Cập nhật node thành công!' : 'Thêm node mới thành công!' };
    }
    return { success: false, message: data.message || 'Có lỗi xảy ra' };
  };

  const removeNode = async (id) => {
    const res = await fetch(`${API_BASE}/admin/nodes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      await fetchNodes();
      return { success: true };
    }
    return { success: false, message: data.message || 'Lỗi khi xóa node' };
  };

  const createUser = async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/create-leader`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'USER' }),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      await fetchUsers();
      return { success: true, message: 'Cấp tài khoản User thành công!' };
    }
    return { success: false, message: data.message || 'Lỗi cấp tài khoản' };
  };

  return {
    nodes,
    users,
    stats,
    isLoading,
    refreshNodes: fetchNodes,
    refreshUsers: fetchUsers,
    saveNode,
    removeNode,
    createUser,
  };
}