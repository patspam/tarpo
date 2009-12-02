Ext.onReady(function(){
    Ext.QuickTips.init();
    
	// Instantiate the main window
    var main = Tarpo.WindowManager.getMainWindow();
    
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
    Ext.air.SystemMenu.add('File', [Tarpo.Actions.openDatabase, Tarpo.Actions.report, '-', Tarpo.Actions.resetDefaults, Tarpo.Actions.demoData, '-', Tarpo.Actions.backup, Tarpo.Actions.exportVisitCsv, Tarpo.Actions.exportSurgCsv, Tarpo.Actions.exportMedCsv, Tarpo.Actions.exportXml, '-', Tarpo.Actions.debug, '-', Tarpo.Actions.quit]);
    Ext.air.SystemMenu.add('Help', [{
        text: 'About',
        handler: function(){
			Tarpo.WindowManager.getAboutWindow().activate();
        }
    }]);
	
	if (!Tarpo.Db.openState) {
		Tarpo.Actions.openDatabase.execute();
		//Ext.Msg.alert('Um..', 'You need to open a data file roger');
	}
    
    // Build the List TreePanel
    var tree = new Tarpo.TreePanel.List({
        actions: Tarpo.Actions,
        store: Tarpo.store.list
    });
	var root = tree.getRootNode();
    var listSm = tree.getSelectionModel();
    
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
        items: [tb, tree, tab]
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
    
    tree.el.on('keydown', function(e){
        if (e.getKey() == e.DELETE && !tree.editor.editing) {
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
    
    main.show();
    main.instance.activate();
    
    Tarpo.store.visit.init();
    Tarpo.store.surg.init();
    Tarpo.store.med.init();
    
    tree.root.select();
    
    // fix bug where surg grid doesn't show initially
    Tarpo.store.surg.reload();
    Tarpo.store.med.reload();
    
    var loadList = function(listId){
        var node = tree.getNodeById(listId);
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
    }
    
    listSm.on('selectionchange', function(t, node){
        loadList(node ? node.id : null);
    });
    
    root.reload();
    
    main.on('closing', function(){
        Ext.air.WindowManager.closeAll();
    });
});
