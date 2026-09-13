// Đường dẫn file: src/hooks/useAdminLogic.js
import { useState, useEffect } from 'react';

export default function useAdminLogic({ nodes, refreshNodes, API_BASE }) {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [users, setUsers] = useState([]);

  const [systemStats, setSystemStats] = useState({
    onlineUsers: 0,
    avgActiveTime: '0 phút',
    totalAccessTime: '0 giờ'
  });

  const [nodeForm, setNodeForm] = useState({ title: '', url: '', description: '', category: '' });
  const [editingNodeId, setEditingNodeId] = useState(null);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý ẩn/hiện từng danh sách
  const [showSection, setShowSection] = useState({
    admin: true,
    leader: true,
    user: true
  });

  // State cho Modal Thêm / Sửa thành viên
  const [showModal, setShowModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'USER',
    email: '',
    phone: '',
    address: '',
    gender: 'Khác',
    note: ''
  });

  // Lấy danh sách users thật từ DB
  const fetchUsers = () => {
    fetch(`${API_BASE}/auth/users`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);

          const onlineCount = data.filter(u => u.isOnline).length;
          const totalMinutes = data.reduce((acc, u) => acc + (u.totalActiveMinutes || 0), 0);
          const avgMinutes = data.length > 0 ? Math.round(totalMinutes / data.length) : 0;

          setSystemStats({
            onlineUsers: onlineCount,
            avgActiveTime: `${avgMinutes} phút`,
            totalAccessTime: `${(totalMinutes / 60).toFixed(1)} giờ`
          });
        }
      })
      .catch(err => console.error('Lỗi lấy danh sách user:', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Cơ chế Heartbeat thời gian thực: Ping server và làm mới danh sách user mỗi 30 giây
  useEffect(() => {
    fetch(`${API_BASE}/auth/ping`, { method: 'POST', credentials: 'include' }).catch(() => {});

    const interval = setInterval(() => {
      fetch(`${API_BASE}/auth/ping`, { method: 'POST', credentials: 'include' }).catch(() => {});
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [API_BASE]);

  // Xử lý thêm Node
  const handleSaveNode = (e) => {
    e.preventDefault();
    const endpoint = editingNodeId ? `${API_BASE}/admin/nodes/${editingNodeId}` : `${API_BASE}/admin/nodes`;
    const method = editingNodeId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeForm),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data._id || data.id) {
          alert(editingNodeId ? 'Cập nhật node thành công!' : 'Thêm node mới thành công!');
          setNodeForm({ title: '', url: '', description: '', category: '' });
          setEditingNodeId(null);
          refreshNodes();
        } else {
          alert(data.message || 'Có lỗi xảy ra');
        }
      });
  };

  const handleDeleteNode = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa node này?')) return;
    fetch(`${API_BASE}/admin/nodes/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.success) refreshNodes(); });
  };

  // Mở modal Thêm mới
  const handleOpenAddModal = () => {
    setIsEditingUser(false);
    setSelectedUserId(null);
    setShowPassword(false);
    setUserForm({
      username: '',
      password: '',
      role: 'USER',
      email: '',
      phone: '',
      address: '',
      gender: 'Khác',
      note: ''
    });
    setShowModal(true);
  };

  // Mở modal Chỉnh sửa thông tin thành viên
  const handleOpenEditModal = (u) => {
    setIsEditingUser(true);
    setSelectedUserId(u._id);
    setShowPassword(false);
    setUserForm({
      username: u.username || '',
      password: '',
      role: u.role || 'USER',
      email: u.email || '',
      phone: u.phone || '',
      address: u.address || '',
      gender: u.gender || 'Khác',
      note: u.note || ''
    });
    setShowModal(true);
  };

  // Xử lý xóa thành viên
  const handleDeleteUser = (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này không?')) return;

    fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Xóa không thành công');
        return data;
      })
      .then(() => {
        alert('Xóa thành viên thành công!');
        fetchUsers();
      })
      .catch(err => {
        console.error('Lỗi khi xóa user:', err);
        alert(err.message || 'Có lỗi xảy ra khi kết nối đến máy chủ.');
      });
  };

  // Xử lý Lưu Thêm hoặc Sửa thành viên
  const handleSaveUser = (e) => {
    e.preventDefault();

    const endpoint = isEditingUser
      ? `${API_BASE}/auth/users/${selectedUserId}`
      : `${API_BASE}/auth/register`;

    const method = isEditingUser ? 'PUT' : 'POST';

    const payload = { ...userForm };
    if (isEditingUser && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Thực hiện không thành công');
        return data;
      })
      .then(() => {
        alert(isEditingUser ? 'Cập nhật thành viên thành công!' : 'Thêm thành viên thành công!');
        setShowModal(false);
        setShowPassword(false);
        fetchUsers();
      })
      .catch(err => {
        console.error('Lỗi thao tác user:', err);
        alert(err.message || 'Có lỗi xảy ra khi kết nối đến máy chủ.');
      });
  };

  const totalClicks = nodes.reduce((acc, curr) => acc + (curr.clicks || curr.click_count || 0), 0);

  const formatMemberCode = (role, index) => {
    const r = (role || '').toUpperCase();
    let prefix = 'U';
    if (r === 'ADMIN') prefix = 'A';
    else if (r === 'LEADER') prefix = 'L';
    return `${prefix}${String(index + 1).padStart(6, '0')}`;
  };

  const filteredUsers = users.filter(user => {
    const role = (user.role || '').toUpperCase();
    if (role !== 'USER' && role !== 'LEADER' && role !== 'ADMIN') return false;

    const search = searchTerm.toLowerCase();
    return (
      (user.username || '').toLowerCase().includes(search) ||
      (user.email || '').toLowerCase().includes(search) ||
      (user.phone || '').toLowerCase().includes(search) ||
      (user.address || '').toLowerCase().includes(search) ||
      (user.note || '').toLowerCase().includes(search)
    );
  });

  const adminList = filteredUsers.filter(u => (u.role || '').toUpperCase() === 'ADMIN');
  const leaderList = filteredUsers.filter(u => (u.role || '').toUpperCase() === 'LEADER');
  const userList = filteredUsers.filter(u => (u.role || '').toUpperCase() === 'USER');

  return {
    activeTab, setActiveTab,
    users,
    systemStats,
    nodeForm, setNodeForm,
    editingNodeId, setEditingNodeId,
    searchTerm, setSearchTerm,
    showSection, setShowSection,
    showModal, setShowModal,
    isEditingUser,
    showPassword, setShowPassword,
    userForm, setUserForm,
    handleSaveNode, handleDeleteNode,
    handleOpenAddModal, handleOpenEditModal,
    handleDeleteUser, handleSaveUser,
    totalClicks, formatMemberCode,
    adminList, leaderList, userList
  };
}