import './App.css';

import web3 from './web3.js'
import lottery from './lottery'
import { useEffect, useState } from 'react';

function App() {

  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')

  /**
   * @param {SubmitEvent} event 
   */
  const onSubmit = async event => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    setMessage('Waiting on transaction success...')
    
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    })
    
    setMessage('You have been entered!')

  }

  useEffect(() => {
    const start = async () => {
      const manager = await lottery.methods.manager().call()
      const players = await lottery.methods.getPlayers().call()
      const balance = await web3.eth.getBalance(lottery.options.address)

      setManager(manager)
      setPlayers(players)
      setBalance(balance)
    }
    start()    
  }, [])

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contrtact is managed by {manager}</p>
      <p>There are currently {players.length} people in the lottery competing for {web3.utils.fromWei(balance, 'ether')} ether</p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter </label>
          <input 
            onChange={event => setValue(event.target.value)}
            value={value}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr/>
      <h1>{message}</h1>
    </div>
      
  );
}

export default App;
