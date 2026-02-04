import { useState } from 'react';
import api from '../api';

function IncomeCard({ income, onUpdate }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    setLoading(true);
    try {
      await api.post(`/income?amount=${parseFloat(amount)}`);
      setAmount('');
      onUpdate();
    } catch (err) {
      alert('Failed to add income');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card income-card">
      <h2>Total Unallocated Income</h2>
      <div className="amount">${income.toFixed(2)}</div>
      
      <form onSubmit={handleAddIncome} className="inline-form">
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Income'}
        </button>
      </form>
    </div>
  );
}

export default IncomeCard;
