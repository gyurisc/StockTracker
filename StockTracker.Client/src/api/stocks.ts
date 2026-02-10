import axios from 'axios';

export interface Stock {
  id: number;
  ticker: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  purchasedAt: string;
  notes?: string;
}

const api = axios.create({
  baseURL: '/api',
});

export const getStocks = () => api.get<Stock[]>('/stocks');
export const createStock = (stock: Omit<Stock, 'id'>) => api.post<Stock>('/stocks', stock);
export const deleteStock = (id: number) => api.delete(`/stocks/${id}`);