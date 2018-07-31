import React, { Component } from 'react'
import TokenHubContract from '../build/contracts/TokenHub.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const TokenHub = contract(TokenHubContract)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: null,
      ethbalance: null,
      tokenName: undefined,
      tokenSymbol: undefined,
      tokenSupply: undefined,
      tokenHubAddress: null,
      deployedTokenAddress: null,
      fiatTokenAddress:null
    }

    this.handletokenName = this.handletokenName.bind(this);
    this.handletokenSymbol = this.handletokenSymbol.bind(this);
    this.handletokenSupply = this.handletokenSupply.bind(this);

  }

  handletokenName = (e) => {
    this.setState({tokenName: e.target.value})
  }

  handletokenSymbol = (e) => {
    this.setState({tokenSymbol: e.target.value})
  }

  handletokenSupply = (e) => {
    this.setState({tokenSupply: e.target.value})
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


  deployTokenHandler = e => {
    e.preventDefault();
    TokenHub.deployed().then(instance =>{
        instance.createToken(this.state.tokenName,this.state.tokenSymbol, this.state.tokenSupply, {from: this.state.account, gas: 4000000})
        .then(txObj => {
          console.log('Transaction Receipt', txObj)
          console.log('Token has been deployed!!!!')
          console.log('Deployed Token Address:', txObj.logs[0].args.token );
          this.setState({deployedTokenAddress: txObj.logs[0].args.token})
        })      
    })
  }

  setFiatTokenHandler = e => {
    e.preventDefault();
    this.setState({fiatTokenAddress: this.state.deployedTokenAddress})
  }
  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    TokenHub.setProvider(this.state.web3.currentProvider)
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

    //Get eth balances
    this.state.web3.eth.getBalance(this.state.account, (error, _balance)=>{
        
      this.setState({
          ethbalance: this.state.web3.fromWei(_balance.toString(10), "ether")
      });

        console.log("eth balance", this.state.ethbalance);
    })


    })

    TokenHub.deployed().then(instance => {

      let tokenAddress = instance.address

      this.setState({
        tokenHubAddress: tokenAddress
      });

      console.log('TokenHub Address:',tokenAddress);

      
    })




  }


  render() {
    //console.log(TokenHub);
    return (
      <div className="App">
        <h1>ICHX Token Deployer and Distributor</h1>
        <p>Account Number: {this.state.account} </p>
        <p>Account ETH Balance: {this.state.ethbalance} ETH </p>
        <p>Token Hub Contract Address: {this.state.tokenHubAddress}</p>
          <form>
            <input type="text" name="Token Name" placeholder="Token Name" value={this.state.tokenName} onChange={this.handletokenName}/>
            <input type="text" name="Token Symbol" placeholder="Token Symbol" value={this.state.tokenSymbol} onChange={this.handletokenSymbol}/>
            <input type="number" name="Token Supply" placeholder="Token Supply" value={this.state.tokenSupply} onChange={this.handletokenSupply}/>
            <button onClick={this.deployTokenHandler}>Deploy Token</button>
            <button onClick={this.setFiatTokenHandler}>Set Fiat Token</button>
          </form>
        <p>Deployed Token Contract Address: {this.state.deployedTokenAddress}</p>
        <table>
          <tr>
            <th>Accounts</th>
            <th>Addresses</th>
            <th>{this.state.tokenName} Token Balance</th>
          </tr>
        </table>

      </div>
    );
  }
}

export default App
