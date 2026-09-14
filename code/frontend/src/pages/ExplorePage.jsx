import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts, deletePost } from '../api/posts';
import { searchUsers } from '../api/users';
import { searchDestinations } from '../api/destinations';
import { followUser, unfollowUser } from '../api/follows';
import { mediaUrl } from '../utils/mediaUrl';
import { formatError } from '../utils/formatError';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

/**
 * ExplorePage - Travel discovery hub for Travel Sphere.
 * Explore global stories, search explorers, and discover destinations.
 */
export default function ExplorePage() {
  const { user } = useAuth();

  // Posts state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');

  // User search state
  const [userQuery, setUserQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userSearched, setUserSearched] = useState(false);

  // Destination search state
  const [destQuery, setDestQuery] = useState('');
  const [destResults, setDestResults] = useState([]);
  const [destLoading, setDestLoading] = useState(false);
  const [destSearched, setDestSearched] = useState(false);

  // Active Tab: 'posts' | 'users' | 'destinations'
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data ?? []))
      .catch((err) => setPostsError(formatError(err, 'Could not load global posts.')))
      .finally(() => setPostsLoading(false));
  }, []);

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setUserLoading(true);
    setUserSearched(true);
    try {
      const res = await searchUsers(userQuery.trim());
      setUserResults(res.data ?? []);
    } catch {
      setUserResults([]);
    } finally {
      setUserLoading(false);
    }
  };

  const handleDestSearch = async (e) => {
    e.preventDefault();
    if (!destQuery.trim()) return;
    setDestLoading(true);
    setDestSearched(true);
    try {
      const res = await searchDestinations(destQuery.trim());
      setDestResults(res.data ?? []);
    } catch {
      setDestResults([]);
    } finally {
      setDestLoading(false);
    }
  };

  const handleFollow = async (targetUser) => {
    try {
      await followUser(targetUser.id);
      setUserResults((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, _following: true } : u))
      );
    } catch (err) {
      alert(formatError(err, 'Could not follow user.'));
    }
  };

  const handleUnfollow = async (targetUser) => {
    try {
      await unfollowUser(targetUser.id);
      setUserResults((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, _following: false } : u))
      );
    } catch (err) {
      alert(formatError(err, 'Could not unfollow user.'));
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert(formatError(err, 'Failed to delete post.'));
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <span className="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Global Discovery</span>
          </span>
          <h1 className="page-title">Explore Travel Stories & Places</h1>
          <p className="page-subtitle">
            Find fellow explorers, trending destinations, and authentic travel moments.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-pill-container">
          <button
            className={`tab-pill ${tab === 'posts' ? 'active' : ''}`}
            onClick={() => setTab('posts')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span>Travel Stories ({posts.length})</span>
          </button>
          <button
            className={`tab-pill ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Find Explorers</span>
          </button>
          <button
            className={`tab-pill ${tab === 'destinations' ? 'active' : ''}`}
            onClick={() => setTab('destinations')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Destinations</span>
          </button>
        </div>

        {/* ── TAB 1: POSTS ── */}
        {tab === 'posts' && (
          <div>
            {postsLoading && (
              <div className="skeleton-feed">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="skeleton-card">
                    <div className="skeleton-header">
                      <div className="skeleton-circle"></div>
                      <div className="skeleton-lines">
                        <div className="skeleton-line w-40"></div>
                        <div className="skeleton-line w-20"></div>
                      </div>
                    </div>
                    <div className="skeleton-image"></div>
                    <div className="skeleton-body">
                      <div className="skeleton-line w-80"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {postsError && (
              <div className="state-card error-card">
                <h3>Unable to load posts</h3>
                <p>{postsError}</p>
              </div>
            )}

            {!postsLoading && !postsError && posts.length === 0 && (
              <div className="state-card empty-card">
                <h3>No posts discovered yet</h3>
                <p>Be the first traveler to share a story on Travel Sphere!</p>
                {user && (
                  <Link to="/create-post" className="btn-primary-sm">
                    Create the First Story
                  </Link>
                )}
              </div>
            )}

            {!postsLoading && posts.length > 0 && (
              <div className="post-list">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    canDelete={Boolean(user && post.user && user.id === post.user.id)}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: EXPLORERS ── */}
        {tab === 'users' && (
          <div>
            {/* Search form */}
            <form onSubmit={handleUserSearch} className="search-bar-card">
              <div className="search-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search explorers by username or name…"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="search-main-input"
                />
              </div>
              <button type="submit" className="btn-primary-sm" disabled={userLoading}>
                {userLoading ? 'Searching…' : 'Search'}
              </button>
            </form>

            {/* User results */}
            <div className="explorer-grid">
              {userResults.map((u) => {
                const initial = (u.full_name || u.username || '?')[0].toUpperCase();
                return (
                  <div key={u.id} className="explorer-card">
                    <Link to={`/profile/${u.id}`} className="explorer-card-link">
                      <div className="explorer-avatar">
                        {u.profile_picture_url ? (
                          <img
                            src={mediaUrl(u.profile_picture_url)}
                            alt={u.username}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="avatar-fallback">{initial}</span>
                        )}
                      </div>
                      <div className="explorer-info">
                        <h4 className="explorer-name">{u.full_name || u.username}</h4>
                        <span className="explorer-handle">@{u.username}</span>
                        {u.bio && <p className="explorer-bio">{u.bio}</p>}
                      </div>
                    </Link>

                    {user && user.id !== u.id && (
                      <div className="explorer-action">
                        {u._following ? (
                          <button
                            onClick={() => handleUnfollow(u)}
                            className="btn-secondary-sm"
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFollow(u)}
                            className="btn-primary-sm"
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {userSearched && !userLoading && userResults.length === 0 && (
              <div className="state-card empty-card">
                <h3>No explorers found</h3>
                <p>No travelers matched "{userQuery}". Try searching with a different name or handle.</p>
              </div>
            )}

            {!userSearched && (
              <div className="state-card info-card">
                <div className="state-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3>Connect with other travelers</h3>
                <p>Search by username to discover fellow explorers and grow your travel circle.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: DESTINATIONS ── */}
        {tab === 'destinations' && (
          <div>
            {/* Search form */}
            <form onSubmit={handleDestSearch} className="search-bar-card">
              <div className="search-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <input
                  type="text"
                  placeholder="Search destinations (e.g. Paris, Tokyo, Bali)…"
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  className="search-main-input"
                />
              </div>
              <button type="submit" className="btn-primary-sm" disabled={destLoading}>
                {destLoading ? 'Searching…' : 'Search'}
              </button>
            </form>

            {/* Destination cards */}
            <div className="destination-grid">
              {destResults.map((d) => (
                <Link
                  key={d.id}
                  to={`/destination/${d.id}`}
                  className="destination-card"
                >
                  <div className="destination-card-top">
                    <div className="dest-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    {d.country && <span className="country-badge">{d.country}</span>}
                  </div>
                  <h3 className="destination-card-name">{d.name}</h3>
                  {d.description && (
                    <p className="destination-card-desc">{d.description}</p>
                  )}
                  <span className="destination-card-arrow">
                    View destination hub →
                  </span>
                </Link>
              ))}
            </div>

            {destSearched && !destLoading && destResults.length === 0 && (
              <div className="state-card empty-card">
                <h3>No destinations found</h3>
                <p>No destinations matched "{destQuery}". Try searching for another city or country.</p>
              </div>
            )}

            {!destSearched && (
              <div className="state-card info-card">
                <div className="state-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <h3>Discover places around the globe</h3>
                <p>Type any destination name above to find stories, photos, and travelers who have visited.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}