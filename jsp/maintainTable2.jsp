<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> --%>
<%
	String userAuth = "level_2";
	String userId = request.getParameter("userId") == null ? "" : request.getParameter("userId");
	String tableName = request.getParameter("tableName") == null ? "" : request.getParameter("tableName");
%>
<!doctype html>
<html ng-app="maintainTable">
<head>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>EXWU02</title>
	
	<script	src="../../js/jquery-3.1.0.min.js"></script><!-- conflict angularJs -->
	
 	<!-- Bootstrap  -->
 	<link rel="stylesheet" href="../../css/bootstrap.min.css">	
	<script	src="../../js/bootstrap.min.js"></script>
	
    <!-- Angular -->
    <script src="../lib/angular/angular.min.js"></script>
    <script src="../lib/angular/angular-touch.min.js"></script>
    <script src="../lib/angular/angular-animate.min.js"></script>
    <script src="../lib/angular/angular-aria.min.js"></script>
    
    <!-- Angular UI Grid Dependencies -->
    <script src="../lib/angular-ui-grid/ui-grid.min.js"></script>
    <link rel="stylesheet" href="../lib/angular-ui-grid/ui-grid.min.css">
    
	<!-- Angular script-->
    <!-- <script src="../app/maintainTable.js"></script> -->
    <script src="../app/script2.js"></script>
<!--     <script src="../app/app214.js"></script> -->
    <style type="text/css">
    .navbar-btn{
    	margin-left:10px;    
    }
    .watermark {
	    position: absolute;
	    top : 80px;
	    opacity: 0.25;
	    font-size: 3em;
	    width: 100%;
	    text-align: center;
	    z-index: 1000;
	}
    </style> 
</head>
<body>
	<div>
		<nav class="navbar navbar-default" id="btnToolBar">
<!-- 		  <div class="container-fluid"> -->
<!-- 		    <div class="navbar-header"> -->
<!-- 		      <a class="navbar-brand" href="#">exwu02</a> -->
<!-- 		    </div> -->
<!-- 		    <ul class="nav navbar-nav"> -->
<!-- 		      <li class="active"><button class="btn btn-default navbar-btn">View</button></li> -->
<!-- 		      <li><button class="btn btn-default navbar-btn">Edit</button></li> -->
<!-- 		    </ul>		     -->
<!-- 		   	<ul class="nav navbar-nav navbar-right"> -->
<!-- 		      <li><button class="btn btn-default navbar-btn">Download</button></li> -->
<!-- 		      <li><button class="btn btn-default navbar-btn">Update</button></li> -->
<!-- 		    </ul> -->
<!-- 		  </div> -->
		</nav>
		
		<div ng-controller="MainCtrl">
				<div ng-if="!gridEditMode" >
					<div ui-grid="gridOptionsView" ui-grid ui-grid-auto-resize class="grid">
						<div class="watermark" ng-show="!gridOptionsView.data.length">No data available</div>
			        </div>
				</div>
				<div ng-if="gridEditMode" >
					<div id="gridOptions" ui-grid="gridOptionsEdit" ui-grid-pagination ui-grid-edit ui-grid-auto-resize class="grid">
						<div class="watermark" ng-show="!gridOptionsEdit.data.length">No data available</div>
					</div>
				</div>	        
		        	
				<span>Total pages: {{ gridApi.pagination.getTotalPages() }}</span>
				<button type="button" class="btn btn-success" ng-click="gridApi.pagination.previousPage()">
				previous page
				</button>
				<button type="button" class="btn btn-success" ng-click="gridApi.pagination.nextPage()">
				next page
				</button>
				<button type="button" class="btn btn-success" ng-click="gridApi.pagination.seek(3)">
				go to page 3
				</button>		
		</div>
	</div>
	
<!-- maintainTable.js -->
<script>
var userAuth ="<%=userAuth%>";
var userId ="<%=userId%>";
var tableName ="<%=tableName%>";

//tableName="table";

$(document).ready(function(){
	ajaxGetPermissionLevel();	
});

function ajaxGetPermissionLevel(){
	var obj ={
				userId:userId,
				tableName:tableName
			};
	$.ajax({
		type: "GET",
		url: "../../getPermissionLevel.do",
		data :{
			userId: obj.userId,
			tableName: obj.tableName
		},
		error : function(e) {
			alert('Ajax Request Error');
		},
		success: function(result){
			$("#btnToolBar").html("");
			switch(parseInt(result)){
			case 1:
				$("#btnToolBar").append(
						'<div class="container-fluid">'+
							'<div class="navbar-header">'+
								'<a class="navbar-brand" href="#">exwu02</a>'+
							'</div>'+
						'<ul class="nav navbar-nav">'+
							'<li><button class="btn btn-primary navbar-btn">View</button></li>'+
							//'<li><button class="btn btn-default navbar-btn">Edit</button></li>'+
						'</ul>'+
						'<ul class="nav navbar-nav navbar-right">'+
							//'<li><button class="btn btn-default navbar-btn">Download</button></li>'+
							//'<li><button class="btn btn-default navbar-btn">Update</button></li>'+
							'<li><button class="btn btn-default navbar-btn" onClick="toggleFilter()" >toggleFilter</button></li>'+
						'</ul>'+
						'</div>'+			
						'');
				console.log("level_1");
				break;
			case 2:
				$("#btnToolBar").append(
						'<div class="container-fluid">'+
							'<div class="navbar-header">'+
								'<a class="navbar-brand" href="#">exwu02</a>'+
							'</div>'+
						'<ul class="nav navbar-nav">'+
							'<li><button class="btn btn-default navbar-btn">View</button></li>'+
							'<li><button class="btn btn-default navbar-btn">Edit</button></li>'+
						'</ul>'+
						'<ul class="nav navbar-nav navbar-right">'+
							//'<li><button class="btn btn-default navbar-btn">Download</button></li>'+
							//'<li><button class="btn btn-default navbar-btn">Update</button></li>'+
							'<li><button class="btn btn-default navbar-btn" onClick="toggleFilter()" >toggleFilter</button></li>'+
						'</ul>'+
						'</div>'+			
						'');
				console.log("level_2");
				break;
			case 3:
				$("#btnToolBar").append(
						'<div class="container-fluid">'+
							'<div class="navbar-header">'+
								'<a class="navbar-brand" href="#">exwu02</a>'+
							'</div>'+
						'<ul class="nav navbar-nav">'+
							'<li><button class="btn btn-default navbar-btn">View</button></li>'+
							'<li><button class="btn btn-default navbar-btn">Edit</button></li>'+
						'</ul>'+
						'<ul class="nav navbar-nav navbar-right">'+
							'<li><button class="btn btn-default navbar-btn">Download</button></li>'+
// 							'<li><button class="btn btn-default navbar-btn">Update</button></li>'+
							'<li><button class="btn btn-default navbar-btn" onClick="toggleFilter()" >toggleFilter</button></li>'+
						'</ul>'+
						'</div>'+			
						'');
				console.log("level_3");
				break;
			case 4:
				$("#btnToolBar").append(
						'<div class="container-fluid">'+
							'<div class="navbar-header">'+
								'<a class="navbar-brand" href="#">exwu02</a>'+
							'</div>'+
						'<ul class="nav navbar-nav">'+
							'<li class="btn-group">'+
								'<button class="btn btn-primary navbar-btn" onClick="changeTableMode(this)">View</button>'+
								'<button class="btn btn-default navbar-btn" onClick="changeTableMode(this)">Edit</button>'+
							'</li>'+
						'</ul>'+
						'<ul class="nav navbar-nav navbar-right">'+
							'<li><button class="btn btn-default navbar-btn">Download</button></li>'+
							'<li><button class="btn btn-default navbar-btn">Update</button></li>'+
							'<li><button class="btn btn-default navbar-btn" onClick="toggleFilter()" >toggleFilter</button></li>'+
							'<li><button class="btn btn-default navbar-btn" onClick="search()" >Search</button></li>'+
						'</ul>'+
						'</div>'+			
						'');
				console.log("level_4");
				break;
			default:
		 		alert("AuthLevel Error");
			}	
			obj.level=result;
		},
// 		anyc:false,
	});
	return obj;
}

</script>
    
</body>
</html>
