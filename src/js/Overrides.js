/**
 * Ext overrides are collected here
 */

Ext.BLANK_IMAGE_URL = '../images/s.gif';

// Unique ids, if the time isn't unique enough, the addition 
// of random chars should be
Ext.uniqueId = function(){
	var t = String(new Date().getTime()).substr(4);
	var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i = 0; i < 4; i++){
		t += s.charAt(Math.floor(Math.random()*26));
	}
	return t;
}

Ext.util.Format.bool = function(value){
	return value ? '<img src="../images/icon-complete.gif"></input>' : '';
};