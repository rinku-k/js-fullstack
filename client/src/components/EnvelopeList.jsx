import { useState } from 'react';
import api from '../api';

function EnvelopeList({ envelopes, onUpdate }) {
  return (
    <div className="envelope-list">
      {envelopes.map(env => (
        <EnvelopeItem key={env.id} envelope={env} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

function EnvelopeItem({ envelope, onUpdate }) {
  const [action, setAction] = useState(null); // 'move' | 'spend' | null
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      if (action === 'move') {
        await api.post(`/income?amount=${parseFloat(amount)}&envelopId=${envelope.id}`);
      } else if (action === 'spend') {
        await api.post(`/envelopes/${envelope.id}/spend?amount=${parseFloat(amount)}`);
      }
      setAmount('');
      setAction(null);
      onUpdate();
    } catch (err) {
      alert('Action failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card envelope-item">
      <div className="env-header">
        <h3>{envelope.name}</h3>
        <span className="balance">${Number(envelope.amount).toFixed(2)}</span>
      </div>

      <div className="env-actions">
        {!action && (
          <>
            <button onClick={() => setAction('move')} className="btn-small btn-secondary">Add Funds</button>
            <button onClick={() => setAction('spend')} className="btn-small btn-danger">Spend</button>
          </>
        )}
        
        {action && (
          <form onSubmit={handleSubmit} className="action-form">
            <input 
              autoFocus
              type="number" 
              placeholder="Amount" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
            <button type="submit" disabled={loading}>
                {action === 'move' ? 'Move' : 'Spend'}
            </button>
            <button 
                type="button" 
                className="btn-text" 
                onClick={() => { setAction(null); setAmount(''); }}
            >
                Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EnvelopeList;
