import React from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../utils/mediaUrl';

/**
 * PostCard - Reusable card for displaying a single post.
 * Props:
 *   post       - post object from the API
 *   canDelete  - boolean; true if the current user owns the post
 *   onDelete   - callback(postId) called when Delete is confirmed
 */
export default function PostCard({ post, canDelete, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Delete this post?')) {
      onDelete(post.id);
    }
  };

  return (
    <div className="post-card">
      {post.image_url && (
        <img
          src={mediaUrl(post.image_url)}
          alt="Post"
          className="post-img"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="post-body">
        <p className="post-content">{post.content}</p>
        {post.destination_name && (
          <span className="post-destination">📍 {post.destination_name}</span>
        )}
        <div className="post-meta">
          <div className="post-meta-left">
            {post.user ? (
              <Link to={`/profile/${post.user.id}`} className="post-user">
                @{post.user.username}
              </Link>
            ) : null}
          </div>
          <div className="post-meta-right">
            <Link to={`/post/${post.id}`} className="post-link">View →</Link>
            {canDelete && (
              <button onClick={handleDelete} className="btn-danger-sm">Delete</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}