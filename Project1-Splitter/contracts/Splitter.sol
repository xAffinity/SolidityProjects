pragma solidity ^0.4.19;

import "./Ownable.sol";

contract Splitter is Ownable{

	address owner;
	uint256 sendAmount;

	mapping (address => uint) public balances;

	bool killStatus = false;
	
	event LogSplit(address indexed sender,address indexed firstAddress, address indexed secondAddress, uint256 amount);
	event LogWithdrawn(address indexed who, uint256 amount);
	event LogKill(address owner, bool _killStatus);

	/*Split Ether*/
	function splitEther(address _firstAddress, address _secondAddress) public payable {
		require(_firstAddress !=0);
		require(_secondAddress !=0);
		sendAmount = msg.value/2;
		require(sendAmount>0);
		balances[_firstAddress]+= sendAmount;
		balances[_secondAddress]+=msg.value-sendAmount;
		LogSplit(msg.sender,_firstAddress,_secondAddress,msg.value);
	}

	/*Allow address with balance on contract to withdraw their balance*/
	function withdraw() public {
		uint256 amount = balances[msg.sender];
		require(amount >0);
		balances[msg.sender]=0;
		LogWithdrawn(msg.sender, amount);
		msg.sender.transfer(amount);

	}

	/*Destroys contract - only allowed by owner*/
	function kill() public onlyOwner returns (bool _killStatus){
		selfdestruct(owner);
		killStatus=true;
		LogKill(owner, killStatus);
		return killStatus;
	}

}