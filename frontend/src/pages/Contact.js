import React, { useState } from 'react';
import { submitContact } from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err?.detail || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto card mt-10">
      <h2 className="text-2xl font-bold text-primary-700 mb-4">Contact Us</h2>
      <p className="mb-4 text-gray-700">
        Have questions or need help? Fill out the form below and our team will get back to you as soon as possible.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="input-field"
            value={form.name}
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
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            name="message"
            className="input-field"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">Thank you for contacting us!</div>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;