MedGrid = function(){	
	var offset = 9;
	MedGrid.superclass.constructor.call(this, {
		id:'med-grid',
        store: tx.data.med,
        sm: new Ext.grid.RowSelectionModel({moveEditorOnEnter: false}),
        clicksToEdit: 'auto',
        enableColumnHide:false,
        enableColumnMove:true,
		autoEncode: true,
        title:'Medical Cases',
        iconCls:'icon-folder',
        region:'center',
		margins:'3 3 3 0',
		stripeRows: true,
        columns: [
			{
                header: "Date",
                width: 75 + offset,
                sortable: true,
                renderer: dateFormatter,
                dataIndex: 'd',
				id: 'air-bug-first-row-requires-id',
            },
			{
                header: "Location",
                width:50 + offset,
                sortable: true,
                dataIndex: 'loc',
            },
			{
                header: "House",
                width:40 + offset,
                sortable: true,
                dataIndex: 'house',
            },
			{
                header: "Balanda",
                width:40 + offset,
                sortable: true,
                dataIndex: 'balanda',
				renderer: Ext.util.Format.bool,
            },
			{
                header: "Charge",
                width:40 + offset,
                sortable: true,
                dataIndex: 'charge',
            },
			{
                header: "Owner",
                width:40 + offset,
                sortable: true,
                dataIndex: 'owner',
            },
			{
                header: "Domicile",
                width:60 + offset,
                sortable: true,
                dataIndex: 'domicile',
            },
			{
                header: "Type",
                width:40 + offset,
                sortable: true,
                dataIndex: 'type',
            },
			{
                header: "Microchip",
                width:90 + offset,
                sortable: true,
                dataIndex: 'mc',
				renderer: function(val){
					if (!val)
						return val;
					if (val.length != 15)
						return val;
					return val.substr(0,9) + "<span class='mc-highlight'>" + val.substr(9) + "</span>";
				},
            },
            {
                header: "Name",
                width:40 + offset,
                sortable: true,
                dataIndex: 'name',
            },
            {
                header: "Breed",
                width:40 + offset,
                sortable: true,
                dataIndex: 'breed',
            },
			{
                header: "Colour",
                width:35 + offset,
                sortable: true,
                dataIndex: 'colour',
            },
			{
                header: "Sex",
                width:25 + offset,
                sortable: true,
                dataIndex: 'sex',
				align: 'center',
            },
			{
                header: "Desexed",
                width:45 + offset,
                sortable: true,
                dataIndex: 'desexed',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "BCS",
                width:30 + offset,
                sortable: true,
                dataIndex: 'bcs',
				align: 'center',
            },
			{
                header: "Mange",
                width:35 + offset,
                sortable: true,
                dataIndex: 'mange',
				align: 'center',
            },
			{
                header: "Reason",
                width:40 + offset,
                sortable: true,
                dataIndex: 'reason',
            },
			{
                header: "Vaccination",
                width:60 + offset,
                sortable: true,
                dataIndex: 'vacc',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Euthanasia",
                width:50 + offset,
                sortable: true,
                dataIndex: 'euth',
            },
			{
                header: "Details",
                width:180,
                sortable: true,
                dataIndex: 'details',
            },
            
        ],

        view: new MedView()
	});
	
	this.on('rowcontextmenu', this.onRowContext, this);
};

Ext.extend(MedGrid, Ext.grid.EditorGridPanel, {
	onCellDblClick: function(g, row){
		clearTimeout(this.autoEditTimer); // allow dbl click without starting edit
		var id = this.store.getAt(row).id;
		
		Ext.air.NativeWindowManager.getMedWindow(id);
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
                id:'med-ctx',
				listWidth: 200,
                items: [{
                    text:'Open',
                    scope: this,
                    handler:function(){
						Ext.each(this.selModel.getSelections(), function(r){
							Ext.air.NativeWindowManager.getMedWindow(r.id);
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


MedView = Ext.extend(Ext.grid.GroupingView, {
	forceFit:false,
    ignoreAdd: true,
    emptyText: 'There are no Medical Cases to show in this list.',
	getRowClass : function(r){
		return r.data.type;
    }
});