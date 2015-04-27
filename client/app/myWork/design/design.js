angular.module('myApp.DesignCtrl', [])
.controller('DesignCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  console.log($scope.stuff);
  $(function(){
    $('.materialboxed').materialbox();
  });
}]);