import { useRef, useState } from 'react';
import StockList from './components/StockList';
import AddStock from './components/AddStock';

function App() {
  // Simple refresh approach — just re-render
  const [key, setKey] = useState(0);

  return (
    <div>
      <h1>Stock Tracker</h1>
      <AddStock onAdded={() => setKey(k => k + 1)} />
      <StockList key={key} />
    </div>
  );
}

export default App;