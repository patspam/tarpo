(function(){
    Forms = {};
    
    var opener = Ext.air.NativeWindow.getRootHtmlWindow();
    
    var clearComboMarker = '---';
    
    function clearCombo(combo){
        if (combo.getValue() == Forms.common.clearComboMarker) 
            combo.clearValue();
    }
    
    function comboSort(array){
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
    
    Forms.common = {
    
        d: new Ext.form.DateField({
            fieldLabel: 'Date',
            name: 'd',
            width: 135,
            format: 'd/m/Y',
            value: new Date(), // default value (overwritten with existing value if not new)
            allowBlank: false,
        }),
        
        listId: new ListSelector({
            fieldLabel: 'List',
            name: 'listId',
            store: opener.tx.data.lists,
            anchor: '100%',
            allowBlank: false,
            listeners: {
                render: function(){
                    var _self = this;
                    _self.menu.on('beforeshow', function(m){
                        _self.tree.setWidth(Math.max(180, _self.getSize().width));
                    });
                }
            }
        }),
        
        house: new Ext.form.TextField({
            fieldLabel: 'House',
            name: 'house',
            allowBlank: false,
            anchor: '100%'
        }),
        
        loc: new Ext.form.TextField({
            fieldLabel: 'Location',
            name: 'loc',
            anchor: '100%'
        }),
        
        owner: new Ext.form.TextField({
            fieldLabel: 'Owner',
            name: 'owner',
            anchor: '100%'
        }),
        
        name: new Ext.form.TextField({
            fieldLabel: 'Name',
            name: 'name',
            anchor: '100%'
        }),
        
        colour: new Ext.form.ComboBox({
            fieldLabel: 'Colour',
            name: 'colour',
            anchor: '100%',
            tpl: Templates.simpleCombo,
            store: new Ext.data.SimpleStore({
                fields: ['singleField'],
                data: comboSort([[clearComboMarker], ['Black'], ['Black/White'], ['Black/Tan'], ['Blue'], ['Blue/White'], ['Blue Roan'], ['Blue Roan/White'], ['Brindle'], ['Brindle/White'], ['Brown'], ['Brown/White'], ['Chestnut'], ['Chestnut/White'], ['Chocolate'], ['Chocolate/White'], ['Fawn'], ['Fawn/White'], ['Golden'], ['Golden/White'], ['Liver'], ['Liver/White'], ['Red'], ['Red/Brown'], ['Red Roan'], ['Red Roan/White'], ['Tan'], ['Tan/White'], ['Tri'], ['Tri/White'], ['White/Black'], ['White/Blue'], ['White/Brindle'], ['White/Brown'], ['White/Fawn'], ['White/Tan'], ['White/Tri'], ])
            }),
            displayField: 'singleField',
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            listeners: {
                select: clearCombo
            }
        }),
        
        sex: new Ext.form.ComboBox({
            fieldLabel: 'Sex',
            name: 'sex',
            anchor: '100%',
            allowBlank: false,
            tpl: Templates.simpleCombo,
            store: new Ext.data.SimpleStore({
                fields: ['singleField'],
                data: [['M'], ['F'], ]
            }),
            displayField: 'singleField',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            editable: false,
        }),
        
        desexed: new Ext.form.Checkbox({
            fieldLabel: 'Desexed',
            name: 'desexed'
        }),
        
        bcs: new Ext.form.ComboBox({
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
            listeners: {
                select: clearCombo
            }
        }),
        
        mange: new Ext.form.ComboBox({
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
            listeners: {
                select: clearCombo
            }
        }),
        
        animal_type: new Ext.form.ComboBox({
            fieldLabel: 'Type',
            name: 'type',
            anchor: '100%',
            allowBlank: false,
            tpl: Templates.simpleCombo,
            store: new Ext.data.SimpleStore({
                fields: ['singleField'],
                data: [['Dog'], ['Cat'], ['Puppy'], ['Kitten'], ['Pig'], ['Other']]
            }),
            displayField: 'singleField',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            editable: false,
        }),
        
        breed: new Ext.form.ComboBox({
            fieldLabel: 'Breed',
            name: 'breed',
            anchor: '100%',
            tpl: Templates.simpleCombo,
            store: new Ext.data.SimpleStore({
                fields: ['singleField'],
                data: comboSort([[clearComboMarker], ['Boxer'], ['Staffie'], ['Dingo'], ['Pit Bull'], ['Mastiff X'], ['Labrador'], ['Golder Retriever'], ['German Shephers'], ['Rottweiler'], ['Jack Russell'], ['Ridgeback'], ['Kelpie'], ['Border Collie'], ['Blue Heeler'], ['Red Heeler'], ['GSP'], ['Shar Pei X'], ['Pig Dog Crossbreed'], ['Small crossbreed'], ['Bull Arab']])
            }),
            displayField: 'singleField',
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            listeners: {
                select: clearCombo
            }
        }),
        
        microchip: new Ext.form.TextField({
            fieldLabel: 'Microchip',
            name: 'mc',
            anchor: '100%',
            maxLength: 15,
            minLength: 15,
        }),
        
        balanda: new Ext.form.Checkbox({
            fieldLabel: 'Balanda',
            name: 'balanda'
        }),
        
        charge: new Ext.form.NumberField({
            fieldLabel: 'Charge',
            name: 'charge',
            anchor: '100%',
            allowNegative: false,
            value: 0,
            allowBlank: false,
        }),
        
        domicile: new Ext.form.ComboBox({
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
            listeners: {
                select: clearCombo
            }
        }),
        
        clearComboMarker: clearComboMarker,
        clearCombo: clearCombo,
        
        dual_column: function(a, b){
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
        },
        
        comboSort: comboSort
    };
})();
