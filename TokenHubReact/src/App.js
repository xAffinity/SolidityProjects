import React, { Component } from 'react'
//import Account from './Account/Account';

import TokenHubContract from '../build/contracts/TokenHub.json'
import TokenContract from '../build/contracts/SecurityToken.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const TokenHub = contract(TokenHubContract)
const Token = contract(TokenContract)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: undefined,
      account: undefined,
      ethbalance: undefined,
      tokenName: undefined,
      tokenSymbol: undefined,
      tokenSupply: undefined,
      tokenHubAddress: undefined,
      tokenHubInstance: undefined,
      deployedTokenAddress: undefined,
      deployedTokenInstance: undefined,
      deployedTokenBalance: undefined,
      fiatTokenInstance: undefined,
      fiatTokenBalance: undefined,
      fiatTokenSupply: undefined,
      fiatTokenSymbol: undefined,
      fiatTokenAmount: undefined,
      accounts: [],
      balances: [0,0,0,0,0],
      tokenBalances: [0,0,0,0,0],
      rate: undefined,
      investment: undefined,
      investments: []
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

  handlefiatAmount = e => {
    this.setState({fiatTokenAmount: e.target.value})
  }
  
  handleRate = e => {
    this.setState({rate: e.target.value})
  }

  handleInvestment = e => {
    this.setState({investment: e.target.value})
  }
  /*
  handleInvestment1 = e =>{
    const investment = this.state.investment
    investment[0] = e.target.value
    this.setState({investment: investment})
  }*/

 

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
        console.log('Creating token with:',this.state.tokenName, this.state.tokenSymbol, this.state.tokenSupply)
        this.setState({tokenHubInstance: instance})
        instance.createToken(this.state.tokenName,this.state.tokenSymbol, this.state.tokenSupply, {from: this.state.account, gas: 4000000})
        .then(txObj => {
          console.log('Transaction Receipt', txObj)
          console.log('Token has been deployed!!!!')
          console.log('Deployed Token Address:', txObj.logs[0].args.token );
          this.setState({deployedTokenAddress: txObj.logs[0].args.token})
          Token.setProvider(this.state.web3.currentProvider)
          let deployedTokenInstance = Token.at(this.state.deployedTokenAddress);
          this.setState({deployedTokenInstance: deployedTokenInstance})
          deployedTokenInstance.balanceOf(this.state.tokenHubAddress).then(_balance=>{
            let balance = this.state.web3.fromWei(_balance.toString(10), "ether")
            this.setState({deployedTokenBalance: balance});
          })
        })      
    })
  }

  setFiatTokenHandler = e => {
      e.preventDefault();
      Token.setProvider(this.state.web3.currentProvider)
      let fiatInstance = Token.at(this.state.deployedTokenAddress);
      console.log(this.state.account);
      console.log(fiatInstance);
      console.log(this.state.tokenSupply);
      this.setState({fiatTokenInstance: fiatInstance})

      fiatInstance.totalSupply().then(_supply =>{
        console.log(_supply);
        let supply = this.state.web3.fromWei(_supply.toString(10), "ether")
        this.setState({fiatTokenSupply: supply});
        console.log(supply);
      });

      fiatInstance.balanceOf(this.state.tokenHubAddress).then(_balance =>{
        console.log(_balance);
        let balance = this.state.web3.fromWei(_balance.toString(10), "ether")
        this.setState({fiatTokenBalance: balance});
        console.log(balance);
      }
      );

      this.setState({fiatTokenSymbol: this.state.tokenSymbol})
      this.setState({fiatTokenAddress: this.state.deployedTokenAddress})
      
  }

  sendFiatHandler = e =>{
    e.preventDefault();
    console.log(this.state.accounts.length)
    console.log(this.state.tokenHubInstance)
    console.log(this.state.fiatTokenAmount)
    let amount = this.state.web3.toWei(this.state.fiatTokenAmount, "ether");
    this.state.tokenHubInstance.testSendOutFiat(this.state.fiatTokenAddress,this.state.accounts,amount,{from: this.state.account, gas: 4000000})
    .then(txObj => {
      console.log('Transaction Receipt', txObj)
      console.log('Fiat Distributed')
      for(let i=0 ; i<this.state.accounts.length; i++){
        this.state.fiatTokenInstance.balanceOf(this.state.accounts[i]).then(_balance =>{
        console.log(_balance);
        let balance = this.state.web3.fromWei(_balance.toString(10), "ether")
        console.log(balance);
        const balances = this.state.balances;
        balances[i] = balance;

        this.setState({balances: balances})
      })
     }

     this.state.fiatTokenInstance.balanceOf(this.state.tokenHubAddress).then(_balance => {

        console.log(_balance);
        let balance = this.state.web3.fromWei(_balance.toString(10), "ether")
        console.log(balance);
        this.setState({fiatTokenBalance: balance})


     })
    })

  }

  investmentHandler = e =>{
    e.preventDefault();
    console.log(this.state.investment)
    let investment = this.state.web3.toWei(this.state.investment, "ether");
    this.state.fiatTokenInstance.approve(this.state.tokenHubAddress,investment,{from: this.state.accounts[0], gas: 4000000}).then(_approve=>{
      console.log(_approve);
    })
  }

  tokenDistributionHandler = e => {
    e.preventDefault();
    console.log(this.state.investment)
    //let investments = this.state.investment.map(e=>this.state.web3.toWei(e, "ether")); 
      let  investment = this.state.web3.toWei(this.state.investment,"ether");
    //console.log(investments)
    this.state.tokenHubInstance.convertAndDistributeToken(this.state.fiatTokenAddress, this.state.deployedTokenAddress, [this.state.account], [investment], this.state.rate,{from: this.state.account, gas: 6000000})
    .then(txObj=>{
      console.log(txObj);
      for(let i=0 ; i<this.state.accounts.length; i++){
        
        this.state.fiatTokenInstance.balanceOf(this.state.accounts[i]).then(_balance =>{
        let balance = this.state.web3.fromWei(_balance.toString(10), "ether")
        const balances = this.state.balances;
        balances[i] = balance;
        this.setState({balances: balances})
        })
        
        console.log(this.state.tokenBalances)
        Token.at(this.state.deployedTokenAddress).balanceOf(this.state.accounts[i]).then(_tbalance=>{
        let tbalance = this.state.web3.fromWei(_tbalance.toString(10), "ether")
        const tbalances = this.state.tokenBalances;
        tbalances[i] = tbalance;
        this.setState({tokenBalances: tbalances})

        })
     }

    })
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
        account: accounts[0],
        accounts: accounts
      });

      console.log("using account", accounts[0]); 
      console.log(this.state.accounts)

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
        <p>Fiat Contract Address: {this.state.fiatTokenAddress}</p>
        <p>Fiat Token Total Supply: {this.state.fiatTokenSupply} {this.state.fiatTokenSymbol}</p>
        <p>Fiat Token Contract Balance: {this.state.fiatTokenBalance} {this.state.fiatTokenSymbol}</p>
        <form>
          <input type="number" name="Fiat Distributor" placeholder="Fiat to each account" value={this.state.fiatTokenAmount} onChange={this.handlefiatAmount}/>
          <button onClick={this.sendFiatHandler}>Distribute {this.state.fiatTokenSymbol} to all accounts!</button>
        </form>
        <p>Deployed Token Contract Address: {this.state.deployedTokenAddress}</p>
        <p>Deployed Token Contract Balance: {this.state.deployedTokenBalance} {this.state.tokenSymbol}</p> 
        <form>
          <input type="number" name="Set Rate" placeholder="Set Rate" value={this.state.rate} onChange={this.handleRate}/>
        </form>
        <p>Rate: 1 USD = {this.state.rate} {this.state.tokenSymbol}</p>

        <table>
          <tbody>
            <tr>
              <th>Account No</th>
              <th>Address</th>
              <th>{this.state.fiatTokenSymbol} Balance </th>
              <th>{this.state.tokenSymbol} Token Balance</th>
              <th>Contribute</th>
            </tr>
            <tr>
              <th>1</th>
              <th>{this.state.accounts[0]}</th>
              <th>{this.state.balances[0]}</th>
              <th>{this.state.tokenBalances[0]}</th>
              <th> 
                <form>
                  <input type="number" name="Contribute" placeholder="Invest Amount" value={this.state.investment} onChange={this.handleInvestment}/>
                  <button onClick={this.investmentHandler}>Invest!</button>
                </form>
              </th>
            </tr>
            <tr>
              <th>2</th>
              <th>{this.state.accounts[1]}</th>
              <th>{this.state.balances[1]}</th>
              <th>{this.state.tokenBalances[1]}</th>
         
            </tr>
            <tr>
              <th>3</th>
              <th>{this.state.accounts[2]}</th>
              <th>{this.state.balances[2]}</th>
              <th>{this.state.tokenBalances[2]}</th>
          
            </tr>
            <tr>
              <th>4</th>
              <th>{this.state.accounts[3]}</th>
              <th>{this.state.balances[3]}</th>
              <th>{this.state.tokenBalances[3]}</th>
        
            </tr>
            <tr>
              <th>5</th>
              <th>{this.state.accounts[4]}</th>
              <th>{this.state.balances[4]}</th>
              <th>{this.state.tokenBalances[4]}</th>
            </tr>
            
          </tbody>
        </table>
        <p></p>
        <form>
          <button onClick={this.tokenDistributionHandler}>Distribute Tokens!</button>
        </form>

      </div>
    );
  }
}

export default App
