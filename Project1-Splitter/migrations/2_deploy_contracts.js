var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Splitter, "0xedc79eca0ebd799880e7b306d5171fe888289987", "0x3e8a074e4bfe5e80fbec1f75068a63ca54d95ad0");

};
