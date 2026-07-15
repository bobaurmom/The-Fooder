import { useState, useEffect } from 'react';
import { FiGift, FiPlus, FiX, FiCalendar, FiUser, FiShield } from 'react-icons/fi';
import { rbacService } from '../services/rbacService';
import { adminService } from '../services/adminService';

export default function UserGrantManagement() {
  const [grants, setGrants] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    permissionId: '',
    expiresAt: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grantsData, usersData, permissionsData] = await Promise.all([
        rbacService.getAllUserGrants(),
        adminService.getAllUsers(),
        rbacService.getAllPermissions()
      ]);
      setGrants(grantsData.grants || []);
      setUsers(usersData.users || []);
      setPermissions(permissionsData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPermission = async (e) => {
    e.preventDefault();
    try {
      await rbacService.grantPermissionToUser(
        formData.userId,
        formData.permissionId,
        formData.expiresAt || null
      );
      await fetchData();
      setShowGrantModal(false);
      setFormData({ userId: '', permissionId: '', expiresAt: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to grant permission');
    }
  };

  const handleRevokeGrant = async (userId, permissionId) => {
    if (!window.confirm('Are you sure you want to revoke this grant?')) return;
    try {
      await rbacService.revokeUserGrant(userId, permissionId);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to revoke grant');
    }
  };

  const handleViewUserGrants = async (userId) => {
    try {
      const userGrants = await rbacService.getUserGrants(userId);
      setSelectedUser({
        id: userId,
        name: users.find(u => u.user_id === userId)?.username || 'Unknown',
        grants: userGrants
      });
    } catch (err) {
      setError('Failed to fetch user grants');
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Grant Management</h2>
        <button
          onClick={() => setShowGrantModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus />
          Grant Permission
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* User List with Quick Grant View */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Users</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiUser className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewUserGrants(user.user_id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Grants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Grants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">All Active Grants</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Granted By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Granted At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {grants.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No active grants found
                </td>
              </tr>
            ) : (
              grants.map((grant) => (
                <tr key={grant.grant_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {grant.users?.username || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiShield className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-900">{grant.permissions?.permission_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grant.granted_by_user?.username || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(grant.granted_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grant.expires_at ? (
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 mr-1" />
                        {new Date(grant.expires_at).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-green-600">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRevokeGrant(grant.user_id, grant.permission_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiX className="inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Grants Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Grants for {selectedUser.name}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            {selectedUser.grants && selectedUser.grants.length > 0 ? (
              <div className="space-y-3">
                {selectedUser.grants.map((grant) => (
                  <div key={grant.grant_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiGift className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{grant.permissions?.permission_name}</p>
                        <p className="text-sm text-gray-500">
                          Granted by {grant.granted_by_user?.username || 'System'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {grant.expires_at && (
                        <span className="text-sm text-gray-500">
                          Expires: {new Date(grant.expires_at).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => handleRevokeGrant(selectedUser.id, grant.permission_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiX className="inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No grants found for this user</p>
            )}
          </div>
        </div>
      )}

      {/* Grant Permission Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Grant Permission to User</h3>
            <form onSubmit={handleGrantPermission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission</label>
                <select
                  required
                  value={formData.permissionId}
                  onChange={(e) => setFormData({ ...formData, permissionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select permission</option>
                  {Object.entries(groupedPermissions).map(([resource, perms]) => (
                    <optgroup key={resource} label={resource.toUpperCase()}>
                      {perms.map((perm) => (
                        <option key={perm.permission_id} value={perm.permission_id}>
                          {perm.permission_name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At (Optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Grant Permission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGrantModal(false);
                    setFormData({ userId: '', permissionId: '', expiresAt: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
