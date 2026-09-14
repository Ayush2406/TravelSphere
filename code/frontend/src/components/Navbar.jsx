import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar - Persistent top navigation for all authenticated pages.
 * Also renders on public pages; hides user-specific links when not logged in.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">TravelSphere</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/"             className={isActive('/')}>Home</Link>
            <Link to="/explore"      className={isActive('/explore')}>Explore</Link>
            <Link to="/create-post"  className={isActive('/create-post')}>+ Post</Link>
            <Link to={`/profile/${user.id}`} className="nav-link">Profile</Link>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/explore" className={isActive('/explore')}>Explore</Link>
            <Link to="/login"   className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}