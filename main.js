// Initialize the state provider
Ext.state.Manager.setProvider(new Ext.air.FileProvider({
	file: 'visits.state',
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
		trayTip: 'v3t',
		trayMenu : [{
			text: 'Open v3t',
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
    
    var grid = new VisitGrid();
	var selections = grid.getSelectionModel();
	
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
			text: 'New Entry',
			iconCls: 'icon-active',
			tooltip: 'New Entry',
			handler: function(){
				Ext.air.NativeWindowManager.getVisitWindow();
			}
		}),
		
		report: new Ext.Action({
			text: 'Report',
			iconCls: 'icon-active',
			tooltip: 'Report',
			handler: function(){
				
				var report = "";
				report += "Houses Visited: " + querySingle('select count(distinct addr) from visit') + "<br>";
				
				report += "<br/><H2>Total Animals Seen</H2>";
				report += "Dogs: " + querySingle('select count(*) from visit where type="DOG"') + "<br>";
				report += "Cats: " + querySingle('select count(*) from visit where type="CAT"') + "<br>";
				report += "Puppies: " + querySingle('select count(*) from visit where type="PUPPY"') + "<br>";
				report += "Kittens: " + querySingle('select count(*) from visit where type="KITTEN"') + "<br>";
				report += "Pigs: " + querySingle('select count(*) from visit where type="PIG"') + "<br>";
				report += "Other: " + querySingle('select count(*) from visit where type="OTHER"') + "<br>";
				
				report += "<br/><H2>Dog Averages</H2>";
				report += "BCS: " + sigFigs(querySingle('select avg(bcs) from visit where type="DOG"')) + "<br>";
				report += "Mange: " + sigFigs(querySingle('select avg(mange) from visit where type="DOG"')) + "<br>";
				
				Ext.Msg.show({
					title: 'Report',
					msg: report,
					minWidth: 200,
				});
			}
		}),
		
		deleteVisit: new Ext.Action({
			itemText: 'Delete',
			text: 'Delete',
			iconCls: 'icon-delete-visit',
			tooltip: 'Delete Visit',
			disabled: true,
			handler: function(){
				Ext.Msg.confirm('Confirm', 'Are you sure you want to delete the selected visit(s)?', function(btn){
					if (btn == 'yes') {
						selections.each(function(s){
							tx.data.visits.remove(s);
						});
					}
				});
			}
		}),
		
		quit : new Ext.Action({
			text: 'Exit',
			handler: function(){
				air.NativeApplication.nativeApplication.exit();
			}
		})
	};
    tx.actions = actions;

    var menus = Ext.air.SystemMenu;
	
	menus.add('File', [
		actions.newVisit, 
		actions.report,
		'-',
		actions.quit
	]);

    menus.add('Help', [{
        text: 'About',
        handler: function(){
            Ext.air.NativeWindowManager.getAboutWindow().activate();
        }
    }]);


    var tb = new Ext.Toolbar({
		region:'north',
		id:'main-tb',
		height:26,
		items: [{
				xtype:'splitbutton',
				iconCls:'icon-edit',
				text:'New',
				handler: actions.newVisit.initialConfig.handler,
				menu: [actions.newVisit]
			},'-',
			actions.deleteVisit,
            '->', ' ', ' ', ' '		
		]
	});

	var viewport = new Ext.Viewport({
        layout:'border',
        items: [tb, grid]
    });
	
	grid.on('keydown', function(e){
         if(e.getKey() == e.DELETE && !grid.editing){
             actions.deleteVisit.execute();
         }
    });

    selections.on('selectionchange', function(sm){
    	var disabled = sm.getCount() < 1;
    	actions.deleteVisit.setDisabled(disabled);
    });

//	var visitHeader = new VisitHeader(grid);

	win.show();
	win.instance.activate();
	
	tx.data.visits.init();
	
	win.on('closing', function(){
		Ext.air.NativeWindowManager.closeAll();
	});
});

    

