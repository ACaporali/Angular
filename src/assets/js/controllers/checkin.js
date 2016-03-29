(function(angular){
	'use strict';

	angular.module('checkinModule',['LocalStorageModule'])
	.controller('checkinController', function($scope, $http){
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
  			//localStorage (création du tableau dans lequel les coordonnées sont misent en localStorage)
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
  			$rootScope.$broadcast('localStorageFait');
			
		};			
	})

	.controller('loginController', function($scope, $auth){			
		$scope.loginSubmit = function(){			
			console.log('passe dans le loginController');			
			//email : demo@demo.com
			//mdp: demo			
						
			var user = {  				
				email: $scope.email,  				  				
				password: $scope.password			
			};
			 					console.log(user);			
	
			$auth.login(user).then(function(response) { 	
				console.log(response);				
				// Redirect user here after a successful log in.  
				console.log("connexion réussite");
			}).catch(function(response) {
				console.log("Erreur connexion"); 
				console.log($scope.password);			
				// Handle errors here, such as displaying a notification     			
				// for invalid email and/or password.   			
			});		
		};	
	})

	.controller('SynchroController', function($rootScope, $scope, $http, localStorageService, $routeParams){
		$scope.$on('localStorageFait', function(){
			console.log("evenement localStorageFait reçut");
			var checkIns = localStorageService.get('checkIns');
			$scope.nbSynchro = checkIns.length;
		});

		//Ajout d'un checkIn avec ses coordonnées géographiques enregistrées dans le localStorage
		$scope.synchro = function(){
			console.log('ici');
			var checkIns = localStorageService.get('checkIns');
			for (var i = 0; i <= checkIns.length; i++) {
				$http({
					method: 'POST',
					url: 'http://checkin-api.dev.cap-liberte.com/checkin',
					data:{
						lat: checkIns[i].lat,
						lng: checkIns[i].lng
					},
					headers:{
						'Content-Type': undefined
					}
				}).then(function successCallback(response){
					$rootScope.$broadcast('EvenementRecharge');// retourne la chaine de caractère "EvenementRecharge" dans le rootScope (parent de tous les scope)				
					console.log(response.data);
					$scope.checkins = response.data;
					localStorageService.remove('checkIns');					
				    var $toastContent = $('<span>Synchronisation faite !</span>');
				    Materialize.toast($toastContent, 5000);
        
				}, function errorCallback(response){
					console.log(response);
				});
			};					
		};			
	});
})(window.angular);