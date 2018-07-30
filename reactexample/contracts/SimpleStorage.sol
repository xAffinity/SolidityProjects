pragma solidity ^0.4.18;

contract SimpleStorage {
  uint storedData;

  event LogChanged(uint value);

  function set(uint x) public {
    storedData = x;
    emit LogChanged(x);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
