import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <span className="brand-mark large">SI</span>
          <h1>Smart Insurance</h1>
          <p>Claim Management System</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="e.g. admin"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="auth-switch">
            New customer? <Link to="/register">Create an account</Link>
          </p>

          <div className="demo-hint">
            <strong>Demo accounts:</strong>
            <div>admin / Admin@123</div>
            <div>officer1 / Officer@123</div>
            <div>agent1 / Agent@123</div>
          </div>
        </form>
      </div>
    </div>
  );
}
