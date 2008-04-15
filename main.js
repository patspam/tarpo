// Initialize the state provider
Ext.state.Manager.setProvider(new Ext.air.FileProvider({
	file: 'app.state',
	// if first time running
	defaultState : {
		mainWindow : {
			width:780,
			height:580,
			x:10,
			y:10
		}
	}
}));

Ext.onReady(function(){
    Ext.QuickTips.init();

	// maintain window state automatically
	var win = new Ext.air.NativeWindow({
		id: 'mainWindow',
		instance: window.nativeWindow,
		minimizeToTray: true,
		trayIcon: 'ext-air/resources/icons/extlogo16.png',
		trayTip: 'Tarpo',
		trayMenu : [{
			text: 'Open Tarpo',
			handler: function(){
				win.activate();
			}
		}, '-', {
			text: 'Exit',
			handler: function(){
				air.NativeApplication.nativeApplication.exit();
			}
		}]
	});
	
    tx.data.conn.open('db');
    
    var visitsGrid = new VisitGrid();
	var surgGrid = new SurgGrid();
	var medGrid = new MedGrid();
	var visitsSelections = visitsGrid.getSelectionModel();
	var surgSelections = surgGrid.getSelectionModel();
	var medSelections = medGrid.getSelectionModel();
	
	// single col, single result
	function querySingle(sql) {
		var instance = Ext.sql.Connection.getInstance();
		instance.open('db');
		var result = instance.query(sql)[0];
		var results = new Array();
		for (p in result) {
			return result[p]; // return first
		}
	}
	
	function sigFigs(x) {
		return Math.round(x*100)/100;
	}
	
	// Shared actions used by Ext toolbars, menus, etc.
	var actions = {
		newVisit: new Ext.Action({
			text: 'New House Visit',
			iconCls: 'icon-multi-list',
			tooltip: 'New House Visit',
			handler: function(){
				Ext.air.NativeWindowManager.getVisitWindow();
			}
		}),
		
		newSurg: new Ext.Action({
			text: 'New Surgical Case',
			iconCls: 'icon-multi-list',
			tooltip: 'New Surgical Case',
			handler: function(){
				Ext.air.NativeWindowManager.getSurgWindow();
			}
		}),
		
		newMed: new Ext.Action({
			text: 'New Medical Case',
			iconCls: 'icon-multi-list',
			tooltip: 'New Medical Case',
			handler: function(){
				Ext.air.NativeWindowManager.getMedWindow();
			}
		}),
		
		report: new Ext.Action({
			text: 'Report on All Data',
			iconCls: 'icon-report',
			tooltip: 'Report on All Data (right-click on individual list for more specific Report)',
			handler: function(listId){
				
				var xF, filter_for;
				if (listId && typeof listId === 'string' && querySingle('select isFolder from list where listId = "' + listId + '"') == 0) {
					xF = ' AND listId="' + listId + '"';
					filter_for = tx.data.lists.getName(listId);
				} else {
					xF = '';
					filter_for = 'All Data';
				}
				
				var houses_with_dogs = querySingle('select count(distinct house) from visit where type="Dog"' + xF);
				var dogs = querySingle('select count(*) from visit where type="Dog"' + xF);
				
				var report_data = {
					houses: querySingle('select count(distinct house) from visit where 1' + xF),
					houses_with_dogs: houses_with_dogs,
					dogs: dogs,
					cats: querySingle('select count(*) from visit where type="Cat"' + xF),
					puppies: querySingle('select count(*) from visit where type="Puppy"' + xF),
					kittens: querySingle('select count(*) from visit where type="Kitten"' + xF),
					pigs: querySingle('select count(*) from visit where type="Pig"' + xF),
					other: querySingle('select count(*) from visit where type="Other"' + xF),
					ivermectin: querySingle('select count(*) from visit where ivermectin=1' + xF),
					covinan: querySingle('select count(*) from visit where covinan=1' + xF),
					
					avg_bcs: sigFigs(querySingle('select avg(bcs) from visit where type="Dog"' + xF)),
					avg_mange: sigFigs(querySingle('select avg(mange) from visit where type="Dog"' + xF)),
					avg_dogs_per_house: sigFigs(dogs / houses_with_dogs ),
					
					surgical_cases: querySingle('select count(*) from surg where 1' + xF),
					speys: querySingle('select count(*) from surg where desex="Spey"' + xF),
					castrations: querySingle('select count(*) from surg where desex="Castrate"' + xF),
					other_procedures: querySingle('select count(*) from surg where other_procedures = 1' + xF),
					penile_tvt: querySingle('select count(*) from surg where tvt="Penile"' + xF),
					vaginal_tvt: querySingle('select count(*) from surg where tvt="Vaginal"' + xF),
					surgical_vaccinations: querySingle('select count(*) from surg where vacc=1' + xF),
					
					medical_cases: querySingle('select count(*) from med where 1' + xF),
					fight_wounds: querySingle('select count(*) from med where reason="Fight Wound"' + xF),
					hunting_wounds: querySingle('select count(*) from med where reason="Hunting Wound"' + xF),
					car_accidents: querySingle('select count(*) from med where reason="Car Accident"' + xF),
					other_reasons: querySingle('select count(*) from med where reason="Other"' + xF),
					medical_vaccinations: querySingle('select count(*) from med where vacc=1' + xF),
					
					euth_unwanted: querySingle('select count(*) from med where euth="Unwanted"' + xF),
					euth_humane: querySingle('select count(*) from med where euth="Humane"' + xF),
					euth_cheeky: querySingle('select count(*) from med where euth="Cheeky"' + xF),
				};
				
				Ext.Msg.show({
					title: 'Report: ' + filter_for,
					msg: Templates.report.apply(report_data),
					minWidth: 400,
				});
			}
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
						visitsSelections.each(function(s){
							tx.data.visits.remove(s);
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
							tx.data.surg.remove(s);
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
							tx.data.med.remove(s);
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
				var id = tx.data.lists.newList(false, tree.getActiveFolderId()).id;
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
				var id = tx.data.lists.newList(true, tree.getActiveFolderId()).id;
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
				new tx.XmlExporter();
			}
		}),
		
		exportVisitCsv: new Ext.Action({
			itemText: 'Export Visit Data to CSV',
			tooltip: 'Export Visit Data to CSV',
			handler: function(){
				new tx.VisitCsvExporter();
			}
		}),
		
		exportSurgCsv: new Ext.Action({
			itemText: 'Export Surgical Case Data to CSV',
			tooltip: 'Export Surgical Case Data to CSV',
			handler: function(){
				new tx.SurgCsvExporter();
			}
		}),
		
		exportMedCsv: new Ext.Action({
			itemText: 'Export Medical Case Data to CSV',
			tooltip: 'Export Medical Case Data to CSV',
			handler: function(){
				new tx.MedCsvExporter();
			}
		}),
		
		backup: new Ext.Action({
			itemText: 'Backup Tarpo to your Desktop',
			tooltip: 'Backup Tarpo to your Desktop',
			handler: function(){
				new tx.Backup();
			}
		}),
		
		quit : new Ext.Action({
			text: 'Exit',
			handler: function(){
				air.NativeApplication.nativeApplication.exit();
			}
		}),
		
		demoData: new Ext.Action({
			itemText: 'Load Demo Data',
			tooltip: 'Re-populate database with demo data',
			iconCls: 'icon-list-delete',
			handler: function(){
				Ext.Msg.confirm('Confirm', 'This will delete all your existing data and populate the database with some demo data. Are you sure you want to continue?', function(btn){
					if (btn == 'yes') {
						tx.data.demoData();
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
    tx.actions = actions;

    var menus = Ext.air.SystemMenu;
	
	menus.add('File', [
		actions.report,
		'->',
		actions.resetDefaults,
		actions.demoData,
		'-',
		actions.backup,
		actions.exportVisitCsv,
		actions.exportSurgCsv,
		actions.exportMedCsv,
		actions.exportXml,
		'-',
		actions.quit
	]);

    menus.add('Help', [{
        text: 'About',
        handler: function(){
            Ext.air.NativeWindowManager.getAboutWindow().activate();
        }
    }]);
	
	var tree = new ListTree({
		actions: actions,
		store: tx.data.lists
	});

	var root = tree.getRootNode();	

	var listSm = tree.getSelectionModel();
	
    tx.data.lists.bindTree(tree);
	tx.data.lists.on('update', function(){
		tx.data.visits.applyGrouping();
		tx.data.surg.applyGrouping();
		tx.data.med.applyGrouping();
		if(visitsGrid.titleNode){
			visitsGrid.setTitle(visitsGrid.titleNode.text);
		}
		if(surgGrid.titleNode){
			surgGrid.setTitle(surgGrid.titleNode.text);
		}
		if(medGrid.titleNode){
			medGrid.setTitle(medGrid.titleNode.text);
		}
	});

    var tb = new Ext.Toolbar({
		region:'north',
		id:'main-tb',
		height:26,
		items: [
			actions.newVisit,
			actions.newSurg,
			actions.newMed,
			'-',
			actions.report,
            '->', ' ', ' ', ' '		
		]
	});
	
	var tab = new Ext.TabPanel({
        region:'center',
		id: 'tab-panel',
        activeTab: 0,
//        defaults:{autoScroll: true},
		deferredRender: false, // to avoid eval()!
        items:[

			new Ext.Panel({
				title: 'House Visits',
				layout: 'fit',
				items: visitsGrid,
				
			}), 
			new Ext.Panel({
				title: 'Surgical Cases',
				layout: 'fit',
				items: surgGrid,
				listeners: {'activate': function(){
					tx.data.surg.init();
				}}
			}), 
			new Ext.Panel({
				title: 'Medical Cases',
				layout: 'fit',
				items: medGrid,
				listeners: {'activate': function(){
					tx.data.med.init();
				}}
			}), 
		],
			
    });

	var viewport = new Ext.Viewport({
        layout:'border',
        items: [tb, tree, tab]
    });
	
	visitsGrid.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !visitsGrid.editing){
             actions.deleteVisit.execute();
         }
    });
	surgGrid.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !surgGrid.editing){
             actions.deleteSurg.execute();
         }
    });
	medGrid.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !medGrid.editing){
             actions.deleteMed.execute();
         }
    });
	
	tree.el.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !tree.editor.editing){
             actions.deleteList.execute();
         }
    });

    visitsSelections.on('selectionchange', function(sm){
    	var disabled = sm.getCount() < 1;
    	actions.deleteVisit.setDisabled(disabled);
    });
	surgSelections.on('selectionchange', function(sm){
    	var disabled = sm.getCount() < 1;
    	actions.deleteSurg.setDisabled(disabled);
    });
	medSelections.on('selectionchange', function(sm){
    	var disabled = sm.getCount() < 1;
    	actions.deleteMed.setDisabled(disabled);
    });

	win.show();
	win.instance.activate();
	
	tx.data.visits.init();
	tx.data.surg.init();
	tx.data.med.init();
	
	tree.root.select();
	
	// fix bug where surg grid doesn't show initially
	tx.data.surg.reload();
	tx.data.med.reload();
	
	var loadList = function(listId){
		var node = tree.getNodeById(listId);
		if(node && !node.isSelected()){
			node.select();
			return;
		}
		actions.deleteList.setDisabled(!node || !node.attributes.editable);
		actions.deleteFolder.setDisabled(!node || node.attributes.editable === false || !node.attributes.isFolder);
		if(node){
			if (node.attributes.isFolder) {
				var lists = [];
				node.cascade(function(n){
					if (!n.attributes.isFolder) {
						lists.push(n.attributes.id);
					}
				});
				tx.data.visits.loadList(lists);
				tx.data.surg.loadList(lists);
				tx.data.med.loadList(lists);
			}
			else {
				tx.data.visits.loadList(node.id);
				tx.data.surg.loadList(node.id);
				tx.data.med.loadList(node.id);
			}
			visitsGrid.titleNode = node;
			surgGrid.titleNode = node;
			medGrid.titleNode = node;
			visitsGrid.setTitle(node.text);
			surgGrid.setTitle(node.text);
			medGrid.setTitle(node.text);
			visitsGrid.setIconClass(node.attributes.iconCls);
			surgGrid.setIconClass(node.attributes.iconCls);
			medGrid.setIconClass(node.attributes.iconCls);
		}
	}

	listSm.on('selectionchange', function(t, node){
		loadList(node ? node.id : null);
	});
	
	root.reload();
	
	win.on('closing', function(){
		Ext.air.NativeWindowManager.closeAll();
	});
});

    

