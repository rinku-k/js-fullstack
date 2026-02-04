import { useState } from 'react';
import api from '../api';

function CreateEnvelopeForm({ onUpdate }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.post('/envelopes', { name });
      setName('');
      onUpdate();
    } catch (err) {
      alert('Failed to create envelope');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card create-envelope-card">
      <h3>Create New Envelope</h3>
      <form onSubmit={handleSubmit} className="inline-form">
        <input 
          type="text" 
          placeholder="Envelope Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={loading}>Create</button>
      </form>
    </div>
  );
}

export default CreateEnvelopeForm;
