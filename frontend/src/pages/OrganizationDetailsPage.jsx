import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { organizationsAPI, usersAPI } from '../api/axios';

const OrganizationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [showUserSidePanel, setShowUserSidePanel] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [orgForm, setOrgForm] = useState({});

  useEffect(() => {
    fetchOrganization();
    fetchUsers();
  }, [id]);

  const fetchOrganization = async () => {
    try {
      const response = await organizationsAPI.getById(id);
      const org = response.data.data;
      setOrganization(org);
      setOrgForm(org);
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getByOrganization(id);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateOrganization = async (e) => {
    e.preventDefault();
    try {
      await organizationsAPI.update(id, orgForm);
      setEditMode(false);
      fetchOrganization();
      alert('Organization updated successfully');
    } catch (error) {
      console.error('Error updating organization:', error);
      alert('Error updating organization');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create({
        ...userForm,
        organization_id: parseInt(id)
      });
      setShowUserSidePanel(false);
      setUserForm({ name: '', email: '', role: 'Admin' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleBadge = (role) => {
    const isAdmin = role === 'Admin';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${
        isAdmin ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {role}
      </span>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <nav className="text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-gray-700">🏠</button>
          <span className="mx-2">›</span>
          <button onClick={() => navigate('/')} className="hover:text-gray-700">Manage B2B organizations</button>
          <span className="mx-2">›</span>
          <span>Organization details</span>
        </nav>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm">change status</button>
      </div>

      {/* Organization Header Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-indigo-600">{organization?.name?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{organization?.name}</h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {organization?.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {organization?.phone || 'N/A'}
              </div>
              {organization?.website && (
                <a href={organization.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-indigo-600 hover:underline">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  {organization.website}
                </a>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              organization?.status === 'active' ? 'bg-green-100 text-green-800' : 
              organization?.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              ● {organization?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Basic details
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'users' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Basic Details Tab */}
        {activeTab === 'basic' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Profile</h3>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditMode(false);
                    setOrgForm(organization);
                  }}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleUpdateOrganization}>
              <div className="space-y-6">
                {/* Organization Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Organization details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={orgForm.name || ''}
                        onChange={(e) => setOrgForm({...orgForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="gitam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization slug</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={orgForm.slug || ''}
                        onChange={(e) => setOrgForm({...orgForm, slug: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="gitam"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary admin name</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={orgForm.primary_admin_name || ''}
                        onChange={(e) => setOrgForm({...orgForm, primary_admin_name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="Tushar Gupta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary admin mail ID</label>
                      <input
                        type="email"
                        disabled={!editMode}
                        value={orgForm.primary_admin_email || ''}
                        onChange={(e) => setOrgForm({...orgForm, primary_admin_email: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="Tushar@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Support Email ID</label>
                      <input
                        type="email"
                        disabled={!editMode}
                        value={orgForm.email || ''}
                        onChange={(e) => setOrgForm({...orgForm, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="gitam@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={orgForm.phone || ''}
                        onChange={(e) => setOrgForm({...orgForm, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="91 - 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alternate phone number</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={orgForm.alternate_phone || ''}
                        onChange={(e) => setOrgForm({...orgForm, alternate_phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                        placeholder="91 - 1234567890"
                      />
                    </div>
                  </div>
                </div>

                {/* Maximum Allowed Coordinators */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Maximum Allowed Coordinators</h4>
                  <p className="text-xs text-gray-500 mb-2">Maximum active Coordinators allowed. Up to 5</p>
                  <select
                    disabled={!editMode}
                    value={orgForm.max_coordinators || 5}
                    onChange={(e) => setOrgForm({...orgForm, max_coordinators: parseInt(e.target.value)})}
                    className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  >
                    <option value={5}>Max 5 Co-ordinators</option>
                    <option value={10}>Max 10 Co-ordinators</option>
                    <option value={15}>Max 15 Co-ordinators</option>
                    <option value={20}>Max 20 Co-ordinators</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Timezone</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conventional</label>
                      <select
                        disabled={!editMode}
                        value={orgForm.timezone || 'India Standard Time'}
                        onChange={(e) => setOrgForm({...orgForm, timezone: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                      >
                        <option>India Standard Time</option>
                        <option>America/New_York</option>
                        <option>America/Los_Angeles</option>
                        <option>Europe/London</option>
                        <option>Atlantic/Canary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                      <select
                        disabled={!editMode}
                        value={orgForm.region || 'Asia/Calcutta'}
                        onChange={(e) => setOrgForm({...orgForm, region: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                      >
                        <option>Asia/Calcutta</option>
                        <option>America/New_York</option>
                        <option>America/Los_Angeles</option>
                        <option>Europe/London</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Language</h4>
                  <p className="text-xs text-gray-500 mb-2">Choose the language for the organization</p>
                  <select
                    disabled={!editMode}
                    value={orgForm.language || 'English'}
                    onChange={(e) => setOrgForm({...orgForm, language: e.target.value})}
                    className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                {/* Official Website URL */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Official website URL</h4>
                  <p className="text-xs text-gray-500 mb-2">website URL</p>
                  <input
                    type="url"
                    disabled={!editMode}
                    value={orgForm.website || ''}
                    onChange={(e) => setOrgForm({...orgForm, website: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                    placeholder="Gitam.edu"
                  />
                </div>

                {editMode && (
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setOrgForm(organization);
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Users</h3>
              <button
                onClick={() => setShowUserSidePanel(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm flex items-center"
              >
                <span className="mr-2">+</span>
                Add user
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Side Panel */}
      {showUserSidePanel && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowUserSidePanel(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add User</h3>
                <button 
                  onClick={() => setShowUserSidePanel(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name of the user</label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type here"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type here"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Choose user role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="Admin">Admin</option>
                      <option value="Co-ordinator">Co-ordinator</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowUserSidePanel(false)}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizationDetailsPage;
