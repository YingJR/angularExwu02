
angular.module('maintainTable', ['ui.grid', 'ui.grid.edit', 'ui.bootstrap', 'schemaForm'])

.constant('TableSchema', {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Name' },
    company: { type: 'string', title: 'Company' },
    phone: { type: 'string', title: 'Phone' },
    'address.city': { type: 'string', title: 'City' }
  }
})

.controller('MainCtrl', MainCtrl)
.controller('RowEditCtrl', RowEditCtrl)
.service('RowEditor', RowEditor)
;

MainCtrl.$inject = ['$http', 'RowEditor'];
function MainCtrl ($http, RowEditor) {
  var vm = this;
  
  vm.editRow = RowEditor.editRow;
  
  vm.gridOptions = {
    columnDefs: [
      { field: 'id', name: '', cellTemplate: 'edit-button.html', width: 34 },
      { name: 'name' },
      { name: 'company' },
      { name: 'phone' },
      { name: 'City', field: 'address.city' },
    ]
  };
  
  $http.get('http://ui-grid.info/data/500_complex.json')
    .success(function (data) {
      vm.gridOptions.data = data;
    });
}

RowEditor.$inject = ['$rootScope', '$modal'];
function RowEditor($rootScope, $modal) {
  var service = {};
  service.editRow = editRow;
  
  function editRow(grid, row) {
    $modal.open({
      templateUrl: 'edit-modal.html',
      controller: ['$modalInstance', 'TableSchema', 'grid', 'row', RowEditCtrl],
      controllerAs: 'vm',
      resolve: {
        grid: function () { return grid; },
        row: function () { return row; }
      }
    });
  }
  
  return service;
}

function RowEditCtrl($modalInstance, TableSchema, grid, row) {
  var vm = this;
  
  vm.schema = TableSchema;
  vm.entity = angular.copy(row.entity);
  vm.form = [
    'name',
    'company',
    'phone',
    {
      'key': 'address.city',
      'title': 'City'
    },
  ];
  
  vm.save = save;
  
  function save() {
    // Copy row values over
    row.entity = angular.extend(row.entity, vm.entity);
    $modalInstance.close(row.entity);
  }
}
