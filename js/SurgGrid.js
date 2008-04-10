SurgGrid = function(){
	
	SurgGrid.superclass.constructor.call(this, {
		id:'surg-grid',
        store: tx.data.surg,
        sm: new Ext.grid.RowSelectionModel({moveEditorOnEnter: false}),
        clicksToEdit: 'auto',
        enableColumnHide:false,
        enableColumnMove:true,
		autoEncode: true,
        title:'Surgery',
        iconCls:'icon-folder',
        region:'center',
		margins:'3 3 3 0',
		stripeRows: true,
        columns: [
			{
                header: "Date",
                width: 100,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer('D d/m/Y'),
                dataIndex: 'd',
				id: 'air-bug-first-row-requires-id',
            },
			{
                header: "Microchip",
                width:65,
                sortable: true,
                dataIndex: 'a_id',
            },
            {
                header: "Name",
                width:50,
                sortable: true,
                dataIndex: 'a_name',
            },
            {
                header: "Breed",
                width:50,
                sortable: true,
                dataIndex: 'a_breed',
            },
			{
                header: "Balanda",
                width:40,
                sortable: true,
                dataIndex: 'o_balanda',
            },
			{
                header: "Name",
                width:40,
                sortable: true,
                dataIndex: 'o_name',
            },
			{
                header: "Owner Addr",
                width:40,
                sortable: true,
                dataIndex: 'o_addr',
            },
			{
                header: "Owner Location",
                width:40,
                sortable: true,
                dataIndex: 'o_loc',
            },
			{
                header: "Location",
                width:40,
                sortable: true,
                dataIndex: 'loc',
            },
			{
                header: "Type",
                width:40,
                sortable: true,
                dataIndex: 'type',
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
                header: "Charge",
                width:40,
                sortable: true,
                dataIndex: 'charge',
            },
			{
                header: "Spey",
                width:40,
                sortable: true,
                dataIndex: 'spey',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Castration",
                width:40,
                sortable: true,
                dataIndex: 'castration',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Euth (unwanted)",
                width:45,
                sortable: true,
                dataIndex: 'euth_unwanted',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Euth (humane)",
                width:45,
                sortable: true,
                dataIndex: 'euth_humane',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Euth (cheeky)",
                width:45,
                sortable: true,
                dataIndex: 'euth_cheeky',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Vaccination",
                width:30,
                sortable: true,
                dataIndex: 'vacc',
				renderer: Ext.util.Format.bool,
				align: 'center',
            },
			{
                header: "Other Procedures",
                width:180,
                sortable: true,
                dataIndex: 'other_prcedures',
            },
			{
                header: "History",
                width:180,
                sortable: true,
                dataIndex: 'history',
            },
			{
                header: "Clinical",
                width:180,
                sortable: true,
                dataIndex: 'clinical',
            },
			{
                header: "Diagnosis",
                width:180,
                sortable: true,
                dataIndex: 'diagnosis',
            },
			{
                header: "Comments",
                width:180,
                sortable: true,
                dataIndex: 'comments',
            },
            
        ],

        view: new SurgView()
	});
	
	this.on('rowcontextmenu', this.onRowContext, this);
};

Ext.extend(SurgGrid, Ext.grid.EditorGridPanel, {
	onCellDblClick: function(g, row){
		clearTimeout(this.autoEditTimer); // allow dbl click without starting edit
		var id = this.store.getAt(row).id;
		
		Ext.air.NativeWindowManager.getSurgWindow(id);
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
                id:'surg-ctx',
				listWidth: 200,
                items: [{
                    text:'Open',
                    scope: this,
                    handler:function(){
						Ext.each(this.selModel.getSelections(), function(r){
							Ext.air.NativeWindowManager.getSurgWindow(r.id);
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


SurgView = Ext.extend(Ext.grid.GroupingView, {
	forceFit:true,
    ignoreAdd: true,
    emptyText: 'There are no surgeries to show in this list.',
	getRowClass : function(r){
		return r.data.type;
    }
});