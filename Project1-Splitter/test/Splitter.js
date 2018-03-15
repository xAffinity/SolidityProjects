var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

    var contract;
    var owner = accounts[0];

    beforeEach(function(){
      return Splitter.new({from: owner})
      .then(function(instance){
        contract = instance;
      });
    });

    it("should be owned by owner", function(){
      return contract.owner({from: owner})
      .then(function(_owner){
        assert.strictEqual(_owner, owner, "Contract is not owned by owner");
      });
    });

});
