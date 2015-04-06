angular.module('app.DesignCtrl', [
  'ui.router',
]).controller('DesignCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  cosole.log($scope.stuff);
}]);