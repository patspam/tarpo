// Unique ids, if the time isn't unique enough, the addition 
// of random chars should be
Ext.uniqueId = function(){
	var t = String(new Date().getTime()).substr(4);
	var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i = 0; i < 4; i++){
		t += s.charAt(Math.floor(Math.random()*26));
	}
	return t;
}

// Define the Visit data type
tx.data.Visit = Ext.data.Record.create([
    {name: 'id', type:'string'},
	{name: 'd', type:'date', dateFormat: Ext.sql.Proxy.DATE_FORMAT, defaultValue: ''},
    {name: 'addr', type:'string'},
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

tx.data.conn = Ext.sql.Connection.getInstance();

tx.data.visits = new tx.data.VisitStore();

Ext.util.Format.bool = function(value){
	return value ? '<input type="checkbox" checked="checked" onclick="return false"></input>' : '<input type="checkbox" onclick="return false"></input>';
};