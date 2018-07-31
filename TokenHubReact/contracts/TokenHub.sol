pragma solidity ^0.4.24;

import "./SecurityToken.sol";

contract TokenHub {

	address[] public tokens;

	event LogNewToken(address sender, address token, string tokenName, string tokenSymbol, uint8 tokenSupply );

	function getTokenCount()
		public
		constant
		returns(uint tokenCount)
	{
		return tokens.length;
	}

	function createToken(string _name, string _symbol, uint8 _INITIAL_SUPPLY) 
		public
		returns(address tokenContract)
	{
		SecurityToken deployedContract = new SecurityToken(_name, _symbol, _INITIAL_SUPPLY);
		tokens.push(tokenContract);
		emit LogNewToken(msg.sender, deployedContract, _name, _symbol, _INITIAL_SUPPLY);
		return deployedContract;
	}


}