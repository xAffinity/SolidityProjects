pragma solidity ^0.4.19;

import "contracts/Owned.sol";

contract AppStore is Owned {

	struct Product {
		string name;
		uint price;
	}

	mapping(uint => Product) public products;
	uint public count;

	event LogProductAdded(uint id, string name, uint price);
	function  AppStore() public {
	}


	function addProduct(uint id, string name, uint price)
		fromOwner
		public
		returns (bool successful) {
		products[id] = Product({
			name: name,
			price: price
			});
		count++;
		LogProductAdded(id,name, price);
		return true;

		}

}