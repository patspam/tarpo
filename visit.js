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
			{iconCls: 'icon-delete', text: 'Delete', handler: function(){
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
		var fields = ['name','colour','sex','desexed','bcs','mange','ticks','fleas','ivermectin','covinan','tvt'];
		
		var type = form.getForm().findField('type');
		if (type.getValue() == 'Note') {
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
			{xtype: 'tx.form.d'},
			{xtype: 'tx.form.listId'},
			
			tx.form.dual_column(
				{xtype: 'tx.form.house'},
				{xtype: 'tx.form.loc'}
			),
			
			{xtype: 'tx.form.owner'},
			{
				xtype: 'tx.form.type',
				store: new Ext.data.SimpleStore({
				    fields: ['singleField'],
				    data : [ ['Dog'], ['Cat'], ['Puppy'], ['Kitten'], ['Pig'], ['Other'], ['Note']]
				}),
				listeners: {
					select: {
						fn: checkType
					},
					scope: this
				},
			},
	
			tx.form.dual_column(				
				{xtype: 'tx.form.name'},
				{xtype: 'tx.form.colour'}
			),
			
			tx.form.dual_column(
				{xtype: 'tx.form.sex'},
				{xtype: 'tx.form.desexed'}
			),
			
			tx.form.dual_column(
				{xtype: 'tx.form.bcs'},
				{xtype: 'tx.form.mange'}
			),
			
			tx.form.dual_column(
				{xtype: 'tx.form.ticks'},
				{xtype: 'tx.form.fleas'}
			),
			
			{xtype: 'tx.form.ivermectin'},
			{xtype: 'tx.form.covinan'},
			{xtype: 'tx.form.tvt'},
			{xtype: 'tx.form.comments'},
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

