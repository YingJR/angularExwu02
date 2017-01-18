//將ui grid使用到的功能模組化 注入到 maintainTable這個app
var app = angular.module('maintainTable', ['ngTouch', 'ui.grid','ui.grid.rowEdit']);

app.controller('MainCtrl', ['TableService', '$scope', function (TableService, $scope) {
    $scope.gridEditMode = false; // 這個Grid是不是可編輯的模式

    $scope.gridOptionsView = {
        enableColumnMenus: false,
        enableCellEdit: false,
        excludeProperties: '__metadata',
        onRegisterApi : function(gridApi){
           $scope.gridApi = gridApi;
       },
    };

    $scope.gridOptionsEdit={
        enableColumnMenus: true,
        enableCellEdit: true,
        excludeProperties: '__metadata',
        onRegisterApi : function(gridApi){
           $scope.gridApi = gridApi;
        },
    };

    $scope.load = function () {
     TableService.loadTitle().then(function (response) {
        console.log(response.data[0]);
        $scope.gridOptionsView={
          columnDefs: response.data
      };
            // $scope.gridOptions.columnDefs = response.data;

            $scope.gridOptionsEdit={
              columnDefs: response.data
            };	

        });
}

        $scope.search= function () {
             TableService.readAll().then(function (response) {
                console.log(response.data);
                $scope.gridOptionsView.data=response.data;
                $scope.gridOptionsEdit.data=response.data;
            });
        }

        $scope.changeTableMode = function (mode){

            // $scope.gridEditMode = !$scope.gridEditMode;
            if(mode==="Edit"){
               $scope.gridEditMode = true;
            }
            if(mode==="View"){
               $scope.gridEditMode = false; 
            }
            $scope.$apply();

            // console.log("changeMode: " + $scope.gridEditMode);
            // $scope.$apply(function(){$scope.gridApi.core.refresh();});
            // $scope.$digest();

            // $scope.gridOptions.enableCellEdit =
			// !$scope.gridOptions.enableCellEdit;
            // console.log("changeMode"+$scope.gridOptions.enableCellEdit);
            // $scope.$apply();
            // $scope.refresh();
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
  // 通過controller來取得Angular應用
  var appElement = document.querySelector('[ng-controller=MainCtrl]'); 
  // 取得$scope變數
  var $scope = angular.element(appElement).scope();

  // 改變值
    // $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;

  $scope.search();
  // 改變值後要同步至angular Controller中，如果想同步到Angular要使用$apply()
 $scope.$apply();

  alert("search");
}
function changeTableMode(btn){
	var self = $(btn);
	// //通過controller來取得Angular應用
    var appElement = document.querySelector('[ng-controller=MainCtrl]'); 
    // //取得$scope變數
    var $scope = angular.element(appElement).scope();

    if(self.text()==="Edit"){
        $(".navbar-btn:contains('Edit')").removeClass('btn-default').addClass('btn-primary');
        $(".navbar-btn:contains('View')").removeClass('btn-primary').addClass('btn-default');
    }
    if(self.text()==="View"){
        $(".navbar-btn:contains('Edit')").removeClass('btn-primary').addClass('btn-default');
        $(".navbar-btn:contains('View')").removeClass('btn-default').addClass('btn-primary');
    }
// if($scope.gridEditMode){
// $(".navbar-btn:contains('Edit')").removeClass('btn-default').addClass('btn-primary');
// $(".navbar-btn:contains('View')").removeClass('btn-primary').addClass('btn-default');
// }else{
// $(".navbar-btn:contains('Edit')").removeClass('btn-primary').addClass('btn-default');
// $(".navbar-btn:contains('View')").removeClass('btn-default').addClass('btn-primary');
// }
 // console.log("changeMode: " + $scope.gridEditMode);
    $scope.changeTableMode(self.text());
    $scope.$apply();
 // $scope.$apply(function
	// (){$scope.gridApi.grid.refreshCanvas();$scope.gridApi.core.refresh();});
    
     $scope.gridApi.grid.refresh();
}