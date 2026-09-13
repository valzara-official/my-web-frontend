import { useState, useEffect, useCallback } from 'react';

export default function useAdminLogic(rawApiBase) {
  // 🛡️ Xử lý an toàn URL API
  const API_BASE = typeof rawApiBase === 'object' && rawApiBase !== null
    ? (rawApiBase.url || rawApiBase.baseURL || '') 
    : (rawApiBase || '');

  const [nodes, setNodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalClicks: 0, activeNodes: 0, totalUsers: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // 🎛️ Các state giao diện
  const [activeTab, setActiveTab] = useState('overview');
  const [showSection, setShowSection] = useState({
    admin: true,
    leader: true,
    user: true
  });
  const [nodeForm, setNodeForm] = useState({ title: '', url: '' });
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'USER',
    phone: '',
    gender: 'Nam',
    email: '',
    address: '',
    note: ''
  });

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
      } else {
        setNodes([]);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách nodes:', err);
      setNodes([]);
    }
  }, [API_BASE]);

  // Lấy danh sách Users từ API
  const fetchUsers = useCallback(async () => {
    if (!API_BASE) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/auth/users`, { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        setStats(prev => ({ ...prev, totalUsers: data.length }));
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách users:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchNodes();
    fetchUsers();
  }, [fetchNodes, fetchUsers]);

  const saveNode = async (formData, editId) => {
    const targetId = editId !== undefined ? editId : editingNodeId;
    const currentForm = formData || nodeForm;
    const endpoint = targetId 
      ? `${API_BASE}/admin/nodes/${targetId}` 
      : `${API_BASE}/admin/nodes`;
    const method = targetId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentForm),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success || data._id || data.id) {
      await fetchNodes();
      setEditingNodeId(null);
      setNodeForm({ title: '', url: '' });
      return { success: true, message: targetId ? 'Cập nhật node thành công!' : 'Thêm node mới thành công!' };
    }
    return { success: false, message: data.message || 'Có lỗi xảy ra' };
  };

  const handleSaveNode = async (e) => {
    e.preventDefault();
    await saveNode(nodeForm, editingNodeId);
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

  const handleDeleteNode = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa node này?')) {
      await removeNode(id);
    }
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

  const handleOpenAddModal = () => {
    setIsEditingUser(false);
    setUserForm({
      username: '',
      password: '',
      role: 'USER',
      phone: '',
      gender: 'Nam',
      email: '',
      address: '',
      note: ''
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setIsEditingUser(true);
    setUserForm({
      _id: user._id || user.id,
      username: user.username || '',
      password: '',
      role: user.role || 'USER',
      phone: user.phone || '',
      gender: user.gender || 'Nam',
      email: user.email || '',
      address: user.address || '',
      note: user.note || ''
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const endpoint = isEditingUser 
      ? `${API_BASE}/admin/users/${userForm._id}` 
      : `${API_BASE}/auth/create-leader`;
    const method = isEditingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success || data._id || data.id) {
        await fetchUsers();
        setShowModal(false);
      } else {
        alert(data.message || 'Lỗi khi lưu thông tin thành viên');
      }
    } catch (err) {
      console.error('Lỗi lưu user:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        const res = await fetch(`${API_BASE}/admin/users/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          await fetchUsers();
        } else {
          alert(data.message || 'Lỗi khi xóa thành viên');
        }
      } catch (err) {
        console.error('Lỗi xóa user:', err);
      }
    }
  };

  const formatMemberCode = (role, index) => {
    const prefix = role === 'ADMIN' ? 'AD' : role === 'LEADER' ? 'LD' : 'US';
    return `${prefix}${String(index + 1).padStart(3, '0')}`;
  };

  // 🛡️ Đảm bảo an toàn tuyệt đối, luôn trả về mảng dù users chưa tải xong
  const safeUsers = Array.isArray(users) ? users : [];
  const safeNodes = Array.isArray(nodes) ? nodes : [];

  const filteredUsers = safeUsers.filter(u => {
    const term = (searchTerm || '').toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.toLowerCase().includes(term)) ||
      (u.address && u.address.toLowerCase().includes(term)) ||
      (u.note && u.note.toLowerCase().includes(term))
    );
  });

  const adminList = filteredUsers.filter(u => u.role === 'ADMIN');
  const leaderList = filteredUsers.filter(u => u.role === 'LEADER');
  const userList = filteredUsers.filter(u => u.role === 'USER' || !u.role);

  const totalClicks = stats.totalClicks;
  const systemStats = {
    onlineUsers: safeUsers.filter(u => u.isOnline).length,
    avgActiveTime: '15 phút',
    totalAccessTime: `${safeUsers.length * 45} phút`
  };

  return {
    nodes: safeNodes,
    users: safeUsers,
    stats,
    isLoading,
    refreshNodes: fetchNodes,
    refreshUsers: fetchUsers,
    saveNode,
    removeNode,
    createUser,
    activeTab, setActiveTab,
    showSection, setShowSection,
    nodeForm, setNodeForm,
    editingNodeId, setEditingNodeId,
    searchTerm, setSearchTerm,
    showModal, setShowModal,
    isEditingUser,
    showPassword, setShowPassword,
    userForm, setUserForm,
    handleSaveNode, handleDeleteNode,
    handleOpenAddModal, handleOpenEditModal,
    handleDeleteUser, handleSaveUser,
    totalClicks, formatMemberCode,
    adminList, leaderList, userList,
    systemStats
  };
}