var app = angular.module('maintain-table', ['ngTouch', 'ui.grid', 'ui.grid.pagination']);

app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {


  $scope.gridOptions = {
    enablePaginationControls: false,
    paginationPageSize: 25,
    columnDefs: [
      { name: 'name' },
      { name: 'gender' },
      { name: 'company' }
    ]
  };

  $scope.gridOptions.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
  }

  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/100.json')
  .success(function (data) {
    $scope.gridOptions.data = data;
  });
}]);
