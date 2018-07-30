import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      account: null,
      ethbalance: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(error => {
      console.log(error)
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      if(error!=null){
          alert("There was an error fetching your accounts.");
          return;
      }

      if(accounts.length===0){
          alert("Couldn't get any accounts. Make sure your Ethereum client is configured.")
          return;
      }

      this.setState({
        account: accounts[0]
      });

      console.log("using account", accounts[0]); 

      this.state.web3.eth.getBalance(this.state.account, (error, _balance)=>{
        
        this.setState({
          ethbalance: this.state.web3.fromWei(_balance.toString(10), "ether")
        });

        console.log("eth balance", this.state.ethbalance);
      })

    })


  }

  render() {
    return (
      <div className="App">
        <h1>ICHX Token Deployer and Distributor</h1>
        <p>Account Number: {this.state.account} </p>
        <p>Account Balance: {this.state.ethbalance} ETH </p>

      </div>
    );
  }
}

export default App
