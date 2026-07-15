import { useState, useEffect } from 'react';
import { FiUserPlus, FiShield, FiCheck, FiX } from 'react-icons/fi';
import { adminService } from '../services/adminService';
import { rbacService } from '../services/rbacService';

export default function CreateAdminWithGrants() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await rbacService.getAllPermissions();
      setPermissions(data);
    } catch (err) {
      setError('Failed to fetch permissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    if (selectedPermissions.length === 0) {
      setError('Please select at least one permission for the admin');
      setCreating(false);
      return;
    }

    try {
      const permissionNames = permissions
        .filter(p => selectedPermissions.includes(p.permission_id))
        .map(p => p.permission_name);

      const result = await adminService.createAdminWithGrants(
        {
          username: formData.username,
          email: formData.email,
          password_hash: 'supabase_auth' // Will be handled by auth system
        },
        permissionNames
      );

      setSuccess(`Admin "${formData.username}" created successfully with ${permissionNames.length} permissions`);
      setFormData({ username: '', email: '', password: '' });
      setSelectedPermissions([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin');
    } finally {
      setCreating(false);
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
      <div className="flex items-center gap-3">
        <FiUserPlus className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create Admin with Specific Grants</h2>
          <p className="text-gray-600 text-sm">Super Admin only - Create new admin accounts with custom permission sets</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <FiX className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
          <FiCheck className="mr-2" />
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admin Account Details */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Note: Password will be set through the authentication system after account creation
            </p>
          </div>

          {/* Permission Selection */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Permissions</h3>
              <span className="text-sm text-gray-600">
                {selectedPermissions.length} permission(s) selected
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700 capitalize flex items-center">
                      <FiShield className="h-4 w-4 mr-2 text-blue-600" />
                      {resource}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const allPermIds = perms.map(p => p.permission_id);
                        const allSelected = allPermIds.every(id => selectedPermissions.includes(id));
                        if (allSelected) {
                          setSelectedPermissions(prev => prev.filter(id => !allPermIds.includes(id)));
                        } else {
                          setSelectedPermissions(prev => [...new Set([...prev, ...allPermIds])]);
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {perms.every(p => selectedPermissions.includes(p.permission_id)) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {perms.map((perm) => (
                      <label
                        key={perm.permission_id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition ${
                          selectedPermissions.includes(perm.permission_id)
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.permission_id)}
                          onChange={() => handlePermissionToggle(perm.permission_id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{perm.permission_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Permissions Summary */}
          {selectedPermissions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Selected Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {permissions
                  .filter(p => selectedPermissions.includes(p.permission_id))
                  .map(p => (
                    <span
                      key={p.permission_id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {p.permission_name}
                      <button
                        type="button"
                        onClick={() => handlePermissionToggle(p.permission_id)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Admin...
                </>
              ) : (
                <>
                  <FiUserPlus />
                  Create Admin with Grants
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ username: '', email: '', password: '' });
                setSelectedPermissions([]);
                setError('');
                setSuccess('');
              }}
              className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <FiShield className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Super Admin Feature</p>
            <p>
              This feature allows you to create admin accounts with specific permission sets. 
              The new admin will have the base admin role plus any additional permissions you grant them. 
              Use this to create specialized admins for different operational needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
