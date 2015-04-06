angular.module('app.WritingCtrl', [
  'ui.router',
]).controller('WritingCtrl ', ['$scope', '$state', function($scope, $state) {
  $scope.stuff = 'Hello!';
  cosole.log($scope.stuff);
}]);