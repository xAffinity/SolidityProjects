var TokenHub = artifacts.require("./TokenHub.sol");

module.exports = function(deployer) {
  deployer.deploy(TokenHub);
};
