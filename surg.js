Ext.onReady(function(){

	
    Ext.QuickTips.init();
	
	// globals in function scope
	var win = window.nativeWindow;
	var opener = Ext.air.NativeWindow.getRootHtmlWindow();
	var surgId = String(window.location).split('=')[1];
	var isNew = surgId == 'New';
	var addCount = 1;
	
	if (isNew) {
		surgId = Ext.uniqueId();
		win.title = 'New Surgical Case #' + addCount;
	} else {
		win.title = 'Surgical Case - ' + Ext.util.Format.ellipsis(getView().data.mc, 40);
	}	
	
	var tb = new Ext.Toolbar({
		region: 'north',
		height:26,
		id:'main-tb',
		items:[
			{iconCls: 'icon-delete', text: 'Delete', handler: function(){
				Ext.Msg.confirm('Confirm Delete', 'Are you sure you want to delete this Surgical Case?', function(btn){
					if(btn == 'yes'){
						opener.tx.data.surg.remove(getView());
						win.close();
					}
				});
			}}
		]
	});
	
	var form = new Ext.form.FormPanel({
		region:'center',
        baseCls: 'x-plain',
        labelWidth: 75,
        margins:'10 10 5 10',
		
		buttonAlign: 'right',
		minButtonWidth: 80,
		buttons:[{
			text: 'Save &amp; Reuse',
			handler: function(){
				if(validate()) {
					saveData();
					isNew = true;
					surgId = Ext.uniqueId();
					win.title = 'New Surgical Case #' + ++addCount;
				}
			}
		},{
			text: 'Save',
			handler: function(){
				if(validate()) {
					saveData();
					window.nativeWindow.close();
				}
			}
		},{
			text: 'Cancel',
			handler: function(){ window.nativeWindow.close(); }
		}],
		
        items: [
			Forms.common.d,
			Forms.common.listId,
			
			Forms.common.dual_column(
				Forms.common.house,
				Forms.common.loc
			),
			
			Forms.common.dual_column(
				Forms.common.balanda,
				Forms.common.charge
			),
			
			Forms.common.dual_column(
				Forms.common.owner,
				Forms.common.domicile
			),
			
			Forms.common.dual_column(
				Forms.common.animal_type,
				Forms.common.breed
			),
			
			Forms.common.microchip,
			
			Forms.common.dual_column(				
				Forms.common.name,				
				Forms.common.colour
			),
			
			Forms.common.dual_column(
				Forms.common.sex,
				Forms.common.desexed				
			),
			
			Forms.common.dual_column(
				Forms.common.bcs,
				Forms.common.mange
			),
			
			Forms.common.dual_column(
				new Ext.form.ComboBox({
					fieldLabel: 'Desex',
			        name: 'desex',
			        anchor: '100%',
					
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ [Forms.common.clearComboMarker], ['Spey'], ['Castrate']]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
					listeners: {
						select: Forms.common.clearCombo
					}
			    }),
				
				new Ext.form.Checkbox({
					fieldLabel: 'Other Procedures',
			        name: 'other_procedures'
			    })
			),
			
			Forms.common.dual_column(
				new Ext.form.ComboBox({
					fieldLabel: 'TVT',
			        name: 'tvt',
			        anchor: '100%',
					
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ [Forms.common.clearComboMarker], ['Penile'], ['Vaginal']]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
					listeners: {
						select: Forms.common.clearCombo
					}
			    }),
				
				new Ext.form.Checkbox({
					fieldLabel: 'Vaccination',
			        name: 'vacc'
			    })
			),
			
			new Ext.form.TextArea({
				fieldLabel: 'Details',
		        name: 'details',
		        anchor: '100%',
				height: 100,
		    }),
		]
    });
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[tb, form]
	});
	
	refreshData.defer(10);

	win.visible = true;
	win.activate();
	
	form.getForm().findField('house').focus();
		
	function refreshData(){
		if(!isNew){
			var view = getView();
			form.getForm().loadRecord(view);
		}
	}
	
	function saveData(){
		var view;
		if(isNew){
			view = opener.tx.data.surg.createSurg(
				form.getForm().findField('listId').getRawValue()
			);
		}else{
			view = getView();
			// should all happen automagically
		}
		if (view) {
			form.getForm().updateRecord(view);
		}
		
	}
	
	function validate(){
		if(!form.getForm().isValid()){
			Ext.Msg.alert('Validation Warning', 'Unable to save changes. Please check fields and try again.');
			return false;
		}
		return true;
	}
	
	function getView(){
		var t = opener.tx.data.surg.lookup(surgId);
		if(t){
			//workaround WebKit cross-frame date issue
			fixDateMember(t.data, 'd');
		}
		return t;
	}
});   

