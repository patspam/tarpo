tx.data.SurgStore = Ext.extend(Ext.data.GroupingStore, {
    constructor: function(){
        tx.data.SurgStore.superclass.constructor.call(this, {
            sortInfo: {
                field: 'd',
                direction: "ASC"
            },
            groupField: 'd',
            surgFilter: 'all',
            reader: new Ext.data.JsonReader({
                id: 'id',
                fields: tx.data.Surg
            })
        });
        this.conn = tx.data.conn;
        this.proxy = new Ext.sql.Proxy(tx.data.conn, 'surg', 'id', this);
    },
    
    applyFilter: function(filter){
        if (filter !== undefined) {
            this.surgFilter = filter;
        }
        var value = this.surgFilter;
        if (value == 'all') {
            return this.clearFilter();
        }
        return this.filterBy(function(item){
            return item.data.completed === value;
        });
    },
    
    addSurg: function(data){
        this.suspendEvents();
        this.clearFilter();
        this.resumeEvents();
        this.loadData([data], true);
        this.suspendEvents();
        this.applyFilter();
        this.applyGrouping(true);
        this.resumeEvents();
        this.fireEvent('datachanged', this);
    },
	
	loadList: function(listId){
		var multi = Ext.isArray(listId);
		this.activeList = multi ? listId[0] : listId;
		this.suspendEvents();
        if(multi){
			var ps = [];
			for(var i = 0, len = listId.length; i < len; i++){
				ps.push('?');
			}
			this.load({
				params: {
					where: 'where listId in (' + ps.join(',') + ')',
					args: listId
				}
			});
		}else{
			this.load({params: {
				where: 'where listId = ?',
				args: [listId]
			}});
		}		
        this.applyFilter();
        this.applyGrouping(true);
        this.resumeEvents();
        this.fireEvent('datachanged', this);
	},
	
	removeList: function(listId){
		this.conn.execBy('delete from surg where listId = ?', [listId]);
		this.reload();
	},
    
    prepareTable: function(){
        try {
            this.createTable({
                name: 'surg',
                key: 'id',
                fields: tx.data.Surg.prototype.fields
            });
        } 
        catch (e) {
            console.log(e);
        }
    },
    
    createSurg: function(listText){
		var listId = '';
		if(!Ext.isEmpty(listText)){
			listId = tx.data.lists.addList(Ext.util.Format.htmlEncode(listText)).id;
		}else{
			listId = tx.data.lists.newList(false).id;
		}
		var newId = Ext.uniqueId();
        this.addSurg({
            id: newId,
			listId: listId,
        });
		return this.lookup(newId);
    },
    
    afterEdit: function(r){
        if (r.isModified(this.getGroupState())) {
            this.applyGrouping();
        }
        //workaround WebKit cross-frame date issue
        fixDateMember(r.data, 'd');
        tx.data.SurgStore.superclass.afterEdit.apply(this, arguments);
    },
    
    init: function(){
		tx.data.lists.load();
    },
    
    lookup: function(id){
        var surg;
        if (surg = this.getById(id)) {
            return surg;
        }
        var data = this.proxy.table.lookup(id);
        if (data) {
            var result = this.reader.readRecords([data]);
            return result.records[0];
        }
        return null;
    },
    
    /* This is used to load some demo data if the database is empty */
    demoData: function(){
        var s = new Date();
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            addr: '537',
            loc: 'Bottom Camp',
            type: 'NOTE',
            comments: 'No roof',
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            addr: '536',
			owner: 'Peter',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'B',
			sex: 'F',
			desexed: 0,
			bcs: 3,
			mange: 3,
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            addr: '536',
			owner: 'Peter',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T',
			sex: 'M',
			desexed: 0,
			bcs: 5,
			mange: 1,
			comments: 'Lame LH',
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            addr: '535',
            loc: 'Bottom Camp',
            type: 'NOTE',
			comments: 'Not home',
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            addr: '534',
            loc: 'Bottom Camp',
            type: 'NOTE',
			comments: 'Not home',
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -2),
            addr: '533',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -2),
            addr: '533',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'F',
			desexed: 0,
			bcs: 4,
			mange: 1,
			listId:'2007-dry-start',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -2),
            addr: '533',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'B/W',
			sex: 'F',
			desexed: 0,
			bcs: 4,
			mange: 2,
			listId:'2007-dry-start',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '205',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'Red',
			sex: 'M',
			desexed: 0,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '206/207',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'M',
			desexed: 0,
			bcs: 4,
			mange: 1,
			comments: 'To castrate',
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '206/207',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'M',
			desexed: 0,
			bcs: 5,
			mange: 1,
			comments: 'To castrate',
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '206/207',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '206/207',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'Red/Brown',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '206/207',
            loc: 'Bottom Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 4,
			mange: 1,
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            addr: '208',
            loc: 'Bottom Camp',
            type: 'NOTE',
			comments: 'No dogs',
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s,
            addr: '128',
            loc: 'Side Camp',
            type: 'DOG',
			colour: 'T',
			sex: 'F',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
        });
		this.addSurg({
            id: Ext.uniqueId(),
			d: s,
            addr: '128',
            loc: 'Side Camp',
            type: 'DOG',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			name: 'Simba',
			comments: "Multiple mutilobulated intradermal masses medial LH and also beside prepuce. \nOld dog.\nMonitor.",
			listId:'2007-dry-end',
        });
    }
});