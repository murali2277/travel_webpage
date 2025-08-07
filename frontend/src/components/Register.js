import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await registerUser(form);
      onRegister(data);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.username) {
          setError(`Username: ${err.response.data.username[0]}`);
        } else if (err.response.data.email) {
          setError(`Email: ${err.response.data.email[0]}`);
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0]);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">Sign Up</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              className="input-field"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              className="input-field"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
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
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            className="input-field"
            value={form.phone}
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
        
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            className="input-field"
            value={form.confirm_password}
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
