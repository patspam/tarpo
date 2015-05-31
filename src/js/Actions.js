// Shared actions used by Ext toolbars, menus, etc.
Ext.namespace('Tarpo.Actions');

Tarpo.Actions = {
    newVisit: new Ext.Action({
        text: 'New House Visit',
        iconCls: 'icon-multi-list',
        tooltip: 'New House Visit',
        handler: function(){
			Tarpo.WindowManager.getVisitWindow();
        }
    }),
    
    newSurg: new Ext.Action({
        text: 'New Surgical Case',
        iconCls: 'icon-multi-list',
        tooltip: 'New Surgical Case',
        handler: function(){
            Tarpo.WindowManager.getSurgWindow();
        }
    }),
    
    newMed: new Ext.Action({
        text: 'New Medical Case',
        iconCls: 'icon-multi-list',
        tooltip: 'New Medical Case',
        handler: function(){
            Tarpo.WindowManager.getMedWindow();
        }
    }),
	
	editDogColours: new Ext.Action({
        text: 'Dog Colours',
        tooltip: 'Edit the default list of Dog Colours',
        handler: function(){
            Tarpo.WindowManager.getDogColoursWindow();
        }
    }),
	
	editDogBreeds: new Ext.Action({
        text: 'Dog Breeds',
        tooltip: 'Edit the default list of Dog Breeds',
        handler: function(){
            Tarpo.WindowManager.getDogBreedsWindow();
        }
    }),
    
    report: new Ext.Action({
        text: 'Report on All Data',
        iconCls: 'icon-report',
        tooltip: 'Report on All Data (right-click on individual list for more specific Report)',
		handler: function(listId){
			Tarpo.Report.show(listId)
		},
    }),
	
	about: new Ext.Action({
        text: 'About',
        tooltip: 'Show the About dialog',
		handler: function(){
			Tarpo.WindowManager.getAboutWindow().activate();
		},
    }),
    
    deleteVisit: new Ext.Action({
        itemText: 'Delete House Visit',
        text: 'Delete House Visit',
        iconCls: 'icon-delete',
        tooltip: 'Delete House Visit',
        disabled: true,
        handler: function(){
            Ext.Msg.confirm('Confirm', 'Are you sure you want to delete the selected House Visit(s)?', function(btn){
                if (btn == 'yes') {
                    Tarpo.grid.visit.getSelectionModel().each(function(s){
                        Tarpo.store.visit.remove(s);
                    });
                }
            });
        }
    }),
    
    deleteSurg: new Ext.Action({
        itemText: 'Delete Surgical Case',
        text: 'Delete Surgical Case',
        iconCls: 'icon-delete',
        tooltip: 'Delete Surgical Case',
        disabled: true,
        handler: function(){
            Ext.Msg.confirm('Confirm', 'Are you sure you want to delete the selected Surgical Case(s)?', function(btn){
                if (btn == 'yes') {
                    surgSelections.each(function(s){
                        Tarpo.store.surg.remove(s);
                    });
                }
            });
        }
    }),
    
    deleteMed: new Ext.Action({
        itemText: 'Delete Medical Case',
        text: 'Delete Medical Case',
        iconCls: 'icon-delete',
        tooltip: 'Delete Medical Case',
        disabled: true,
        handler: function(){
            Ext.Msg.confirm('Confirm', 'Are you sure you want to delete the selected Medical Case(s)?', function(btn){
                if (btn == 'yes') {
                    medSelections.each(function(s){
                        Tarpo.store.med.remove(s);
                    });
                }
            });
        }
    }),
    
    newList: new Ext.Action({
        itemText: 'New List',
        tooltip: 'New List',
        iconCls: 'icon-list-new',
        handler: function(){
            var id = Tarpo.store.list.newList(false, Tarpo.store.list.tree.getActiveFolderId()).id;
            Tarpo.store.list.tree.startEdit(id, true);
        }
    }),
    
    deleteList: new Ext.Action({
        itemText: 'Delete',
        tooltip: 'Delete List',
        iconCls: 'icon-list-delete',
        disabled: true,
        handler: function(){
            Tarpo.store.list.tree.removeList(Tarpo.store.list.tree.getSelectionModel().getSelectedNode());
        }
    }),
    
    newFolder: new Ext.Action({
        itemText: 'New Folder',
        tooltip: 'New Folder',
        iconCls: 'icon-folder-new',
        handler: function(){
            var id = Tarpo.store.list.newList(true, Tarpo.store.list.tree.getActiveFolderId()).id;
            Tarpo.store.list.tree.startEdit(id, true);
        }
    }),
    
    deleteFolder: new Ext.Action({
        itemText: 'Delete',
        tooltip: 'Delete Folder',
        iconCls: 'icon-folder-delete',
        disabled: true,
        handler: function(s){
            Tarpo.store.list.tree.removeList(Tarpo.store.list.tree.getSelectionModel().getSelectedNode());
        }
    }),
    
    exportXml: new Ext.Action({
        itemText: 'Export Data as XML',
        tooltip: 'Export Data to XML',
        handler: function(){
            Tarpo.Export.XML.All();
        }
    }),
	
	importSqlite: new Ext.Action({
        itemText: 'Import Tarpo Database',
        tooltip: 'Import a second Tarpo Database into the current Tarpo Database',
        handler: function(){
            Tarpo.Import.importSqlite();
        }
    }),
	
	refresh: new Ext.Action({
        text: 'Refresh',
        handler: function(){
			// For some reason, load() works after import but reload() doesn't..
			Tarpo.store.list.load();
			Tarpo.store.visit.load();
			Tarpo.store.surg.load();
			Tarpo.store.med.load();
			Tarpo.store.list.tree.getRootNode().reload();
        }
    }),
    
    quit: new Ext.Action({
        text: 'Exit',
        handler: function(){
            air.NativeApplication.nativeApplication.exit();
        }
    }),
	
	visitProjectPage: new Ext.Action({
        text: 'Website',
        handler: function(){
            Tarpo.Util.openInBrowser('http://patspam.github.com/tarpo');
        }
    }),
	
	visitBugTracker: new Ext.Action({
        text: 'Bug Tracker',
        handler: function(){
            Tarpo.Util.openInBrowser('http://github.com/patspam/tarpo/issues');
        }
    }),
	
	visitWiki: new Ext.Action({
        text: 'Wiki',
        handler: function(){
            Tarpo.Util.openInBrowser('http://wiki.github.com/patspam/tarpo');
        }
    }),
	
	debug: new Ext.Action({
        text: 'Debug',
        handler: function(){
            Tarpo.log(Tarpo);
        }
    }),
	
	debugState: new Ext.Action({
        text: 'Debug State',
        handler: function(){
            Tarpo.log(Tarpo.Settings.getAll());
        }
    }),
    
    resetDefaults: new Ext.Action({
        itemText: 'Reset Settings',
        tooltip: 'Reset program defaults such as column widths',
        iconCls: 'icon-list-delete',
        handler: function(){
            Ext.Msg.confirm('Confirm', 'This will reset all program settings to their defaults, such as individual column positions and widths. Are you sure you want to continue?', function(btn){
                if (btn == 'yes') {
					Tarpo.Settings.reset();
                    Ext.Msg.alert('Settings Reset', 'Settings have been reset to their defaults. Please restart Tarpo to complete the process.')
                }
            });
        }
    }),
	
	closeDatabase: new Ext.Action({
        itemText: 'Close Database',
        tooltip: 'Close the currently open database',
        handler: function(){
			air.trace('Closing db connection');
			Tarpo.Db.close();
			
			air.trace('Hiding main window');
            Tarpo.WindowManager.getMainWindow().hide();
			
			air.trace('Re-showing launch');
			Tarpo.WindowManager.getLaunchWindow().show();
        }
    }),
};
