import { useEffect, useState } from 'react';
import { getAllPolicies, getProducts, approvePolicy, rejectPolicy } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

export default function AgentDashboard() {
  const [policies, setPolicies] = useState([]);
  const [products, setProducts] = useState([]);

  const loadPolicies = () => getAllPolicies().then((r) => setPolicies(r.data)).catch(() => {});

  useEffect(() => {
    loadPolicies();
    getProducts().then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  const handleApprove = (id) => approvePolicy(id).then(loadPolicies);
  const handleReject = (id) => rejectPolicy(id).then(loadPolicies);

  return (
    <div className="page">
      <h1>Agent Desk</h1>
      <p className="page-subtitle">Assist customers with policies and view available products.</p>

      <Card title="All Customer Policies">
        <table className="data-table">
          <thead>
            <tr><th>Policy #</th><th>Customer</th><th>Product</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id}>
                <td>{p.policyNumber}</td>
                <td>{p.customerName}</td>
                <td>{p.productName}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  {p.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleApprove(p.id)}>Approve</button>{' '}
                      <button onClick={() => handleReject(p.id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {policies.length === 0 && <tr><td colSpan={5} className="empty-row">No policies found.</td></tr>}
          </tbody>
        </table>
      </Card>

      <Card title="Available Products">
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-category">{p.productCategory}</div>
              <h3>{p.productName}</h3>
              <div className="product-figures">
                <div><span>Coverage</span><strong>₹{Number(p.coverageAmount).toLocaleString()}</strong></div>
                <div><span>Premium</span><strong>₹{Number(p.premiumAmount).toLocaleString()}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
