var DefaultBuilder = require("truffle-default-builder");

// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  build: new DefaultBuilder({
  	"index.html": "index.html",
  	"app.js": [
  		"javascripts/_vendor/angular.min.js",
  		"javascripts/app.js"
  	],
  	"app.css": [
  		"stylesheets/app.css"
  	],
  	"images/": "images/"
  }),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4700000
    }
  }
}
