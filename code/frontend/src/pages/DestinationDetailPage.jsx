import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestination, getDestinationPosts, getDestinationTravelers } from '../api/destinations';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

/**
 * DestinationDetailPage - Public page for a single destination.
 * Loads: destination info, posts at the destination, travelers who have been there.
 */
export default function DestinationDetailPage() {
  const { destinationId } = useParams();

  const [destination, setDestination] = useState(null);
  const [posts, setPosts]             = useState([]);
  const [travelers, setTravelers]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [tab, setTab]                 = useState('posts');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [destRes, postsRes, travelersRes] = await Promise.all([
          getDestination(destinationId),
          getDestinationPosts(destinationId),
          getDestinationTravelers(destinationId),
        ]);
        if (!cancelled) {
          setDestination(destRes.data);
          setPosts(postsRes.data ?? []);
          setTravelers(travelersRes.data ?? []);
        }
      } catch {
        if (!cancelled) setError('Destination not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [destinationId]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        {loading && <p className="state-msg">Loading destination…</p>}
        {error   && <p className="state-error">{error}</p>}

        {destination && (
          <>
            <div className="dest-header">
              <h2 className="page-title">📍 {destination.name}</h2>
              {destination.country && (
                <p className="dest-country-label">{destination.country}</p>
              )}
              {destination.description && (
                <p className="dest-description">{destination.description}</p>
              )}
            </div>

            <div className="tab-nav">
              <button
                className={tab === 'posts' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setTab('posts')}
              >
                Posts ({posts.length})
              </button>
              <button
                className={tab === 'travelers' ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setTab('travelers')}
              >
                Travelers ({travelers.length})
              </button>
            </div>

            {tab === 'posts' && (
              <div>
                {posts.length === 0
                  ? <p className="state-msg">No posts for this destination yet.</p>
                  : (
                    <div className="post-list">
                      {posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          canDelete={false}
                          onDelete={() => {}}
                        />
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            {tab === 'travelers' && (
              <div className="user-list">
                {travelers.length === 0
                  ? <p className="state-msg">No travelers listed yet.</p>
                  : travelers.map((u) => (
                    <div key={u.id} className="user-card">
                      <div className="user-card-info">
                        <Link to={`/profile/${u.id}`} className="user-card-name">
                          {u.full_name || u.username}
                        </Link>
                        <span className="user-card-handle">@{u.username}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}