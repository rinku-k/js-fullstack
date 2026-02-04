import { useEffect, useState } from 'react'
import api from './api'

export const Account = () => {
    const [accounts, setAccount] = useState([]);
    const [userId, setuserId] = useState("");
    const [amount, setAmount] = useState(0);

    const handleCreateAcc = () => {
        api.post('/accounts', { userId, amount })
            .then(res => console.log(res.data.list))
            .catch(err => console.err(err))
    };


    const getAccDetails = () => {
        api.get('/accounts')
            .then(res => setAccount(res.data.list))
            .catch(err => console.err(err))
    };

    return (
        <div className="container">
            <div style={{ padding: 10, borderColor: 'red', borderWidth: 1, margin: 10 }}>
                <h1>Create Account</h1>
                User Id : <input type='number' onChange={(e) => setuserId(+e.target.value)} value={userId} />
                Amount : <input type='number' onChange={(e) => setAmount(+e.target.value)} value={amount} />
                <button onClick={handleCreateAcc}>
                    Create Account
                </button>


                <button onClick={getAccDetails}>
                    List Accounts
                </button>
                <h2>All Accounts</h2>
                {!accounts.length && <p>No Accounts Yet</p>}
                {accounts.map((account, index) => (
                    <div style={{ borderWidth: 1, borderColor: 'black', margin: 10 }}>
                        <span>Account ID : {account.id} | </span>
                        <span>User : {account.userid} | </span>
                        <span>Balance : {account.balance}</span>
                    </div>
                ))
                }
            </div>

        </div>
    )
}
