import { useState, useEffect } from 'react';
import client from '../api/client';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const fetch = async () => {
    const { data } = await client.get('/categories');
    setCategories(data.categories);
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/categories', { name, description });
      setName('');
      setDescription('');
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  const handleUpdate = async (id) => {
    setError('');
    try {
      await client.put(`/categories/${id}`, { name, description });
      setEditing(null);
      setName('');
      setDescription('');
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await client.delete(`/categories/${id}`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (cat) => {
    setEditing(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  return (
    <div className="row">
      <div className="col-lg-6">
        <h2 className="mb-3">Categories</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={editing ? (e) => { e.preventDefault(); handleUpdate(editing); } : handleCreate}>
          <div className="input-group mb-2">
            <input type="text" className="form-control" placeholder="Category name" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-2">
            <textarea className="form-control" placeholder="Description (optional)" value={description}
              onChange={(e) => setDescription(e.target.value)} rows="2" />
          </div>
          <button className="btn btn-primary btn-sm">
            {editing ? 'Update' : 'Add Category'}
          </button>
          {editing && (
            <button type="button" className="btn btn-secondary btn-sm ms-1"
              onClick={() => { setEditing(null); setName(''); setDescription(''); }}>
              Cancel
            </button>
          )}
        </form>
        <ul className="list-group mt-3">
          {categories.map((cat) => (
            <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{cat.name}</strong>
                {cat.description && <p className="mb-0 text-muted small">{cat.description}</p>}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(cat)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
