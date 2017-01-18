console.log("params",params);

//setter angular.module('ng-app',[]);
angular.module('maintainTable', ['ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.selection'])
	.controller('GridToolBarCtrl',[function(){
		// $scope.search = function(){
		// 	$scope.load();
		// };

	}])
	.controller('GridController', ['DataService', 'DataTypeCheck', '$scope', function(DataService, DataTypeCheck, $scope) {

	  $scope.sort = [];
	  $scope.filter = [];
	 	
	  $scope.gridOptions = {
	    excludeProperties: '__metadata',
	    enableColumnMenus: false,
	    enablePaginationControls: false,
	    useExternalSorting: false,
	    useExternalFiltering: true,
	    enableFiltering: false,
	    enableRowSelection: true,
	    enableRowHeaderSelection: false,
	    multiSelect : false,
	    onRegisterApi: function(gridApi) {
	      $scope.gridApi = gridApi;

		  $scope.gridApi.grid.registerRowsProcessor($scope.singleFilter,200);

	      //declare the events
	      //排序改變
	      $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
	        $scope.sort = [];
	        angular.forEach(sortColumns, function(sortColumn) {
	          $scope.sort.push({
	            fieldName: sortColumn.name,
	            order: sortColumn.sort.direction
	          });
	        });
	        $scope.load();
	      });
		
		  //filter改變
	      $scope.gridApi.core.on.filterChanged($scope, function() {
	        $scope.filter = [];
	
	        var grid = this.grid;
          	console.log("filterChanged",grid.columns[1].filters[0].term);
	        console.log("columns",grid.columns);
	        
	      });

		  //點選編輯之後
	      $scope.gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
	      	DataTypeCheck.typeCheck("");
	      });
	    }
	  };
	  
	  // Function called when a checkbox is checked/unchecked
	  $scope.updateSelection = function() {
	    // Refresh the grid (this forces the singleFilter function to be executed)
	    $scope.gridApi.grid.refresh();
	  };

	  //頁面的filter
	  $scope.singleFilter = function(renderableRows){  
		    var validValues = [];
		    console.log("item.Selected: ", $scope);
		    console.log("filterObj",$scope.filterObj);

			var columnArr = [];
			for (property in $scope.filterObj) {
  				columnArr.push(property);
			}

		    angular.forEach($scope.filterObj, function(value, key){
		    	console.log("value",value);
		    	angular.forEach(value, function(value2, key){
			    	console.log("key",key);
			    	console.log("value2",value2);
			    	if (value[key]) {
			      		validValues.push(key);
			    	}
		    	});
		    });

		    renderableRows.forEach( function( row ) {
		      for(var i=0;i < columnArr.length;i++){ 
			      var match = false;
			      var col =columnArr[i];
			      // console.log("col",col);
			      var str = "row.entity."+ col;
			      console.log(str,row.entity[col]);
			      console.log(validValues.indexOf(row.entity[col]));
			      if (validValues.indexOf(row.entity[col]) > -1) {
			        match = true;
			      }
			      // console.log(row.entity.ex_jcn01 + ': ' + match);
			  }
			      if (!match){
			        row.visible = false;
			      }
			      if(!validValues.length){
			      	row.visible = true;
			      	// console.log("validValues.length:",validValues.length);
			      }
		  	  
		    });
		    return renderableRows;
	  };



	  $scope.filterGrid = function(value) {
    	console.log(value);
    	$scope.gridApi.grid.columns[2].filters[0].term=value;
  	  };




	  
	  // $scope.gridOptions.columnDefs = [];
	  
	  $scope.getColumnDefs = function (params){
		  DataService.getColumnDefsJSONArray(params).then(function(response) {
			  console.log("response",response);
			  $scope.gridOptions.columnDefs = response;
		  });
	  }; 
	  
	  $scope.getColumnDefs(params);//取得標題
	  
	  $scope.load = function() {
		  DataService.readAll(params, $scope.sort, $scope.filter).then(function(response) {
		      $scope.gridOptions.data = response.data;
		      $scope.totalItems = response.totalRows;			
	      });
	  };
	
	  $scope.load();
	}])
	//tableStatus
	.directive('tableStatus', function () {
        return {
            restrict: 'A',
            replace : true,
            link: function(scope, element, attrs) {
            	scope.userLevel = params.userId;
            	console.log("tableStatus", scope);
	            attrs.$observe('tableStatus', function () {
		            if(scope.userLevel >=2){
		            	element[0].innerHTML="Editable";
		            }else{
		            	element[0].innerHTML="View";
		            }
	            });

        	},

        };
    })
	;


(function(){
//getter angular.module('ng-app');
  angular.module('maintainTable')
    .service('DataService', ['$http', DataService])
    .service('AuthService', ['$http', AuthService]);

  function DataService($http) {

    var self = this;
    var baseUrl = 'https://api.backand.com/1/objects/';
    var anonymousToken = {
      'AnonymousToken': '78020290-5df3-44b8-9bdb-7b3b4fea2f25'
    };

    var objectName = 'products';


    self.readAll = function(params, sort, filter) {
      return $http({
        method: 'POST',
        url: "../../queryAllJsonObject.do",
        params: {
        	userId:params.userId,
        	tableName:params.tableName,
        	params:{sort: sort, filter: filter}
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}        
      }).then(function(response) {
//    	  console.log("readAll response",JSON.stringify(response.data));
    	  console.log("readAll response",response.data,response.status);
          return response.data;
      });
    };

    self.getFilterJson = function(params) {
      return $http({
        method: 'POST',
        url: "../../queryFilterJsonArray.do",
        params: {
        	userId:params.userId,
        	tableName:params.tableName,
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}        
      }).then(function(response) {
    	  // console.log("getFilterJson: ",response.data,response.status);
          return response.data;
      });
    };

    self.readOne = function(id) {
      return $http({
        method: 'GET',
        url: baseUrl + objectName + '/' + id,
        headers: anonymousToken
      }).then(function(response) {
        return response.data;
      });
    };

    self.create = function(data) {
      return $http({
        method: 'POST',
        url: baseUrl + objectName,
        data: data,
        params: {
          returnObject: true
        },
        headers: anonymousToken
      }).then(function(response) {
        return response.data;
      });
    };

    self.update = function(id, data) {
      return $http({
        method: 'PUT',
        url: baseUrl + objectName + '/' + id,
        data: data,
        headers: anonymousToken
      }).then(function(response) {
        return response.data;
      });
    };

    self.delete = function(id) {
      return $http({
        method: 'DELETE',
        url: baseUrl + objectName + '/' + id,
        headers: anonymousToken
      });
    };
    
    
    self.getColumnDefsJSONArray = function(params) {
        return $http({
          method: 'POST',
          url: "../../getcolumnDefsJsonArray.do",
         params: {
           userId: params.userId,
           tableName: params.tableName,
         },
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}      
        }).then(function(response) {
          return response.data;
        });
      };

  }


  function AuthService($http) {

    var self = this;

    self.checkAuth = function(params) {
      return $http({
        method: 'GET',
        url: "../../getPermissionLevel.do",
        params: {
        	userId:params.userId,
        	tableName:params.tableName
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}        
      }).then(function(response) {
    	  return response.data;
      });
    };
  }

})();

  angular.module('maintainTable')
    .service('DataTypeCheck', [DataTypeCheck]);

  function DataTypeCheck(data) {
	 var self = this;

	 self.typeCheck = function(data) {
      // console.log("check");
    };

  }

//依照權限給ToolBar
angular.module('maintainTable')
	.controller('ToolbarController',['AuthService', '$scope', function(AuthService, $scope) {
		
		$scope.userLevel = params.userId;
		$scope.tableName = params.tableName;
		$scope.toolbar = {};

		//toggle Filter
		$scope.toggleFilter =function(){
			 var myfilter = angular.element(document.getElementById('myFilter')).scope();
			 myfilter.showFilter = !myfilter.showFilter;
		};

		$scope.clearFilter =function(){
			var myfilter = angular.element(document.getElementById('myFilter')).scope();
		};


		$scope.checkAuth = function(){
			AuthService.checkAuth(params).then(function(response) {
				// console.log("checkAuth()response: ",response);
	        });
		};
		$scope.checkAuth();
	}])
	//自訂指令user-level=
    .directive('userLevel', function () {
        return {
            restrict: 'A',
            replace : true,
            link: function(scope, element, attrs) {
	            // console.log(scope);
	            // console.log(element);
	            // console.log(JSON.stringify(attrs));

                attrs.$observe('userLevel', function (acl) {
                	// console.log("acl",acl);
                    if (acl) {
                    	console.log("scope.userLevel",scope.userLevel);
                    	if(scope.userLevel>=acl){
                    		scope.showIt = true;
                    		element.show();
                    	}else{
                    		element.remove();
                    	}
                    }
                });

        	},
            // template: '<a ng-show="showMe">Download</a>'
        };
    })
    
    .directive('myCustomFilter', function(){
    	return{
    		template: '{{filterObj | json}}<table class="table">'+
				'<thead>'+
					'<tr>'+
						'<th ng-repeat="column in ColumnNames">'+
							'{{column.displayName}}'+
						'</th>'+
						'<th><button class="btn btn-default" ng-click="clearAllFilter()">Clear All</button></th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>'+
					'<tr>'+
						'<td ng-repeat="column in ColumnNames">'+
							'<div ng-repeat="dataArray in column.data">'+
								'<input type="checkbox" ng-model="filterObj[column.columnName][dataArray]" ng-click="updateSelection()" >{{dataArray}}<br>'+
							'</div>'+
						'</td>'+
						'<td>'+
							'<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-modal>test</div></div>'+
						'</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>',
			controller: 'myCustomFilterCtrl',
    	};
    })
    .controller('myCustomFilterCtrl',function(DataService, $scope, $element){

		DataService.getFilterJson(params).then(function(response) {
			  // console.log("DataService response",JSON.stringify(response));
			  // console.log();
			  $scope.ColumnNames = angular.fromJson(response);
			  // console.log("ColumnNames",$scope.ColumnNames);
		  });

		$scope.filterObj = {};

	  	$scope.Items = [{
	        Name: "1.000",Selected:false
	    }, {
	        Name: "2.000",Selected:false
	    }, {
	        Name: "3.000",Selected:false
	    }];
  	  
	  $scope.clearAllFilter = function(){
		// console.log("clearAllFilter",$scope.filterObj);
		angular.forEach($scope.filterObj, function(value, key){
			$scope.filterObj={};
		});
	  };

    })
;

