/**
 * Tarpo.TreePanel.List
 */
Ext.namespace('Tarpo.TreePanel.List');

Tarpo.TreePanel.List = function(config){
	Tarpo.TreePanel.List.superclass.constructor.call(this, Ext.apply({
		id:'list-tree',
		animate:false,
		//rootVisible:false,
		region:'west',
		width:200,
		split:true,
		title:'My Lists',
		autoScroll:true,
		margins: '3 0 3 3',
		cmargins: '3 3 3 3',
		useArrows:true,
		collapsible:true,
		minWidth:120
	}, config));
	
	this.on('contextmenu', this.onContextMenu, this);
}
Ext.extend(Tarpo.TreePanel.List, Ext.tree.TreePanel, {
	
	initComponent : function(){
		this.bbar = [
			Tarpo.Actions.newList, 
			Tarpo.Actions.deleteList, 
			'-', 
			Tarpo.Actions.newFolder,
			Tarpo.Actions.deleteFolder
		];
		
		this.loader = new ListLoader({
			store: Tarpo.store.list
		});
		Tarpo.TreePanel.List.superclass.initComponent.call(this);
		
		var root = new Ext.tree.AsyncTreeNode({
	        text: 'All Lists',
			id: 'root',
			leaf: false,
			iconCls: 'icon-folder',
			expanded: true,
			isFolder: true,
			editable: false
	    });
	    this.setRootNode(root);
				
		this.editor = new Ext.tree.TreeEditor(this, {
	        allowBlank:false,
	        blankText:'A name is required',
	        selectOnFocus:true
	    });
        this.editor.shadow = false;

        this.editor.on('beforecomplete', function(ed, value, startValue){
			var node = ed.editNode;
			value = Ext.util.Format.htmlEncode(value);
			var r = this.store.getById(node.id);
			r.set('listName', value);
			//ed.editing = false;
            //ed.hide();
			//return false;
		}, this);
		
		this.sorter = new Ext.tree.TreeSorter(this, {
			folderSort: true
		});
	},
	
	getActiveFolderId : function(){
		var sm = this.selModel;
		var n = sm.getSelectedNode();
		if(n){
			return n.attributes.isFolder ? n.id : n.attributes.parentId;
		}
		return 'root';
	},
	
	onContextMenu : function(node, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'lists-cTarpo',
				listWidth: 200,
                items: [{
                    iconCls:'icon-list-new',
                    text:'New List',
                    scope: this,
                    handler:function(){
						this.cTarpoNode.select();
						Tarpo.Actions.newList.execute();
                    }
                },{
                    iconCls:'icon-folder-new',
                    text:'New Folder',
                    scope: this,
                    handler:function(){
						this.cTarpoNode.select();
						Tarpo.Actions.newFolder.execute();
                    }
                },'-',{
					text:'Delete',
                    iconCls:'icon-list-delete',
                    scope: this,
                    handler:function(){
                        this.removeList(this.cTarpoNode);
                    }
                },'-',{
					text:'Report On This List',
                    iconCls:'icon-report',
                    scope: this,
                    handler:function(){
                        Tarpo.Actions.report.execute(this.cTarpoNode.id);
                    }
                },{
					text:'Export Visits to CSV',
                    iconCls:'icon-report',
                    scope: this,
                    handler:function(){
						Tarpo.Export.CSV.Visit(this.cTarpoNode.id);
                    }
                },{
					text:'Export Surgical Cases to CSV',
                    iconCls:'icon-report',
                    scope: this,
                    handler:function(){
                       Tarpo.Export.CSV.Surg(this.cTarpoNode.id);
                    }
                },{
					text:'Export Medical Cases to CSV',
                    iconCls:'icon-report',
                    scope: this,
                    handler:function(){
                       Tarpo.Export.CSV.Med(this.cTarpoNode.id);
                    }
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        if(this.cTarpoNode){
            this.cTarpoNode.ui.removeClass('x-node-cTarpo');
            this.cTarpoNode = null;
        }
        this.cTarpoNode = node;
        this.cTarpoNode.ui.addClass('x-node-cTarpo');
		
		// Hide New List, New Folder and Separator if List selected
		this.menu.items.get(0).setVisible(!!node.attributes.isFolder);
		this.menu.items.get(1).setVisible(!!node.attributes.isFolder);
		this.menu.items.get(2).setVisible(!!node.attributes.isFolder);
		
		this.menu.items.get(5).setText(!!node.attributes.isFolder ? 'Report On This Folder' : 'Report On This List');
//		if (!!node.attributes.isFolder) {}
//		this.menu.items.get(1).setVisible(!!node.attributes.isFolder);
		
//		this.menu.items.get(2).setVisible(!!node.attributes.isFolder);
//		this.menu.items.get(0).setVisible(!node.attributes.isFolder);
		
		this.menu.showAt(e.getXY());
    },

    onContextHide : function(){
        if(this.cTarpoNode){
            this.cTarpoNode.ui.removeClass('x-node-cTarpo');
            this.cTarpoNode = null;
        }
    },
	
	startEdit : function(node, select){
		if(typeof node == 'string'){
			node = this.getNodeById(node);
		}
		if(select === true){
			node.select();
		}
		var ed = this.editor;
		setTimeout(function(){
			ed.editNode = node;
			ed.startEdit(node.ui.textNode);
		}, 10);
	},
	
	removeList : function(s){
		if (s && s.attributes.editable) {
			Ext.Msg.confirm('Confirm', 'Are you sure you want to delete "' + Ext.util.Format.htmlEncode(s.text) + '"?', function(btn){
				if (btn == 'yes') {
					if (s.nextSibling) {
						s.nextSibling.select();
					}
					else 
						if (s.previousSibling) {
							s.previousSibling.select();
						}
					s.parentNode.removeChild(s);
					Tarpo.store.list.remove(this.store.getById(s.id));
					Tarpo.store.visit.removeList(s.id);
					Tarpo.store.surg.removeList(s.id);
					Tarpo.store.med.removeList(s.id);
				}
			}, this);
		}
	}
});

