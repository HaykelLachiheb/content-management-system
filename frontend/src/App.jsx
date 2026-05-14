import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostList from './pages/PostList';
import PostForm from './pages/PostForm';
import CategoryList from './pages/CategoryList';
import MediaList from './pages/MediaList';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>
      {user && <Header />}
      <div className={user ? 'container mt-4' : ''}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/posts" element={<PrivateRoute><PostList /></PrivateRoute>} />
          <Route path="/posts/new" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          <Route path="/posts/edit/:id" element={<PrivateRoute><PostForm /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
          <Route path="/media" element={<PrivateRoute><MediaList /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
