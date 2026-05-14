import { useState, useEffect, useRef } from 'react';
import client from '../api/client';

export default function MediaList() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetch = async () => {
    const { data } = await client.get('/media');
    setMedia(data.media);
  };

  useEffect(() => { fetch(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      await client.post('/media', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    try {
      await client.delete(`/media/${id}`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Media Library</h2>
        <div>
          <input type="file" ref={fileRef} onChange={handleUpload} className="d-none" accept="image/*" />
          <button className="btn btn-primary" disabled={uploading} onClick={() => fileRef.current.click()}>
            {uploading ? 'Uploading...' : '+ Upload'}
          </button>
        </div>
      </div>
      <div className="row">
        {media.map((item) => (
          <div key={item._id} className="col-md-3 col-sm-4 col-6 mb-3">
            <div className="card">
              {item.mimetype.startsWith('image/') ? (
                <img src={`/${item.path}`} alt={item.originalName} className="card-img-top" style={{ height: '150px', objectFit: 'cover' }} />
              ) : (
                <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '150px' }}>
                  <span className="text-muted">{item.mimetype}</span>
                </div>
              )}
              <div className="card-body p-2">
                <p className="card-text small text-truncate mb-1">{item.originalName}</p>
                <button className="btn btn-sm btn-outline-danger w-100" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && !uploading && (
          <div className="col-12"><div className="alert alert-info">No media uploaded yet.</div></div>
        )}
      </div>
    </div>
  );
}
