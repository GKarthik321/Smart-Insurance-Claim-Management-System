import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = {
  CUSTOMER: [
    { to: '/customer', label: 'Dashboard' },
    { to: '/customer/products', label: 'Insurance Products' },
    { to: '/customer/policies', label: 'My Policies' },
    { to: '/customer/claims', label: 'My Claims' },
    { to: '/customer/payments', label: 'Payments' }
  ],
  CLAIMS_OFFICER: [
    { to: '/officer/queue', label: 'Claims Queue' }
  ],
  ADMIN: [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/products', label: 'Manage Products' },
    { to: '/officer/queue', label: 'Claims Queue' }
  ],
  AGENT: [
    { to: '/agent', label: 'Agent Desk' }
  ]
};

export default function AppLayout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const items = auth ? NAV_ITEMS[auth.role] || [] : [];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SI</span>
          <div className="brand-text">
            <strong>Smart Insurance</strong>
            <small>Claim Management</small>
          </div>
        </div>

        <nav className="nav-links">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {auth && (
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="avatar">{auth.username?.[0]?.toUpperCase()}</div>
              <div>
                <div className="user-name">{auth.username}</div>
                <div className="user-role">{auth.role.replace('_', ' ')}</div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Sign out</button>
          </div>
        )}
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
