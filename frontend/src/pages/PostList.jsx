import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await client.get(`/posts?page=${page}&limit=10`);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await client.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Posts ({total})</h2>
        <Link to="/posts/new" className="btn btn-primary">+ New Post</Link>
      </div>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : posts.length === 0 ? (
        <div className="alert alert-info">No posts yet. Create your first post!</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td><span className={`badge bg-${post.status === 'published' ? 'success' : 'secondary'}`}>{post.status}</span></td>
                <td>{post.author?.name}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/posts/edit/${post._id}`} className="btn btn-sm btn-outline-primary me-1">Edit</Link>
                  <button onClick={() => handleDelete(post._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {Math.ceil(total / 10) > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(total / 10) }, (_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
