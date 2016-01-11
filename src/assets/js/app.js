(function(angular){
	'use strict';

	var myApp = angular.module('myApp',[
		'ngRoute', 'LocalStorageModule',
		'helloModule','contactModule','checkinModule'
	])

	
	myApp.config(function($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl: 'assets/template/checkinList.html',
			})
		.when('/checkin/:checkinId',{
			templateUrl: 'assets/template/checkinDetails.html',
			// controller: 'checkinDetailsController'
		});
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

            console.log(scope);

            console.log(scope.lat);
            console.log(scope.lon);

            var myLatLng = new google.maps.LatLng(scope.lat, scope.lon);
            
            
            
            var mapOption = {
              center : myLatLng,
              zoom: 2,
              mapTypeId: google.maps.MapTypeId.TERRAIN
            };
            //var map = new google.maps.Map(document.getElementById(attrs.id), mapOption);
            var map = new google.maps.Map(document.getElementById("map-canvas"), mapOption);
            // Avec une ligne ou l'autre ça fonctionnes

            

            var marker = new google.maps.Marker({
              position: myLatLng,
              title:"Hello World!"
            });
            marker.setMap(map);
          }
        }
      });

})(window.angular);