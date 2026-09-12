import React, { useState, useEffect } from 'react';
import IndexView from './page/IndexView';
import AuthView from './page/AuthView';
import AdminView from './page/AdminView';
import LeaderView from './page/LeaderView';
import UserView from './page/UserView';

const getApiBase = () => {
  const envUrl = import.meta.env?.VITE_API_URL || 'https://my-web-backend-i49k.onrender.com';
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE = getApiBase();

export default function App() {
  const [view, setView] = useState(() => localStorage.getItem('current_view') || 'INDEX');
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' hoặc 'REGISTER'
  const [nodes, setNodes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('user_role') || 'USER');

  const changeView = (newView) => {
    setView(newView);
    localStorage.setItem('current_view', newView);
  };

  // Kiếm tra phiên làm việc khi load lại trang
  useEffect(() => {
    const savedView = localStorage.getItem('current_view') || 'INDEX';

    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsLoggedIn(true);
          const role = data.user?.role || 'USER';
          setUserRole(role);
          localStorage.setItem('user_role', role);

          if (['ADMIN', 'LEADER', 'USER', 'AUTH'].includes(savedView)) {
            setView(role); // Tự động chuyển về giao diện theo role
          }
        } else {
          setIsLoggedIn(false);
          if (['ADMIN', 'LEADER', 'USER'].includes(savedView)) {
            changeView('AUTH');
          }
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  // Tải dữ liệu các nhánh
  useEffect(() => {
    if (view === 'INDEX' || view === 'USER') {
      fetch(`${API_BASE}/public/nodes`)
        .then(res => res.json())
        .then(data => setNodes(data))
        .catch(err => console.error(err));
    } else if (['ADMIN', 'LEADER'].includes(view)) {
      fetchAdminNodes();
    }
  }, [view]);

  const fetchAdminNodes = () => {
    fetch(`${API_BASE}/admin/nodes`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setNodes(data))
      .catch(err => console.error(err));
  };

  const handleNodeClick = (node) => {
    const nodeId = node._id || node.id;
    fetch(`${API_BASE}/public/nodes/${nodeId}/click`, { method: 'POST' });
    window.open(node.target_url || node.url, '_blank');
  };

  const handleLogout = () => {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).then(() => {
      setIsLoggedIn(false);
      setUserRole('USER');
      localStorage.removeItem('user_role');
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

        <div className="flex space-x-3">
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
              Vào trang {userRole}
            </button>
          )}

          {view !== 'INDEX' && (
            <button
              onClick={() => changeView('INDEX')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
            >
              Về Trang Chủ
            </button>
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
        {view === 'ADMIN' && <AdminView nodes={nodes} refreshNodes={fetchAdminNodes} handleLogout={handleLogout} API_BASE={API_BASE} />}
        {view === 'LEADER' && <LeaderView nodes={nodes} handleLogout={handleLogout} />}
        {view === 'USER' && <UserView nodes={nodes} onNodeClick={handleNodeClick} handleLogout={handleLogout} />}
      </div>
    </div>
  );
}