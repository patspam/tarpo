// Define the Visit data type
tx.data.Visit = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'addr', type:'string'},
	{name: 'owner', type:'string'},
    {name: 'loc', type:'string'},
    {name: 'type', type:'string'},
    {name: 'name', type:'string'},
	{name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
    {name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'ticks', type:'int'},
	{name: 'fleas', type:'int'},
	{name: 'covinan', type:'boolean'},
	{name: 'tvt', type:'boolean'},	
	{name: 'comments', type:'string'}
]);

// Define the Surg data type
tx.data.Surg = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'listId', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'a_id', type:'string'},
	{name: 'a_name', type:'string'},
    {name: 'a_breed', type:'string'},
    {name: 'o_balanda', type:'boolean'},
    {name: 'o_name', type:'string'},
	{name: 'o_addr', type:'string'},
	{name: 'o_loc', type:'string'},
    {name: 'loc', type:'string'},
	{name: 'type', type:'string'},
	{name: 'colour', type:'string'},
	{name: 'sex', type:'string'},
	{name: 'desexed', type:'boolean'},
	{name: 'bcs', type:'int'},
	{name: 'mange', type:'int'},
	{name: 'charge', type:'string'},
	
	{name: 'spey', type:'boolean'},
	{name: 'castration', type:'boolean'},
	{name: 'euth_unwanted', type:'boolean'},
	{name: 'euth_humane', type:'boolean'},
	{name: 'euth_cheeky', type:'boolean'},
	{name: 'vacc', type:'boolean'},
	{name: 'other_procedures', type:'string'},
	
	{name: 'history', type:'string'},
	{name: 'clinical', type:'string'},
	{name: 'diagnosis', type:'string'},
	{name: 'comments', type:'string'},
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
