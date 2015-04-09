angular.module('app.PhotographyCtrl', [])
.controller('PhotographyCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  console.log($scope.stuff);
}]);