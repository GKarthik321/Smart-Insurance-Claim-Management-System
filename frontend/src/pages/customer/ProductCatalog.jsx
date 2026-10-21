import { useEffect, useState } from 'react';
import { getProducts, purchasePolicy } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState(null);
  const [nominee, setNominee] = useState({ nomineeName: '', nomineeRelation: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function loadProducts(cat) {
    getProducts(cat || undefined).then((r) => setProducts(r.data)).catch(() => {});
  }

  useEffect(() => { loadProducts(); }, []);

  async function handlePurchase(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await purchasePolicy({
        productId: selected.id,
        nomineeName: nominee.nomineeName,
        nomineeRelation: nominee.nomineeRelation
      });
      setMessage(`Policy purchased successfully: ${data.policyNumber}`);
      setSelected(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not purchase policy');
    }
  }

  return (
    <div className="page">
      <h1>Insurance Products</h1>
      <p className="page-subtitle">Browse and purchase coverage that fits your needs.</p>

      <AlertBanner type="success" message={message} onDismiss={() => setMessage('')} />
      <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

      <div className="filter-bar">
        {['', 'HEALTH', 'MOTOR', 'LIFE', 'TRAVEL'].map((c) => (
          <button
            key={c || 'ALL'}
            className={`chip${category === c ? ' active' : ''}`}
            onClick={() => { setCategory(c); loadProducts(c); }}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="product-category">{p.productCategory}</div>
            <h3>{p.productName}</h3>
            <p className="product-desc">{p.description}</p>
            <div className="product-figures">
              <div><span>Coverage</span><strong>₹{Number(p.coverageAmount).toLocaleString()}</strong></div>
              <div><span>Premium</span><strong>₹{Number(p.premiumAmount).toLocaleString()}</strong></div>
              <div><span>Tenure</span><strong>{p.policyTenureMonths} mo</strong></div>
            </div>
            <button className="btn-secondary" onClick={() => setSelected(p)}>Purchase</button>
          </div>
        ))}
        {products.length === 0 && <p className="empty-row">No products available in this category.</p>}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <Card title={`Purchase: ${selected.productName}`}>
              <form onSubmit={handlePurchase}>
                <label>Nominee name</label>
                <input value={nominee.nomineeName} onChange={(e) => setNominee({ ...nominee, nomineeName: e.target.value })} required />
                <label>Nominee relation</label>
                <input value={nominee.nomineeRelation} onChange={(e) => setNominee({ ...nominee, nomineeRelation: e.target.value })} required />
                <div className="modal-actions">
                  <button type="button" className="btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
                  <button type="submit" className="btn-primary">Confirm Purchase</button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
