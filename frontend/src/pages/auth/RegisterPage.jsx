import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

const EMPTY_FORM = { username: '', password: '', email: '', firstName: '', lastName: '', phone: '', address: '' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel wide">
        <div className="auth-brand">
          <span className="brand-mark large">SI</span>
          <h1>Smart Insurance</h1>
          <p>Create your customer account</p>
        </div>

        <form className="auth-form grid-2" onSubmit={handleSubmit}>
          <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

          <div><label>First name</label><input value={form.firstName} onChange={update('firstName')} required /></div>
          <div><label>Last name</label><input value={form.lastName} onChange={update('lastName')} required /></div>
          <div><label>Username</label><input value={form.username} onChange={update('username')} required /></div>
          <div><label>Email</label><input type="email" value={form.email} onChange={update('email')} required /></div>
          <div><label>Password</label><input type="password" value={form.password} onChange={update('password')} required /></div>
          <div><label>Phone</label><input value={form.phone} onChange={update('phone')} /></div>
          <div className="span-2"><label>Address</label><input value={form.address} onChange={update('address')} /></div>

          <div className="span-2">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
            <p className="auth-switch">
              Already registered? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
