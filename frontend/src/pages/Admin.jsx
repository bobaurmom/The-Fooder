import { useState } from 'react';
import { FiDatabase, FiLogOut, FiShoppingBag, FiHome, FiSettings, FiUsers, FiShield, FiKey, FiGift, FiUserPlus } from 'react-icons/fi';
import BackupRecovery from '../components/BackupRecovery';
import OrderManagement from '../components/OrderManagement';
import RestaurantManagement from '../components/RestaurantManagement';
import SystemSettings from '../components/SystemSettings';
import RoleManagement from '../components/RoleManagement';
import PermissionManagement from '../components/PermissionManagement';
import UserGrantManagement from '../components/UserGrantManagement';
import CreateAdminWithGrants from '../components/CreateAdminWithGrants';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiShoppingBag />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'restaurants'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiHome />
            Restaurants
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiSettings />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiDatabase />
            Backup
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'roles'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiShield />
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'permissions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiKey />
            Permissions
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'grants'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiGift />
            Grants
          </button>
          <button
            onClick={() => setActiveTab('create-admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'create-admin'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiUserPlus />
            Create Admin
          </button>
        </div>

        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'restaurants' && <RestaurantManagement />}
        {activeTab === 'settings' && <SystemSettings />}
        {activeTab === 'backup' && <BackupRecovery />}
        {activeTab === 'roles' && <RoleManagement />}
        {activeTab === 'permissions' && <PermissionManagement />}
        {activeTab === 'grants' && <UserGrantManagement />}
        {activeTab === 'create-admin' && <CreateAdminWithGrants />}
      </div>
    </div>
  );
}
