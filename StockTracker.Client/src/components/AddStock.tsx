import { useState } from 'react';
import { createStock } from '../api/stocks';

export default function AddStock({ onAdded }: { onAdded: () => void }) {
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Ticker (e.g. AAPL)" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value })} required />
      <input placeholder="Company name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input type="number" placeholder="Price" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: +e.target.value })} required />
      <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} required />
      <input type="date" value={form.purchasedAt} onChange={e => setForm({ ...form, purchasedAt: e.target.value })} required />
      <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      <button type="submit">Add Stock</button>
    </form>
  );
}