(function(angular){
	'use strict';

	angular.module('contactModule',[])
	.controller('contactController', function(){
		this.contacts =[
			{
				name: 'John',
				phone: '06 00 00 00 00'
			},
			{
				name: 'Jean',
				phone: '06 11 11 11 11'
			}

		];
	});
		

})(window.angular);