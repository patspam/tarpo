Ext.onReady(function(){
	
	function dual_column(a, b) {
		return {
				layout: 'column',
				anchor: '100%',
				baseCls: 'x-plain',
				defaults: {
					columnWidth: .5,
					layout: 'form',
					baseCls: 'x-plain',
				},
				items: [{
					items: 
					
						a,
					
				}, {
					labelAlign: 'right',
					labelWidth: '5', // just need any old value
					items: 
					
						b,
					
				}]
			}
	};
	
    Ext.QuickTips.init();
	
	// globals in function scope
	var win = window.nativeWindow;
	var opener = Ext.air.NativeWindow.getRootHtmlWindow();
	var surgId = String(window.location).split('=')[1];
	var isNew = surgId == 'New';
	var addCount = 1;
	
	if (isNew) {
		surgId = Ext.uniqueId();
		win.title = 'New Surgery #' + addCount;
	} else {
		win.title = 'Surgery - ' + Ext.util.Format.ellipsis(getView().data.house, 40);
	}	
	
	var tb = new Ext.Toolbar({
		region: 'north',
		height:26,
		id:'main-tb',
		items:[
			{iconCls: 'icon-delete-surg', text: 'Delete', handler: function(){
				Ext.Msg.confirm('Confirm Delete', 'Are you sure you want to delete this surgery?', function(btn){
					if(btn == 'yes'){
						opener.tx.data.surg.remove(getView());
						win.close();
					}
				});
			}}
		]
	});
	
	function checkType() {
//		var fields = ['name','colour','sex','desexed','bcs','mange','ticks','fleas','covinan','tvt'];
//		
//		var type = form.getForm().findField('type');
//		if (type.getValue() == 'NOTE') {
//			Ext.each(fields, function(field){
//				var f = form.getForm().findField(field);
//				f.disable();
//				f.setValue();
//			});
//		} else {
//			Ext.each(fields, function(field){
//				var f = form.getForm().findField(field);
//				f.enable();
//			});
//		}
	}
	
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
					win.title = 'New Surgery #' + ++addCount;
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
			new Ext.form.DateField({
				fieldLabel: 'Date',
				name: 'd',
				width: 135,
				format: 'd/m/Y',
				value: new Date(), // default value (overwritten with existing value if not new)
				allowBlank: false,
			}),
		
			new ListSelector({
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
			
			dual_column(
				new Ext.form.TextField({
					fieldLabel: 'House',
			        name: 'house',
					allowBlank: false,
			    }),
				
				new Ext.form.TextField({
					fieldLabel: 'Location',
			        name: 'loc',
			    })
			),
			
			new Ext.form.Checkbox({
				fieldLabel: 'Balanda',
		        name: 'balanda'
		    }),
			
			dual_column(
				new Ext.form.TextField({
					fieldLabel: 'Owner',
			        name: 'owner',
			        anchor: '100%'
			    }),
				
				new Ext.form.TextField({
					fieldLabel: 'Owner Location',
			        name: 'o_loc',
			        anchor: '100%',
			    })
			),
			
			dual_column(
				new Ext.form.ComboBox({
					fieldLabel: 'Type',
			        name: 'type',
			        anchor: '100%',
					allowBlank: false,
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ ['DOG'], ['CAT'], ['PUPPY'], ['KITTEN'], ['PIG'], ['NOTE'], ['OTHER']]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
					listeners: {
						select: {
							fn: checkType
						},
						scope: this
					},
			    }),
				
				new Ext.form.TextField({
					fieldLabel: 'Breed',
			        name: 'breed',
			        anchor: '100%'
			    })
			),
			
			new Ext.form.TextField({
				fieldLabel: 'Microchip',
		        name: 'mc',
		        anchor: '100%'
		    }),
			
			dual_column(
				new Ext.form.TextField({
					fieldLabel: 'Name',
			        name: 'name',
			        anchor: '100%'
			    }),
				
				new Ext.form.TextField({
					fieldLabel: 'Colour',
			        name: 'colour',
			        anchor: '100%'
			    })
			),
			
			dual_column(
				new Ext.form.ComboBox({
					fieldLabel: 'Sex',
			        name: 'sex',
			        anchor: '100%',
					allowBlank: false,
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ ['M'], ['F'], ]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
			    }),
			
				new Ext.form.Checkbox({
					fieldLabel: 'Desexed',
			        name: 'desexed'
			    })
			),
			
			dual_column(
				new Ext.form.ComboBox({
					fieldLabel: 'BCS',
			        name: 'bcs',
			        anchor: '100%',
					
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ [' '], [1], [2], [3], [4], [5], [6], [7], [8], [9], ]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
			    }),
				
				new Ext.form.ComboBox({
					fieldLabel: 'Mange',
			        name: 'mange',
			        anchor: '100%',
					
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ [' '], [1], [2], [3], [4], [5], ]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
			    })
			),
			
			new Ext.form.NumberField({
				fieldLabel: 'Charge',
		        name: 'charge',
		        anchor: '100%',
				allowNegative: false,
				value: 0,
				allowBlank: false,
		    }),
			
			dual_column(
				new Ext.form.Checkbox({
					fieldLabel: 'Spey',
			        name: 'spey'
			    }),
				
				new Ext.form.Checkbox({
					fieldLabel: 'Castration',
			        name: 'castration'
			    })
			),
			
			dual_column(
				new Ext.form.ComboBox({
					fieldLabel: 'Euthanasia',
			        name: 'euth',
			        anchor: '100%',
					
					tpl: Templates.simpleCombo,
					store: new Ext.data.SimpleStore({
					    fields: ['singleField'],
					    data : [ [' '], ['Unwanted'], ['Humane'], ['Cheeky']]
					}),
					displayField: 'singleField',
					typeAhead: true,
				    mode: 'local',
				    triggerAction: 'all',
				    selectOnFocus:true,
					editable: false,
			    }),
				
				new Ext.form.Checkbox({
					fieldLabel: 'Vaccination',
			        name: 'vacc'
			    })
			),
			
			new Ext.form.TextArea({
				fieldLabel: 'Other Procedures',
		        name: 'other',
				anchor: '100%'
		    }),
			
			new Ext.form.TextArea({
				fieldLabel: 'Comments',
		        name: 'comments',
		        anchor: '100%'
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
			checkType();
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

