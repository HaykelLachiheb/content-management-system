import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', status: 'draft', categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const isEdit = Boolean(id);

  useEffect(() => {
    client.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
    if (isEdit) {
      client.get(`/posts/${id}`).then(({ data }) => {
        const p = data.post;
        setForm({
          title: p.title,
          content: p.content,
          excerpt: p.excerpt,
          status: p.status,
          categories: p.categories?.map((c) => c._id) || [],
        });
      }).catch(() => navigate('/posts'));
    }
  }, [id]);

  const handleCatToggle = (catId) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) {
        await client.put(`/posts/${id}`, form);
      } else {
        await client.post('/posts', form);
      }
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        <h2>{isEdit ? 'Edit Post' : 'New Post'}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Excerpt</label>
            <textarea className="form-control" rows="2" value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea className="form-control" rows="12" value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          {categories.length > 0 && (
            <div className="mb-3">
              <label className="form-label">Categories</label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <div className="form-check" key={cat._id}>
                    <input className="form-check-input" type="checkbox"
                      checked={form.categories.includes(cat._id)}
                      onChange={() => handleCatToggle(cat._id)} id={`cat-${cat._id}`} />
                    <label className="form-check-label" htmlFor={`cat-${cat._id}`}>{cat.name}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Post' : 'Create Post'}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/posts')}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
