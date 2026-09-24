import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import IndexView from "./components/IndexView";
import UserView from "./components/UserView";
import LeaderView from "./components/LeaderView";
import AdminView from "./components/AdminView";
import AuthView from "./components/AuthView";

const API_BASE = import.meta.env.VITE_API_URL || 'https://my-web-backend-i49k.onrender.com/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchNodes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/nodes`);
      const data = await res.json();
      if (Array.isArray(data)) setNodes(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách nodes:', err);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/check`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Lỗi kiểm tra phiên đăng nhập:', err);
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      await checkAuthStatus();
      await fetchNodes();
    };
    initApp();
  }, [checkAuthStatus, fetchNodes]);

  const handleNodeClick = async (node) => {
    const nodeId = node._id || node.id;
    const targetUrl = node.url || node.target_url;
    if (nodeId) {
      try {
        await fetch(`${API_BASE}/nodes/${nodeId}/click`, { method: 'POST' });
        setNodes((prevNodes) =>
          prevNodes.map((n) => (n._id === nodeId || n.id === nodeId ? { ...n, clicks: (n.clicks || 0) + 1 } : n))
        );
      } catch (err) {
        console.error('Không thể ghi nhận lượt click:', err);
      }
    }
    if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      alert('Đăng xuất thành công!');
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-gray-600">Đang khôi phục phiên đăng nhập...</div>
        </div>
      </div>
    );
  }

  // Xác định đường dẫn trang quản trị riêng theo role
  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'LEADER') return '/leader';
    return '/user';
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        {/* NAVBAR CHUNG */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 cursor-pointer text-decoration-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                V
              </div>
              <div>
                <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Valzaria Hub
                </span>
                <span className="block text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                  Enterprise Portal
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Bấm vào phần tên/role sẽ chuyển đến trang tương ứng của role đó */}
                  <Link 
                    to={getDashboardPath()}
                    className="text-right hidden sm:block hover:opacity-80 transition cursor-pointer bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100"
                  >
                    <div className="text-sm font-bold text-gray-800">{user.username}</div>
                    <div className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">{user.role}</div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition border border-gray-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ROUTING CÁC NHÁNH URL */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <IndexView
                  nodes={nodes}
                  onNodeClick={handleNodeClick}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              }
            />
            <Route
              path="/admin"
              element={
                user && user.role === 'ADMIN' ? (
                  <AdminView nodes={nodes} refreshNodes={fetchNodes} handleLogout={handleLogout} API_BASE={API_BASE} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/leader"
              element={
                user && user.role === 'LEADER' ? (
                  <LeaderView handleLogout={handleLogout} API_BASE={API_BASE} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/user"
              element={
                user ? (
                  <UserView user={user} nodes={nodes} onNodeClick={handleNodeClick} handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t py-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Valzaria System. Bảo mật và phân quyền toàn diện.</p>
        </footer>

        {/* AUTH MODAL */}
        {showAuthModal && !user && (
          <AuthView
            API_BASE={API_BASE}
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setShowAuthModal(false);
            }}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}