angular.module('app.SoftwareCtrl', [])
.controller('SoftwareCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  console.log($scope.stuff);
}]);