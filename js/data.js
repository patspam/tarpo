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

// Define the List data type
tx.data.List = Ext.data.Record.create([
    {name: 'listId', type:'string'},
    {name: 'parentId', type:'string'},
    {name: 'listName', type:'string'},
    {name: 'isFolder', type:'boolean'}
]);

tx.data.conn = Ext.sql.Connection.getInstance();

tx.data.visits = new tx.data.VisitStore();
tx.data.lists = new tx.data.ListStore();

Ext.util.Format.bool = function(value){
	return value ? '<img src="/images/icon-complete.gif"></input>' : '';
};

tx.data.getActiveListId = function(){
    var id = tx.data.visits.activeList;
    if(!id){
        var first = tx.data.lists.getAt(0);
        if(first){
            id = first.id;
        }else{
            id = tx.data.lists.newList().id;
        }
    }
    return id;
};

tx.data.demoData = function() {
	tx.data.conn.exec('delete from list');
	tx.data.conn.exec('delete from visit');
	tx.data.lists.reload();
	tx.data.visits.reload();
	tx.data.lists.demoData();
	tx.data.visits.demoData();
}
