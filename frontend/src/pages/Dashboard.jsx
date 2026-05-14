import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, categories: 0, media: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, catsRes, mediaRes] = await Promise.all([
          client.get('/posts?limit=1'),
          client.get('/categories'),
          client.get('/media'),
        ]);
        setStats({
          posts: postsRes.data.total,
          categories: catsRes.data.categories.length,
          media: mediaRes.data.media.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-bg-primary">
            <div className="card-body text-center py-4">
              <h1 className="display-4">{stats.posts}</h1>
              <h5>Posts</h5>
              <Link to="/posts" className="btn btn-light btn-sm mt-2">Manage Posts</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-bg-success">
            <div className="card-body text-center py-4">
              <h1 className="display-4">{stats.categories}</h1>
              <h5>Categories</h5>
              <Link to="/categories" className="btn btn-light btn-sm mt-2">Manage Categories</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-bg-warning">
            <div className="card-body text-center py-4">
              <h1 className="display-4">{stats.media}</h1>
              <h5>Media Files</h5>
              <Link to="/media" className="btn btn-light btn-sm mt-2">Manage Media</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
