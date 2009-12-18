/**
 * Tarpo.Window.Main
 * 
 * This is the javascript for the "initialWindow" of our AIR app (main.html).
 * The page itself is opened automatically by AIR (because we tell it so in 
 * application.xml).
 * 
 * The Main window is the one that ends up being used to drive Tarpo,
 * however the user actually sees the Launch window first up. We create
 * that window from this one, and use some cross-window event trickery
 * to make it all hang together.
 * 
 * Read on..
 */
Ext.namespace('Tarpo.Window.Main');

/**
 * This is the first function called when the application loads.
 * 
 * In it, we instantiate the Launch window and the Main window, 
 * wire up the initial events, and display the Launch window.
 * 
 * Everything from then on is event-based.
 */
Tarpo.Window.Main.bootstrap = function() {
	
	// Create the Launch and the Main NativeWindows.
	// We create them both right away so that we can add 
	// event listeners to them.
	var launch = Tarpo.WindowManager.getLaunchWindow();
	var main = Tarpo.WindowManager.getMainWindow();
	
	// Try to register ourselves as the default handler for .tarpo files
	air.NativeApplication.nativeApplication.setAsDefaultApplication('tarpo');
	if (!air.NativeApplication.nativeApplication.isSetAsDefaultApplication('tarpo')) {
		air.trace('Unable to setAsDefaultApplication for .tarpo files, oh well..');
	}
	
	// Now wire up some events..
	
	// Closing either window immediately exits the app
	main.on('close', function(){ 
		//Tarpo.trace('Main window closed, exiting app');
		air.NativeApplication.nativeApplication.exit();
	});
	launch.on('close', function(){  
		//Tarpo.trace('Launch window closed, exiting app');
		air.NativeApplication.nativeApplication.exit(); 
	});
	
	// The main window kicks into gear when the Launch window
	// fires its tarpoDatabaseChosen event
	launch.on('tarpoDatabaseChosen', function(e){
		try {
			Tarpo.Window.Main.tarpoDatabaseChosen(e);
		}
		catch(err) {
			Tarpo.trace(err);
			alert('An error occurred, please try again');
		}
	});
	
	// Invoke event fires on application load, and if second instance of application is run 
	air.NativeApplication.nativeApplication.addEventListener('invoke', Tarpo.Window.Main.onInvoke);
	
	// Display the Launch window
	launch.activate();
}

/**
 * Handles the 'invoke' event, which is triggered when the application starts
 * and also if the user tries to start a second instance of the app.
 * 
 * This handler is used to pull out a filename from the command-line arguments
 * and open the appropriate database file. This means that if Tarpo is set
 * as the default application for .tarpo files, double-clicking on a .tarpo file
 * will open that file (even if Tarpo is already running - intelligently prompting
 * the user if they want to close the current file)
 */
Tarpo.Window.Main.onInvoke = function(e) {
	var args = e.arguments.filter(function(arg){return arg != '-d' && arg != '--debug'});
	
	// Arguments optionally contains a database to open
	if (args.length > 0) {
		var file = e.currentDirectory.resolvePath(args[0]);
		var nativePath = file.nativePath;
		if (!file.exists) {
			alert('File does not exist:\n\n' + nativePath);
			return;
		}
		if (nativePath == Tarpo.Db.nativePath) {
			air.trace('File already open', nativePath);
			return;
		}
		if (Tarpo.Db.openState) {
			if (confirm('Do you want to close the current database and open:\n\n' + nativePath)) {
				Tarpo.Db.close();
			}
			else {
				return;
			}
		}
		
		// We are going to trigger the 'tarpoDatabaseChosen' which is usually triggered
		// by the Launch window, so put the file reference where the event handler expects
		// to find it..
		var launch = Tarpo.WindowManager.getLaunchWindow();
		launch.loader.window.Tarpo.Window.Launch.file = file;
		
		// Fire the 'tarpoDatabaseChosen' event
		launch.instance.dispatchEvent(new air.Event("tarpoDatabaseChosen"));
	}
}

/**
 * The Launch window is in control of allowing the user to choose which database
 * to open, but the Main window is the one that actually does the opening (because
 * we want to open it in the Main window's JS environment). Thus, the main window
 * waits for the Launch window to fire the tarpoDatabaseChosen event, and then 
 * reaches across into the Launch windows JS env to pull out the filename of the
 * selected database.
 */
Tarpo.Window.Main.tarpoDatabaseChosen = function(e) {
	//air.trace('Main window responding to tarpoDatabaseChosen event');
	
	// We need references to both windows (which have already be instantiated)
	var launch = Tarpo.WindowManager.getLaunchWindow();
	var main = Tarpo.WindowManager.getMainWindow();
	
	// Tunnel out the chosen file from the Launch Window's JS env
	var file = launch.loader.window.Tarpo.Window.Launch.file;
	
	if (Tarpo.Db.openState) {
		air.trace('Closing open file before opening new one');
		Tarpo.Db.close();
	}
	
	// Open the connection to the db
	var nativePath = file.nativePath;
	try {
		Tarpo.Db.open(file);
	} catch(err) {
		// To use Ext.Msg.alert we would have to fire an event back to the Launch Window 
		// to have the error displayed there
		alert('Sorry, Tarpo did not recognise that file as a valid database. ' +
			  "Please check the file and try again.\n\n" +
			  "The file you tried to open was:\n" + nativePath
		);
		return;
	}
	
	// First, create an automatic backup
	try {
		Tarpo.Db.backup();
	} catch(err) {
		Tarpo.trace(err);
		alert('Unable to create safe backup of database file, please check the file and try again');
		return;
	}
	
	// Then run sanity check
	try {
		Tarpo.Upgrade.sanityCheck();
	} catch(err) {
		Tarpo.trace(err);
		return;
	}
	
	// See if Tarpo is out of date (according to the database)
	if (Tarpo.Upgrade.tarpoNeedsUpgrade()) {
		alert(
			'This database is from a newer version of Tarpo that the one currently installed. ' +
			'Please upgrade Tarpo!'
		);
		return;
	}
	
	// See if the database needs to be upgraded
	if (Tarpo.Upgrade.dbNeedsUpgrade()) {
		if (!confirm('This database file is out of date. Can I upgrade it?')) {
			return;
		}
		
		try {
			Tarpo.Upgrade.run();
		} 
		catch (err) {
			Tarpo.trace(err);
			alert('Sorry, problems were encountered during the upgrade and it is possible that ' +
			'your database was corrupted as a result. Please grab a backup copy of your database ' +
			'from the collection of backups that Tarpo automatically creates in:\n\n' +
			Tarpo.Db.backupFolderLocation().nativePath);
			return;
		}
	}
	
	// The connection was successfully opened, so update the list of recent databases
	var recent = Tarpo.Settings.get('recentDatabases', []);
	recent = recent.filter(function(e){
		return e.nativePath != nativePath
	});
	var newest = {
		nativePath: file.nativePath,
		timestamp: new Date().getTime(),
	};
	if (recent.length == 0) {
		recent = [newest];
	} else {
		recent.splice(0, 0, newest);
	}

	Tarpo.Settings.set('recentDatabases', recent);
	
	// We want to send this updated list back to the Launch window so that it can
	// update its TreePanel, so store recent in main's JS environment
	Tarpo.Window.Main.recentDatabases = recent;
	
	// The Launch window has done its job. Time for it to disappear
	// N.B. AIR introspector console likes to re-open this window if you send debug messages
	launch.hide();
	
	// Time to display the Main window an load it with data from the database
	Tarpo.Window.Main.load();
	
	// Finally, fire off an event so that the Launch window knows ot update its list
	// of recent databases
	nativeWindow.dispatchEvent(new air.Event("tarpoRecentDatabasesUpdated"));
}

/**
 * This function initialises the Main window (menus, panels, etc..). 
 * 
 * It is automatically called by Tarpo.Window.Main.load()
 * 
 * Everything that happens here should be independent of the actual contents of 
 * the database, so that we don't need to run it again if the user closes
 * the database and loads another file.
 */
Tarpo.Window.Main.init = function(){
	if (Tarpo.Window.Main.initialised) {
		air.trace('Main window already initialised');
		return;
	} else {
		air.trace('Initialising main window');
	}
	
	// Initialise Ext's QuickTips library (needs to be called once at page load)
	Ext.QuickTips.init();
	
	// Init the Grouping Stores
	Tarpo.store = {
		visit: new Tarpo.Store.Visit(),
		surg:  new Tarpo.Store.Surg(),
		med:   new Tarpo.Store.Med(),
		list:  new Tarpo.Store.List(),
	};
	
	// Init the Editor Grid Panels
	Tarpo.grid = {
		visit: new Tarpo.EditorGridPanel.Visit(),
		surg:  new Tarpo.EditorGridPanel.Surg(),
		med:   new Tarpo.EditorGridPanel.Med(),
	};
	
	// Init the Menus
	Ext.air.SystemMenu.add('File', [Tarpo.Actions.exportXml, Tarpo.Actions.closeDatabase, Tarpo.Actions.quit, ]);
	Ext.air.SystemMenu.add('Report', [Tarpo.Actions.report, ]);
	Ext.air.SystemMenu.add('Settings', [Tarpo.Actions.editDogColours, Tarpo.Actions.editDogBreeds, Tarpo.Actions.resetDefaults]);
	if (air.Introspector) {
		Ext.air.SystemMenu.add('Debug', [Tarpo.Actions.debug, Tarpo.Actions.debugState]);
	}
	Ext.air.SystemMenu.add('Help', [Tarpo.Actions.visitProjectPage, Tarpo.Actions.visitWiki, Tarpo.Actions.visitBugTracker, Tarpo.Actions.about]);
	
	// Build the List TreePanel
	var tree = new Tarpo.TreePanel.List({
		actions: Tarpo.Actions,
		store: Tarpo.store.list
	});
	Tarpo.store.list.bindTree(tree);
	Tarpo.store.list.on('update', function(){
		Tarpo.store.visit.applyGrouping();
		Tarpo.store.surg.applyGrouping();
		Tarpo.store.med.applyGrouping();
		
		if (Tarpo.grid.visit.titleNode) {
			Tarpo.grid.visit.setTitle(Tarpo.grid.visit.titleNode.text);
		}
		if (Tarpo.grid.surg.titleNode) {
			Tarpo.grid.surg.setTitle(Tarpo.grid.surg.titleNode.text);
		}
		if (Tarpo.grid.med.titleNode) {
			Tarpo.grid.med.setTitle(Tarpo.grid.med.titleNode.text);
		}
	});
	
	var limit_field = new Ext.form.NumberField({
		allowBlank: false,
		allowNegative: false,
		allowDecimals: false,
		fieldLabel: 'Max Rows',
		minValue: 1,
		width: 40,
		value: Tarpo.Data.row_limit,
		listeners: {
			change: {
				fn: function(target, new_val, old_val){
					Tarpo.Data.row_limit = new_val;
				}
			}
		}
	});
	
	var tb = new Ext.Toolbar({
		region: 'north',
		id: 'main-tb',
		height: 26,
		items: [Tarpo.Actions.newVisit, Tarpo.Actions.newSurg, Tarpo.Actions.newMed, '-', Tarpo.Actions.report, '-', 'Max Rows: ', limit_field, '->', ' ', ' ', ' ']
	});
	
	var tab = new Ext.TabPanel({
		region: 'center',
		id: 'tab-panel',
		activeTab: 0,
		//        defaults:{autoScroll: true},
		deferredRender: false, // to avoid eval()!
		items: [new Ext.Panel({
			title: 'House Visits',
			layout: 'fit',
			items: Tarpo.grid.visit,
		
		}), new Ext.Panel({
			title: 'Surgical Cases',
			layout: 'fit',
			items: Tarpo.grid.surg,
			listeners: {
				'activate': function(){
					Tarpo.store.surg.init();
				}
			}
		}), new Ext.Panel({
			title: 'Medical Cases',
			layout: 'fit',
			items: Tarpo.grid.med,
			listeners: {
				'activate': function(){
					Tarpo.store.med.init();
				}
			}
		}), ],
	
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [tb, Tarpo.store.list.tree, tab]
	});
	
	Tarpo.grid.visit.on('keydown', function(e){
		if (e.getKey() == e.DELETE && !Tarpo.grid.visit.editing) {
			Tarpo.Actions.deleteVisit.execute();
		}
	});
	Tarpo.grid.surg.on('keydown', function(e){
		if (e.getKey() == e.DELETE && !Tarpo.grid.surg.editing) {
			Tarpo.Actions.deleteSurg.execute();
		}
	});
	Tarpo.grid.med.on('keydown', function(e){
		if (e.getKey() == e.DELETE && !Tarpo.grid.med.editing) {
			Tarpo.Actions.deleteMed.execute();
		}
	});
	
	Tarpo.store.list.tree.el.on('keydown', function(e){
		if (e.getKey() == e.DELETE && !Tarpo.store.list.tree.editor.editing) {
			Tarpo.Actions.deleteList.execute();
		}
	});
	
	Tarpo.grid.visit.getSelectionModel().on('selectionchange', function(sm){
		var disabled = sm.getCount() < 1;
		Tarpo.Actions.deleteVisit.setDisabled(disabled);
	});
	Tarpo.grid.surg.getSelectionModel().on('selectionchange', function(sm){
		var disabled = sm.getCount() < 1;
		Tarpo.Actions.deleteSurg.setDisabled(disabled);
	});
	Tarpo.grid.med.getSelectionModel().on('selectionchange', function(sm){
		var disabled = sm.getCount() < 1;
		Tarpo.Actions.deleteMed.setDisabled(disabled);
	});
	
	// Whew! Make note that we've initialised the main window, so that we
	// don't have to go through all that rubbish a second time..
	Tarpo.Window.Main.initialised = true;
};

/**
 * This function loads data from the database into the Main window.
 * 
 * The Main window is automatically initialised along the way.
 */
Tarpo.Window.Main.load = function() {
	
	// We always call the Main window's initialisation method, but it 
	// only does real work the first time around. 
	Tarpo.Window.Main.init();
    
	// Initialise the data stores
    Tarpo.store.visit.init();
    Tarpo.store.surg.init();
    Tarpo.store.med.init();
    
    Tarpo.store.list.tree.root.select();
    
    // fix bug where surg grid doesn't show initially
    Tarpo.store.surg.reload();
    Tarpo.store.med.reload();
    
    Tarpo.store.list.tree.getSelectionModel().on('selectionchange', function(t, node){
        var listId = node ? node.id : null;
        var node = Tarpo.store.list.tree.getNodeById(listId);
        if (node && !node.isSelected()) {
            node.select();
            return;
        }
        Tarpo.Actions.deleteList.setDisabled(!node || !node.attributes.editable);
        Tarpo.Actions.deleteFolder.setDisabled(!node || node.attributes.editable === false || !node.attributes.isFolder);
        if (node) {
            if (node.attributes.isFolder) {
                var lists = [];
                node.cascade(function(n){
                    if (!n.attributes.isFolder) {
                        lists.push(n.attributes.id);
                    }
                });
                Tarpo.store.visit.loadList(lists);
                Tarpo.store.surg.loadList(lists);
                Tarpo.store.med.loadList(lists);
            }
            else {
                Tarpo.store.visit.loadList(node.id);
                Tarpo.store.surg.loadList(node.id);
                Tarpo.store.med.loadList(node.id);
            }
            Tarpo.grid.visit.titleNode = node;
            Tarpo.grid.surg.titleNode = node;
            Tarpo.grid.med.titleNode = node;
            Tarpo.grid.visit.setTitle(node.text);
            Tarpo.grid.surg.setTitle(node.text);
            Tarpo.grid.med.setTitle(node.text);
            Tarpo.grid.visit.setIconClass(node.attributes.iconCls);
            Tarpo.grid.surg.setIconClass(node.attributes.iconCls);
            Tarpo.grid.med.setIconClass(node.attributes.iconCls);
        }
    });
    
    Tarpo.store.list.tree.getRootNode().reload();
	
	// Behold!
	Tarpo.WindowManager.getMainWindow().activate();
};
Tarpo.WindowManager.getAboutWindow().activate();
//Tarpo.Window.Main.bootstrap();
