pragma solidity ^0.4.24;

import "/home/terence/DAPPS/SolidityProjects/TokenHubReact/node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol";


/**
 * @title Security Token
 * @dev The decimals are only for visualization purposes.
 * All the operations are done using the smallest and indivisible token unit,
 * just as on Ethereum all the operations are done in wei.
 */
contract SecurityToken is StandardBurnableToken {
  string public name;
  string public symbol;
  uint8 public constant decimals = 18;
  uint256 public INITIAL_SUPPLY;

  constructor(string _name, string _symbol, uint256 _INITIAL_SUPPLY) public {
    name = _name;
    symbol = _symbol;
    INITIAL_SUPPLY = _INITIAL_SUPPLY * (10 ** uint256(decimals));

    /**
    * @dev Constructor that gives msg.sender all of existing tokens.
    */
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
  }

}
