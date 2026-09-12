import React, { useState } from 'react';

export default function AuthView({ API_BASE, changeView, setUserRole, setIsLoggedIn, initialAuthMode = 'LOGIN' }) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialAuthMode === 'REGISTER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Mặc định khi tạo tài khoản là USER

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegisterMode ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
    const payload = isRegisterMode ? { username, password, role } : { username, password };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isRegisterMode) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            setIsRegisterMode(false);
          } else {
            setIsLoggedIn(true);
            const userRole = data.user?.role || 'USER';
            setUserRole(userRole);
            localStorage.setItem('user_role', userRole);

            // Tự động điều hướng theo quyền
            if (userRole === 'ADMIN') changeView('ADMIN');
            else if (userRole === 'LEADER') changeView('LEADER');
            else changeView('USER');
          }
        } else {
          alert(data.message || 'Thao tác thất bại!');
        }
      })
      .catch(err => {
        console.error('Lỗi xác thực:', err);
        alert('Lỗi kết nối máy chủ!');
      });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isRegisterMode ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tên đăng nhập..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        {isRegisterMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Vai trò đăng ký</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="USER">Thành viên (User)</option>
              <option value="LEADER">Quản lý nhóm (Leader)</option>
              <option value="ADMIN">Quản trị viên (Admin)</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          {isRegisterMode ? 'Đăng Ký' : 'Đăng Nhập'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        {isRegisterMode ? (
          <span>
            Đã có tài khoản?{' '}
            <button onClick={() => setIsRegisterMode(false)} className="text-blue-600 font-semibold hover:underline">
              Đăng nhập ngay
            </button>
          </span>
        ) : (
          <span>
            Chưa có tài khoản?{' '}
            <button onClick={() => setIsRegisterMode(true)} className="text-blue-600 font-semibold hover:underline">
              Tạo tài khoản mới
            </button>
          </span>
        )}
      </div>
    </div>
  );
}