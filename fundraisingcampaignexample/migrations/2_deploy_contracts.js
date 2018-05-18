var Campaign = artifacts.require("./Campaign.sol");

var campaignSponsor = '0x31bb155ec4c7fdb6b8e47ea21f8457c691eaa347';
var campaignDuration = 5;
var campaignGoal = 1000;

module.exports = function(deployer) {
  deployer.deploy(Campaign,campaignSponsor,campaignDuration,campaignGoal);
};
