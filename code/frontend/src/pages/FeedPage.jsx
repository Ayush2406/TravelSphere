import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFeed } from '../api/feed';
import { deletePost } from '../api/posts';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

/**
 * FeedPage - Protected home feed.
 * Fetches GET /api/feed and renders posts for the logged-in user.
 */
export default function FeedPage() {
  const { user } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await getFeed(0, 20);
        if (!cancelled) setItems(res.data.items ?? []);
      } catch {
        if (!cancelled) setError('Could not load feed. Make sure the backend is running.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setItems((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h2 className="page-title">Home Feed</h2>

        {loading && <p className="state-msg">Loading feed…</p>}
        {error   && <p className="state-error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <div className="state-empty">
            <p>Your feed is empty.</p>
            <p>Follow travelers or <a href="/explore">explore posts</a> to get started.</p>
          </div>
        )}

        <div className="post-list">
          {items.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canDelete={user && post.user && user.id === post.user.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}