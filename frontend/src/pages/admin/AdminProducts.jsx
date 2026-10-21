import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deactivateProduct } from '../../api/endpoints';
import Card from '../../components/Card.jsx';
import AlertBanner from '../../components/AlertBanner.jsx';

const EMPTY_FORM = { productName: '', productCategory: 'HEALTH', coverageAmount: '', premiumAmount: '', policyTenureMonths: '', description: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    getProducts().then((r) => setProducts(r.data)).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      productName: p.productName,
      productCategory: p.productCategory,
      coverageAmount: p.coverageAmount,
      premiumAmount: p.premiumAmount,
      policyTenureMonths: p.policyTenureMonths,
      description: p.description || ''
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setMessage('');
    const payload = {
      productName: form.productName,
      productCategory: form.productCategory,
      coverageAmount: Number(form.coverageAmount),
      premiumAmount: Number(form.premiumAmount),
      policyTenureMonths: Number(form.policyTenureMonths),
      description: form.description
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Product updated.');
      } else {
        await createProduct(payload);
        setMessage('Product created.');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  }

  async function handleDeactivate(id) {
    setError(''); setMessage('');
    try {
      await deactivateProduct(id);
      setMessage('Product deactivated.');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not deactivate product');
    }
  }

  return (
    <div className="page">
      <h1>Manage Insurance Products</h1>
      <AlertBanner type="success" message={message} onDismiss={() => setMessage('')} />
      <AlertBanner type="error" message={error} onDismiss={() => setError('')} />

      <Card title={editingId ? 'Edit Product' : 'Create Product'}>
        <form className="grid-2" onSubmit={handleSubmit}>
          <div><label>Product name</label><input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required /></div>
          <div>
            <label>Category</label>
            <select value={form.productCategory} onChange={(e) => setForm({ ...form, productCategory: e.target.value })}>
              <option value="HEALTH">Health</option>
              <option value="MOTOR">Motor</option>
              <option value="LIFE">Life</option>
              <option value="TRAVEL">Travel</option>
            </select>
          </div>
          <div><label>Coverage amount</label><input type="number" value={form.coverageAmount} onChange={(e) => setForm({ ...form, coverageAmount: e.target.value })} required /></div>
          <div><label>Premium amount</label><input type="number" value={form.premiumAmount} onChange={(e) => setForm({ ...form, premiumAmount: e.target.value })} required /></div>
          <div><label>Tenure (months)</label><input type="number" value={form.policyTenureMonths} onChange={(e) => setForm({ ...form, policyTenureMonths: e.target.value })} required /></div>
          <div className="span-2"><label>Description</label><textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="span-2">
            <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Product'}</button>
            {editingId && <button type="button" className="btn-ghost" onClick={resetForm}>Cancel edit</button>}
          </div>
        </form>
      </Card>

      <Card title="Existing Products">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Coverage</th><th>Premium</th><th>Tenure</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.productName}</td>
                <td>{p.productCategory}</td>
                <td>₹{Number(p.coverageAmount).toLocaleString()}</td>
                <td>₹{Number(p.premiumAmount).toLocaleString()}</td>
                <td>{p.policyTenureMonths} mo</td>
                <td>{p.active ? 'Yes' : 'No'}</td>
                <td className="row-actions">
                  <button className="btn-link" onClick={() => startEdit(p)}>Edit</button>
                  {p.active && <button className="btn-link danger" onClick={() => handleDeactivate(p.id)}>Deactivate</button>}
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={7} className="empty-row">No products yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
