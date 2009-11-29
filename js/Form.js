/*
 * Re-usable pre-configured form elements used throughout Tarpo Add/Edit form pages
 * Nice having them all in one file for easy comparison
 */
(function(){
    var opener = Ext.air.NativeWindow.getRootHtmlWindow();
    var clearComboMarker = '---';
	Ext.namespace('tx.form');
    
	/* 
	 * @private - used to sort combo data alphabetically whilst leaving 
	 * clearComboMarker at the top
	 */
    function _clearableComboSort(array){
        return array.sort(function(array1, array2){
            a = array1[0];
            b = array2[0];
            if (a == clearComboMarker) 
                return -1;
            if (b == clearComboMarker) 
                return 1;
            return (a === b) ? 0 : (a > b) ? 1 : -1;
        });
    }
	
	/*
	 * Used to quickly and easily add 2 form items into a 2-column layout
	 * 
	 */
	tx.form.dual_column = function(a, b){
        return {
            layout: 'column',
            anchor: '100%',
            baseCls: 'x-plain',
            defaults: {
                width: 250, // first col fixed-width
                layout: 'form',
                baseCls: 'x-plain',
            },
            items: [{
                items: a,
            }, {
                columnWidth: 1, // 2nd column takes up the slack
                labelAlign: 'right', // looks better if 2nd column labels are right-aligned
                items: b,
            }]
        }
    };

	Ext.reg('tx.form.d', tx.form.d = Ext.extend(Ext.form.DateField, {
	    fieldLabel: 'Date',
		name: 'd',
	    width: 135,
	    format: 'd/m/Y',
		value: new Date(), // default value (overwritten with existing value if not new)
		allowBlank: false,
	}));
	
	Ext.reg('tx.form.listId', tx.form.listId = Ext.extend(ListSelector, {
		fieldLabel: 'List',
		name: 'listId',
		store: opener.tx.data.lists,
		anchor: '100%',
		allowBlank: false,
		
		// Override other inherited methods 
	    onRender: function(){
	        // Before parent code
	        // Call parent (required)
	        tx.form.listId.superclass.onRender.apply(this, arguments);
	 
	        // After parent code
			this.menu.on('beforeshow', function(m){
				this.tree.setWidth(Math.max(180, this.getSize().width));
			}, this);
	    }
	}));
	
	Ext.reg('tx.form.house', tx.form.house = Ext.extend(Ext.form.TextField, {
		fieldLabel: 'House',
		name: 'house',
		allowBlank: false,
		anchor: '100%'
	}));
	
	Ext.reg('tx.form.loc', tx.form.loc = Ext.extend(Ext.form.TextField, {
		fieldLabel: 'Location',
		name: 'loc',
		anchor: '100%'
	}));
	
	Ext.reg('tx.form.owner', tx.form.owner = Ext.extend(Ext.form.TextField, {
		fieldLabel: 'Owner',
		name: 'owner',
		anchor: '100%'
	}));
	
	Ext.reg('tx.form.name', tx.form.name = Ext.extend(Ext.form.TextField, {
		fieldLabel: 'Name',
		name: 'name',
		anchor: '100%'
	}));
	
	Ext.ux.ClearableCombo = Ext.extend(Ext.form.ComboBox, {
		clearMarker: clearComboMarker,
		initComponent: function(){
			// Before parent code
			
			// Call parent (required)
			Ext.ux.ClearableCombo.superclass.initComponent.apply(this, arguments);
			
			// After parent code
			this.on('select', function(){
				if (this.getValue() == this.clearMarker) 
					this.clearValue();
			});
		},
	});
	
	Ext.reg('tx.form.type', tx.form.type = Ext.extend(Ext.form.ComboBox, {
		fieldLabel: 'Type',
        name: 'type',
        anchor: '100%',
		allowBlank: false,
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
		    fields: ['singleField'],
		    data : [ ['Dog'], ['Cat'], ['Puppy'], ['Kitten'], ['Pig'], ['Other']]
		}),
		displayField: 'singleField',
		typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    selectOnFocus:true,
		editable: false,
	}));
	
	Ext.reg('tx.form.colour', tx.form.colour = Ext.extend(Ext.ux.ClearableCombo, {
		fieldLabel: 'Colour',
		name: 'colour',
		anchor: '100%',
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
			fields: ['singleField'],
			data: _clearableComboSort([[clearComboMarker], ['Black'], ['Black/White'], ['Black/Tan'], ['Blue'], ['Blue/White'], ['Blue Roan'], ['Blue Roan/White'], ['Blue Roan/Black'], ['Brindle'], ['Brindle/White'], ['Brown'], ['Brown/White'], ['Chestnut'], ['Chestnut/White'], ['Chocolate'], ['Chocolate/White'], ['Fawn'], ['Fawn/White'], ['Ginger'], ['Golden'], ['Golden/White'], ['Liver'], ['Liver/White'], ['Red'], ['Red/Brown'], ['Red Roan'], ['Red Roan/White'], ['Red Roan/Tan'], ['Tabby'], ['Tan'], ['Tan/White'], ['Tri'], ['Tri/White'], ['White'], ['White/Black'], ['White/Blue'], ['White/Brindle'], ['White/Brown'], ['White/Fawn'], ['White/Tan'], ['White/Tri'], ])
		}),
		displayField: 'singleField',
		mode: 'local',
		triggerAction: 'all',
		selectOnFocus: true,
	}));
	
	Ext.reg('tx.form.sex', tx.form.sex = Ext.extend(Ext.form.ComboBox, {
		fieldLabel: 'Sex',
        name: 'sex',
        anchor: '100%',
        allowBlank: false,
        tpl: Templates.simpleCombo,
        store: new Ext.data.SimpleStore({
            fields: ['singleField'],
            data: [['M'], ['F'], ['Unknown']]
        }),
        displayField: 'singleField',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        editable: false,
	}));
	
	Ext.reg('tx.form.desexed', tx.form.desexed = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'Desexed',
        name: 'desexed'
	}));
	
	Ext.reg('tx.form.bcs', tx.form.bcs = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'BCS',
        name: 'bcs',
        anchor: '100%',
        tpl: Templates.simpleCombo,
        store: new Ext.data.SimpleStore({
            fields: ['singleField'],
            data: [[clearComboMarker], [1], [2], [3], [4], [5], [6], [7], [8], [9], ]
        }),
        displayField: 'singleField',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        editable: false,
	}));
	
	Ext.reg('tx.form.mange', tx.form.mange = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Mange',
        name: 'mange',
        anchor: '100%',
        tpl: Templates.simpleCombo,
        store: new Ext.data.SimpleStore({
            fields: ['singleField'],
            data: [[clearComboMarker], [1], [2], [3], [4], [5], ]
        }),
        displayField: 'singleField',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        editable: false,
	}));
	
	Ext.reg('tx.form.ticks', tx.form.ticks = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Ticks',
        name: 'ticks',
        anchor: '100%',
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
		    fields: ['singleField'],
		    data : [[clearComboMarker], [1], [2], [3], [4], ]
		}),
		displayField: 'singleField',
		typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    selectOnFocus:true,
		editable: false,
	}));
	
	Ext.reg('tx.form.fleas', tx.form.fleas = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Fleas',
        name: 'fleas',
        anchor: '100%',
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
		    fields: ['singleField'],
		    data : [[clearComboMarker], [1], [2], [3], ]
		}),
		displayField: 'singleField',
		typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    selectOnFocus:true,
		editable: false,
	}));
	
	Ext.reg('tx.form.ivermectin', tx.form.ivermectin = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'Ivermectin',
        name: 'ivermectin'
	}));
	
	Ext.reg('tx.form.covinan', tx.form.covinan = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'Covinan',
        name: 'covinan'
	}));
	
	Ext.reg('tx.form.tvt', tx.form.tvt = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'TVT',
        name: 'tvt'
	}));
	
	Ext.reg('tx.form.comments', tx.form.comments = Ext.extend(Ext.form.TextArea, {
		fieldLabel: 'Comments',
        name: 'comments',
        anchor: '100%',
		height: 100,
	}));
	
	Ext.reg('tx.form.details', tx.form.details = Ext.extend(Ext.form.TextArea, {
		fieldLabel: 'Details',
		name: 'details',
		anchor: '100%'
	}));
	
	Ext.reg('tx.form.breed', tx.form.breed = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Breed',
        name: 'breed',
        anchor: '100%',
        tpl: Templates.simpleCombo,
        store: new Ext.data.SimpleStore({
            fields: ['singleField'],
            data: _clearableComboSort([[clearComboMarker], ['Camp Dog'], ['Boxer'], ['Staffie'], ['Dingo'], ['Irish Wolfhound X'], ['DSH'], ['DLH'], ['Pit Bull'], ['Mastiff X'], ['Labrador'], ['Golder Retriever'], ['German Shephers'], ['Rottweiler'], ['Jack Russell'], ['Ridgeback'], ['Kelpie'], ['Border Collie'], ['Blue Heeler'], ['Red Heeler'], ['GSP'], ['Shar Pei X'], ['Pig Dog Crossbreed'], ['Small crossbreed'], ['Bull Arab']])
        }),
        displayField: 'singleField',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
	}));
	
	Ext.reg('tx.form.mc', tx.form.mc = Ext.extend(Ext.form.TextField, {
		fieldLabel: 'Microchip',
        name: 'mc',
        anchor: '100%',
        maxLength: 15,
        minLength: 15,
	}));
	
	Ext.reg('tx.form.balanda', tx.form.balanda = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'Balanda',
        name: 'balanda'
	}));
	
	Ext.reg('tx.form.charge', tx.form.charge = Ext.extend(Ext.form.NumberField, {
		fieldLabel: 'Charge',
        name: 'charge',
        anchor: '100%',
        allowNegative: false,
        value: 0,
        allowBlank: false,
	}));
    
	Ext.reg('tx.form.domicile', tx.form.domicile = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Domicile',
        name: 'domicile',
        anchor: '100%',
        tpl: Templates.simpleCombo,
        store: new Ext.data.SimpleStore({
            fields: ['singleField'],
            data: [[clearComboMarker], ['Community'], ['Outstation']]
        }),
        displayField: 'singleField',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        editable: false,
	}));
	
	Ext.reg('tx.form.desex', tx.form.desex = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Desex',
        name: 'desex',
        anchor: '100%',
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
		    fields: ['singleField'],
		    data : [ [clearComboMarker], ['Spey'], ['Castrate']]
		}),
		displayField: 'singleField',
		typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    selectOnFocus:true,
		editable: false,
	}));
	
	Ext.reg('tx.form.other_procedures', tx.form.other_procedures = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'Other Procedures',
        name: 'other_procedures'
	}));
	
	Ext.reg('tx.form.vacc', tx.form.vacc = Ext.extend(Ext.form.Checkbox, {
		fieldLabel: 'Vaccination',
        name: 'vacc'
	}));
	
	Ext.reg('tx.form.reason', tx.form.reason = Ext.extend(Ext.form.ComboBox, {
		fieldLabel: 'Reason',
        name: 'reason',
        anchor: '100%',
		allowBlank: false,					
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
		    fields: ['singleField'],
		    data : [ ['Fight Wound'], ['Hunting Wound'], ['Car Accident'], ['Other']]
		}),
		displayField: 'singleField',
		typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    selectOnFocus:true,
		editable: false,
	}));
	
	Ext.reg('tx.form.euth', tx.form.euth = Ext.extend(Ext.ux.ClearableCombo, {
	 	fieldLabel: 'Euthanasia',
        name: 'euth',
        anchor: '100%',
		tpl: Templates.simpleCombo,
		store: new Ext.data.SimpleStore({
		    fields: ['singleField'],
		    data : [ [clearComboMarker], ['Unwanted'], ['Humane'], ['Cheeky']]
		}),
		displayField: 'singleField',
		typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    selectOnFocus:true,
		editable: false,
	}));
})();