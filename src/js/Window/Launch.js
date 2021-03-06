/**
 * Tarpo.Window.Launch
 * 
 * The Launch page is the first window that users see when they start Tarpo.
 * 
 * The Launch page is partly a splash screen, and partly functional as it is
 * the interface used to actually open a database file.
 */
Ext.namespace('Tarpo.Window.Launch');

/**
 * Returns a reference to the Main window
 */
Tarpo.Window.Launch.getMainWindow = function() {
	return air.NativeApplication.nativeApplication.openedWindows[0];
}

/**
 * Reloads the treepanel that displays the list of recently opened databases 
 */
Tarpo.Window.Launch.reloadRecentDatabases = function() {
	var main = Tarpo.Window.Launch.getMainWindow();
	
	// You would think we could grab the latest "recentDatabases" list
	// straight out of the state file (via Tarpo.Settings.get("recentDatabases"),
	// however that doesn't work - at least I couldn't get it to work, even by
	// explicitly reloading the state file. Instead, we use our trick of reaching
	// across into the other window's JS environment and grabbing the data we want
	var recentDatabases = main.stage.getChildAt(0).window.Tarpo.Window.Main.recentDatabases;
	
	// Rebuild the recentDatabases TreePanel
	var rootNode = Ext.ComponentMgr.get('recentDatabasesTreePanel').getRootNode();
	
	// Annoying hack that we have to do.. first delete all items
	while(rootNode.hasChildNodes()){
		rootNode.removeChild(rootNode.item(0));
	}
	// Then re-add, using the new recentDatabases
	rootNode.appendChild(Tarpo.Window.Launch.recentDatabases(recentDatabases));
}

/**
 * This function Initialises the Launch window. It is called from launch.html
 */
Tarpo.Window.Launch.init = function(){
	// Initialise Ext's QuickTips library for the window
	Ext.QuickTips.init();
	
	// Grab a reference to the Main nativeWindow, so that we can respond
	// to events that it fires 
	var main = Tarpo.Window.Launch.getMainWindow();
	
	// The main window tells us when it has finished updating the list
	// of recent databases, so that we can rebuild our list (for the next
	// time the window is displayed)
	main.addEventListener('tarpoRecentDatabasesUpdated', function(){
		Tarpo.Window.Launch.reloadRecentDatabases();
	});
	
	// Build the pretty Launch page
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
				text: 'Open',
				handler: function(){
					Tarpo.Util.openDatabase(Tarpo.Window.Launch.setDatabaseChosen);
				},
				icon: '../images/edit.gif',
				cls: 'x-btn-text-icon',
			}, ]
		}, {
			region: 'west',
			collapsible: true,
			title: 'Recently Opened..',
			xtype: 'treepanel',
			id: 'recentDatabasesTreePanel',
			width: 250,
			autoScroll: true,
			split: true,
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
						Tarpo.error('File not found','Sorry, there is no longer a file at:<br>' + file.nativePath);
					}
				}
			},
		}, {
			region: 'center',
			html: '<img src="../images/splash.png" style="width: 100%; max-width: 250px;" onclick="Tarpo.Window.Launch.woof();">' +
				  '<h2 class="launch-welcome">Welcome to Tarpo v' + Tarpo.Util.getVersion() + '</h2>' +
				  '<p class="launch-welcome">Tarpo is an open source Data Management tool for Dog Health Programs.</p>' +
				  "<p class='launch-welcome'>Visit the <a href='#' onclick='Tarpo.Util.openInBrowser(\"http://patspam.github.com/tarpo\")'>Tarpo Website</a> to get involved in the project.</p>" +
				  "<p class='launch-welcome'>Please report all bugs in the <a href='#' onclick='Tarpo.Util.openInBrowser(\"http://github.com/patspam/tarpo/issues\")'>Issue Tracker</a></p>",
			autoHeight: true,
		}]
	});
};

/**
 * Plays a woof sound (easter egg)
 */
Tarpo.Window.Launch.woof = function() {
	air.trace('woof');
	Ext.air.Sound.play('src/sound/woof.mp3', 0);
}

/**
 * This function grabs the list of recent databases out of the state file,
 * and turns it into a list of objects that can be passed to the TreePanel
 */
Tarpo.Window.Launch.recentDatabases = function(recent) {
	// If an object is provided, use that (and munge it), otherwise look it up
	recent = recent || Tarpo.Settings.get('recentDatabases', []);
	
	if (recent.length == 0) {
		return [];
	} else {
		return recent.map(function(e){
			var date = e.timestamp ? new Date(e.timestamp) : new Date();
			return {
				text: e.nativePath || 'Unknown',
				leaf: true,
				qtip: date.format('D d/m/Y h:m:s'),
			};
		});
	}
}

/**
 * This function triggers the "new file" dialog
 */
Tarpo.Window.Launch.newDatabase = function() {
	// The "New File" dialog should default to the documents directory
	var date = new Date().format('Y-m-d');
	var file = air.File.documentsDirectory.resolvePath(date + '.tarpo');
    
	// Subscribe to the SELECT event
	file.addEventListener( air.Event.SELECT, function (e) {
		air.trace('User chose file: ' + file.nativePath);
		
		// N.B. AIR handles the "file exists" scenario for us
		
		// Copy the skeleton database file to the specified location
		try {
			var skeleton = air.File.applicationDirectory.resolvePath('src/skeleton.sqlite');
			skeleton.copyTo(file, true);
		} catch(err) {
			air.trace(err);
			Tarpo.error('File error', 'Unable to create a new tarpo database at the location specified:<br>' + file.nativePath);
			return;
		}
		
		// The file copied successfully, so proceed
		Tarpo.Window.Launch.setDatabaseChosen(file);
	});
	
	file.browseForSave( 'Specify new Tarpo Database file' );
};

/**
 * This function is called after a database file has been selected.
 * It triggers an event that the Main window is waiting for, telling it
 * to go ahead and (try to) open the database. 
 */
Tarpo.Window.Launch.setDatabaseChosen = function(file) {
	// Stash the file object somewhere that the main window can grab it from
	Tarpo.Window.Launch.file = file;
	
	// Dispatch a custom event, telling the main window that a file has been chosen
	nativeWindow.dispatchEvent(new air.Event("tarpoDatabaseChosen"));
}

Tarpo.Window.Launch.init();
