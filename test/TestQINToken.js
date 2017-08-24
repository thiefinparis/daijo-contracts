var QINToken = artifacts.require("./token/QINToken.sol");

contract('QINToken', function(accounts) {
  var qinToken;
  var crowdsale;

  var Web3 = require('web3');
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  var wrf_owner = web3.eth.accounts[0];
  var user = web3.eth.accounts[1];

  it("integration test for crowdsale: create QINToken", function() {
    return QINToken.deployed().then(function(instance) {
      qinToken = instance;
      return qinToken.balanceOf.call(wrf_owner);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 200000000 * 10**18, "the correct balance wasn't in the first account");
    }).then(function() {
      // TODO(mrice): the block number is coming back undefined.  This needs to be investigated further.
      var blockNumber = web3.eth.blockNumber;
      qinToken.startCrowdsale(10000, 10001, 250, accounts[0], 1597721000);
    }).then(function() {
      return qinToken.balanceOf.call(wrf_owner);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "the correct balance wasn't in the first after crowdsale start");
    }).catch(function(err) {
      assert.equal("error", "no error", "there was an error thrown" + web3.eth.blockNumber);
    }).then(function() {
      return web3.eth.sendTransaction({from: user, to: crowdsale, value: web3.toWei(1, 'ether'), gasLimit: 21000, gasPrice: 1000});
    }).then(function() {
      return qinToken.balanceOf.call(user);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 250 * 10**18, "the correct balance wasn't in the user account");
    });
  });
});