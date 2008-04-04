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
	
	
	// Shared actions used by Ext toolbars, menus, etc.
	var actions = {
		newVisit: new Ext.Action({
			text: 'New Entry',
			iconCls: 'icon-active',
			tooltip: 'New Visit',
			handler: function(){
//				visitHeader.vAddr.focus();
				Ext.air.NativeWindowManager.getVisitWindow();
			}
		}),
		
		deleteVisit: new Ext.Action({
			itemText: 'Delete',
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

    

