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
		
		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(position){
	        	console.log(position); // Objet position retourné par getCurrentPosition
	        	$scope.$apply(function(){ //$apply met a jour angular dans une fonction asynchrone
					$scope.lat = position.coords.latitude;
				    $scope.lng = position.coords.longitude;
	        	});	        	
	        });
	    } 

	    else { 
	        //x.innerHTML = "Geolocation is not supported by this browser.";
	    }					

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