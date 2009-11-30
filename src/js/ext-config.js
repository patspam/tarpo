Ext.BLANK_IMAGE_URL = '../images/s.gif';

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

// Date formatter needed because AIR sometimes chokes on Ext's built-in ones
function dateFormatter(v){
    if(!v){
        return "";
    }
    if(!Ext.isDate(v)){
        v = new Date(Date.parse(v));
    }
	return (v.toString()).replace(/(\d{4}).*/, '$1');
//	return v.format('D d/m/Y'); // this breaks sometimes
};

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