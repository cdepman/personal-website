angular.module('app.DesignCtrl', [])
.controller('DesignCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  cosole.log($scope.stuff);
}]);