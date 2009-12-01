/**
 * Tarpo Utility methods
 */
Ext.namespace('Tarpo.Util');

// Debug shortcuts that live in the top-level namespace to save keystrokes
Tarpo.log = air.Introspector && air.Introspector.Console && air.Introspector.Console.log || Ext.emptyFn;
Tarpo.dump = air.Introspector && air.Introspector.Console && air.Introspector.Console.dump || Ext.emptyFn;

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
