import { useEffect, useState } from 'react';
import { getMyPolicies, getMyClaims, fileClaim } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

const EMPTY_FORM = { policyId: '', incidentDate: '', claimType: '', claimDescription: '', claimAmount: '' };

export default function CustomerClaims() {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    getMyClaims().then((r) => setClaims(r.data)).catch(() => {});
    getMyPolicies().then((r) => setPolicies(r.data.filter((p) => p.status === 'ACTIVE'))).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const { data } = await fileClaim({
        policyId: Number(form.policyId),
        incidentDate: form.incidentDate,
        claimType: form.claimType,
        claimDescription: form.claimDescription,
        claimAmount: Number(form.claimAmount)
      });
      setMessage(`Claim filed successfully: ${data.claimNumber}`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not file claim');
    }
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <h1>My Claims</h1>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close' : 'File a New Claim'}
        </button>
      </div>

      <AlertBanner type="success" message={message} onDismiss={() => setMessage('')} />
      <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

      {showForm && (
        <Card title="File a Claim">
          <form className="grid-2" onSubmit={handleSubmit}>
            <div>
              <label>Policy</label>
              <select value={form.policyId} onChange={(e) => setForm({ ...form, policyId: e.target.value })} required>
                <option value="">Select active policy</option>
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>{p.policyNumber} — {p.productName}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Incident date</label>
              <input type="date" value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} required />
            </div>
            <div>
              <label>Claim type</label>
              <input value={form.claimType} onChange={(e) => setForm({ ...form, claimType: e.target.value })} placeholder="e.g. Hospitalization" required />
            </div>
            <div>
              <label>Claim amount</label>
              <input type="number" step="0.01" value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: e.target.value })} required />
            </div>
            <div className="span-2">
              <label>Description</label>
              <textarea rows="3" value={form.claimDescription} onChange={(e) => setForm({ ...form, claimDescription: e.target.value })} />
            </div>
            <div className="span-2">
              <button type="submit" className="btn-primary">Submit Claim</button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Claim History">
        <table className="data-table">
          <thead>
            <tr><th>Claim #</th><th>Policy #</th><th>Type</th><th>Incident Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id}>
                <td>{c.claimNumber}</td>
                <td>{c.policyNumber}</td>
                <td>{c.claimType}</td>
                <td>{c.incidentDate}</td>
                <td>₹{Number(c.claimAmount).toLocaleString()}</td>
                <td><StatusBadge status={c.status} /></td>
              </tr>
            ))}
            {claims.length === 0 && <tr><td colSpan={6} className="empty-row">No claims filed yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
