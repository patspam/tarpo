VisitGrid = function(){
	
	VisitGrid.superclass.constructor.call(this, {
		id:'visits-grid',
        store: tx.data.visits,
        sm: new Ext.grid.RowSelectionModel({moveEditorOnEnter: false}),
        clicksToEdit: 'auto',
        enableColumnHide:false,
        enableColumnMove:false,
		autoEncode: true,
        title:'House Visits',
        iconCls:'icon-folder',
        region:'center',
		margins:'3 3 3 0',
        columns: [
			{
                header: "Date",
                width: 100,
                sortable: true,
                renderer: Ext.util.Format.dateRenderer('D d/m/Y'),
                dataIndex: 'd',
				id:'visit-d',
                groupRenderer: Ext.util.Format.createTextDateRenderer(),
                groupName: 'Date',
                editor: new Ext.form.DateField({
                    format : "d/m/Y"
                })
            },
            {
                header: "House",
                width:50,
                sortable: true,
                dataIndex: 'addr',
                id:'visit-addr',
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
			{
                header: "Location",
                width:65,
                sortable: true,
                dataIndex: 'loc',
                id:'visit-loc',
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            },
			{
                header: "Type",
                width:40,
                sortable: true,
                dataIndex: 'type',
                id:'visit-type',
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
			{
                header: "Name",
                width:40,
                sortable: true,
                dataIndex: 'name',
                id:'visit-name',
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            },
			{
                header: "Colour",
                width:40,
                sortable: true,
                dataIndex: 'colour',
                id:'visit-colour',
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            },
			{
                header: "Sex",
                width:40,
                sortable: true,
                dataIndex: 'sex',
                id:'visit-sex',
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            },
			{
                header: "Desexed",
                width:55,
                sortable: true,
                dataIndex: 'desexed',
                id:'visit-desexed',
				renderer: Ext.util.Format.bool,
                editor: new Ext.form.Checkbox({
                    allowBlank: false
                })
            },
			{
                header: "BCS",
                width:30,
                sortable: true,
                dataIndex: 'bcs',
                id:'visit-bcs',
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            },
			{
                header: "Mange",
                width:40,
                sortable: true,
                dataIndex: 'mange',
                id:'visit-mange',
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            },
			{
                header: "Ticks",
                width:40,
                sortable: true,
                dataIndex: 'ticks',
                id:'visit-ticks',
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            },
			{
                header: "Fleas",
                width:40,
                sortable: true,
                dataIndex: 'fleas',
                id:'visit-fleas',
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            },
			{
                header: "Covinan",
                width:45,
                sortable: true,
                dataIndex: 'covinan',
                id:'visit-covinan',
				renderer: Ext.util.Format.bool,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
			{
                header: "TVT",
                width:30,
                sortable: true,
                dataIndex: 'tvt',
                id:'visit-tvt',
				renderer: Ext.util.Format.bool,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
			{
                header: "Comments",
                width:180,
                sortable: true,
                dataIndex: 'comments',
                id:'visit-comments',
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
            
        ],

        view: new VisitView()
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
    emptyText: 'There are no visits to show in this list.'
});