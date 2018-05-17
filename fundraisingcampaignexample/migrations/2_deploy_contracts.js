var Campaign = artifacts.require("./Campaign.sol");

module.exports = function(deployer) {
  deployer.deploy(Campaign, '0x66979fb5e7fbb4e1e566fd6c0003f96c8a8ba61a','500', '10000');
};
