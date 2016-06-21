(function(angular){
	'use strict';

	angular.module('checkinModule',['LocalStorageModule'])
	.controller('checkinController', function($scope, $http, localStorageService){
		var getCheckInList = function(){
			$http({
				method: 'GET',
				url: 'http://checkin-api.dev.cap-liberte.com/checkin'

			}).then(function successCallback(response){				
				$scope.checkins = response.data;
				console.log($scope.checkins);

				var checkInList = localStorageService.get('checkInList');
	  			checkInList = [];

	  			for (var i = 0; i < $scope.checkins.length; i++) {

	  			var elements = {
	  				id : $scope.checkins[i].id,
	  				picture : $scope.checkins[i].user.picture,
	  				name : $scope.checkins[i].user.name,
	  				weather : $scope.checkins[i].weather
	  			}
	  			checkInList.push(elements);

	  			};
	  			localStorageService.set('checkInList', checkInList);

			}, function errorCallback(response){
				console.log(response);
				console.log('non');
				var checkInList = localStorageService.get('checkInList');
				console.log(checkInList);

				//Déclare du tbl final
				var tbl = [];
				

				for (var i = 0; i < checkInList.length; i++) {
					//Déclare les différentes variables
					var checkins = {};
					var user = {};
					var weather = "";
					var id = 0;

					//Met dans user les éléments
					id = checkInList[i].id;					
					user.picture = '../../images/user.jpg';
					user.name = checkInList[i].name;
					weather = checkInList[i].weather;

					//Met user et weather dans checkins
					checkins.id = id;
					checkins.user = user;
					checkins.weather = weather;
					
					//Met checkins dans tbl qui deviendra $scope.checkins par la suite
					tbl.push(checkins);
				};
				
				$scope.checkins = tbl;
				console.log($scope.checkins);
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

		
	.controller('checkinFormController', function($rootScope, $scope, $http, localStorageService, $routeParams, $base64){		
		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(position){
	        	console.log(position); // Objet position retourné par getCurrentPosition
	        	$scope.$apply(function(){ //$apply met a jour angular dans une fonction asynchrone 
					$scope.lat = position.coords.latitude;//
				    $scope.lng = position.coords.longitude;
	        	});

	        	function openWeatherMap(){
					$http({
						method: 'GET',
						url: 'http://api.openweathermap.org/data/2.5/weather?lat='+$scope.lat+'&lon='+$scope.lng+'&appid=1084fe7b11d7b5de600c40f277b2b42c&lang=fr&units=metric'			
						//utiliser la lat et long récupéré dans le checkin au dessus

					}).then(function successCallback(response){
						$scope.weatherLocal = response.data;

					}, function errorCallback(response){
						//console.log(response);
					});
				};
				openWeatherMap();
	        });

	        
	    } 
	    else { 
	        //x.innerHTML = "Geolocation is not supported by this browser.";
	        alert('Geolocation is not supported by this browser.');
	    }

	    document.addEventListener("deviceready", function () {
		    $scope.tackPicture = function() {
		    	navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
    			destinationType: Camera.DestinationType.DATA_URL
				});

				function onSuccess(imageData) {
				    var image = document.getElementById('myImage');
				    image.src = "data:image/jpeg;base64," + imageData;
				    console.log(image.src);
				    $scope.image64 = image.src;

				    
				}

				function onFail(message) {
				    alert('Failed because: ' + message);
				}
		    }
		}, false);				

		$scope.submit = function(){
			if ($scope.image64 == null) {
				$scope.image64 = "";
		    };

			localStorage.clear(); //Vide la local storage à chaque clique sur le bouton submit, à retirer si l'on veux mettre plusieur chekin dans le local storage
			console.log($scope.lat + ' ' + $scope.lng);
  			//localStorage (création du tableau dans lequel les coordonnées sont misent en localStorage)
  			var checkIns = localStorageService.get('checkIns');
  			if (checkIns === null){
  				checkIns = [];
  			}

  			var coordonnees = {
  				lat : $scope.lat,
  				lng : $scope.lng,
  				image64 : $scope.image64,
  				weatherLocal: $scope.weatherLocal
  			}
  			checkIns.push(coordonnees);
  			localStorageService.set('checkIns', checkIns);
  			$rootScope.$broadcast('localStorageFait');
			
		};			
	})

	.controller('loginController', function($scope, $auth){			
		$scope.loginSubmit = function(){						
			//email : demo@demo.com
			//mdp: demo			
						
			var user = {  				
				email: $scope.email,  				  				
				password: $scope.password			
			};		
	
			$auth.login(user).then(function(response) { 	
				console.log(response);				
				// Redirect user here after a successful log in.  
				console.log("connexion réussite");
				window.location.assign("/#/");
				var $toastContent = $('<span>Connexion faite !</span>');
				Materialize.toast($toastContent, 5000);
			}).catch(function(response) {
				console.log("Erreur connexion"); 	
				var $toastContent = $('<span>Erreur de connexion !</span>');
				Materialize.toast($toastContent, 5000);	
				// Handle errors here, such as displaying a notification     			
				// for invalid email and/or password.   			
			});		
		};	
	})

	.controller('SynchroController', function($rootScope, $scope, $http, localStorageService, $routeParams){
		$scope.$on('localStorageFait', function(){
			var checkIns = localStorageService.get('checkIns');
			$scope.nbSynchro = checkIns.length;
		});

		//Ajout d'un checkIn avec ses coordonnées géographiques enregistrées dans le localStorage
		$scope.synchro = function(){
			var checkIns = localStorageService.get('checkIns');
			for (var i = 0; i < checkIns.length; i++) {
				$http({
					method: 'POST',
					url: 'http://checkin-api.dev.cap-liberte.com/checkin',
					data:{
						lat: checkIns[i].lat,
						lng: checkIns[i].lng,
						image_path: checkIns[i].image64,
						weather: checkIns[i].weatherLocal
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