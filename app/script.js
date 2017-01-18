console.log("params",params);

// DataService.getFilterJson(params);

//setter angular.module('ng-app',[]);
angular.module('maintainTable', ['ngTouch', 'ui.grid', 'ui.grid.edit'])
	.controller('GridController', ['DataService', 'DataTypeCheck', '$scope', function(DataService, DataTypeCheck, $scope) {
	  // console.log("filterTerm",$scope.filterTerm);

	  $scope.sort = [];
	  $scope.filter = [];
	 	
	  $scope.gridOptions = {
	    excludeProperties: '__metadata',
	    enableColumnMenus: false,
	    enablePaginationControls: false,
	    useExternalSorting: false,
	    useExternalFiltering: true,
	    enableFiltering: false,
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
	        
	        // angular.forEach(grid.columns, function(column) {
	        //   var fieldName = column.field;
	        //   var value = column.filters[0].term;
	        //   var operator = "contains";
	        //   if (value) {
	        //     if (fieldName == "id") operator = "equals";
	        //     else if (fieldName == "price") operator = "greaterThanOrEqualsTo";
	        //     $scope.filter.push({
	        //       fieldName: fieldName,
	        //       operator: operator,
	        //       value: value
	        //     });
	        //   }
	        // });
	
	        // $scope.load();
	      });

		  //點選編輯之後
	      $scope.gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
	      	// console.log(rowEntity);
	      	// console.log(colDef);
	      	// console.log(newValue);
	      	// console.log(oldValue);
	      	DataTypeCheck.typeCheck("");

	        // var id = rowEntity.__metadata.id;
	        // var data = {};
	        // data[colDef.name] = newValue;
	
	        // DataService.update(id, data).then(function(response) {
	        //   $scope.load(); //The change may trigger other server side action that may change additional data
	        //   $scope.$apply();
	        // });
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
		    // console.log('P ' + $scope.date16);
		    // console.log('F ' + $scope.date17);
		    // console.log('N ' + $scope.date18);
		    console.log("item.Selected: ", $scope);
		    // console.log("Data.Selected: ", $scope.Data.Selected);

		    //$scope.$watch('filterObj', function(newValue, oldValue) {
		    console.log("filterObj",$scope.filterObj);
			// },true);
			var columnArr = [];
			for (property in $scope.filterObj) {
  				columnArr.push(property);
			}
			// columnArr.push(Object.keys($scope.filterObj));
		    angular.forEach($scope.filterObj, function(value, key){
		    	// console.log("key",$scope.Items[key].Name);
		    	// console.log("keys",Object.keys(value));
		    	// columnArr.push(value);
		    	console.log("value",value);
		    	angular.forEach(value, function(value2, key){
			    	console.log("key",key);
			    	console.log("value2",value2);
			    	if (value[key]) {
			      		validValues.push(key);
			    	}
		    	});
		    });
		    
		    // console.log("validValues",validValues);
		    // console.log("columnArr",columnArr);
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
    	  console.log("getFilterJson: ",response.data,response.status);
          return response.data;
      });
    };
    // self.readAll = function(pageSize, pageNumber, sort, filter) {
    //   console.log("filter:",filter);
    //   return $http({
    //     method: 'GET',
    //     url: baseUrl + objectName,
    //     params: {
    //       pageSize: pageSize,
    //       pageNumber: pageNumber,
    //       sort: sort,
    //       filter: filter
    //     },
    //     headers: anonymousToken        
    //   }).then(function(response) {
    // 	  console.log("response",JSON.stringify(response.data));
    //     return response.data;
    //   });
    // };

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
      console.log("check");
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

		$scope.search = function(){
			var dataGrid = angular.element(document.getElementById('dataGrid')).scope();
			dataGrid.load();
		};
		$scope.checkAuth = function(){
			AuthService.checkAuth(params).then(function(response) {
				console.log("checkAuth()response: ",response);
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
	            console.log(scope);
	            console.log(element);
	            console.log(JSON.stringify(attrs));

                attrs.$observe('userLevel', function (acl) {
                	console.log("acl",acl);
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
    //tableStatus
	.directive('tableStatus', function () {
        return {
            restrict: 'A',
            replace : true,
            link: function(scope, element, attrs) {
	            // console.log("tableStatus",scope);
	            // console.log("tableStatus",element);
	            // console.log("tableStatus",attrs);

	            // console.log("tableStatus",JSON.stringify(attrs));
	            
	            attrs.$observe('tableStatus', function () {
		            if(scope.userLevel >=2){
		            	element[0].innerHTML="Editable";
		            }else{
		            	element[0].innerHTML="View";
		            }
	            });
                // attrs.$observe('userLevel', function (acl) {
                // 	console.log("acl",acl);
                //     if (acl) {
                //     	console.log("scope.userLevel",scope.userLevel);
                //     	if(scope.userLevel>=acl){
                //     		scope.showIt = true;
                //     		element.show();
                //     	}else{
                //     		element.remove();
                //     	}
                //     }
                // });

        	},
//            template: '<span>View</span>'
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
//    	console.log($scope);
		

		// $scope.ColumnNames =[];
		DataService.getFilterJson(params).then(function(response) {
			  console.log("DataService response",JSON.stringify(response));
			  // console.log();
			  $scope.ColumnNames = angular.fromJson(response);
			  console.log("ColumnNames",$scope.ColumnNames);
		  });
		// console.log("ColumnNames",$scope.ColumnNames);
    	// console.log(DataService.getFilterJson(params));
    	// $scope.ColumnNames = DataService.getFilterJson(params).value;
		$scope.filterObj = {};

	  	$scope.Items = [{
	        Name: "1.000",Selected:false
	    }, {
	        Name: "2.000",Selected:false
	    }, {
	        Name: "3.000",Selected:false
	    }];
  	  
	  $scope.clearAllFilter = function(){
		console.log("clearAllFilter",$scope.filterObj);
		// console.log("$element",$element);
		// $scope.Items = false;
		angular.forEach($scope.filterObj, function(value, key){
			$scope.filterObj={};
			// console.log("value",value);
			// console.log($scope.Items[key]);
			// console.log("key",key);
		});
//		$scope.Items.Selected=false;
	  };

    	// $scope.myVar = false;
    	// console.log("myCustomFilterCtrl: ",$scope);
    	// $scope.showIt = false;
   //  	$scope.toggle = function(){
   //  		console.log("toggle toggle");
			// $scope.showIt = ! $scope.showIt;
			// $scope.myVar = ! $scope.myVar;
			// console.log("$scope.myVar", $scope.myVar);
			// console.log("$scope.showIt", $scope.showIt);
			// return $scope.showIt;
   //  	};

    })
    .directive('myCustomDropdown', function() {
	  return {
	    template: '<select class="form-control" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options"></select>'
	  };
	})
	.controller('myCustomModalCtrl', function( $scope, $compile, $timeout ) {
		  var $elm;
		  
		  $scope.showAgeModal = function() {
		    $scope.listOfAges = [];
		    
		    $scope.col.grid.appScope.gridOptions.data.forEach( function ( row ) {
		      if ( $scope.listOfAges.indexOf( row.age ) === -1 ) {
		        $scope.listOfAges.push( row.age );
		      }
		    });
		    $scope.listOfAges.sort();
		    
		    $scope.gridOptions = { 
		      data: [],
		      enableColumnMenus: false,
		      onRegisterApi: function( gridApi) {
		        $scope.gridApi = gridApi;
		        
		        if ( $scope.colFilter && $scope.colFilter.listTerm ){
		          $timeout(function() {
		            $scope.colFilter.listTerm.forEach( function( age ) {
		              var entities = $scope.gridOptions.data.filter( function( row ) {
		                return row.age === age;
		              }); 
		              
		              if( entities.length > 0 ) {
		                $scope.gridApi.selection.selectRow(entities[0]);
		              }
		            });
		          });
		        }
		      } 
		    };
		    
		    $scope.listOfAges.forEach(function( age ) {
		      $scope.gridOptions.data.push({age: age});
		    });
		    
		    var html = '<div class="modal" ng-style="{display: \'block\'}"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">Filter Ages</div><div class="modal-body"><div id="grid1" ui-grid="gridOptions" ui-grid-selection class="modalGrid"></div></div><div class="modal-footer"><button id="buttonClose" class="btn btn-primary" ng-click="close()">Filter</button></div></div></div></div>';
		    $elm = angular.element(html);
		    angular.element(document.body).prepend($elm);

		    $compile($elm)($scope);
		    
		  };
		  
		  $scope.close = function() {
		    var ages = $scope.gridApi.selection.getSelectedRows();
		    $scope.colFilter.listTerm = [];
		    
		    ages.forEach( function( age ) {
		      $scope.colFilter.listTerm.push( age.age );
		    });
		    
		    $scope.colFilter.term = $scope.colFilter.listTerm.join(', ');
		    $scope.colFilter.condition = new RegExp($scope.colFilter.listTerm.join('|'));
		    
		    if ($elm) {
		      $elm.remove();
		    }
		  };
	})
	.directive('myCustomModal', function() {
		  return {
		    template: '<label>{{colFilter.term}}</label><button ng-click="showAgeModal()">...</button>',
		    controller: 'myCustomModalCtrl'
		  };
	})
    ;
	
angular.module('maintainTable')
.factory('modal', ['$compile', '$rootScope', function ($compile, $rootScope) {
  return function() {
    var elm;
    var modal = {
      open: function() {
 
        var html = '<div class="modal" ng-style="modalStyle">'+
        				'<div class="modal-dialog" style="width:1200px;">'+
        				'<div class="modal-content">'+
	        				'<div class="modal-header"></div>'+
	        				'<div class="modal-body">'+
	        				'</div>'+
	        				'<div class="modal-footer">'+
	        					'<button id="buttonClose" class="btn btn-primary" ng-click="close()">Close</button>'+
	        				'</div>'+
						'</div>'+
						'</div>'+
					'</div>';
        elm = angular.element(html);
        angular.element(document.body).prepend(elm);
 
        $rootScope.close = function() {
          modal.close();
        };
 
        $rootScope.modalStyle = {"display": "block"};
 
        $compile(elm)($rootScope);
      },
      close: function() {
        if (elm) {
          elm.remove();
        }
      }
    };
 
    return modal;
  };
}]);

