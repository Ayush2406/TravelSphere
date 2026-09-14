import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterPage - Public page for creating a new account.
 *
 * Sends { username, email, password, full_name } to POST /api/auth/register.
 * The backend returns the created user (no token).
 * On success redirects to /login for the user to sign in explicitly.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    username:  '',
    email:     '',
    password:  '',
    confirm:   '',
  });
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username:  form.username,
        email:     form.email,
        password:  form.password,
        full_name: form.full_name,
      });
      navigate('/login', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">🌍 TravelSphere</h1>
        <h2 className="auth-subtitle">Create account</h2>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="auth-label" htmlFor="full_name">Full name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className="auth-input"
            value={form.full_name}
            onChange={handleChange}
            autoComplete="name"
            required
          />

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

          <label className="auth-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
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
            autoComplete="new-password"
            required
          />

          <label className="auth-label" htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            className="auth-input"
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}