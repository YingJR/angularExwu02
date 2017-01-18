// Code goes here
angular.module('angularGruntSeed', [
    'ngRoute',
    'ui.grid'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '../jsp/crud home.html',
        controller: 'HomeController'
    })
    .otherwise({ redirectTo: '/' });
}])
.controller('HomeController', ['$scope', 'BackandService',
    function($scope, backandService) {
        $scope.selectedRows = [];

        var initializeGrid = function(){
            backandService.authenticate().then(function(token){
                getEmployees();
            });
        };

        var getEmployees = function(){
            backandService.getEmployees().then(function(employees){
                $scope.employees = employees.data.data;
            });
            $scope.selectedRows.length = 0;
        };

        $scope.deleteItems = function(){
            for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {
                backandService.deleteEmployee($scope.selectedRows[i].ID).then(function(data){
                    getEmployees();
                });
            }
        }

        $scope.addNewRow = function(){
            $scope.employees.push({ID: null});
        };

        $scope.$on('ngGridEventEndCellEdit', function(evt){
            if(evt.targetScope.row.entity.ID === null){
                backandService.createEmployee(evt.targetScope.row.entity).then(function(data){
                    getEmployees();
                });
            } else {
                var payload = {
                    'ID': evt.targetScope.row.entity.ID,
                    'First_Name': evt.targetScope.row.entity.First_Name,
                    'Last_Name': evt.targetScope.row.entity.Last_Name,
                };
                backandService.updateEmployee(evt.targetScope.row.entity.ID, payload).then(function(data){
                    getEmployees();
                });
            }
        });
        

        $scope.gridOptions = {
            data: 'employees',
            enableRowSelection: true,
            enableCellEditOnFocus: true,
            showSelectionCheckbox: true,
            selectedItems:$scope.selectedRows,
            columnDefs: [{
                field: 'ID',
                displayName: 'Id',
                enableCellEdit: false,
                width: 50
            }, {
                field: 'First_Name',
                displayName: 'First Name',
                enableCellEdit: true,
                width: 200
            }, {
                field: 'Last_Name',
                displayName: 'Last Name',
                enableCellEdit: true,
                width: 200
            }]
        };

        initializeGrid();
    }
])
.factory('BackandService', ['$http', '$q',
    function($http, $q) {
        var backandGlobalUrl = 'https://api.backand.com:8080';

            function toQueryString(obj) {
                var parts = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
                    }
                }
                return parts.join('&');
            }

            function authenticate() {

                var deferred = $q.defer();

                var data = toQueryString({
                    grant_type: 'password',
                    username: '',
                    password: '',
                    appname: 'restdemo',
                });

                var request = $http({
                    method: 'POST',
                    url: backandGlobalUrl + '/token',
                    data: data,
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                request.then(function(response){
                    var authToken = response.data.token_type + ' ' + response.data.access_token;
                    $http.defaults.headers.common['Authorization'] = authToken;
                    deferred.resolve(authToken);
                }, function(error){
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function createEmployee(body) {

                var request = $http({
                    method: 'POST',
                    data: body,
                    url: backandGlobalUrl + '/1/view/data/Employees'
                });

                return sendRequest(request);
            }

            function getEmployees() {

                var request = $http({
                    method: 'GET',
                    url: backandGlobalUrl + '/1/view/data/Employees'
                });

                return sendRequest(request);
            }

            function updateEmployee(id, body) {

                var request = $http({
                    method: 'PUT',
                    data: body,
                    url: backandGlobalUrl + '/1/view/data/Employees/' + id
                });

                return sendRequest(request);
            }

            function deleteEmployee(id) {

                var request = $http({
                    method: 'DELETE',
                    url: backandGlobalUrl + '/1/view/data/Employees/' + id
                });

                return sendRequest(request);
            }

            function sendRequest(config){

                var deferred = $q.defer();

                config.then(function(response){
                    deferred.resolve(response);
                }, function(error){
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            return {
                authenticate: authenticate,
                createEmployee: createEmployee,
                getEmployees: getEmployees,
                updateEmployee: updateEmployee,
                deleteEmployee: deleteEmployee
            };
    }
]);
