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

		getCheckInList();	

		$scope.$on('EvenementRecharge', function(){ //Regarde si le $scope voit la chaine de caratère
			console.log("evenement EvenementRecharge reçut");
			getCheckInList();
		});

		$scope.$on('localStorageFait', function(){
			console.log("evenement localStorageFait reçut");
		});	
		
		
	})

	.controller('checkinDetailsController', function($routeParams, $http, $scope, $rootScope){

		$http({
			method: 'GET',
			url: 'http://checkin-api.dev.cap-liberte.com/checkin/'+$routeParams.checkinId+''

		}).then(function successCallback(response){
			console.log($routeParams);
			console.log(response.data);
			$scope.checkin = response.data;
			function openWeatherMap(){
				$http({
					method: 'GET',
					url: 'http://api.openweathermap.org/data/2.5/weather?lat='+$scope.checkin.lat+'&lon='+$scope.checkin.lng+'&appid=1084fe7b11d7b5de600c40f277b2b42c&lang=fr&units=metric'			
					//utiliser la lat et long récupéré dans le checkin au dessus

				}).then(function successCallback(response){
					console.log(response.data);
					$scope.weather = response.data;

				}, function errorCallback(response){
					//console.log(response);
				});
			};
			openWeatherMap();
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

			/*var key = $routeParams.checkinId;
			if(localStorageService.isSupported) {
    			function submit(key, val) {
   					return localStorageService.set('property', 'oldValue');
   					console.log("localStorageService " + localStorageService.get('property'));
  				}.then(function successCallback(response){
					$rootScope.$broadcast('localStorageFait');// retourne la chaine de caractère "localStorageFait" dans le rootScope (parent de tous les scope)
				}
  			}*/

  			//localStorage
  			var checkIns = localStorageService.get('checkIns');
  			if (checkIns === null){
  				checkIns = [];
  			}

  			var coordonnees = {
  				lat : $scope.lat,
  				lng : $scope.lng
  			}

  			checkIns.push(coordonnees);

  			localStorageService.set('checkIns', checkIns);

  			//self.updatecontroleur : augment de 1

			

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