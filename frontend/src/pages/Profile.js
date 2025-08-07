import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      setForm(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updatedProfile = await updateUserProfile(form);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card max-w-2xl mx-auto mt-10 text-center">
        <div className="p-8">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card max-w-2xl mx-auto mt-10 text-center">
        <div className="p-8 text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="flex justify-end items-center mb-6">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg">{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.first_name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.last_name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                value={form.username || ''}
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.email || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                value={form.address || ''}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm(profile);
                  setError('');
                  setSuccess('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-600">First Name</label>
                <p className="text-gray-800 text-lg">{profile.first_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Last Name</label>
                <p className="text-gray-800 text-lg">{profile.last_name || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">Username</label>
              <p className="text-gray-800 text-lg">{profile.username}</p>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">Email</label>
              <p className="text-gray-800 text-lg">{profile.email}</p>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">Phone</label>
              <p className="text-gray-800 text-lg">{profile.phone || 'Not provided'}</p>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">Address</label>
              <p className="text-gray-800 text-lg">{profile.address || 'Not provided'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
