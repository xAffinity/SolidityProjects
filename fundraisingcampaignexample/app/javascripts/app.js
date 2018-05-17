var app = angular.module('campaignApp', []);

// Configure preferences for the Angular App

app.config(function( $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

// Define an App Controller with some Angular features

app.controller("campaignController", 
  [ '$scope', '$location', '$http', '$q', '$window', '$timeout', 
  function($scope, $location, $http, $q, $window, $timeout) {

  //Everything we do will be inside the App Controller
  var contract = Campaign.deployed();
  console.log("The contract:", contract);

  //See the contract abstraction output in the console log 

}]);