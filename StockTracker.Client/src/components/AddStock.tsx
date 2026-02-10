import { useState } from 'react';
import { createStock } from '../api/stocks';
import './AddStock.css';

export default function AddStock({ onAdded }: { onAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    ticker: '',
    name: '',
    purchasePrice: 0,
    quantity: 0,
    purchasedAt: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createStock(form);
    onAdded();
    setForm({ ticker: '', name: '', purchasePrice: 0, quantity: 0, purchasedAt: new Date().toISOString().split('T')[0], notes: '' });
    setIsOpen(false);
  };

  return (
    <section className="card">
      <div className="add-stock-header">
        <h2 className="section-title">Add Position</h2>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Cancel' : '+ Add Stock'}
        </button>
      </div>

      <div className={`form-collapse ${isOpen ? 'form-collapse--open' : ''}`}>
        <div className="form-collapse-inner">
          <form className="add-stock-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Ticker</label>
                <input
                  className="form-input form-input--mono"
                  placeholder="AAPL"
                  value={form.ticker}
                  onChange={e => setForm({ ...form, ticker: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Company</label>
                <input
                  className="form-input"
                  placeholder="Apple Inc."
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Price</label>
                <input
                  className="form-input form-input--mono"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.purchasePrice || ''}
                  onChange={e => setForm({ ...form, purchasePrice: +e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Quantity</label>
                <input
                  className="form-input form-input--mono"
                  type="number"
                  placeholder="0"
                  value={form.quantity || ''}
                  onChange={e => setForm({ ...form, quantity: +e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Purchase Date</label>
                <input
                  className="form-input form-input--mono"
                  type="date"
                  value={form.purchasedAt}
                  onChange={e => setForm({ ...form, purchasedAt: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Notes</label>
                <input
                  className="form-input"
                  placeholder="Optional"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <button className="submit-btn" type="submit">Add to Portfolio</button>
          </form>
        </div>
      </div>
    </section>
  );
}
