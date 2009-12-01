Tarpo.Backup = function(){
	/**
	 * Backup is done by making a file copy of the SQLite database file
	 * 
	 * N.B. Should be close/flush the db before doing this, or does sqlite take
	 * care of that for us?
	 */
	
	// Construct backup filename from date
	var destinationFilename = 'tarpo-' + new Date().format('Y-m-d-hms') + '.sqlite';
	
	// Backup goes to user's Desktop
	var destination = air.File.desktopDirectory.resolvePath(destinationFilename);
	var original = air.File.applicationDirectory.resolvePath(Tarpo.Settings.DB_FILENAME);
	
	original.addEventListener(air.Event.COMPLETE, function (event){
	    Ext.Msg.alert("Backup Complete", 'Tarpo has been backed up to the file: "' + destinationFilename + '" on your desktop');
	});
	original.addEventListener(air.IOErrorEvent.IO_ERROR, function (event) {
	    Ext.Msg.alert("I/O Error.", 'An error occurred'); 
	});
	
	original.copyToAsync(destination);
};