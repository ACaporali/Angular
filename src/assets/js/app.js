(function(angular){
	'use strict';

	angular.module('myApp',[
		'ngRoute',
		'helloModule','contactModule','checkinModule'
	])

	
	.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl: 'assets/template/checkinList.html',
			})
		.when('/checkin/:checkinId',{
			templateUrl: 'assets/template/checkinDetails.html',
			// controller: 'checkinDetailsController'
		});

	});
	

})(window.angular);