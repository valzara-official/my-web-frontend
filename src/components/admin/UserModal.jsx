import React from 'react';

export default function UserModal({
  showModal, setShowModal,
  isEditingUser,
  showPassword, setShowPassword,
  userForm, setUserForm,
  handleSaveUser
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl space-y-4 my-8">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditingUser ? '✏️ Chỉnh sửa thông tin thành viên' : '➕ Thêm thành viên mới'}
          </h3>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
        </div>
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tên tài khoản (Username) *</label>
              <input
                type="text"
                required
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập tên tài khoản..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mật khẩu {isEditingUser && '(Để trống nếu giữ nguyên)'} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!isEditingUser}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
                  placeholder="Nhập mật khẩu..."
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chức vụ (Role) *</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="USER">USER</option>
                <option value="LEADER">LEADER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Nhập SĐT..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                value={userForm.gender}
                onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Nhập địa chỉ email..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Nhập địa chỉ cư trú..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              rows="2"
              value={userForm.note}
              onChange={(e) => setUserForm({ ...userForm, note: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="Nhập ghi chú thêm..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              {isEditingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}