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
    
    report: new Ext.Action({
        text: 'Report on All Data',
        iconCls: 'icon-report',
        tooltip: 'Report on All Data (right-click on individual list for more specific Report)',
		handler: function(){
			Tarpo.Report.show()
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
            var id = Tarpo.store.list.newList(false, tree.getActiveFolderId()).id;
            tree.startEdit(id, true);
        }
    }),
    
    deleteList: new Ext.Action({
        itemText: 'Delete',
        tooltip: 'Delete List',
        iconCls: 'icon-list-delete',
        disabled: true,
        handler: function(){
            tree.removeList(tree.getSelectionModel().getSelectedNode());
        }
    }),
    
    newFolder: new Ext.Action({
        itemText: 'New Folder',
        tooltip: 'New Folder',
        iconCls: 'icon-folder-new',
        handler: function(){
            var id = Tarpo.store.list.newList(true, tree.getActiveFolderId()).id;
            tree.startEdit(id, true);
        }
    }),
    
    deleteFolder: new Ext.Action({
        itemText: 'Delete',
        tooltip: 'Delete Folder',
        iconCls: 'icon-folder-delete',
        disabled: true,
        handler: function(s){
            tree.removeList(tree.getSelectionModel().getSelectedNode());
        }
    }),
    
    exportXml: new Ext.Action({
        itemText: 'Export All Data to XML',
        tooltip: 'Export All Data to XML',
        handler: function(){
            new Tarpo.XmlExporter();
        }
    }),
    
    exportVisitCsv: new Ext.Action({
        itemText: 'Export Visit Data to CSV',
        tooltip: 'Export Visit Data to CSV',
        handler: function(){
            new Tarpo.VisitCsvExporter();
        }
    }),
    
    exportSurgCsv: new Ext.Action({
        itemText: 'Export Surgical Case Data to CSV',
        tooltip: 'Export Surgical Case Data to CSV',
        handler: function(){
            new Tarpo.SurgCsvExporter();
        }
    }),
    
    exportMedCsv: new Ext.Action({
        itemText: 'Export Medical Case Data to CSV',
        tooltip: 'Export Medical Case Data to CSV',
        handler: function(){
            new Tarpo.MedCsvExporter();
        }
    }),
    
    backup: new Ext.Action({
        itemText: 'Backup Tarpo to your Desktop',
        tooltip: 'Backup Tarpo to your Desktop',
        handler: function(){
            new Tarpo.Backup();
        }
    }),
    
    quit: new Ext.Action({
        text: 'Exit',
        handler: function(){
            air.NativeApplication.nativeApplication.exit();
        }
    }),
	
	debug: new Ext.Action({
        text: 'Debug',
        handler: function(){
            Tarpo.log(Tarpo);
        }
    }),
    
    demoData: new Ext.Action({
        itemText: 'Load Demo Data',
        tooltip: 'Re-populate database with demo data',
        iconCls: 'icon-list-delete',
        handler: function(){
            Ext.Msg.confirm('Confirm', 'This will delete all your existing data and populate the database with some demo data. Are you sure you want to continue?', function(btn){
                if (btn == 'yes') {
                    Tarpo.Util.loadDemoData();
                }
            });
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
	
	openDatabase: new Ext.Action({
		itemText: 'Open Database',
        tooltip: 'Open Tarpo database file',
        handler: function(){
			// The "Open File" dialog should default to the location
			// of the most recently opened database file
			var lastDatabase = Tarpo.Settings.get('lastDatabase');
			var file;
			if (lastDatabase) {
				file = new air.File(lastDatabase);
			} else {
				// Otherwise just default to the documents directory
				file = air.File.documentsDirectory;
			}
            
			// Subscribe to the SELECT event
			
			file.addEventListener( air.Event.SELECT, function (e) {
				if (Tarpo.Db.openState) {
					Tarpo.log('Closing open file before opening new one');
					Tarpo.Db.close();
				}
				
				Tarpo.Db.open(file);
				Tarpo.Settings.set('lastDatabase', file.nativePath);	
			});
			
			// Subscribe to the CANCEL event
			file.addEventListener( air.Event.CANCEL, function (e) {
				Tarpo.log('User cancelled Open File dialog');
			});
			
			var filters = new runtime.Array();
			filters.push( new air.FileFilter( 'Tarpo Databases', '*.sqlite' ) );
			file.browseForOpen( 'Open Tarpo Database', filters );
        }
	}),
};
