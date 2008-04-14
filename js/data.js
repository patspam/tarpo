// Define the Visit data type
tx.data.Visit = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'loc', type:'string'},
    {name: 'house', type:'string'},
	{name: 'owner', type:'string'},
    {name: 'type', type:'string'},
    {name: 'name', type:'string'},
	{name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
    {name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'ticks', type:'int'},
	{name: 'fleas', type:'int'},
	{name: 'ivermectin', type:'boolean'},
	{name: 'covinan', type:'boolean'},
	{name: 'tvt', type:'boolean'},	
	{name: 'comments', type:'string'}
]);

// Define the Surg data type
tx.data.Surg = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'loc', type:'string'},
	{name: 'house', type:'string'},
	
	{name: 'balanda', type:'boolean'},
	{name: 'owner', type:'string'},
	{name: 'o_loc', type:'string'},
	
	{name: 'type', type:'string'},
    {name: 'mc', type:'string'},
	{name: 'name', type:'string'},
    {name: 'breed', type:'string'},
    {name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
	{name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'charge', type:'string'},
	
	{name: 'desex', type:'string'},
	{name: 'other_procedures', type:'boolean'},
	{name: 'tvt', type:'string'},
	{name: 'vacc', type:'boolean'},
	
	{name: 'details', type:'string'},
]);

// Define the List data type
tx.data.List = Ext.data.Record.create([
    {name: 'listId', type:'string'},
    {name: 'parentId', type:'string'},
    {name: 'listName', type:'string'},
    {name: 'isFolder', type:'boolean'}
]);

tx.data.conn = Ext.sql.Connection.getInstance();

tx.data.visits = new tx.data.VisitStore();
tx.data.surg = new tx.data.SurgStore();
tx.data.lists = new tx.data.ListStore();

Ext.util.Format.bool = function(value){
	return value ? '<img src="/images/icon-complete.gif"></input>' : '';
};

tx.data.demoData = function() {
	tx.data.conn.exec('delete from list');
	tx.data.conn.exec('delete from visit');
	tx.data.conn.exec('delete from surg');
	tx.data.lists.reload();
	tx.data.visits.reload();
	tx.data.surg.reload();
	tx.data.lists.demoData();
	tx.data.visits.demoData();
	tx.data.surg.demoData();
}
