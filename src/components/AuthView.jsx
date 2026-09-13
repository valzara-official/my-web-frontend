import React, { useState } from 'react';

export default function AuthView({ API_BASE, changeView, setUserRole, setIsLoggedIn, initialAuthMode = 'LOGIN' }) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialAuthMode === 'REGISTER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isRegisterMode ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;

    // Đăng ký chỉ gửi username & password, Backend tự cố định role là USER
    const payload = { username: username.trim(), password };

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
            alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            setIsRegisterMode(false);
            setPassword('');
          } else {
            const userRole = data.user?.role || 'USER';

            // === CẬP NHẬT ĐOẠN LƯU LOCALSTORAGE ĐẦY ĐỦ Ở ĐÂY ===
            localStorage.setItem('is_logged_in', 'true');
            localStorage.setItem('user_role', userRole);
            if (data.user) {
              localStorage.setItem('current_user', JSON.stringify(data.user));
            }

            // Cập nhật State
            setIsLoggedIn(true);
            setUserRole(userRole);

            // Chờ 100ms để đảm bảo trình duyệt lưu HTTP-Only Cookie trước khi gọi API Admin
            setTimeout(() => {
              changeView(userRole);
            }, 100);
          }
        } else {
          alert(data.message || 'Thao tác thất bại!');
        }
      })
      .catch(err => {
        console.error('Lỗi xác thực:', err);
        alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!');
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
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Đăng nhập ngay
            </button>
          </span>
        ) : (
          <span>
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Tạo tài khoản mới
            </button>
          </span>
        )}
      </div>
    </div>
  );
}