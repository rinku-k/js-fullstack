import { useEffect, useState } from 'react'
import api from './api'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking connection...')
  const [dbStatus, setDbStatus] = useState('Checking DB...')

  useEffect(() => {
    // Check Health
    api.get('/health')
      .then(res => setServerStatus(res.data.message || 'Connected'))
      .catch(err => setServerStatus('Error connecting to server: ' + err.message))

    // Check DB
    api.get('/db-check') // Assuming you add this to index.js as per plan, or we can test health first
      .then(res => setDbStatus('Database Connected at ' + res.data.time))
      .catch(err => setDbStatus('DB Error: ' + err.message))
  }, [])

  return (
    <div className="container">
      <h1>Fullstack Boilerplate</h1>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>System Status</h2>
        <p><strong>Server:</strong> {serverStatus}</p>
        <p><strong>Database:</strong> {dbStatus}</p>
      </div>
    </div>
  )
}

export default App
