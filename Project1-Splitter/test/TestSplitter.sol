pragma solidity ^0.4.2;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Splitter.sol";
contract TestSplitter {
    uint public initialBalance = 101 finney;
    address bob = 0xedc79Eca0Ebd799880E7B306d5171Fe888289987;
    address carol = 0x3E8A074E4BFE5E80FBEC1f75068A63Ca54D95Ad0;
    function testSplitEqualBobCarol() {
        Splitter splitter = new Splitter();
        splitter.splitEther.value(100 finney)(bob, carol);
        Assert.equal(splitter.balance, 100 finney, "Splitter contract should have the Ether");
        Assert.equal(splitter.balances(bob), 50 finney, "Bob should be owed the exact half");
        Assert.equal(splitter.balances(carol), 50 finney, "Carol should be owed the exact half");
    }
    function testSplitUnequalBobCarol() {
        Splitter splitter = new Splitter();
        splitter.splitEther.value(200003)(bob, carol);
        Assert.equal(splitter.balance, 200003, "Splitter contract should have the Ether");
        Assert.equal(splitter.balances(bob), 100001, "Bob should be owed the smaller half");
        Assert.equal(splitter.balances(carol), 100002, "Carol should be owed the larger half");
    }
}
