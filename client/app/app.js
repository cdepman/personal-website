'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.connect'
])
.config(function($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('about', {
      url: '/about',
      templateUrl: 'about/about.html',
      controller: 'AboutCtrl'
    })
    .state('connect', {
      url: '/connect',
      templateUrl: 'connect/connect.html',
      controller: 'ConnectCtrl'
    })
    .state('myWork', {
      url: '/myWork',
      templateUrl: 'myWork/myWork.html',
      controller: 'MyWorkCtrl'
    })
    .state('cv', {
      url: '/cv',
      templateUrl: 'cv/cv.html',
      controller: 'ConnectCtrl'
    })
})
