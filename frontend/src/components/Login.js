import React, { useState } from 'react';
import { loginUser } from '../services/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await loginUser(form);
      onLogin(data.user);
    } catch (err) {
      setError(err?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            className="input-field"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="input-field"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {error && <div className="text-red-600 text-sm">{error}</div>}
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login; 