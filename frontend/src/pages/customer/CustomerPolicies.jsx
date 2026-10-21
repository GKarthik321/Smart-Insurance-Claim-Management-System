import { useEffect, useState } from 'react';
import { getMyPolicies, renewPolicy, cancelPolicy } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

export default function CustomerPolicies() {
  const [policies, setPolicies] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    getMyPolicies().then((r) => setPolicies(r.data)).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function handleRenew(id) {
    setError(''); setMessage('');
    try {
      await renewPolicy(id);
      setMessage('Policy renewed successfully.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not renew policy');
    }
  }

  async function handleCancel(id) {
    setError(''); setMessage('');
    try {
      await cancelPolicy(id);
      setMessage('Cancellation requested; pending admin approval.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not request cancellation');
    }
  }

  return (
    <div className="page">
      <h1>My Policies</h1>
      <AlertBanner type="success" message={message} onDismiss={() => setMessage('')} />
      <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

      <Card>
        <table className="data-table">
          <thead>
            <tr><th>Policy #</th><th>Product</th><th>Start</th><th>End</th><th>Premium</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id}>
                <td>{p.policyNumber}</td>
                <td>{p.productName}</td>
                <td>{p.startDate}</td>
                <td>{p.endDate}</td>
                <td>₹{Number(p.premiumAmount).toLocaleString()}</td>
                <td><StatusBadge status={p.status} /></td>
                <td className="row-actions">
                  {p.status === 'ACTIVE' && (
                    <>
                      <button className="btn-link" onClick={() => handleRenew(p.id)}>Renew</button>
                      <button className="btn-link danger" onClick={() => handleCancel(p.id)}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {policies.length === 0 && <tr><td colSpan={7} className="empty-row">You have no policies yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
