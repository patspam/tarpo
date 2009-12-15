/**
 * DogBreeds
 */
Ext.namespace('Tarpo.Window.DogBreeds');

Tarpo.Window.DogBreeds.saveData = function(){
    var dogBreeds = Tarpo.Window.DogBreeds.getField().getValue() || "";
    Tarpo.DogBreeds.set(dogBreeds.replace(/\n+/g, '\n').split('\n'));
};

Tarpo.Window.DogBreeds.loadData = function(val){
	val = val || Tarpo.DogBreeds.get();
	val = Tarpo.DogBreeds.filter(val);
    Tarpo.Window.DogBreeds.getField().setValue(val.join('\n'));
};

Tarpo.Window.DogBreeds.loadDefaults = function(){
	Tarpo.Window.DogBreeds.loadData(Tarpo.DogBreeds.getDefaults());
};

Tarpo.Window.DogBreeds.loadDatabaseBreeds = function(){
	Tarpo.Db.openCurrent();
	var breeds = 
			Tarpo.Db.query('select distinct(breed) as breed from med'  ).map(function(e){return e.breed})
		.concat(
			Tarpo.Db.query('select distinct(breed) as breed from surg' ).map(function(e){return e.breed})
		);
	Tarpo.Window.DogBreeds.loadData(breeds);
};

Tarpo.Window.DogBreeds.getField = function(){
    return Tarpo.Window.DogBreeds.form.getForm().findField('dogBreeds');
};

Tarpo.Window.DogBreeds.init = function(){

    Ext.QuickTips.init();
    
    Tarpo.Window.DogBreeds.form = new Ext.form.FormPanel({
        region: 'center',
        baseCls: 'x-plain',
        labelWidth: 75,
        margins: '10 10 5 10',
        
        buttonAlign: 'right',
        minButtonWidth: 80,
        buttons: [{
            text: 'Save',
            handler: function(){
                Tarpo.Window.DogBreeds.saveData();
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
				if (confirm('This will overwrite your current list of dog breeds with the Tarpo defaults. Are you sure you want to continue?')) {
					Tarpo.Window.DogBreeds.loadDefaults();
				}
            }
        }, {
            text: 'Database Values',
            handler: function(){
				if (confirm('This will overwrite your current list of dog breeds with all breeds in use by the current Database file. Are you sure you want to continue?')) {
					Tarpo.Window.DogBreeds.loadDatabaseBreeds();
				}
            }
        }],
        
        items: [{
            xtype: 'Tarpo.Form.dogBreeds'
        }, ]
    });
    
    new Ext.Viewport({
        layout: 'border',
        items: [Tarpo.Window.DogBreeds.form]
    });
    
    Tarpo.Window.DogBreeds.loadData.defer(10);
    
    nativeWindow.visible = true;
    nativeWindow.activate();
    
    Tarpo.Window.DogBreeds.getField().focus();
};

Tarpo.Window.DogBreeds.init();
