import { useEffect, useState } from 'react';
import { getMyPolicies, getMyPayments, makePayment } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

export default function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ policyId: '', amount: '', paymentMethod: 'CARD' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    getMyPayments().then((r) => setPayments(r.data)).catch(() => {});
    getMyPolicies().then((r) => setPolicies(r.data)).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const { data } = await makePayment({
        policyId: Number(form.policyId),
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod
      });
      setMessage(`Payment successful. Invoice: ${data.invoiceNumber}`);
      setForm({ policyId: '', amount: '', paymentMethod: 'CARD' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
  }

  return (
    <div className="page">
      <h1>Payments</h1>
      <AlertBanner type="success" message={message} onDismiss={() => setMessage('')} />
      <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

      <Card title="Pay Premium">
        <form className="grid-2" onSubmit={handleSubmit}>
          <div>
            <label>Policy</label>
            <select value={form.policyId} onChange={(e) => setForm({ ...form, policyId: e.target.value })} required>
              <option value="">Select policy</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.policyNumber} — ₹{Number(p.premiumAmount).toLocaleString()}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount</label>
            <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div>
            <label>Payment method</label>
            <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
              <option value="CARD">Card</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div className="span-2"><button type="submit" className="btn-primary">Pay Now</button></div>
        </form>
      </Card>

      <Card title="Payment History">
        <table className="data-table">
          <thead>
            <tr><th>Invoice</th><th>Policy #</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.invoiceNumber}</td>
                <td>{p.policyNumber}</td>
                <td>₹{Number(p.amount).toLocaleString()}</td>
                <td>{p.paymentMethod}</td>
                <td>{new Date(p.paymentDate).toLocaleString()}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="empty-row">No payments made yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
