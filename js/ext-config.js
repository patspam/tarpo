Ext.BLANK_IMAGE_URL = 'images/s.gif';

tx = {data:{}, ui: {}};

// work around for broken cross frame Dates in Safari
function fixDate(d){
	return d ? new Date(d.getTime()) : d;
}

function fixDateMember(o, name){
	if(o[name]){
		o[name] = new Date(o[name].getTime());
	}
}

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

Ext.override(Ext.air.FileProvider, {
	clearAllState : function(){
		var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file);
		var stream = new air.FileStream();
		stream.open(stateFile, air.FileMode.WRITE);
		stream.writeObject({});
		stream.close();
		return;
	}
});
//Ext.air.FileProvider.clearAllState();
console = air.Introspector.Console;
//Ext.air.FileProvider.a = 1;
//Ext.air.FileProvider.prototype.clearAllState = function(){alert('ok!');};
//console.log(Ext.air.FileProvider);
//Ext.air.FileProvider.clearAllState();
