import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUser, updateMe, getFollowers, getFollowing } from '../api/users';
import { followUser, unfollowUser } from '../api/follows';
import { uploadImage } from '../api/uploads';
import { getPosts, deletePost } from '../api/posts';
import { mediaUrl } from '../utils/mediaUrl';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';

/**
 * ProfilePage - View any user's public profile.
 * Own profile: shows Edit form and own posts.
 * Other profile: shows Follow/Unfollow and their posts.
 */
export default function ProfilePage() {
  const { userId } = useParams();
  const { user: me } = useAuth();

  const [profile, setProfile]     = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError]     = useState('');

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [socialTab, setSocialTab] = useState(null); // 'followers' | 'following' | null

  const [posts, setPosts]         = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy]   = useState(false);

  // Edit profile state
  const [editing, setEditing]     = useState(false);
  const [editForm, setEditForm]   = useState({ full_name: '', bio: '', profile_picture_url: '' });
  const [editFile, setEditFile]   = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const isOwnProfile = me && parseInt(userId, 10) === me.id;

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const res = await getUser(userId);
      setProfile(res.data);
      setEditForm({
        full_name: res.data.full_name || '',
        bio: res.data.bio || '',
        profile_picture_url: res.data.profile_picture_url || '',
      });
    } catch {
      setProfileError('User not found.');
    } finally {
      setProfileLoading(false);
    }
  }, [userId]);

  // Load followers to determine follow state
  const loadFollowers = useCallback(async () => {
    try {
      const res = await getFollowers(userId);
      const list = res.data ?? [];
      setFollowers(list);
      if (me) setIsFollowing(list.some((f) => f.id === me.id));
    } catch { /* non-fatal */ }
  }, [userId, me]);

  const loadFollowing = useCallback(async () => {
    try {
      const res = await getFollowing(userId);
      setFollowing(res.data ?? []);
    } catch { /* non-fatal */ }
  }, [userId]);

  // Load this user's posts from the public /posts endpoint filtered client-side
  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const res = await getPosts();
      const all = res.data ?? [];
      setPosts(all.filter((p) => p.user && p.user.id === parseInt(userId, 10)));
    } catch { /* non-fatal */ }
    finally { setPostsLoading(false); }
  }, [userId]);

  useEffect(() => {
    loadProfile();
    loadFollowers();
    loadFollowing();
    loadPosts();
  }, [loadProfile, loadFollowers, loadFollowing, loadPosts]);

  const handleFollow = async () => {
    setFollowBusy(true);
    try {
      await followUser(parseInt(userId, 10));
      setIsFollowing(true);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not follow.');
    } finally {
      setFollowBusy(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowBusy(true);
    try {
      await unfollowUser(parseInt(userId, 10));
      setIsFollowing(false);
    } catch (err) {
      alert(err?.response?.data?.detail || 'Could not unfollow.');
    } finally {
      setFollowBusy(false);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    setEditError('');
    setEditSuccess('');

    let pictureUrl = editForm.profile_picture_url;

    // Upload new profile picture if a file was selected
    if (editFile) {
      try {
        const upRes = await uploadImage(editFile);
        pictureUrl = upRes.data.url;
      } catch {
        setEditError('Image upload failed.');
        setEditSaving(false);
        return;
      }
    }

    try {
      // Send full_name and bio unconditionally so the user can clear them.
      // Only include profile_picture_url when there is one to set.
      const payload = {
        full_name: editForm.full_name,
        bio: editForm.bio,
      };
      if (pictureUrl) payload.profile_picture_url = pictureUrl;

      await updateMe(payload);
      setEditSuccess('Profile updated!');
      setEditing(false);
      loadProfile();
    } catch (err) {
      setEditError(err?.response?.data?.detail || 'Update failed.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert('Failed to delete post.');
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container">

        {profileLoading && <p className="state-msg">Loading profile…</p>}
        {profileError   && <p className="state-error">{profileError}</p>}

        {profile && (
          <>
            {/* Profile header card */}
            <div className="profile-card">
              <div className="profile-pic-wrap">
                {profile.profile_picture_url ? (
                  <img
                    src={mediaUrl(profile.profile_picture_url)}
                    alt="Profile"
                    className="profile-pic"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="profile-pic-placeholder">
                    {(profile.username || '?')[0].toUpperCase()}
                  </div>
                )}
              </div>

              <div className="profile-info">
                <h2 className="profile-name">{profile.full_name || profile.username}</h2>
                <p className="profile-handle">@{profile.username}</p>
                {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                <div className="profile-stats">
                  <span><strong>{profile.post_count ?? 0}</strong> posts</span>
                  <span><strong>{profile.destinations_visited?.length ?? 0}</strong> destinations</span>
                  <button
                    className="stat-link"
                    onClick={() => setSocialTab(socialTab === 'followers' ? null : 'followers')}
                  >
                    <strong>{followers.length}</strong> followers
                  </button>
                  <button
                    className="stat-link"
                    onClick={() => setSocialTab(socialTab === 'following' ? null : 'following')}
                  >
                    <strong>{following.length}</strong> following
                  </button>
                </div>

                <div className="profile-actions">
                  {isOwnProfile ? (
                    <button
                      className="btn-primary-sm"
                      onClick={() => { setEditing(!editing); setEditError(''); setEditSuccess(''); }}
                    >
                      {editing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                  ) : (
                    me && (
                      isFollowing
                        ? <button onClick={handleUnfollow} disabled={followBusy} className="btn-secondary-sm">
                            {followBusy ? '…' : 'Unfollow'}
                          </button>
                        : <button onClick={handleFollow} disabled={followBusy} className="btn-primary-sm">
                            {followBusy ? '…' : 'Follow'}
                          </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Edit profile form */}
            {editing && (
              <div className="form-card">
                <h3 className="section-title">Edit Profile</h3>
                {editError   && <p className="state-error">{editError}</p>}
                {editSuccess && <p className="state-success">{editSuccess}</p>}
                <form onSubmit={handleEditSave}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
                  />
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell travelers about yourself…"
                  />
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => setEditFile(e.target.files[0] || null)}
                  />
                  {editFile && <p className="form-hint">Selected: {editFile.name}</p>}
                  <button type="submit" className="auth-btn" disabled={editSaving}>
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Followers / Following panel */}
            {socialTab && (
              <div className="social-panel">
                <h3 className="section-title">
                  {socialTab === 'followers' ? 'Followers' : 'Following'}
                </h3>
                {(socialTab === 'followers' ? followers : following).map((u) => (
                  <div key={u.id} className="user-card">
                    <div className="user-card-info">
                      <Link to={`/profile/${u.id}`} className="user-card-name">
                        {u.full_name || u.username}
                      </Link>
                      <span className="user-card-handle">@{u.username}</span>
                    </div>
                  </div>
                ))}
                {(socialTab === 'followers' ? followers : following).length === 0 && (
                  <p className="state-msg">None yet.</p>
                )}
              </div>
            )}

            {/* Posts by this user */}
            <h3 className="section-title">Posts</h3>
            {postsLoading && <p className="state-msg">Loading posts…</p>}
            {!postsLoading && posts.length === 0 && (
              <p className="state-msg">No posts yet.</p>
            )}
            <div className="post-list">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canDelete={isOwnProfile}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}