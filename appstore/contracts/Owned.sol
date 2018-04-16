pragma solidity ^0.4.19;

contract Owned {

	address public owner;

	function  Owned() public {
		owner = msg.sender;
	}

	modifier fromOwner {
		require(msg.sender == owner);
		_;
	}


}
