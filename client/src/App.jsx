import { useEffect, useState } from 'react';
import api from './api';
import IncomeCard from './components/IncomeCard';
import CreateEnvelopeForm from './components/CreateEnvelopeForm';
import EnvelopeList from './components/EnvelopeList';

function App() {
  const [income, setIncome] = useState(0);
  const [envelopes, setEnvelopes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [userRes, envelopesRes] = await Promise.all([
        api.get('/user'),
        api.get('/envelopes')
      ]);
      setIncome(Number(userRes.data.amount));
      setEnvelopes(envelopesRes.data.list);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <header className="app-header">
        <h1>Envelope Budget</h1>
      </header>
      
      {loading ? <p>Loading...</p> : (
        <div className="dashboard-grid">
          <section className="left-panel">
            <IncomeCard income={income} onUpdate={fetchData} />
            <CreateEnvelopeForm onUpdate={fetchData} />
          </section>

          <section className="main-content">
            <h2>Your Envelopes</h2>
            {envelopes.length === 0 ? (
                <p className="empty-state">No envelopes yet. Create one!</p>
            ) : (
                <EnvelopeList envelopes={envelopes} onUpdate={fetchData} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
