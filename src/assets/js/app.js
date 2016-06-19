(function(angular){
	'use strict';

	var myApp = angular.module('myApp',[
		'ngRoute', 'satellizer','LocalStorageModule',
		'helloModule','contactModule','checkinModule','base64'
	])

	
	myApp.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl: 'assets/template/checkinList.html',
      controller: 'checkinController'
			})
    .when('/auth',{
      templateUrl: 'assets/template/login.html',
      controller: 'loginController'
      })
		.when('/checkin/:checkinId',{
			templateUrl: 'assets/template/checkinDetails.html',
			// controller: 'checkinDetailsController'
		});
	})

  .config(function($authProvider) {      
    $authProvider.httpInterceptor = function() {return true; },          
    $authProvider.withCredentials = false;          
    $authProvider.tokenRoot = null;          
    $authProvider.cordova = false;          
    $authProvider.baseUrl = 'http://checkin-api.dev.cap-liberte.com/';          
    $authProvider.loginUrl = '/auth';         
    $authProvider.signupUrl = '/auth/signup';          
    $authProvider.unlinkUrl = '/auth/unlink/';          
    $authProvider.tokenName = 'token';          
    $authProvider.tokenPrefix = 'satellizer';         
    $authProvider.authHeader = 'Authorization';          
    $authProvider.authToken = 'Bearer';          
    $authProvider.storageType = 'localStorage';        
  });    

	myApp.directive('myMaps', function(){
        return{
        	scope :{
        		lat: '@',
        		lon: '@' 	
          },
          restrict: 'E',
          template: '<div></div>',
          replace: true,
          link: function(scope, element, attrs){
            //scope.$watch permet de voir si lat change. 
            //Le html s'execute avant la requete que renvoie lat et lon (openweathermap dans checkinDetailsController) donc lat et lon (dans le html) sont null 
            //Si c'est la cas, appel de la fonction map();
            scope.$watch('lat', function() {
              map();
            });

            var map = function(){
              scope.lat = scope.lat; 
              scope.lon = scope.lon; 
              var myLatLng = new google.maps.LatLng(scope.lat, scope.lon);
             
              var mapOption = {
                center : myLatLng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.TERRAIN
              };
              //var map = new google.maps.Map(document.getElementById(attrs.id), mapOption);
              var map = new google.maps.Map(document.getElementById("map-canvas"), mapOption);
              // Avec une ligne ou l'autre ça fonctionnes

              var marker = new google.maps.Marker({
                position: myLatLng,
                title:"Ma position"
              });
              marker.setMap(map);
            }
          }
        }
      });

})(window.angular);