Ext.namespace('Tarpo.WindowManager');

Tarpo.WindowManager.getLaunchWindow = function(){
    return Tarpo.WindowManager.getWindow('launch', {
        width: 500,
        height: 500,
    });
};

Tarpo.WindowManager.getMainWindow = function(){
    return Tarpo.WindowManager.getWindow('mainWindow', {
        instance: window.nativeWindow,
        minimizeToTray: true,
        trayIcon: '../images/icons/48.png',
        trayTip: 'Tarpo',
        trayMenu: [{
            text: 'Open Tarpo',
            handler: function(){
                Tarpo.WindowManager.getMainWindow().activate();
            }
        }, '-', {
            text: 'Exit',
            handler: function(){
                air.NativeApplication.nativeApplication.exit();
            }
        }]
    });
};

Tarpo.WindowManager.getVisitWindow = function(id){
    return Tarpo.WindowManager.getMultiWindow('visit', id, {
        height: 580
    });
};

Tarpo.WindowManager.getSurgWindow = function(id){
    return Tarpo.WindowManager.getMultiWindow('surg', id);
}

Tarpo.WindowManager.getMedWindow = function(id){
    return Tarpo.WindowManager.getMultiWindow('med', id);
};

Tarpo.WindowManager.getAboutWindow = function(){
    return Tarpo.WindowManager.getWindow('about', {
        type: 'utility'
    });
};

Tarpo.WindowManager.getDogColoursWindow = function(){
    return Tarpo.WindowManager.getWindow('dogColours', {
        type: 'utility'
    });
};

Tarpo.WindowManager.getDogBreedsWindow = function(){
    return Tarpo.WindowManager.getWindow('dogBreeds', {
        type: 'utility'
    });
};

/**
 * Defaults for all Tarpo windows
 */
Tarpo.WindowManager.windowDefaults = {
    width: 550,
    height: 550,
};

/**
 * Creates a new Tarpo window, or returns the existing instance identified
 * by winId
 */
Tarpo.WindowManager.getWindow = function(winId, o){
    o = Ext.apply({}, o || {}, Tarpo.WindowManager.windowDefaults); 
    var win;
    if (win = Ext.air.NativeWindowManager.get(winId)) {
        win.instance.orderToFront();
        return win;
    }
    else {
        return new Ext.air.NativeWindow(Ext.apply({}, o, {
            id: winId,
            file: winId + '.html',
        }));
    }
};

/**
 * Multi windows are ones that typically correspond to one per-db row
 */
Tarpo.WindowManager.getMultiWindow = function(name, dbId, o){
    o = o || {};
    dbId = dbId || 'New';
    var winId = name + dbId; // e.g. medNew
    return Tarpo.WindowManager.getWindow(winId, Ext.apply(o, {
        file: name + '.html?' + name + 'Id=' + dbId
    }));
};
