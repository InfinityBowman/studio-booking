'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface NewUser {
  email: string;
  password: string;
  role: string;
}

interface User {
  user_id: string;
  email: string;
  roles: string[];
}

const AdminPage = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const roles = newUser.role === 'admin' ? ['user', 'admin'] : ['user'];

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          roles: roles,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('User created successfully');
        setNewUser({ email: '', password: '', role: 'user' });
        setShowCreateForm(false);
        setTimeout(fetchUsers, 2000); // Refresh the user list
      } else {
        setMessage(data.error || 'Failed to create user');
      }
    } catch (error) {
      setMessage('Error creating user');
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('User deleted successfully');
          setTimeout(fetchUsers, 2000); // Refresh the user list
        } else {
          const data = await response.json();
          setMessage(data.error || 'Failed to delete user');
        }
      } catch (error) {
        setMessage('Error deleting user');
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Page</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showCreateForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* User List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="bg-gray-700 shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase">Roles</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-100 uppercase">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles?.length > 0 ? user.roles.join(', ') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteUser(user.user_id, user.email)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <form
            onSubmit={handleSubmit}
            className="max-w-md space-y-4"
          >
            <div>
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Role:</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full p-2 border rounded text-black"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {message && <div className="mt-4 p-2 border rounded">{message}</div>}
    </div>
  );
};

export default AdminPage;
