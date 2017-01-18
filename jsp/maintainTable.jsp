<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> --%>
<%
	String userId = request.getParameter("userId") == null ? "" : request.getParameter("userId");
	String targetTable = request.getParameter("tableName") == null ? "" : request.getParameter("tableName");
%>
<script>
	var userId ="<%=userId%>";
	var targetTable ="<%=targetTable%>";

	var params ={
		userId:userId,
		tableName:targetTable
	};
</script>
<!doctype html>
<html ng-app="maintainTable">
<head>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	
	<title>EXWU02</title>

    <!-- Angular UI Grid Dependencies -->
    <link rel="stylesheet" href="../lib/angular-ui-grid/ui-grid.min.css">
    <!-- Bootstrap  -->
 	<link rel="stylesheet" href="../../css/bootstrap.min.css">	

    
    <style type="text/css">
	.grid {
	  width: 100%;
	  height: 300px;
	}
	.navbar-btn{
		margin-left: 10px;
	}
    </style>

</head>
<body>
	<div ng-controller="ToolbarController">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand" href="#">exwu02 UserLevel: {{userLevel}}
				&nbsp;TableName:{{tableName}}
				</a>
			</div>
			<div id="toolbarBtn">
				<ul class="nav navbar-nav">
					<li class="btn-group">
						<button class="btn btn-primary navbar-btn" table-status></button>
					</li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li>
						<button class="btn btn-default navbar-btn" user-level="3" 
							style="display:none;">Download
						</button>
					</li>
					<li>
						<button class="btn btn-default navbar-btn" user-level="4" 
							style="display:none;">Update
						</button>
					</li>
					<li><button class="btn btn-info navbar-btn" data-toggle="modal" 
						data-target="#myFilterModal">Filter</button>
					</li>
					<li><button class="btn btn-info navbar-btn" ng-click="clearFilter()">Clear Filter</button>
					</li>
					<li><button class="btn btn-default navbar-btn" ng-click="search()">Search</button></li>
				</ul>
			</div>
		</div>
	</div>

	<div ng-controller="GridController">	
	
        <div id="dataGrid" ui-grid="gridOptions" class="grid" ui-grid-edit></div>
        <p>Total :{{ totalItems }}</p>

		<div id="myFilterModal" class="modal fade" role="dialog">
			<div class="modal-dialog">
				<!-- Modal content-->
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
						&times;</button>
						<h4 class="modal-title">Filter</h4>
					</div>
					<div class="modal-body">
						<div id="myFilter" my-custom-filter ng-hide="showFilter" ></div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">
						Close</button>
					</div>
				</div>

			</div>
		</div>

	</div>


	<!-- lib & script -->
	<script	src="../../js/jquery-3.1.0.min.js"></script>

    <script src="../lib/angular/angular.min.js"></script>
    <script src="../lib/angular/angular-touch.min.js"></script>
    <script src="../lib/angular/angular-animate.min.js"></script>
    <script src="../lib/angular/angular-aria.min.js"></script>

    <script src="../lib/angular-ui-grid/ui-grid.min.js"></script>

    <script	src="../../js/bootstrap.min.js"></script>

    <script src="../app/script.js"></script>
	<!-- maintainTable.js -->
	<script>
	$(document).ready(function(){
		$(".ui-grid-header-cell-wrapper").css("height","30px");


	});
	</script>
	
</body>
</html>
