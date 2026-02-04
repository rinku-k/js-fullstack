import { useEffect, useState } from 'react'
import api from './api'
import { Account } from './account';

function App() {
  const [fromAcc, setFromAccount] = useState("");
  const [toAcc, setToAccount] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const [transactions, setTransaction] = useState([]);

  const handleCreateTransactions = () => {
    api.post('/transactions', { fromAccount: fromAcc, toAccount: toAcc, amount: transferAmt })
      .then(res => console.log(res))
      .catch(err => console.error(err))
  };


  const getTransactions = () => {
    api.get(`/transactions?fromAccount=${fromAcc}&toAccount=${toAcc}`)
      .then(res => setTransaction(res.data.list))
      .catch(err => console.error(err))
  };

  return (
    <div className="container">
      <h1>Fullstack Boilerplate</h1>
      <div>
        <Account />
        <h1>Transactions</h1>
        <div style={{ padding: 10, borderColor: 'red', borderWidth: 1, margin: 10, gap: 20, flexDirection: 'column' }}>
          From Account Id : <input type='number' onChange={(e) => setFromAccount(+e.target.value)} value={fromAcc} />
          To Account Id : <input type='number' onChange={(e) => setToAccount(+e.target.value)} value={toAcc} />
          Amount : <input type='number' onChange={(e) => setTransferAmt(+e.target.value)} value={transferAmt} />
          <button onClick={handleCreateTransactions}>
            Create Transaction
          </button>
          <button onClick={getTransactions}>
            List Transactions
          </button>
          <p>Transactions : </p>
          {!transactions.length && <p>No Transactions Yet</p>}
          {transactions.map((transaction, index) => (
            <div style={{ borderWidth: 1, borderColor: 'black', margin: 10 }}>
              <span>ID : {transaction.id} | </span>
              <span>From : {transaction.fromaccount} | </span>
              <span>To : {transaction.toaccount} | </span>
              <span>Amount : {transaction.amount} | </span>
              <span>Type : {transaction.txn_type} | </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
