/**
 * Class for getting and setting settings
 * 
 * e.g. 
 *  Tarpo.Settings.get('someSetting', 'someDefault');
 *  Tarpo.Settings.set('someSetting', 'someValue');
 */
Ext.namespace('Tarpo.Settings');

/**
 * Start by defining some constants
 */
Tarpo.Settings = {
	DB_FILENAME: 'tarpo.sqlite', // this will be removed when we have openable files
	STATE_FILENAME: 'tarpo.state',
};

/** 
 * Next, initialise Ext's global state manager
 * 
 * Notice that this runs immediately.
 * 
 * All state-aware Ext components use the state manager, 
 * and we do too for storing settings.
 */
Ext.state.Manager.setProvider(

	// Use Ext's air-specific FileProvider, which serialises
	// settings to a binary file in the AIR Local Store 
	new Ext.air.FileProvider({
	
		// This is a binary file in the AIR Local Store
		file: Tarpo.Settings.STATE_FILENAME,
		
		// Define default settings here
		defaultState : {
			mainWindow : {
				width:780,
				height:580,
				x:10,
				y:10
			},
			recentFiles: [],
		}
	}
));

Tarpo.Settings.get = function(name, defaultValue) {
	return Ext.state.Manager.getProvider().get(name, defaultValue);
};

Tarpo.Settings.set = function(name, value) {
	return Ext.state.Manager.getProvider().set(name, value);
};

Tarpo.Settings.reset = function() {
	var provider = Ext.state.Manager.getProvider();
	
	// Resetting state probably implies there is something funky going on,
	// so give lots of debug output along the way to help out
	Tarpo.log('State file: ' 
		+ air.File.applicationStorageDirectory.resolvePath(provider.file).nativePath
	);
	Tarpo.log('Old state:');
	Tarpo.dump(provider.state);
	
	// To reset, simply set the state to the default and re-save
	provider.state = provider.defaultState;
	provider.saveState();
	
	Tarpo.log('New state:');
	Tarpo.dump(provider.state);
};