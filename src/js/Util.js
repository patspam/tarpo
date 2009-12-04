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
