import { useEffect, useState } from 'react';
import { getAdminSummary } from '../../api/endpoints';
import Card from '../../components/Card.jsx';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAdminSummary().then((r) => setSummary(r.data)).catch(() => {});
  }, []);

  if (!summary) return <div className="page"><h1>Admin Overview</h1><p>Loading…</p></div>;

  return (
    <div className="page">
      <h1>Admin Overview</h1>
      <p className="page-subtitle">Platform-wide claims and revenue summary.</p>

      <div className="stat-grid">
        <div className="stat-card"><span className="stat-value">₹{Number(summary.premiumCollection).toLocaleString()}</span><span className="stat-label">Premium Collection</span></div>
        <div className="stat-card"><span className="stat-value">{summary.claimsSettlementRatio}%</span><span className="stat-label">Settlement Ratio</span></div>
        <div className="stat-card"><span className="stat-value">{summary.totalClaims}</span><span className="stat-label">Total Claims</span></div>
        <div className="stat-card"><span className="stat-value">{summary.approvedClaims}</span><span className="stat-label">Approved</span></div>
        <div className="stat-card"><span className="stat-value">{summary.rejectedClaims}</span><span className="stat-label">Rejected</span></div>
        <div className="stat-card"><span className="stat-value">{summary.pendingClaims}</span><span className="stat-label">Pending</span></div>
        <div className="stat-card"><span className="stat-value">{summary.settledClaims}</span><span className="stat-label">Settled</span></div>
      </div>

      <Card title="Quick Links">
        <p>Use the sidebar to manage insurance products or review the claims queue.</p>
      </Card>
    </div>
  );
}
