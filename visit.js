Ext.onReady(function(){
	
    Ext.QuickTips.init();
	
	// globals in function scope
	var win = window.nativeWindow;
	var opener = Ext.air.NativeWindow.getRootHtmlWindow();
	var visitId = String(window.location).split('=')[1];
	var isNew = visitId == 'New';
	var addCount = 1;
	
	if (isNew) {
		visitId = Ext.uniqueId();
		win.title = 'New Visit #' + addCount;
	} else {
		win.title = 'House Visit - ' + Ext.util.Format.ellipsis(getView().data.house, 40);
	}	
	
	var tb = new Ext.Toolbar({
		region: 'north',
		height:26,
		id:'main-tb',
		items:[
			{iconCls: 'icon-delete-visit', text: 'Delete', handler: function(){
				Ext.Msg.confirm('Confirm Delete', 'Are you sure you want to delete this visit?', function(btn){
					if(btn == 'yes'){
						opener.tx.data.visits.remove(getView());
						win.close();
					}
				});
			}}
		]
	});
	
	function checkType() {
		var fields = ['name','colour','sex','desexed','bcs','mange','ticks','fleas','covinan','tvt'];
		
		var type = form.getForm().findField('type');
		if (type.getValue() == 'NOTE') {
			Ext.each(fields, function(field){
				var f = form.getForm().findField(field);
				f.disable();
				f.setValue();
			});
		} else {
			Ext.each(fields, function(field){
				var f = form.getForm().findField(field);
				f.enable();
			});
		}
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
					visitId = Ext.uniqueId();
					win.title = 'New Visit #' + ++addCount;
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
			
			new Ext.form.TextField({
				fieldLabel: 'Location',
		        name: 'loc',
		        anchor: '100%',
		    }),
	
			new Ext.form.TextField({
				fieldLabel: 'House',
		        name: 'house',
		        anchor: '100%',
				allowBlank: false,
		    }),
	
			new Ext.form.TextField({
				fieldLabel: 'Owner',
		        name: 'owner',
		        anchor: '100%'
		    }),

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
				fieldLabel: 'Name',
		        name: 'name',
		        anchor: '100%'
		    }),
			
			new Ext.form.TextField({
				fieldLabel: 'Colour',
		        name: 'colour',
		        anchor: '100%'
		    }),
			
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
		    }),
			
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
		    }),
			
			new Ext.form.ComboBox({
				fieldLabel: 'Ticks',
		        name: 'ticks',
		        anchor: '100%',
				
				tpl: Templates.simpleCombo,
				store: new Ext.data.SimpleStore({
				    fields: ['singleField'],
				    data : [ [' '], [1], [2], [3], [4], ]
				}),
				displayField: 'singleField',
				typeAhead: true,
			    mode: 'local',
			    triggerAction: 'all',
			    selectOnFocus:true,
				editable: false,
		    }),
			
			new Ext.form.ComboBox({
				fieldLabel: 'Fleas',
		        name: 'fleas',
		        anchor: '100%',
				
				tpl: Templates.simpleCombo,
				store: new Ext.data.SimpleStore({
				    fields: ['singleField'],
				    data : [ [' '], [1], [2], [3], ]
				}),
				displayField: 'singleField',
				typeAhead: true,
			    mode: 'local',
			    triggerAction: 'all',
			    selectOnFocus:true,
				editable: false,
		    }),
			
			new Ext.form.Checkbox({
				fieldLabel: 'Covinan',
		        name: 'covinan'
		    }),
			
			new Ext.form.Checkbox({
				fieldLabel: 'TVT',
		        name: 'tvt'
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
			view = opener.tx.data.visits.createVisit(
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
		var t = opener.tx.data.visits.lookup(visitId);
		if(t){
			//workaround WebKit cross-frame date issue
			fixDateMember(t.data, 'd');
		}
		return t;
	}
});   

