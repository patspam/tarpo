/**
 * Singleton for communicating with the currently open database
 * (per-window singleton, that is)
 * 
 * This object is an instance of Ext.sql.AirConnection (see below), 
 * so refer to the docs for that class for more information on methods 
 * that can be called.
 * 
 * Usage:
 *  Tarpo.Db.open(file);
 *  Tarpo.Db.exec('delete from visit');
 *  Tarpo.Db.execBy('update version set description = ? where 1=1', [ "blah" ]);
 *  Tarpo.Db.query('select * from visit');
 *  Tarpo.Db.queryBy('select * from visit where id = ?', [ "710663999ZKAA" ]); 
 *  Tarpo.Db.queryBy('select * from visit where id = :id', { id : "710663999ZKAA" });
 *  Tarpo.Db.queryScalar('select id from visit limit 1');
 *  Tarpo.Db.close();
 *  
 *  // Ext.sql.Table
 *  var surg = Tarpo.Db.getTable('surg', 'id');
 *  surg.insert({ version: version, d: new Date().getTime().toString() });
 *  surg.update/updateBy/lookup/exists/save/select/selectBy/remove/removeBy
 *  
 *  // Lower level API access
 *  var stmt = Tarpo.Db.createStatement('query');
 *  stmt.text = 'select * from visit where id = ?';
 *  Tarpo.Db.addParams(stmt, [ "710663999ZKAA" ]);
 *  stmt.execute(Tarpo.Db.maxResults);
 *  var rs = stmt.getResult(); // SQLResult object, has rowsAffected, etc..
 *  var regularArray = Tarpo.Db.readResults(rs);
 */

/**
 * Tarpo only needs a single database connection, so we use
 * the return result of Ext.sql.Connection.getInstance (an
 * instance of Ext.sql.AirConnection) as a singleton.
 * 
 * This instance must be open()'d before it can be used,
 * and can be close()'d to change databases.
 * 
 * Each native window that includes this class will have its own database connection
 */
Tarpo.Db = Ext.sql.Connection.getInstance();

/**
 * Override Ext.sql.AirConnection.open() so that it works with
 * general air.File instances, rather than assuming that the sqlite
 * file lives in air.File.applicationStorageDirectory
 */
Ext.apply(Tarpo.Db, {
	open: function(file) {
		air.trace('Opening database connection to: ' + file.nativePath);
    	this.conn = new air.SQLConnection();
		this.conn.open(file);
    	this.openState = true;
		this.nativePath = file.nativePath,
		this.fireEvent('open', this);
	},
	
	/**
	 * Child windows want to connect to the same database that the main window does
	 * This class provides a handy short-cut for opening a connection to the same
	 * database that Main has open.  
	 */
	openCurrent: function() {
		if (this.openState) {
			return;
		}
		var file = new air.File(Ext.air.NativeWindow.getRootHtmlWindow().Tarpo.Db.nativePath);
		this.open(file);
	},
	getSchemaResult: function() {
		this.conn.loadSchema();
		return this.conn.getSchemaResult();
	},
	backup: function() {
		// Create a backup of the currently open database
		var dbFile = new air.File(this.nativePath);
		var date = new Date().format('Y-m-d-hms');
		var backupFolderLocation = Tarpo.Db.backupFolderLocation();
		if (!backupFolderLocation.exists) {
			backupFolderLocation.createDirectory();
		}
		var backup = backupFolderLocation.resolvePath(date + '.tarpo');
		dbFile.copyTo(backup, true);
	},
	backupFolderLocation: function() {
		return air.File.applicationStorageDirectory.resolvePath('backups');
	},
	queryScalar: function(sql, params) {
	    var result = this.queryBy(sql, params)[0];
	    for (p in result) {
	        return result[p]; // return first
	    }
	}
});
