// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'myApp.SoftwareCtrl',
  'myApp.DesignCtrl',
  'myApp.PhotographyCtrl',
  'myApp.WritingCtrl',
  'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/software');

  $stateProvider
    .state('software', {
      url: '/software',
      templateUrl: 'myWork/software/software.html',
      controller: 'SoftwareCtrl'
    })
    .state('photography', {
      url: '/photography',
      templateUrl: 'myWork/photography/photography.html',
      controller: 'PhotographyCtrl'
    })
    .state('design', {
      url: '/design',
      templateUrl: 'myWork/design/design.html',
      controller: 'DesignCtrl'
    })
    .state('writing', {
      url: '/writing',
      templateUrl: 'myWork/writing/writing.html',
      controller: 'WritingCtrl'
    })
})

$(function(){
  $(".button-collapse").sideNav();
  $("li").on('click', function(){
    $("li").removeClass("active");
    $(this).addClass("active");
  });
});