import { useState, useEffect, useCallback } from 'react';

export function useAdminLogic(API_BASE) {
  const [nodes, setNodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalClicks: 0, activeNodes: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách Nodes từ API
  const fetchNodes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/nodes`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNodes(data);
        // Cập nhật thống kê nhanh
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

  // Khởi chạy đồng bộ ban đầu
  useEffect(() => {
    fetchNodes();
    fetchUsers();
  }, [fetchNodes, fetchUsers]);

  // Thêm hoặc Cập nhật Node
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

  // Xóa Node
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

  // Tạo tài khoản User mới
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