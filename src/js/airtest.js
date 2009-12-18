var Employee = Ext.data.Record.create([
    {name: 'firstname'},
    {name: 'occupation'},
]);
var reader = new Ext.data.JsonReader({
    totalProperty: "results",
    root: "rows",
    id: "id",
}, Employee);
var data = {
    results: 2,
    rows: [
        { id: 1, firstname: 'Bill', occupation: 'Gardener' },
        { id: 2, firstname: 'Ben' , occupation: 'Horticulturalist' },
		{ id: 3, firstname: 'Sally' , occupation: 'Horticulturalist' },
    ]
};
var grid = new Ext.grid.GridPanel({
    store: new Ext.data.GroupingStore({
        reader: reader,
        data: data,
        sortInfo:{field: 'firstname', direction: "ASC"},
        groupField:'occupation',
    }),

    columns: [
        {id:'firstname',header: "firstname", dataIndex: 'firstname'},
		{id:'occupation',header: "occupation", dataIndex: 'occupation'},
    ],

    view: new Ext.grid.GroupingView({
        forceFit:true,
		startGroup: new Ext.XTemplate('<div id="{groupId}" class="x-grid-group {cls}">', '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>{text} xxx</div></div>', '<div id="{groupId}-bd" class="x-grid-group-body">'),
    }),

    frame:true,
    width: 700,
    height: 450,
    collapsible: true,
    animCollapse: false,
    title: 'Grouping Example',
    iconCls: 'icon-grid',
    renderTo: document.body
});