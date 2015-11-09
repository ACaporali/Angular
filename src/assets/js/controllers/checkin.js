(function(angular){
	'use strict';

	angular.module('checkinModule',[])
	.controller('checkinController', function($scope, $http){
		console.log("bonjour");

		$http({
			method: 'GET',
			url: 'http://checkin-api.dev.cap-liberte.com/checkin'

		}).then(function successCallback(response){
			console.log(response.data);
			$scope.checkins = response.data;
		}, function errorCallback(response){
			//console.log(response);
		});
		
	});
		

})(window.angular);