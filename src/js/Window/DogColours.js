/**
 * DogColours
 */
Ext.namespace('Tarpo.Window.DogColours');

Tarpo.Window.DogColours.saveData = function(){
    var dogColours = Tarpo.Window.DogColours.getField().getValue() || "";
    Tarpo.DogColours.set(dogColours.replace(/\n+/g, '\n').split('\n'));
};

Tarpo.Window.DogColours.loadData = function(){
    Tarpo.Window.DogColours.getField().setValue(Tarpo.DogColours.get().join('\n'));
};

Tarpo.Window.DogColours.getField = function(){
    return Tarpo.Window.DogColours.form.getForm().findField('dogColours');
};

Tarpo.Window.DogColours.init = function(){

    Ext.QuickTips.init();
    
    Tarpo.Window.DogColours.form = new Ext.form.FormPanel({
        region: 'center',
        baseCls: 'x-plain',
        labelWidth: 75,
        margins: '10 10 5 10',
        
        buttonAlign: 'right',
        minButtonWidth: 80,
        buttons: [{
            text: 'Save',
            handler: function(){
                Tarpo.Window.DogColours.saveData();
                nativeWindow.close();
            }
        }, {
            text: 'Cancel',
            handler: function(){
                nativeWindow.close();
            }
        }],
        
        items: [{
            xtype: 'Tarpo.form.dogColours'
        }, ]
    });
    
    new Ext.Viewport({
        layout: 'border',
        items: [Tarpo.Window.DogColours.form]
    });
    
    Tarpo.Window.DogColours.loadData.defer(10);
    
    nativeWindow.visible = true;
    nativeWindow.activate();
    
    Tarpo.Window.DogColours.getField().focus();
};
