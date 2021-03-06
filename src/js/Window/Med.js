/**
 * Tarpo.Window.Med
 */
Ext.namespace('Tarpo.Window.Med');

Tarpo.Window.Med.init = function(){

    Ext.QuickTips.init();
	
	// globals in function scope
	var win = window.nativeWindow;
	var opener = Ext.air.NativeWindow.getRootHtmlWindow();
	var medId = String(window.location).split('=')[1];
	var isNew = medId == 'New';
	var addCount = 1;
	
	if (isNew) {
		medId = Ext.uniqueId();
		win.title = 'New Medical Case #' + addCount;
	} else {
		win.title = 'Medical Case - ' + Ext.util.Format.ellipsis(getView().data.mc, 40);
	}	
	
	var tb = new Ext.Toolbar({
		region: 'north',
		height:26,
		id:'main-tb',
		items:[
			{iconCls: 'icon-delete', text: 'Delete', handler: function(){
				Ext.Msg.confirm('Confirm Delete', 'Are you sure you want to delete this Medical Case?', function(btn){
					if(btn == 'yes'){
						opener.Tarpo.store.med.remove(getView());
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
					medId = Ext.uniqueId();
					win.title = 'New Medical Case #' + ++addCount;
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
			{xtype: 'Tarpo.Form.d'},
			{xtype: 'Tarpo.Form.listId'},
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.house'},
				{xtype: 'Tarpo.Form.loc'}
			),
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.balanda'},
				{xtype: 'Tarpo.Form.charge'}
			),
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.owner'},
				{xtype: 'Tarpo.Form.domicile'}
			),
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.type'},
				{xtype: 'Tarpo.Form.breed'}
			),
			
			{xtype: 'Tarpo.Form.mc'},
			
			Tarpo.Form.dual_column(				
				{xtype: 'Tarpo.Form.name'},
				{xtype: 'Tarpo.Form.colour'}
			),
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.sex'},
				{xtype: 'Tarpo.Form.desexed'}
			),
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.bcs'},
				{xtype: 'Tarpo.Form.mange'}
			),
			
			Tarpo.Form.dual_column(
				{xtype: 'Tarpo.Form.reason'},
				{xtype: 'Tarpo.Form.vacc'}
			),
			
			{xtype: 'Tarpo.Form.euth'},
			{xtype: 'Tarpo.Form.details'},
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
			view = opener.Tarpo.store.med.createMed(
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
		var t = opener.Tarpo.store.med.lookup(medId);
		if(t){
			//workaround WebKit cross-frame date issue
			Tarpo.Util.fixDateMember(t.data, 'd');
		}
		return t;
	}
};   

Tarpo.Window.Med.init();