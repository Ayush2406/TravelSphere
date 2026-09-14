import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPost, deletePost } from '../api/posts';
import { mediaUrl } from '../utils/mediaUrl';
import Navbar from '../components/Navbar';

/**
 * PostDetailPage - Public page showing a single post.
 * If the logged-in user owns the post, shows a Delete button.
 */
export default function PostDetailPage() {
  const { postId }  = useParams();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    let cancelled = false;
    getPost(postId)
      .then((res) => { if (!cancelled) setPost(res.data); })
      .catch(() => { if (!cancelled) setError('Post not found.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(postId);
      navigate('/', { replace: true });
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not delete post.');
    }
  };

  const isOwner = user && post && post.user && user.id === post.user.id;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container narrow">
        {loading && <p className="state-msg">Loading post…</p>}
        {error   && <p className="state-error">{error}</p>}

        {post && (
          <div className="detail-card">
            {post.image_url && (
              <img
                src={mediaUrl(post.image_url)}
                alt="Post"
                className="detail-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="detail-body">
              <p className="detail-content">{post.content}</p>

              {post.destination_name && (
                <p className="post-destination">📍 {post.destination_name}</p>
              )}

              <div className="detail-meta">
                {post.user && (
                  <Link to={`/profile/${post.user.id}`} className="post-user">
                    @{post.user.username}
                  </Link>
                )}
                {isOwner && (
                  <button onClick={handleDelete} className="btn-danger">
                    Delete Post
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}