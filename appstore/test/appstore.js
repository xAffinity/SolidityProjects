var AppStore = artifacts.require("./AppStore.sol");

let appStore;

web3.eth.getTransactionReceiptMined = function (txHash, interval) {
    const self = this;
    const transactionReceiptAsync = function(resolve, reject) {
        self.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};

var getEventsPromise = function (myFilter, count) {
  return new Promise(function (resolve, reject) {
    count = count ? count : 1;
    var results = [];
    myFilter.watch(function (error, result) {
      if (error) {
        reject(error);
      } else {
        count--;
        results.push(result);
      }
      if (count <= 0) {
        resolve(results);
        myFilter.stopWatching();
      }
    });
  });
};

var expectedExceptionPromise = function (action, gasToUse) {
  return new Promise(function (resolve, reject) {
      try {
        resolve(action());
      } catch(e) {
        reject(e);
      }
    })
    .then(function (txn) {
      return web3.eth.getTransactionReceiptMined(txn);
    })
    .then(function (receipt) {
      // We are in Geth
      assert.equal(receipt.gasUsed, gasToUse, "should have used all the gas");
    })
    .catch(function (e) {
             if ((e + "").indexOf("invalid JUMP") > -1 ||
                 (e + "").indexOf("out of gas") > -1 ||
                 (e + "").indexOf("invalid opcode") > -1 ||
                 (e + "").indexOf("revert") > -1) {
                    // We are in TestRPC
                } else if ((e + "").indexOf("please check your gas amount") > -1) {
                    // We are in Geth for a deployment
                } else {
                    throw e;
                }
    });
};

contract('AppStore', function(accounts) {

  it("should start with empty product list", function() {
    return AppStore.deployed().then(function(instance) {
      return instance.count();
    }).then(function(count) {
      assert.equal(count.valueOf(), 0, "should start with no product");
    });
  });

  it("should not add a product if not owner", function() {
    return AppStore.deployed().then(function(instance) {
      appStore =  instance;
      return expectedExceptionPromise(function() {
      		return appStore.addProduct.call(1,"shirt",10,
      			{ from: accounts[1], // not owner
      				gas: 3000000 }); //  give lots of gas to show it uses all gas because it failed
      			},
      			3000000);
      })
  });


  it("should be possible to add a product", function() {
  	var blockNumber;

    return AppStore.deployed().then(function(instance) {
      appStore = instance;
      return appStore.addProduct.call(1,"shirt",10);
    })
    .then(function(successful) {
      assert.isTrue(successful, "should be possible to add a product");
      blockNumber = web3.eth.blockNumber + 1;
      return appStore.addProduct.sendTransaction(1,"shirt",10,{from: accounts[0]})
    })
    .then(function(tx) {
    	return Promise.all([
    		getEventsPromise(appStore.LogProductAdded(
    			{},
    			{ fromBlock: blockNumber, toBlock: "latest"})),
    		web3.eth.getTransactionReceiptMined(tx)
    		]);
    })
    .then(function(eventAndReceipt){
    	//console.log(eventAndReceipt[0][0].args);
    	var eventArgs = eventAndReceipt[0][0].args;
    	assert.equal(eventArgs.id.valueOf(), 1 , "should be the product id");
    	assert.equal(eventArgs.name, "shirt" , "should be the product name");
    	assert.equal(eventArgs.price.valueOf(), 10 , "should be the product price");
    	return appStore.count();
    })
    .then(function(count){
    	assert.equal(count.valueOf(), 1, "should have add a product");
    	return  appStore.products(1); //products is defined as public in AppStore.sol so this is possible
    })
    .then(function(values){
    	//console.log(values);
    	assert.equal(values[0],"shirt", "should be the product name");
    	assert.equal(values[1].valueOf(), 10, "should be the product  price"); // valueOf otherwise is big number
    });

  });



});