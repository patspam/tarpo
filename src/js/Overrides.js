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

/**
 * Need to override the way that GroupingView generates its groupTextTpl because it uses XTemplate
 * This is taken from ext-air.js, but with this.groupTextTpl substituted with {text}
 * -- for some reason GroupingViews don't display their grouping headers without this (in ExtJS >= 2.3) 
 */
Ext.override(Ext.grid.GroupingView, {
    startGroup: new Ext.XTemplate('<div id="{groupId}" class="x-grid-group {cls}">', '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>{text}</div></div>', '<div id="{groupId}-bd" class="x-grid-group-body">')
});