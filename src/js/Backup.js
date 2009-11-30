tx.Backup = function(){
	var original = air.File.applicationDirectory;
	original = original.resolvePath("db");
	
	var destination = air.File.desktopDirectory;
	destination =  destination.resolvePath("Tarpo.backup");
	
	original.addEventListener(air.Event.COMPLETE, fileCopyCompleteHandler);
	original.addEventListener(air.IOErrorEvent.IO_ERROR, fileCopyIOErrorEventHandler);
	original.copyToAsync(destination);
	
	function fileCopyCompleteHandler(event){
	    Ext.Msg.alert("Backup Complete", "Tarpo has been backed up to the file \"Tarpo.backup\" on your desktop");
	}
	function fileCopyIOErrorEventHandler(event) {
	    alert("I/O Error."); 
	}
};