/**
 * Tarpo.Window.Main
 */
Ext.namespace('Tarpo.Window.Main');

Tarpo.Window.Main.appInit = function() {
	
	// Open the Launch Window
	var launch = Tarpo.WindowManager.getLaunchWindow();
	var main = Tarpo.WindowManager.getMainWindow();
	
	// Closing main window exits app
	main.on('close', function(){ 
		Tarpo.trace('Main window closed, exiting app');
		air.NativeApplication.nativeApplication.exit(); 
	});
	
	// Closing Launch window exits app
	launch.on('close', function(){  
		Tarpo.trace('Launch window closed, exiting app');
		air.NativeApplication.nativeApplication.exit(); 
	});
	
	// The launch window's job is to choose a database file.
	// The main window waits until the launch window fires this event.
	launch.on('tarpoDatabaseChosen', function(e){
		air.trace('Main window detected tarpoDatabaseChosen event');
		
		// Tunnel out the chosen file from the Launch Window's JS env
		var file = launch.loader.window.Tarpo.Launch.file;
		
		if (Tarpo.Db.openState) {
			air.trace('Closing open file before opening new one');
			Tarpo.Db.close();
		}
		
		Tarpo.Db.open(file);
		var nativePath = file.nativePath;
		
		// Update list of recent databases
		var recent = Tarpo.Settings.get('recentDatabases', []);
		var newRecent = recent.filter(function(e){return e.nativePath != nativePath});
		newRecent.splice(0,0,{
			nativePath: file.nativePath,
			timestamp: new Date().getTime(),
		});
		Tarpo.Settings.set('recentDatabases', newRecent);
		
		// Store newRecent somewhere that Launch can grab it from
		Tarpo.Window.Main.recentDatabases = newRecent;
		
		// Connection is now open, so let's hide the launch window
		// N.B. AIR debug console seems to re-open this window
		launch.hide();
		
		Tarpo.Window.Main.init(main);
		Tarpo.Window.Main.load();
		
		air.trace('Dispatching event so that recent list updates');
		nativeWindow.dispatchEvent(new air.Event("tarpoRecentDatabasesUpdated"));
	});
	
	launch.activate();
}

Tarpo.Window.Main.init = function(win){
	if (Tarpo.Window.Main.initialised) {
		air.trace('Main window already initialised');
		return;
	}
	
	air.trace('Initialising main window');
	Ext.QuickTips.init();
	
	// Init the Grouping Stores
	Tarpo.store = {
		visit: new Tarpo.GroupingStore.Visit(),
		surg: new Tarpo.GroupingStore.Surg(),
		med: new Tarpo.GroupingStore.Med(),
		list: new Tarpo.GroupingStore.List(),
	};
	
	// Init the Editor Grid Panels
	Tarpo.grid = {
		visit: new Tarpo.EditorGridPanel.Visit(),
		surg: new Tarpo.EditorGridPanel.Surg(),
		med: new Tarpo.EditorGridPanel.Med(),
	};
	
	// Init the Menus
	Ext.air.SystemMenu.add('File', [Tarpo.Actions.closeDatabase, Tarpo.Actions.demoData, Tarpo.Actions.debug, Tarpo.Actions.quit, ]);
	Ext.air.SystemMenu.add('Export', [Tarpo.Actions.backup, Tarpo.Actions.exportVisitCsv, Tarpo.Actions.exportSurgCsv, Tarpo.Actions.exportMedCsv, Tarpo.Actions.exportXml, ]);
	Ext.air.SystemMenu.add('Report', [Tarpo.Actions.report, ]);
	Ext.air.SystemMenu.add('Settings', [Tarpo.Actions.resetDefaults, ]);
	Ext.air.SystemMenu.add('Help', [Tarpo.Actions.about, ]);
	
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
	
	Tarpo.Window.Main.initialised = true;
};

Tarpo.Window.Main.load = function() {
	
	// Show the main window
	var win = Tarpo.WindowManager.getMainWindow();
	win.show();
	win.instance.activate();
    
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
    
	Tarpo.WindowManager.getMainWindow().on('closing', function(){
        //Ext.air.WindowManager.closeAll();
    });
};
