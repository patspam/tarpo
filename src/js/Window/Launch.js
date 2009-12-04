/**
 * Tarpo.Window.Launch
 */
Ext.namespace('Tarpo.Window.Launch');

Tarpo.Window.Launch.init = function(){
	Ext.QuickTips.init();
	
	var main = air.NativeApplication.nativeApplication.openedWindows[0];
	main.addEventListener('tarpoRecentDatabasesUpdated', function(){
		//nativeWindow.visible = false;
		air.trace('tarpoRecentDatabasesUpdated');
		
		// Tunnel out the new recentDatabases the Main Window's JS env
		var recentDatabases = main.stage.getChildAt(0).window.Tarpo.Window.Main.recentDatabases;
		air.trace('Tunneled out');
		air.trace(recentDatabases);
		
		// Rebuild the tree
		var rootNode = Ext.ComponentMgr.get('treepanel').getRootNode();
		
		// Annoying hack that we have to do.. first delete all items
		while(rootNode.hasChildNodes()){
			rootNode.removeChild(rootNode.item(0));
		}
		// Then re-add
		rootNode.appendChild(Tarpo.Window.Launch.recentDatabases(recentDatabases));
	});
	
	new Ext.Viewport({
		layout: 'border',
		items: [{
			region: 'north',
			tbar: [{
				text: 'New',
				handler: function(){
					Tarpo.Window.Launch.newDatabase();
				},
				icon: '../images/icon-folder-new.gif',
				cls: 'x-btn-text-icon',
			}, {
				text: 'Browse',
				handler: function(){
					Tarpo.Window.Launch.openDatabase();
				},
				icon: '../images/edit.gif',
				cls: 'x-btn-text-icon',
			}, ]
		}, {
			region: 'west',
			collapsible: true,
			title: 'Recently Opened..',
			xtype: 'treepanel',
			id: 'treepanel',
			width: 250,
			autoScroll: true,
			loader: new Ext.tree.TreeLoader(),
			root: new Ext.tree.AsyncTreeNode({
				expanded: true,
				children: Tarpo.Window.Launch.recentDatabases(),
			}),
			rootVisible: false,
			listeners: {
				click: function(n){
					var nativePath = n.attributes.text;
					air.trace('Attempting to open file: ' + nativePath);
					var file = new air.File(nativePath);
					if (file.exists) {
						Tarpo.Window.Launch.setDatabaseChosen(file);
					} else {
						Ext.Msg.alert('File not found', 'The selected file does not exist');
					}
				}
			},
		}, {
			region: 'center',
			html: '<img src="../images/splash.png" style="width: 100%; max-width: 250px;">',
			autoHeight: true
		}, {
			region: 'south',
			title: 'Information',
			collapsible: true,
			html: 'Welcome to Tarpo. Please open an existing Tarpo Database file or create a new one using the buttons above.',
			minHeight: 100
		}]
	});
};

Tarpo.Window.Launch.recentDatabases = function(recent) {
	recent = recent || Tarpo.Settings.get('recentDatabases', []);
	recent = recent.map(function(e){ 
		return {
			text: e.nativePath,
			leaf: true,
			qtip: new Date(e.timestamp).format('D d/m/Y h:m:s'),
		};
	});
	if (recent.length == 0) {
		recent = {
			text: 'No recently opened items',
			leaf: true,
		}
	}
	return recent;
}

Tarpo.Window.Launch.openDatabase = function() {
	// The "Open File" dialog should default to the location
	// of the most recently opened database file
	var mostRecent = Tarpo.Settings.get('recentDatabases', [])[0];
	var file;
	if (mostRecent) {
		file = new air.File(mostRecent.nativePath);
	} else {
		// Otherwise just default to the documents directory
		file = air.File.documentsDirectory;
	}
    
	// Subscribe to the SELECT event
	file.addEventListener( air.Event.SELECT, function (e) {
		air.trace('User chose file: ' + file.nativePath);
		if (file.exists) {
			Tarpo.Window.Launch.setDatabaseChosen(file);
		} else {
			Ext.Msg.alert('Error', 'Unable to open file');
		}
	});
	
	// Subscribe to the CANCEL event
	file.addEventListener( air.Event.CANCEL, function (e) {
		air.trace('User cancelled Open File dialog');
	});
	
	var filters = new runtime.Array();
	filters.push( new air.FileFilter( 'Tarpo Databases', '*.sqlite' ) );
	file.browseForOpen( 'Open Tarpo Database', filters );
};

Tarpo.Window.Launch.setDatabaseChosen = function(file) {
	// Stash the file object somewhere that the main window can grab it from
	Tarpo.Window.Launch.file = file;
	
	// Dispatch a custom event, telling the main window that a file has been chosen
	nativeWindow.dispatchEvent(new air.Event("tarpoDatabaseChosen"));
}
