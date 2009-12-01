Tarpo.log = air.Introspector && air.Introspector.Console && air.Introspector.Console.log || Ext.emptyFn;

// Ext Overrides
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

// Initialize the state provider
//Ext.air.FileProvider.clearAllState();
Ext.state.Manager.setProvider(new Ext.air.FileProvider({
	file: 'app.state',
	// if first time running
	defaultState : {
		mainWindow : {
			width:780,
			height:580,
			x:10,
			y:10
		}
	}
}));