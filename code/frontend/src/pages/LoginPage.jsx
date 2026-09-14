import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage - Public page for user sign-in.
 *
 * Calls auth.login() with { username, password }.
 * On success navigates to / (protected home).
 * On failure shows an inline error message.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]             = useState({ username: '', password: '' });
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate('/', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">🌍 TravelSphere</h1>
        <h2 className="auth-subtitle">Sign in</h2>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="auth-label" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="auth-input"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <label className="auth-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="auth-input"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Register</Link>
        </p>
      </div>
    </div>
  );
}