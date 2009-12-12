/**
 * DogColours
 */
Ext.namespace('Tarpo.Window.DogColours');

Tarpo.Window.DogColours.saveData = function(){
    var dogColours = Tarpo.Window.DogColours.getField().getValue() || "";
    Tarpo.DogColours.set(dogColours.replace(/\n+/g, '\n').split('\n'));
};

Tarpo.Window.DogColours.loadData = function(val){
	val = val || Tarpo.DogColours.get();
	val = Tarpo.DogColours.filter(val);
    Tarpo.Window.DogColours.getField().setValue(val.join('\n'));
};

Tarpo.Window.DogColours.loadDefaults = function(){
	Tarpo.Window.DogColours.loadData(Tarpo.DogColours.getDefaults());
};

Tarpo.Window.DogColours.loadDatabaseColours = function(){
	Tarpo.Db.openCurrent();
	var colours = 
			Tarpo.Db.query('select distinct(colour) as colour from med'  ).map(function(e){return e.colour})
		.concat(
			Tarpo.Db.query('select distinct(colour) as colour from surg' ).map(function(e){return e.colour}),
			Tarpo.Db.query('select distinct(colour) as colour from visit').map(function(e){return e.colour})
		);
	Tarpo.Window.DogColours.loadData(colours);
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
        }, {
            text: 'Tarpo Defaults',
            handler: function(){
				if (confirm('This will overwrite your current list of dog colours with the Tarpo defaults. Are you sure you want to continue?')) {
					Tarpo.Window.DogColours.loadDefaults();
				}
            }
        }, {
            text: 'Database Values',
            handler: function(){
				if (confirm('This will overwrite your current list of dog colours with all colours in use by the current Database file. Are you sure you want to continue?')) {
					Tarpo.Window.DogColours.loadDatabaseColours();
				}
            }
        }],
        
        items: [{
            xtype: 'Tarpo.Form.dogColours'
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

Tarpo.Window.DogColours.init();
