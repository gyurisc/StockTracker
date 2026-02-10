import { useState } from 'react';
import type { Stock } from '../api/stocks';
import { deleteStock } from '../api/stocks';
import './StockList.css';

interface Props {
  stocks: Stock[];
  loading: boolean;
  onStockDeleted: () => void;
}

export default function StockList({ stocks, loading, onStockDeleted }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteStock(id);
      onStockDeleted();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section className="card">
        <h2 className="section-title">Portfolio</h2>
        <div className="skeleton-table">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-cell" />
              <div className="skeleton-cell skeleton-cell--wide" />
              <div className="skeleton-cell skeleton-cell--narrow" />
              <div className="skeleton-cell skeleton-cell--narrow" />
              <div className="skeleton-cell skeleton-cell--narrow" />
              <div className="skeleton-cell" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (stocks.length === 0) {
    return (
      <section className="card">
        <h2 className="section-title">Portfolio</h2>
        <div className="empty-state">
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <p className="empty-state-title">No stocks yet</p>
          <p className="empty-state-subtitle">Add your first position to start tracking your portfolio.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="section-title">Portfolio</h2>
      <div className="table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Name</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Value</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s, i) => (
              <tr
                key={s.id}
                className="stock-row"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <td className="ticker">{s.ticker}</td>
                <td>{s.name}</td>
                <td className="text-right mono">{s.quantity}</td>
                <td className="text-right mono">${s.purchasePrice.toFixed(2)}</td>
                <td className="text-right mono">${(s.purchasePrice * s.quantity).toFixed(2)}</td>
                <td className="text-secondary">{new Date(s.purchasedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                  >
                    {deletingId === s.id ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
