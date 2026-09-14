import React from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../utils/mediaUrl';

/**
 * PostCard - Polished travel card matching the Travel Sphere design system.
 * Props:
 *   post       - post object from the backend API
 *   canDelete  - boolean; true if the current logged-in user owns the post
 *   onDelete   - callback(postId) when delete is confirmed
 */
export default function PostCard({ post, canDelete, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this travel story?')) {
      onDelete(post.id);
    }
  };

  const userInitial = (post.user?.full_name || post.user?.username || '?')[0].toUpperCase();

  return (
    <article className="post-card">
      {/* Post Header: Author & Destination */}
      <div className="post-card-header">
        <div className="post-author">
          {post.user ? (
            <Link to={`/profile/${post.user.id}`} className="post-author-link">
              <div className="post-author-avatar">
                {post.user.profile_picture_url ? (
                  <img
                    src={mediaUrl(post.user.profile_picture_url)}
                    alt={post.user.username}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="avatar-fallback">{userInitial}</span>
                )}
              </div>
              <div className="post-author-meta">
                <span className="post-author-name">
                  {post.user.full_name || post.user.username}
                </span>
                <span className="post-author-handle">@{post.user.username}</span>
              </div>
            </Link>
          ) : (
            <div className="post-author-meta">
              <span className="post-author-name">Explorer</span>
            </div>
          )}
        </div>

        {post.destination_name && (
          <span className="destination-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{post.destination_name}</span>
          </span>
        )}
      </div>

      {/* Post Image */}
      {post.image_url && (
        <div className="post-img-wrapper">
          <Link to={`/post/${post.id}`}>
            <img
              src={mediaUrl(post.image_url)}
              alt={post.destination_name ? `Travel in ${post.destination_name}` : 'Travel story'}
              className="post-img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none';
              }}
            />
          </Link>
        </div>
      )}

      {/* Post Body & Content */}
      <div className="post-body">
        <p className="post-content">{post.content}</p>

        {/* Footer actions */}
        <div className="post-footer">
          <Link to={`/post/${post.id}`} className="post-view-link">
            <span>View story</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          {canDelete && (
            <button
              onClick={handleDelete}
              className="btn-danger-pill"
              title="Delete this post"
              aria-label="Delete post"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}