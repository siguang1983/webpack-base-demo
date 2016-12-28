var $ = require('jquery');

define(['./m1', './m2'], function(m1, m2){
	console.log(m1.showModuleM1());
	console.log(m2.showModuleM2());
})