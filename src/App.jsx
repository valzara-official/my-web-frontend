// Đường dẫn file: src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import IndexView from './components/IndexView';
import AuthView from './components/AuthView';
import AdminView from './components/AdminView';
import LeaderView from './components/LeaderView';
import UserView from './components/UserView';

const getApiBase = () => {
  const envUrl = import.meta.env?.VITE_API_URL || 'https://my-web-backend-i49k.onrender.com';
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE = getApiBase();

export default function App() {
  const [view, setView] = useState(() => localStorage.getItem('current_view') || 'INDEX');
  const [authMode, setAuthMode] = useState('LOGIN');
  const [nodes, setNodes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('user_role') || 'USER');
  
  // 🌟 Thêm state lưu thông tin user hiện tại để hiển thị tên lên Navbar
  const [currentUser, setCurrentUser] = useState(null);

  const changeView = (newView) => {
    setView(newView);
    localStorage.setItem('current_view', newView);
  };

  // Kiểm tra phiên làm việc khi load hoặc refresh trang
  useEffect(() => {
    const savedView = localStorage.getItem('current_view') || 'INDEX';

    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Hỗ trợ cả 2 dạng trả về từ backend: data.success hoặc trả thẳng object user / data.user
        const userData = data.user || (data.success ? data : null);
        
        if (userData && (userData._id || userData.id || userData.username)) {
          setIsLoggedIn(true);
          setCurrentUser(userData);
          const role = userData.role || 'USER';
          setUserRole(role);
          localStorage.setItem('user_role', role);

          if (['ADMIN', 'LEADER', 'USER', 'AUTH'].includes(savedView) && savedView !== 'INDEX') {
            changeView(role);
          }
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
          localStorage.removeItem('user_role');
          if (['ADMIN', 'LEADER', 'USER'].includes(savedView)) {
            changeView('AUTH');
          }
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
      });
  }, []);

  // 🌟 VÒNG LẶP HEARTBEAT: Sửa lại gọi đúng route hoặc bắt lỗi ngầm nếu backend chưa có
  useEffect(() => {
    if (!isLoggedIn) return;

    const sendHeartbeat = () => {
      // Thử gọi /auth/ping hoặc /auth/heartbeat tuỳ theo backend hỗ trợ route nào
      fetch(`${API_BASE}/auth/ping`, {
        method: 'POST',
        credentials: 'include'
      }).catch(() => {
        // Fallback sang heartbeat nếu ping lỗi
        fetch(`${API_BASE}/auth/heartbeat`, {
          method: 'POST',
          credentials: 'include'
        }).catch(() => {});
      });
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Hàm gọi API lấy danh sách Node cho Admin / Leader
  const fetchDashboardNodes = useCallback(() => {
    const endpoint = userRole === 'ADMIN' ? `${API_BASE}/admin/nodes` : `${API_BASE}/public/nodes`;

    fetch(endpoint, { credentials: 'include' })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          setIsLoggedIn(false);
          setCurrentUser(null);
          localStorage.removeItem('user_role');
          changeView('AUTH');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNodes(data);
        } else {
          setNodes([]);
        }
      })
      .catch(err => {
        console.error('Lỗi lấy danh sách nodes quản trị:', err);
        setNodes([]);
      });
  }, [userRole]);

  // Tải dữ liệu các nhánh tự động dựa theo View hiện tại
  useEffect(() => {
    if (view === 'INDEX' || view === 'USER') {
      fetch(`${API_BASE}/public/nodes`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNodes(data);
          else setNodes([]);
        })
        .catch(err => {
          console.error(err);
          setNodes([]);
        });
    } else if (view === 'ADMIN' || view === 'LEADER') {
      fetchDashboardNodes();
    }
  }, [view, fetchDashboardNodes]);

  const handleNodeClick = (node) => {
    const nodeId = node._id || node.id;
    fetch(`${API_BASE}/public/nodes/${nodeId}/click`, { method: 'POST' })
      .catch(err => console.error('Lỗi tăng lượt click:', err));
    window.open(node.target_url || node.url, '_blank');
  };

  const handleLogout = () => {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' })
      .catch(err => console.error('Lỗi đăng xuất:', err))
      .finally(() => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserRole('USER');
        setNodes([]);
        localStorage.removeItem('user_role');
        localStorage.removeItem('current_view');
        changeView('INDEX');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => changeView('INDEX')}
        >
          🌐 Navigation Portal
        </h1>

        <div className="flex space-x-3 items-center">
          {view === 'INDEX' && !isLoggedIn && (
            <>
              <button
                onClick={() => { setAuthMode('REGISTER'); changeView('AUTH'); }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Tạo tài khoản
              </button>
              <button
                onClick={() => { setAuthMode('LOGIN'); changeView('AUTH'); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
            </>
          )}

          {isLoggedIn && view === 'INDEX' && (
            <button
              onClick={() => changeView(userRole)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Vào trang quản trị ({userRole})
            </button>
          )}

          {/* 🌟 HIỂN THỊ TÊN TÀI KHOẢN CẠNH NÚT VỀ TRANG CHỦ KHI Ở CÁC TRANG KHÁC INDEX */}
          {view !== 'INDEX' && (
            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border text-sm">
                  <span className="font-semibold text-gray-700">👤 {currentUser.username}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {currentUser.role}
                  </span>
                </div>
              )}
              <button
                onClick={() => changeView('INDEX')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                Về Trang Chủ
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content View Switcher */}
      <div className="max-w-5xl mx-auto p-6">
        {view === 'INDEX' && <IndexView nodes={nodes} onNodeClick={handleNodeClick} />}
        {view === 'AUTH' && (
          <AuthView
            API_BASE={API_BASE}
            changeView={changeView}
            setUserRole={setUserRole}
            setIsLoggedIn={setIsLoggedIn}
            initialAuthMode={authMode}
          />
        )}
        {view === 'ADMIN' && (
          <AdminView
            nodes={nodes}
            refreshNodes={fetchDashboardNodes}
            handleLogout={handleLogout}
            API_BASE={API_BASE}
          />
        )}
        {view === 'LEADER' && (
          <LeaderView
            nodes={nodes}
            refreshNodes={fetchDashboardNodes}
            handleLogout={handleLogout}
            API_BASE={API_BASE}
          />
        )}
        {view === 'USER' && (
          <UserView
            nodes={nodes}
            onNodeClick={handleNodeClick}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}