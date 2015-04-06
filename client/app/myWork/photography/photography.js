angular.module('app.PhotographyCtrl', [
  'ui.router',
]).controller('PhotographyCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  cosole.log($scope.stuff);
}]);