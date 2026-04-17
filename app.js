var app = angular.module('crudApp', []);

app.controller('MainController', function($scope) {
    $scope.items = [];

    $scope.addItem = function() {
        if ($scope.newItem && $scope.newItem.name) {
            $scope.items.push({ name: $scope.newItem.name });
            $scope.newItem = {};
        }
    };

    $scope.updateItem = function(index) {
        alert('Item updated: ' + $scope.items[index].name);
    };

    $scope.deleteItem = function(index) {
        $scope.items.splice(index, 1);
    };
});
