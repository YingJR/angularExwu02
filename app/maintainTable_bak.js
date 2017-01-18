var app = angular.module('maintainTable', ['ngTouch', 'ui.grid','ui.grid.rowEdit']);

app.controller('MainCtrl', ['TableService', '$scope', function (TableService, $scope) {
    $scope.gridOptions = {
        excludeProperties: '__metadata',
    };

    $scope.load = function () {
    	TableService.loadTitle().then(function (response) {
            console.log(response.data[0]);
            $scope.gridOptions={
            		enableColumnMenus: false,
            		columnDefs: response.data
            };
//          $scope.gridOptions.columnDefs = response.data;

        });
    }
    
    $scope.search= function () {
    	TableService.readAll().then(function (response) {
            console.log(response.data);
            $scope.gridOptions.data=response.data;
        });
    }

    $scope.changeTableMode = function (){
    	
        $scope.gridOptions.enableCellEdit = !$scope.gridOptions.enableCellEdit;
        console.log("changeMode"+$scope.gridOptions.enableCellEdit);
        $scope.$apply();
    }
    
    $scope.load();
}]);


(function () {

    angular.module('maintainTable')
        .service('TableService', ['$http', TableService]);

    function TableService($http) {

        var self = this;
        var baseUrl = '../../getcolumnDefsJsonArray.do';        
        
        var serializedData = 
                      $.param({userId:userId,
        				               tableName:tableName});

        self.loadTitle = function () {
            return $http({
                method: 'POST',
                url: baseUrl,
                data: serializedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                console.log("loadTitle: ");
                console.log(response);
                return response;
            });
        };

        self.readAll = function () {    	
            return $http({
                method: 'POST',
                url: '../../getAllRowsJsonArray.do',
                data: serializedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
            	  console.log(response);
                return response;
            }, function errorCallback(response) {
            		console.log(response);
              });
        };

        self.readOne = function (id) {
            return $http({
                method: 'POST',
                url: baseUrl,
                data: serializedData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                return response;
            });
        };

        self.create = function (data) {
            return $http({
                method: 'POST',
                url: baseUrl + objectName,
                data: data,
                params: {
                    returnObject: true
                },
                headers: anonymousToken
            }).then(function (response) {
                return response.data;
            });
        };

        self.update = function (id, data) {
            return $http({
                method: 'PUT',
                url: baseUrl + objectName + '/' + id,
                data: data,
                headers: anonymousToken
            }).then(function (response) {
                return response.data;
            });
        };

        self.delete = function (id) {
            return $http({
                method: 'DELETE',
                url: baseUrl + objectName + '/' + id,
                headers: anonymousToken
            });
        };

    }
}());

function search(){
  //通過controller來取得Angular應用
  var appElement = document.querySelector('[ng-controller=MainCtrl]'); 
  //取得$scope變數
  var $scope = angular.element(appElement).scope();

  //改變值
  $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
  
  $scope.search();
  //改變值後要同步至angular Controller中，如果想同步到Angular要使用$apply() 
  $scope.$apply();

  alert("search");
}
function changeTableMode(){
	//通過controller來取得Angular應用
	var appElement = document.querySelector('[ng-controller=MainCtrl]'); 
	//取得$scope變數
	var $scope = angular.element(appElement).scope();
    $scope.gridOptions.cellEditableCondition = !$scope.gridOptions.cellEditableCondition;
    console.log("changeMode: "+$scope.gridOptions.cellEditableCondition);
	$scope.$apply();
}