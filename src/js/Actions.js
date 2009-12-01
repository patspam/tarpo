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
		handler: Tarpo.Report.show,
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
                    Tarpo.WindowManager.getMainWindow.visitGrid.getSelectionModel().each(function(s){
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
                    Tarpo.Data.demoData();
                }
            });
        }
    }),
    
    resetDefaults: new Ext.Action({
        itemText: 'Reset Program Defaults',
        tooltip: 'Reset program defaults such as column widths',
        iconCls: 'icon-list-delete',
        handler: function(){
            Ext.Msg.confirm('Confirm', 'This will reset all program customisations you have made such as individual column positions and widths. Are you sure you want to continue?', function(btn){
                if (btn == 'yes') {
                    air.NativeApplication.nativeApplication.addEventListener('exiting', function(){
                        Ext.state.Manager.getProvider().clearAllState();
                    });
                    Ext.Msg.alert('Program Defaults Reset', 'Please restart the application to fully apply the changes')
                }
            });
        }
    })
};
