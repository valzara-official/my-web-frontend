import React from 'react';
import useAdminLogic from '../hooks/useAdminLogic';
import AdminSidebar from './admin/AdminSidebar';
import OverviewTab from './admin/OverviewTab';
import NodesTab from './admin/NodesTab';
import UsersTab from './admin/UsersTab';
import UserModal from './admin/UserModal';

export default function AdminView({ nodes, refreshNodes, handleLogout, API_BASE }) {
  const {
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
  } = useAdminLogic(API_BASE);

  const toggleSection = (sectionKey) => {
    setShowSection(prev => ({
      ...(prev || {}),
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* 1. Sidebar Điều hướng */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">
        {activeTab === 'overview' && (
          <OverviewTab
            nodes={nodes}
            users={users}
            totalClicks={totalClicks}
            systemStats={systemStats}
            leaderList={leaderList}
          />
        )}

        {activeTab === 'nodes' && (
          <NodesTab
            nodes={nodes}
            nodeForm={nodeForm}
            setNodeForm={setNodeForm}
            editingNodeId={editingNodeId}
            setEditingNodeId={setEditingNodeId}
            handleSaveNode={handleSaveNode}
            handleDeleteNode={handleDeleteNode}
          />
        )}

        {activeTab === 'users' && (
          <>
            <UsersTab
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showSection={showSection}
              toggleSection={toggleSection}
              adminList={adminList}
              leaderList={leaderList}
              userList={userList}
              formatMemberCode={formatMemberCode}
              handleOpenAddModal={handleOpenAddModal}
              handleOpenEditModal={handleOpenEditModal}
              handleDeleteUser={handleDeleteUser}
            />
            <UserModal
              showModal={showModal}
              setShowModal={setShowModal}
              isEditingUser={isEditingUser}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              userForm={userForm}
              setUserForm={setUserForm}
              handleSaveUser={handleSaveUser}
            />
          </>
        )}
      </div>
    </div>
  );
}


// cập nhật đi