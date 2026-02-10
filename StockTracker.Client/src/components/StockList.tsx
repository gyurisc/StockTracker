import { useEffect, useState } from 'react';
import type { Stock } from '../api/stocks';
import { getStocks, deleteStock } from '../api/stocks';

export default function StockList() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const load = async () => {
    const res = await getStocks();
    setStocks(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    await deleteStock(id);
    load();
  };

  return (
    <div>
      <h2>My Stocks</h2>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(s => (
            <tr key={s.id}>
              <td>{s.ticker}</td>
              <td>{s.name}</td>
              <td>{s.quantity}</td>
              <td>${s.purchasePrice.toFixed(2)}</td>
              <td>{new Date(s.purchasedAt).toLocaleDateString()}</td>
              <td><button onClick={() => handleDelete(s.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}