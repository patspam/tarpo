Ext.onReady(function(){
    Ext.QuickTips.init();
    
    // maintain window state automatically
    var main = new Ext.air.NativeWindow({
        id: 'mainWindow',
        instance: window.nativeWindow,
        minimizeToTray: true,
        trayIcon: '../images/icons/extlogo16.png',
        trayTip: 'Tarpo',
        trayMenu: [{
            text: 'Open Tarpo',
            handler: function(){
                main.activate();
            }
        }, '-', {
            text: 'Exit',
            handler: function(){
                air.NativeApplication.nativeApplication.exit();
            }
        }]
    });
    
    // Instantiate the data stores, and store them in a singleton
    // object
    // N.B. We can't use Ext.namespace() here b/c of AIR security
    Tarpo.store = {
        visit: new Tarpo.GroupingStore.Visit(),
        surg: new Tarpo.GroupingStore.Surg(),
        med: new Tarpo.GroupingStore.Med(),
        list: new Tarpo.GroupingStore.List()
    };
    
    // Connect to the SQLite database file
    Tarpo.Data.getConnection().open(Tarpo.Config.DB_FILENAME);
    
    // Instantiate the Grids, and store them in the main window object
    // (other windows can access them via Tarpo.WindowManager.getMainWindow)
    main.visitGrid = new Tarpo.EditorGridPanel.Visit();
    main.surgGrid = new Tarpo.EditorGridPanel.Surg();
    main.medGrid = new Tarpo.EditorGridPanel.Med();
    
    var menus = Ext.air.SystemMenu;
    menus.add('File', [Tarpo.Actions.report, '->', Tarpo.Actions.resetDefaults, Tarpo.Actions.demoData, '-', Tarpo.Actions.backup, Tarpo.Actions.exportVisitCsv, Tarpo.Actions.exportSurgCsv, Tarpo.Actions.exportMedCsv, Tarpo.Actions.exportXml, '-', Tarpo.Actions.debug, '-', Tarpo.Actions.quit]);
    menus.add('Help', [{
        text: 'About',
        handler: function(){
			Tarpo.WindowManager.getAboutWindow().activate();
        }
    }]);
    
    var tree = new ListTree({
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
        if (main.visitGrid.titleNode) {
            main.visitGrid.setTitle(main.visitGrid.titleNode.text);
        }
        if (main.surgGrid.titleNode) {
            main.surgGrid.setTitle(main.surgGrid.titleNode.text);
        }
        if (main.medGrid.titleNode) {
            main.medGrid.setTitle(main.medGrid.titleNode.text);
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
            items: main.visitGrid,
        
        }), new Ext.Panel({
            title: 'Surgical Cases',
            layout: 'fit',
            items: main.surgGrid,
            listeners: {
                'activate': function(){
                    Tarpo.store.surg.init();
                }
            }
        }), new Ext.Panel({
            title: 'Medical Cases',
            layout: 'fit',
            items: main.medGrid,
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
    
    main.visitGrid.on('keydown', function(e){
        if (e.getKey() == e.DELETE && !main.visitGrid.editing) {
            Tarpo.Actions.deleteVisit.execute();
        }
    });
    main.surgGrid.on('keydown', function(e){
        if (e.getKey() == e.DELETE && !main.surgGrid.editing) {
            Tarpo.Actions.deleteSurg.execute();
        }
    });
    main.medGrid.on('keydown', function(e){
        if (e.getKey() == e.DELETE && !main.medGrid.editing) {
            Tarpo.Actions.deleteMed.execute();
        }
    });
    
    tree.el.on('keydown', function(e){
        if (e.getKey() == e.DELETE && !tree.editor.editing) {
            Tarpo.Actions.deleteList.execute();
        }
    });
    
    main.visitGrid.getSelectionModel().on('selectionchange', function(sm){
        var disabled = sm.getCount() < 1;
        Tarpo.Actions.deleteVisit.setDisabled(disabled);
    });
    main.surgGrid.getSelectionModel().on('selectionchange', function(sm){
        var disabled = sm.getCount() < 1;
        Tarpo.Actions.deleteSurg.setDisabled(disabled);
    });
    main.medGrid.getSelectionModel().on('selectionchange', function(sm){
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
            main.visitGrid.titleNode = node;
            main.surgGrid.titleNode = node;
            main.medGrid.titleNode = node;
            main.visitGrid.setTitle(node.text);
            main.surgGrid.setTitle(node.text);
            main.medGrid.setTitle(node.text);
            main.visitGrid.setIconClass(node.attributes.iconCls);
            main.surgGrid.setIconClass(node.attributes.iconCls);
            main.medGrid.setIconClass(node.attributes.iconCls);
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
