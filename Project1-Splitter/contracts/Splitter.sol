pragma solidity ^0.4.19;

contract Splitter {
	address owner;
	uint256 sendAmount;
	
	address Bob;
	address Carol;
	/*Executes on contract deployement*/
	function Splitter (address bobAddress, address carolAddress)  public {
		owner = msg.sender;
		Bob = bobAddress;
		Carol = carolAddress;
	}

	/*Get Contract Balance*/
	function contractBalance() public view returns (uint) {
		return address(this).balance;
	}

	function  sendWei(address toWhom) public {
		toWhom.transfer(sendAmount);
	}

	/*Split Ether*/
	function splitEther() public payable {
		if(msg.value==0) revert();
		sendAmount = msg.value/2;
		sendWei(Bob);
		sendWei(Carol);
		sendAmount = 0; //ensure people cannot sendWei 
		//call sendfunction to two accounts
	}

	/*Allow Ether to be sent to contract*/
	//may not need since u just need splitEther to get eth and split
	//function() public payable {}
}
