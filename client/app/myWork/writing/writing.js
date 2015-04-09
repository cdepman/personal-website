angular.module('app.WritingCtrl', [])
.controller('WritingCtrl ', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  console.log($scope.stuff);
}]);