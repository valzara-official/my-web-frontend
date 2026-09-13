import React, { useState } from 'react';

export default function AuthView({ API_BASE, onLoginSuccess, onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const endpoint = isLoginMode ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        if (isLoginMode) {
          alert('Đăng nhập thành công!');
          if (onLoginSuccess) onLoginSuccess(data.user);
        } else {
          alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
          setIsLoginMode(true);
          setPassword('');
        }
      } else {
        setErrorMessage(data.message || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      console.error('Lỗi xác thực:', err);
      setErrorMessage('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold"
            >
              &times;
            </button>
          )}
          <h2 className="text-2xl font-bold">{isLoginMode ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}</h2>
          <p className="text-indigo-100 text-xs mt-1">
            {isLoginMode ? 'Truy cập không gian quản lý và dịch vụ' : 'Tạo tài khoản mới để bắt đầu sử dụng'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tên tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition"
              placeholder="Nhập username..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition"
              placeholder="Nhập password..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng Nhập' : 'Đăng Ký')}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLoginMode(!isLoginMode); setErrorMessage(''); }}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              {isLoginMode ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}