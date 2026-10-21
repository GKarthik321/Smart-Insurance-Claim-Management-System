import { useEffect, useState } from 'react';
import {
  getClaimQueue, markUnderReview, requestDocuments, approveClaim, rejectClaim, settleClaim
} from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

const STATUS_FILTERS = ['', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_REQUIRED', 'APPROVED', 'REJECTED', 'SETTLED'];

export default function OfficerQueue() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState('');
  const [active, setActive] = useState(null);
  const [comments, setComments] = useState('');
  const [settledAmount, setSettledAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load(status) {
    getClaimQueue(status || undefined).then((r) => setClaims(r.data)).catch(() => {});
  }

  useEffect(() => { load(filter); }, [filter]);

  async function act(action, id, payload) {
    setError(''); setMessage('');
    try {
      await action(id, payload);
      setMessage('Claim updated successfully.');
      setActive(null);
      setComments('');
      setSettledAmount('');
      load(filter);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  }

  return (
    <div className="page">
      <h1>Claims Review Queue</h1>
      <p className="page-subtitle">Review, approve, reject, and settle customer claims.</p>

      <AlertBanner type="success" message={message} onDismiss={() => setMessage('')} />
      <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

      <div className="filter-bar">
        {STATUS_FILTERS.map((s) => (
          <button key={s || 'ALL'} className={`chip${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
            {s ? s.replaceAll('_', ' ') : 'All'}
          </button>
        ))}
      </div>

      <Card>
        <table className="data-table">
          <thead>
            <tr><th>Claim #</th><th>Policy #</th><th>Type</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id}>
                <td>{c.claimNumber}</td>
                <td>{c.policyNumber}</td>
                <td>{c.claimType}</td>
                <td>₹{Number(c.claimAmount).toLocaleString()}</td>
                <td><StatusBadge status={c.status} /></td>
                <td className="row-actions">
                  <button className="btn-link" onClick={() => setActive(c)}>Review</button>
                </td>
              </tr>
            ))}
            {claims.length === 0 && <tr><td colSpan={6} className="empty-row">No claims in this filter.</td></tr>}
          </tbody>
        </table>
      </Card>

      {active && (
        <div className="modal-backdrop" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <Card title={`Review Claim ${active.claimNumber}`} subtitle={active.claimDescription}>
              <p><strong>Type:</strong> {active.claimType}</p>
              <p><strong>Amount claimed:</strong> ₹{Number(active.claimAmount).toLocaleString()}</p>
              <p><strong>Current status:</strong> <StatusBadge status={active.status} /></p>

              <label>Comments</label>
              <textarea rows="3" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Reviewer notes…" />

              <label>Settled amount (for approve/settle)</label>
              <input type="number" step="0.01" value={settledAmount} onChange={(e) => setSettledAmount(e.target.value)} placeholder={active.claimAmount} />

              <div className="modal-actions wrap">
                <button className="btn-ghost" onClick={() => act(markUnderReview, active.id)}>Mark Under Review</button>
                <button className="btn-ghost" onClick={() => act((id) => requestDocuments(id, comments), active.id)}>Request Documents</button>
                <button className="btn-secondary" onClick={() => act(approveClaim, active.id, { comments, settledAmount: settledAmount ? Number(settledAmount) : undefined })}>Approve</button>
                <button className="btn-danger" onClick={() => act(rejectClaim, active.id, { comments })}>Reject</button>
                <button className="btn-primary" onClick={() => act(settleClaim, active.id, { comments, settledAmount: settledAmount ? Number(settledAmount) : undefined })}>Settle</button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
