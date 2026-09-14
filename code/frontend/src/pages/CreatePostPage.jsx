import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { uploadImage } from '../api/uploads';
import Navbar from '../components/Navbar';

/**
 * CreatePostPage - Protected page for composing a new post.
 * Flow: (optional) upload image → POST /uploads/images → POST /posts
 */
export default function CreatePostPage() {
  const navigate = useNavigate();

  const [content, setContent]             = useState('');
  const [destinationName, setDestName]    = useState('');
  const [imageFile, setImageFile]         = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState('');

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) { setError('Post content is required.'); return; }
    setError('');

    let imageUrl = null;

    // Step 1: upload image if selected
    if (imageFile) {
      setUploading(true);
      try {
        const upRes = await uploadImage(imageFile);
        imageUrl = upRes.data.url;
      } catch (err) {
        setError(err?.response?.data?.detail || 'Image upload failed.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Step 2: create the post
    setSubmitting(true);
    try {
      const postData = {
        content: content.trim(),
        destination_name: destinationName.trim() || null,
        image_url: imageUrl,
      };
      await createPost(postData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  const busy = uploading || submitting;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page-container narrow">
        <h2 className="page-title">Create Post</h2>

        {error && <p className="state-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form-card">
          <label className="form-label" htmlFor="content">What's on your mind?</label>
          <textarea
            id="content"
            className="form-textarea"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your travel experience…"
            required
          />

          <label className="form-label" htmlFor="destName">Destination</label>
          <input
            id="destName"
            type="text"
            className="form-input"
            value={destinationName}
            onChange={(e) => setDestName(e.target.value)}
            placeholder="e.g. Paris, France"
          />

          <label className="form-label" htmlFor="imgFile">Image (optional)</label>
          <input
            id="imgFile"
            type="file"
            accept="image/*"
            className="form-input"
            onChange={handleFileChange}
          />
          {imageFile && <p className="form-hint">Selected: {imageFile.name}</p>}

          <button type="submit" className="auth-btn" disabled={busy}>
            {uploading ? 'Uploading image…' : submitting ? 'Posting…' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}