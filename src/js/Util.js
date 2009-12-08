/**
 * Tarpo Utility methods
 */
Ext.namespace('Tarpo.Util');

// Debug shortcuts that live in the top-level namespace to save keystrokes
Tarpo.log = air.Introspector && air.Introspector.Console && air.Introspector.Console.log || Ext.emptyFn;
Tarpo.dump = air.Introspector && air.Introspector.Console && air.Introspector.Console.dump || Ext.emptyFn;
Tarpo.trace = air.trace; // dumps to stderr 

// work around for broken cross frame Dates in Safari
Tarpo.Util.fixDate = function(d){
    return d ? new Date(d.getTime()) : d;
}

Tarpo.Util.fixDateMember = function(o, name){
    if (o[name]) {
        o[name] = new Date(o[name].getTime());
    }
}

// Date formatter needed because AIR sometimes chokes on Ext's built-in ones
Tarpo.Util.dateFormatter = function(v){
    if (!v) {
        return "";
    }
    if (!Ext.isDate(v)) {
        v = new Date(Date.parse(v));
    }
    return (v.toString()).replace(/(\d{4}).*/, '$1');
    //	return v.format('D d/m/Y'); // this breaks sometimes
};

Tarpo.Util.sigFigs = function(x){
    return Math.round(x * 100) / 100;
}

/**
 * Loads demo data into the database
 */
Tarpo.Util.loadDemoData = function(){
	var connection = Tarpo.Db;
    connection.exec('delete from list');
    connection.exec('delete from visit');
    connection.exec('delete from surg');
    connection.exec('delete from med');
	
    Tarpo.store.list.reload();
    Tarpo.store.visit.reload();
    Tarpo.store.surg.reload();
    Tarpo.store.med.reload();
    Tarpo.store.list.demoData();
    Tarpo.store.visit.demoData();
    Tarpo.store.surg.demoData();
    Tarpo.store.med.demoData();
}

/**
 * Returns the current Tarpo version (retrieved from application.xml)
 */
Tarpo.Util.getVersion = function() {
	var na = air.NativeApplication.nativeApplication;
	var appXML = new DOMParser().parseFromString(na.applicationDescriptor, "text/xml");
	return appXML.getElementsByTagName('version')[0].firstChild.nodeValue;
}

/**
 * Displays an error box, and optionally outputs trace debugging info
 */
Tarpo.error = function(title, msg, trace) {
	if (trace) {
		air.trace(trace);
	}
	Ext.Msg.show({
		title: title,
		msg: msg,
		buttons: Ext.Msg.OK,
		icon: Ext.MessageBox.ERROR
	});
}

/**
 * Produces trace output for Air exceptions
 */
Tarpo.trace = function(err) {
	if (!err) {
		air.trace('Tried to airTrace empty error object');
		return;
	}
	if (err.stackTrace) {
		air.trace(err.message);
		err.stackTrace.forEach(function(obj){
			air.trace(' in', obj.sourceURL + '::' + obj.functionName + ':' + obj.line);
		});
	} else {
		air.trace(err);
	}
}

/**
 * All date formats that are used in the app (e.g. new Date().format('my-format') 
 * have to be precompiled, otherwise you get AIR security requirements. You can
 * get away with now precompiling some, depending on how and when they're used,
 * but mostly that's going to give you unpredictable run-time exceptions, so it's
 * better to aggressively precompile them all here.
 * 
 * The odd ack -Q '.format(' through the source tree wouldn't hurt either.
 */
Date.precompileFormats('D d/m/Y');
Date.precompileFormats('D d/m/Y h:m:s');
Date.precompileFormats('Y-m-d');
Date.precompileFormats('Y-m-d-hms');
