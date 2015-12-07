(function(angular){
	'use strict';

	angular.module('checkinModule',['LocalStorageModule'])
	.controller('checkinController', function($scope, $http){
		console.log("bonjour");

		var getCheckInList = function(){
			$http({
				method: 'GET',
				url: 'http://checkin-api.dev.cap-liberte.com/checkin'

			}).then(function successCallback(response){
				console.log(response.data);
				$scope.checkins = response.data;
			}, function errorCallback(response){
				console.log(response);
			});

		};	

		$scope.$on('EvenementRecharge', function(){ //Regarde si le $scope voit la chaine de caratère
			console.log("evenement EvenementRecharge reçut");
			getCheckInList();
		});
		
		
	})

	.controller('checkinDetailsController', function($routeParams, $http, $scope){
		console.log("lala"+$routeParams);
		$http({
			method: 'GET',
			url: 'http://checkin-api.dev.cap-liberte.com/checkin/'+$routeParams.checkinId+''

		}).then(function successCallback(response){
			console.log(response.data);
			$scope.checkin = response.data;
		}, function errorCallback(response){
			//console.log(response);
		});
	})

		
	.controller('checkinFormController', function($rootScope, $scope, $http, localStorageService, $routeParams){
		
		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(position){
	        	console.log(position); // Objet position retourné par getCurrentPosition
	        	$scope.$apply(function(){ //$apply met a jour angular dans une fonction asynchrone 
					$scope.lat = position.coords.latitude;//
				    $scope.lng = position.coords.longitude;
	        	});	        	
	        });
	    } 

	    else { 
	        //x.innerHTML = "Geolocation is not supported by this browser.";
	    }					

		$scope.submit = function(){
			console.log($scope.lat + ' ' + $scope.lng);

			var key = $routeParams.checkinId;
			//var val = [ lat, lng];

			//console.log("key " +key);

			if(localStorageService.isSupported) {
    			function (key, val) {
   					return localStorageService.set(key, "val");
  				}

  				function getItem(key) {
   					return localStorageService.get("key");
  				}
  			}
			

			console.log("localStorageService " + localStorageService.get("key"));

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
				$rootScope.$broadcast('EvenementRecharge');// retourne la chaine de caractère "EvenementRecharge" dans le rootScope (parent de tous les scope)
				console.log(response.data);
				$scope.checkins = response.data;
			}, function errorCallback(response){
				console.log(response);
			});
		};					
	});
		

})(window.angular);