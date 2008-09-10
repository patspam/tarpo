VisitGrid = function(){
	
	VisitGrid.superclass.constructor.call(this, {
		id:'visits-grid',
        store: tx.data.visits,
        sm: new Ext.grid.RowSelectionModel({moveEditorOnEnter: false}),
        clicksToEdit: 'auto',
        enableColumnHide:false,
        enableColumnMove:true,
		autoEncode: true,
        title:'House Visits',
        iconCls:'icon-folder',
        region:'center',
		margins:'3 3 3 0',
		stripeRows: true,
        columns: [
			{
                header: "Date",
                width: 100,
                sortable: true,
                renderer: dateFormatter,
                dataIndex: 'd',
				id: 'air-bug-first-row-requires-id',
            },
			{
                header: "Location",
                width:65,
                sortable: true,
                dataIndex: 'loc',
            },
            {
                header: "House",
                width:50,
                sortable: true,
                dataIndex: 'house',
            },
            {
                header: "Owner",
                width:50,
                sortable: true,
                dataIndex: 'owner',
            },
			{
                header: "Type",
                width:40,
                sortable: true,
                dataIndex: 'type',
            },
			{
                header: "Name",
                width:40,
                sortable: true,
                dataIndex: 'name',
            },
			{
                header: "Colour",
                width:40,
                sortable: true,
                dataIndex: 'colour',
            },
			{
                header: "Sex",
                width:40,
                sortable: true,
                dataIndex: 'sex',
				align: 'center',
            },
			{
                header: "Desexed",
                width:55,
                sortable: true,
                dataIndex: 'desexed',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "BCS",
                width:30,
                sortable: true,
                dataIndex: 'bcs',
				align: 'center',
            },
			{
                header: "Mange",
                width:40,
                sortable: true,
                dataIndex: 'mange',
				align: 'center',
            },
			{
                header: "Ticks",
                width:40,
                sortable: true,
                dataIndex: 'ticks',
				align: 'center',
            },
			{
                header: "Fleas",
                width:40,
                sortable: true,
                dataIndex: 'fleas',
				align: 'center',
            },
			{
                header: "Ivermectin",
                width:45,
                sortable: true,
                dataIndex: 'ivermectin',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Covinan",
                width:45,
                sortable: true,
                dataIndex: 'covinan',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "TVT",
                width:30,
                sortable: true,
                dataIndex: 'tvt',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Comments",
                width:180,
                sortable: true,
                dataIndex: 'comments',
            },
            
        ],

        view: new VisitView()
//		bbar: new Ext.PagingToolbar({
//            pageSize: 10,
//            store: tx.data.visits,
//            displayInfo: true
//        })
	});
	
	this.on('rowcontextmenu', this.onRowContext, this);
};

Ext.extend(VisitGrid, Ext.grid.EditorGridPanel, {
	onCellDblClick: function(g, row){
		clearTimeout(this.autoEditTimer); // allow dbl click without starting edit
		var id = this.store.getAt(row).id;
		
		Ext.air.NativeWindowManager.getVisitWindow(id);
	},

    // private
    onAutoEditClick : function(e, t){
		clearTimeout(this.autoEditTimer);
        if(e.button !== 0){
            return;
        }
        var row = this.view.findRowIndex(t);
        var col = this.view.findCellIndex(t);
        if(row !== false && col !== false){
        	if(this.selModel.isSelected(row) && this.selModel.getCount() === 1){
				this.autoEditTimer = this.startEditing.defer(300, this, [row, col]);
            }
        }
    },
	
	onRowContext : function(grid, row, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'visits-ctx',
				listWidth: 200,
                items: [{
                    text:'Open',
                    scope: this,
                    handler:function(){
						Ext.each(this.selModel.getSelections(), function(r){
							Ext.air.NativeWindowManager.getVisitWindow(r.id);
						});
                    }
                }
                ]
            });
        }
		if(!this.selModel.isSelected(row)){
			this.selModel.selectRow(row);
		}
		
		this.menu.showAt(e.getXY());
    }
})


VisitView = Ext.extend(Ext.grid.GroupingView, {
	forceFit:true,
    ignoreAdd: true,
    emptyText: 'There are no visits to show in this list.',
	getRowClass : function(r){
		return r.data.type;
    }
});