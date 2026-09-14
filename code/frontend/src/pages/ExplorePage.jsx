import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts, deletePost } from '../api/posts';
import { searchUsers } from '../api/users';
import { searchDestinations } from '../api/destinations';
import { followUser, unfollowUser } from '../api/follows';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

/**
 * ExplorePage - Public discovery page.
 * Sections: All Posts | Search Users | Search Destinations
 */
export default function ExplorePage() {
  const { user } = useAuth();

  // Posts
  const [posts, setPosts]       = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError]     = useState('');

  // User search
  const [userQuery, setUserQuery]   = useState('');
  const [userResults, setUserResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  // Destination search
  const [destQuery, setDestQuery]   = useState('');
  const [destResults, setDestResults] = useState([]);
  const [destLoading, setDestLoading] = useState(false);

  // Tab state
  const [tab, setTab] = useState('posts');

  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data ?? []))
      .catch(() => setPostsError('Could not load posts.'))
      .finally(() => setPostsLoading(false));
  }, []);

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setUserLoading(true);
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
        prev.map((u) => u.id === targetUser.id ? { ...u, _following: true } : u)
      );
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not follow user.');
    }
  };

  const handleUnfollow = async (targetUser) => {
    try {
      await unfollowUser(targetUser.id);
      setUserResults((prev) =>
        prev.map((u) => u.id === targetUser.id ? { ...u, _following: false } : u)
      );
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not unfollow user.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert(err?.response?.data?.detail || 'Failed to delete post.');
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h2 className="page-title">Explore</h2>

        {/* Tab nav */}
        <div className="tab-nav">
          <button className={tab === 'posts' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('posts')}>Posts</button>
          <button className={tab === 'users' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('users')}>People</button>
          <button className={tab === 'destinations' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('destinations')}>Destinations</button>
        </div>

        {/* Posts tab */}
        {tab === 'posts' && (
          <div>
            {postsLoading && <p className="state-msg">Loading posts…</p>}
            {postsError   && <p className="state-error">{postsError}</p>}
            {!postsLoading && posts.length === 0 && !postsError && (
              <p className="state-msg">No posts yet.</p>
            )}
            <div className="post-list">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canDelete={user && post.user && user.id === post.user.id}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div>
            <form onSubmit={handleUserSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by username…"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled={userLoading}>
                {userLoading ? 'Searching…' : 'Search'}
              </button>
            </form>
            <div className="user-list">
              {userResults.map((u) => (
                <div key={u.id} className="user-card">
                  <div className="user-card-info">
                    <Link to={`/profile/${u.id}`} className="user-card-name">
                      {u.full_name || u.username}
                    </Link>
                    <span className="user-card-handle">@{u.username}</span>
                  </div>
                  {user && user.id !== u.id && (
                    u._following
                      ? <button onClick={() => handleUnfollow(u)} className="btn-secondary-sm">Unfollow</button>
                      : <button onClick={() => handleFollow(u)} className="btn-primary-sm">Follow</button>
                  )}
                </div>
              ))}
              {userResults.length === 0 && !userLoading && userQuery && (
                <p className="state-msg">No users found.</p>
              )}
            </div>
          </div>
        )}

        {/* Destinations tab */}
        {tab === 'destinations' && (
          <div>
            <form onSubmit={handleDestSearch} className="search-form">
              <input
                type="text"
                placeholder="Search destinations…"
                value={destQuery}
                onChange={(e) => setDestQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled={destLoading}>
                {destLoading ? 'Searching…' : 'Search'}
              </button>
            </form>
            <div className="dest-list">
              {destResults.map((d) => (
                <Link key={d.id} to={`/destination/${d.id}`} className="dest-card">
                  <span className="dest-name">📍 {d.name}</span>
                  {d.country && <span className="dest-country">{d.country}</span>}
                </Link>
              ))}
              {destResults.length === 0 && !destLoading && destQuery && (
                <p className="state-msg">No destinations found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}