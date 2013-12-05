/**
 * Tarpo.Form
 *
 * Re-usable pre-configured form elements used throughout Tarpo Add/Edit form pages
 * Nice having them all in one file for easy comparison
 *
 */
Ext.namespace('Tarpo.Form');

/* 
 * @private - used to sort combo data alphabetically whilst leaving
 * clearComboMarker at the top
 *
 * This will not be necessary soon..
 */
function _clearableComboSort(array){
    return array.sort(function(array1, array2){
        a = array1[0];
        b = array2[0];
        if (a == Tarpo.Form.clearComboMarker) 
            return -1;
        if (b == Tarpo.Form.clearComboMarker) 
            return 1;
        return (a === b) ? 0 : (a > b) ? 1 : -1;
    });
}

Tarpo.Form.clearComboMarker = '---';

/**
 * Quickly add 2 form items into a 2-column layout
 */
Tarpo.Form.dual_column = function(a, b){
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

Ext.reg('Tarpo.Form.d', Tarpo.Form.d = Ext.extend(Ext.form.DateField, {
    fieldLabel: 'Date',
    name: 'd',
    width: 135,
    format: 'd/m/Y',
    value: new Date(), // default value (overwritten with existing value if not new)
    allowBlank: false,
}));

var _opener = Ext.air.NativeWindow.getRootHtmlWindow();
Ext.reg('Tarpo.Form.listId', Tarpo.Form.listId = Ext.extend(Tarpo.TreeSelector.List, {
    fieldLabel: 'List',
    name: 'listId',
    store: _opener && _opener.Tarpo && _opener.Tarpo.store && _opener.Tarpo.store.list,
    anchor: '100%',
    allowBlank: false,
    
    // Override other inherited methods 
    onRender: function(){
        // Before parent code
        // Call parent (required)
        Tarpo.Form.listId.superclass.onRender.apply(this, arguments);
        
        // After parent code
        this.menu.on('beforeshow', function(m){
            this.tree.setWidth(Math.max(180, this.getSize().width));
        }, this);
    }
}));

Ext.reg('Tarpo.Form.house', Tarpo.Form.house = Ext.extend(Ext.form.TextField, {
    fieldLabel: 'House',
    name: 'house',
    allowBlank: false,
    anchor: '100%'
}));

Ext.reg('Tarpo.Form.loc', Tarpo.Form.loc = Ext.extend(Ext.form.TextField, {
    fieldLabel: 'Location',
    name: 'loc',
    anchor: '100%'
}));

Ext.reg('Tarpo.Form.owner', Tarpo.Form.owner = Ext.extend(Ext.form.TextField, {
    fieldLabel: 'Owner',
    name: 'owner',
    anchor: '100%'
}));

Ext.reg('Tarpo.Form.name', Tarpo.Form.name = Ext.extend(Ext.form.TextField, {
    fieldLabel: 'Name',
    name: 'name',
    anchor: '100%'
}));

Ext.ux.ClearableCombo = Ext.extend(Ext.form.ComboBox, {
    clearMarker: Tarpo.Form.clearComboMarker,
    initComponent: function(){
        // Before parent code
        
        // Call parent (required)
        Ext.ux.ClearableCombo.superclass.initComponent.apply(this, arguments);
        
//        // After parent code
//        this.on('select', function(){
//            if (this.getValue() == this.clearMarker) {
//                this.clearValue();
//            }
//        });
//      this.on('valid', function(field){
//          if (field.getValue() == Tarpo.Form.clearComboMarker) {
//              field.setRawValue(' ');
//          }
//      });
    },
});

Ext.reg('Tarpo.Form.type', Tarpo.Form.type = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: 'Type',
    name: 'type',
    anchor: '100%',
    allowBlank: false,
    tpl: Tarpo.Templates.simpleCombo,
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
}));

var dogColours = Tarpo.DogColours.get().map(function(el){
    return [el]
});
dogColours.splice(0, 0, [Tarpo.Form.clearComboMarker]);
Ext.reg('Tarpo.Form.colour', Tarpo.Form.colour = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Colour',
    name: 'colour',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: dogColours,
    }),
    displayField: 'singleField',
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
}));

Ext.reg('Tarpo.Form.sex', Tarpo.Form.sex = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: 'Sex',
    name: 'sex',
    anchor: '100%',
    allowBlank: false,
    tpl: Tarpo.Templates.simpleCombo,
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

Ext.reg('Tarpo.Form.desexed', Tarpo.Form.desexed = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'Desexed',
    name: 'desexed'
}));

Ext.reg('Tarpo.Form.bcs', Tarpo.Form.bcs = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'BCS',
    name: 'bcs',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], [1], [2], [3], [4], [5], [6], [7], [8], [9], ]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.mange', Tarpo.Form.mange = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Mange',
    name: 'mange',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], [0], [1], [2], [3], [4], [5], ]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.ticks', Tarpo.Form.ticks = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Ticks',
    name: 'ticks',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], [1], [2], [3], [4], ]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.fleas', Tarpo.Form.fleas = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Fleas',
    name: 'fleas',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], [1], [2], [3], ]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.ivermectin', Tarpo.Form.ivermectin = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'Ivermectin',
    name: 'ivermectin'
}));

Ext.reg('Tarpo.Form.covinan', Tarpo.Form.covinan = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'Covinan',
    name: 'covinan'
}));

Ext.reg('Tarpo.Form.tvt', Tarpo.Form.tvt = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'TVT',
    name: 'tvt'
}));

Ext.reg('Tarpo.Form.comments', Tarpo.Form.comments = Ext.extend(Ext.form.TextArea, {
    fieldLabel: 'Comments',
    name: 'comments',
    anchor: '100%',
    height: 100,
}));

Ext.reg('Tarpo.Form.details', Tarpo.Form.details = Ext.extend(Ext.form.TextArea, {
    fieldLabel: 'Details',
    name: 'details',
    anchor: '100%'
}));

Ext.reg('Tarpo.Form.dogColours', Tarpo.Form.dogColours = Ext.extend(Ext.form.TextArea, {
    fieldLabel: 'Dog Colours (enter one per line)',
    name: 'dogColours',
    anchor: '100%',
    height: '100%',
}));

Ext.reg('Tarpo.Form.dogBreeds', Tarpo.Form.dogBreeds = Ext.extend(Ext.form.TextArea, {
    fieldLabel: 'Dog Breeds (enter one per line)',
    name: 'dogBreeds',
    anchor: '100%',
    height: '100%',
}));

var dogBreeds = Tarpo.DogBreeds.get().map(function(el){
    return [el]
});
dogBreeds.splice(0, 0, [Tarpo.Form.clearComboMarker]);
Ext.reg('Tarpo.Form.breed', Tarpo.Form.breed = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Breed',
    name: 'breed',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: dogBreeds,
    }),
    displayField: 'singleField',
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
}));

Ext.reg('Tarpo.Form.mc', Tarpo.Form.mc = Ext.extend(Ext.form.TextField, {
    fieldLabel: 'Microchip',
    name: 'mc',
    anchor: '100%',
    maxLength: 15,
    minLength: 15,
}));

Ext.reg('Tarpo.Form.balanda', Tarpo.Form.balanda = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'Balanda',
    name: 'balanda'
}));

Ext.reg('Tarpo.Form.charge', Tarpo.Form.charge = Ext.extend(Ext.form.NumberField, {
    fieldLabel: 'Charge',
    name: 'charge',
    anchor: '100%',
    allowNegative: false,
    value: 0,
    allowBlank: false,
}));

Ext.reg('Tarpo.Form.domicile', Tarpo.Form.domicile = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Domicile',
    name: 'domicile',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], ['Community'], ['Outstation']]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.desex', Tarpo.Form.desex = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Desex',
    name: 'desex',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], ['Spey'], ['Castrate']]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.other_procedures', Tarpo.Form.other_procedures = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'Other Procedures',
    name: 'other_procedures'
}));

Ext.reg('Tarpo.Form.vacc', Tarpo.Form.vacc = Ext.extend(Ext.form.Checkbox, {
    fieldLabel: 'Vaccination',
    name: 'vacc'
}));

Ext.reg('Tarpo.Form.reason', Tarpo.Form.reason = Ext.extend(Ext.form.ComboBox, {
    fieldLabel: 'Reason',
    name: 'reason',
    anchor: '100%',
    allowBlank: false,
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [['Fight Wound'], ['Hunting Wound'], ['Car Accident'], ['Other']]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));

Ext.reg('Tarpo.Form.euth', Tarpo.Form.euth = Ext.extend(Ext.ux.ClearableCombo, {
    fieldLabel: 'Euthanasia',
    name: 'euth',
    anchor: '100%',
    tpl: Tarpo.Templates.simpleCombo,
    store: new Ext.data.SimpleStore({
        fields: ['singleField'],
        data: [[Tarpo.Form.clearComboMarker], ['Unwanted'], ['Humane'], ['Cheeky']]
    }),
    displayField: 'singleField',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    editable: false,
}));
