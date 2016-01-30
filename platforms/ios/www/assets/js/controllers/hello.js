(function(angular){
	'use strict';

	angular.module('helloModule',[])
	.controller('helloController', function(){
		var helloController = this;

		helloController.afficheLongeur = function(string){
			if(typeof string !== 'undefined'){
				return string.length;
			}
			return 0;
		};

		helloController.inverseChaine = function(string){
			if(typeof string !== 'undefined'){
				return string.split("").reverse().join("");
			}
			return '';
		}

		helloController.splitToList = function(string){
			if(typeof string !== 'undefined'){
				return string.split("");
			}
			return '';
		}

	});

})(window.angular);