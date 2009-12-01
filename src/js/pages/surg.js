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
						opener.Tarpo.store.surg.remove(getView());
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
			{xtype: 'Tarpo.form.d'},
			{xtype: 'Tarpo.form.listId'},
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.house'},
				{xtype: 'Tarpo.form.loc'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.balanda'},
				{xtype: 'Tarpo.form.charge'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.owner'},
				{xtype: 'Tarpo.form.domicile'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.type'},
				{xtype: 'Tarpo.form.breed'}
			),
			
			{xtype: 'Tarpo.form.mc'},
			
			Tarpo.form.dual_column(				
				{xtype: 'Tarpo.form.name'},
				{xtype: 'Tarpo.form.colour'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.sex'},
				{xtype: 'Tarpo.form.desexed'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.bcs'},
				{xtype: 'Tarpo.form.mange'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.desex'},
				{xtype: 'Tarpo.form.other_procedures'}
			),
			
			Tarpo.form.dual_column(
				{xtype: 'Tarpo.form.tvt'},
				{xtype: 'Tarpo.form.vacc'}
			),
			
			{xtype: 'Tarpo.form.details'},
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
			view = opener.Tarpo.store.surg.createSurg(
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
		var t = opener.Tarpo.store.surg.lookup(surgId);
		if(t){
			//workaround WebKit cross-frame date issue
			Tarpo.Util.fixDateMember(t.data, 'd');
		}
		return t;
	}
});   

