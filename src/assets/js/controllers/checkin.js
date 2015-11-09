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
			console.log(response);
		});
		
	})

	.controller('checkinDetailsController', function($routeParams, $http, $scope){
		console.log("lala");
		console.log($routeParams);
		$http({
			method: 'GET',
			url: 'http://checkin-api.dev.cap-liberte.com/checkin/'+$routeParams.checkinId+''

		}).then(function successCallback(response){
			console.log(response.data);
			$scope.checkins = response.data;
		}, function errorCallback(response){
			//console.log(response);
		});

	})

		
	.controller('checkinFormController', function($scope, $http){
		$scope.submit = function(){
			console.log($scope.lat + ' ' + $scope.lng);

			$http({
				method: 'POST',
				url: 'http://checkin-api.dev.cap-liberte.com/checkin',
				data:{
					lat: $scope.lat,
					lng: $scope.lng
				},
				headers:{
					'Content-Type': undefined

				}

			}).then(function successCallback(response){
				console.log(response.data);
				$scope.checkins = response.data;
			}, function errorCallback(response){
				//console.log(response);
			});


		};
	});
		

})(window.angular);