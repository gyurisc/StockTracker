import { useState, useEffect } from 'react';
import { getStocks, type Stock } from './api/stocks';
import StockList from './components/StockList';
import AddStock from './components/AddStock';
import './App.css';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const res = await getStocks();
      setStocks(Array.isArray(res.data) ? res.data : []);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStocks(); }, []);

  const totalPositions = stocks.length;
  const totalValue = stocks.reduce((sum, s) => sum + s.purchasePrice * s.quantity, 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="logo">Stock<span className="logo-accent">Tracker</span></h1>
      </header>

      <div className="portfolio-summary">
        <div className="summary-stat">
          <span className="summary-label">Positions</span>
          <span className="summary-value">{totalPositions}</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Total Value</span>
          <span className="summary-value summary-value--money">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <main className="dashboard-content">
        <AddStock onAdded={loadStocks} />
        <StockList stocks={stocks} loading={loading} onStockDeleted={loadStocks} />
      </main>
    </div>
  );
}

export default App;
