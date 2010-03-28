/**
 * Import
 */
Ext.namespace('Tarpo.Import')
Tarpo.Import.importSqlite = function(){
	Tarpo.Util.openDatabase(Tarpo.Import.onFileOpened);
};

Tarpo.Import.onFileOpened = function(file){
	try {
		Tarpo.Import.handler(file);
	} 
	catch (err) {
		Tarpo.trace(err);
		alert('An error occurred, please try again');
	}
};

Tarpo.Import.handler = function(file){
	Tarpo.Db.conn.attach('importer', file);
	var attachedVersion =  Tarpo.Db.queryScalar('select version from importer.version order by d desc limit 1');
	air.trace("Attached db with version: " + attachedVersion);
	
	if (attachedVersion != Tarpo.Util.getVersion()) {
		alert("You can only import a database with the same version as the current database. Please upgrade your database(s) first.")
		Tarpo.Db.conn.detach('importer');
		return;
	}
	
	var schema = Tarpo.Db.getSchema(air.SQLTableSchema, null, 'importer');
	var inserted = 0, skipped = 0;
	schema.tables.forEach(function(table){
		var name = table.name;
		var primaryKey =  Tarpo.Db.getPrimaryKey(table);
		air.trace("Importing rows from: " + name + " (PK: " + primaryKey + ")");
		var t = Tarpo.Db.getTable(name, primaryKey);
		
		var rows = Tarpo.Db.queryBy('select * from importer.`' + name + '`');
		rows.forEach(function(row){
			var id = row[primaryKey];
			//air.trace("Examining: " + id);
			
			if (t.exists(id)) {
				//air.trace("Skipping row, already exists: " + id);
				skipped++;
			} else {
				t.insert(row);
				inserted++;
			}
		});
	});
	alert("Imported " + inserted + " new records, skipped " + skipped + " duplicate records.");
	
	Tarpo.Db.conn.detach('importer');
	Tarpo.Actions.refresh.execute();
};