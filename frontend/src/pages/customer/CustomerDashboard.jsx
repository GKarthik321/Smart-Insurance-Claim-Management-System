import { useEffect, useState } from 'react';
import { getMyPolicies, getMyClaims, getMyPayments } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CustomerDashboard() {
  const { auth } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getMyPolicies().then((r) => setPolicies(r.data)).catch(() => {});
    getMyClaims().then((r) => setClaims(r.data)).catch(() => {});
    getMyPayments().then((r) => setPayments(r.data)).catch(() => {});
  }, []);

  const activePolicies = policies.filter((p) => p.status === 'ACTIVE').length;
  const openClaims = claims.filter((c) => !['SETTLED', 'REJECTED'].includes(c.status)).length;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="page">
      <h1>Welcome back, {auth?.username}</h1>
      <p className="page-subtitle">Here&apos;s a snapshot of your insurance activity.</p>

      <div className="stat-grid">
        <div className="stat-card"><span className="stat-value">{activePolicies}</span><span className="stat-label">Active Policies</span></div>
        <div className="stat-card"><span className="stat-value">{openClaims}</span><span className="stat-label">Open Claims</span></div>
        <div className="stat-card"><span className="stat-value">{claims.length}</span><span className="stat-label">Total Claims Filed</span></div>
        <div className="stat-card"><span className="stat-value">₹{totalPaid.toLocaleString()}</span><span className="stat-label">Total Premium Paid</span></div>
      </div>

      <Card title="Recent Claims">
        <table className="data-table">
          <thead>
            <tr><th>Claim #</th><th>Type</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {claims.slice(0, 5).map((c) => (
              <tr key={c.id}>
                <td>{c.claimNumber}</td>
                <td>{c.claimType}</td>
                <td>₹{Number(c.claimAmount).toLocaleString()}</td>
                <td><StatusBadge status={c.status} /></td>
              </tr>
            ))}
            {claims.length === 0 && <tr><td colSpan={4} className="empty-row">No claims filed yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
