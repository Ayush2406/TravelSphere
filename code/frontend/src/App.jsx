import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute  from './components/ProtectedRoute';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import HomePage        from './pages/HomePage';

/**
 * App.jsx - Root component.
 *
 * Route structure:
 *   /login      → LoginPage    (public)
 *   /register   → RegisterPage (public)
 *   /           → HomePage     (protected — requires auth)
 *   *           → redirect to /login
 *
 * AuthProvider wraps the entire tree so every component can call useAuth().
 * BrowserRouter is provided by main.jsx.
 */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — rendered only when user is authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Catch-all: redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}