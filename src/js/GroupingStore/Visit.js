/**
 * Tarpo.GroupingStore.Visit
 */
Ext.namespace('Tarpo.GroupingStore.Visit');
Tarpo.GroupingStore.Visit = Ext.extend(Ext.data.GroupingStore, {
    constructor: function(){
        Tarpo.GroupingStore.Visit.superclass.constructor.call(this, {
            sortInfo: {
                field: 'd',
                direction: "ASC"
            },
            groupField: 'd',
            visitFilter: 'all',
            reader: new Ext.data.JsonReader({
                id: 'id',
                fields: Tarpo.Data.Visit
            })
        });
        this.conn = Tarpo.Data.getConnection();
        this.proxy = new Ext.sql.Proxy(Tarpo.Data.getConnection(), 'visit', 'id', this);
    },
    
    applyFilter: function(filter){
        if (filter !== undefined) {
            this.visitFilter = filter;
        }
        var value = this.visitFilter;
        if (value == 'all') {
            return this.clearFilter();
        }
        return this.filterBy(function(item){
            return item.data.completed === value;
        });
    },
    
    addVisit: function(data){
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
					where: 'where listId in (' + ps.join(',') + ') limit ' + Tarpo.Data.row_limit,
					args: listId
				}
			});
		}else{
			this.load({params: {
				where: 'where listId = ? limit ' + Tarpo.Data.row_limit,
				args: [listId]
			}});
		}		
        this.applyFilter();
        this.applyGrouping(true);
        this.resumeEvents();
        this.fireEvent('datachanged', this);
	},
	
	removeList: function(listId){
		this.conn.execBy('delete from visit where listId = ?', [listId]);
		this.reload();
	},
    
    prepareTable: function(){
        try {
            this.createTable({
                name: 'visit',
                key: 'id',
                fields: Tarpo.Data.Visit.prototype.fields
            });
        } 
        catch (e) {
            Tarpo.log(e);
        }
    },
    
    createVisit: function(listText){
		var listId = '';
		if(!Ext.isEmpty(listText)){
			listId = Tarpo.store.list.addList(Ext.util.Format.htmlEncode(listText)).id;
		}else{
			listId = Tarpo.store.list.newList(false).id;
		}
		var newId = Ext.uniqueId();
        this.addVisit({
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
        Tarpo.Util.fixDateMember(r.data, 'd');
        Tarpo.GroupingStore.Visit.superclass.afterEdit.apply(this, arguments);
    },
    
    init: function(){
		Tarpo.store.list.load();
        this.load({
			params: {
				where: ' limit ' + Tarpo.Data.row_limit
			},
            callback: function(){                
                if (this.getCount() < 1) {
                    Ext.Msg.confirm('Create Visits?', 'Your database is currently empty. Would you like to insert some demo data?', function(btn){
                        if (btn == 'yes') {
                            Tarpo.Data.demoData();
                        }
                    }, this);
                }
            },
            scope: this
        });
    },
    
    lookup: function(id){
        var visit;
        if (visit = this.getById(id)) {
            return visit;
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
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            house: '537',
            loc: 'Bottom Camp',
            type: 'Note',
            comments: 'No roof',
			listId:'2007-dry-start',
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            house: '536',
			owner: 'Peter',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'B',
			sex: 'F',
			desexed: 0,
			bcs: 3,
			mange: 3,
			listId:'2007-dry-start',
			ivermectin: 1,
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            house: '536',
			owner: 'Peter',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T',
			sex: 'M',
			desexed: 0,
			bcs: 5,
			mange: 1,
			comments: 'Lame LH',
			listId:'2007-dry-start',
			ivermectin: 1,
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            house: '535',
            loc: 'Bottom Camp',
            type: 'Note',
			comments: 'Not home',
			listId:'2007-dry-start',
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
            house: '534',
            loc: 'Bottom Camp',
            type: 'Note',
			comments: 'Not home',
			listId:'2007-dry-start',
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -2),
            house: '533',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-start',
			ivermectin: 1,
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -2),
            house: '533',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'F',
			desexed: 0,
			bcs: 4,
			mange: 1,
			listId:'2007-dry-start',
			ivermectin: 1,
        });
        this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -2),
            house: '533',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'B/W',
			sex: 'F',
			desexed: 0,
			bcs: 4,
			mange: 2,
			listId:'2007-dry-start',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '205',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'Red',
			sex: 'M',
			desexed: 0,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '206/207',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'M',
			desexed: 0,
			bcs: 4,
			mange: 1,
			comments: 'To castrate',
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '206/207',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'M',
			desexed: 0,
			bcs: 5,
			mange: 1,
			comments: 'To castrate',
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '206/207',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '206/207',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'Red/Brown',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '206/207',
            loc: 'Bottom Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 4,
			mange: 1,
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s.add('d', -1),
            house: '208',
            loc: 'Bottom Camp',
            type: 'Note',
			comments: 'No dogs',
			listId:'2007-dry-end',
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s,
            house: '128',
            loc: 'Side Camp',
            type: 'Dog',
			colour: 'T',
			sex: 'F',
			desexed: 1,
			bcs: 5,
			mange: 1,
			listId:'2007-dry-end',
			ivermectin: 1,
        });
		this.addVisit({
            id: Ext.uniqueId(),
			d: s,
            house: '128',
            loc: 'Side Camp',
            type: 'Dog',
			colour: 'T/W',
			sex: 'M',
			desexed: 1,
			bcs: 5,
			mange: 1,
			name: 'Simba',
			comments: "Multiple mutilobulated intradermal masses medial LH and also beside prepuce. \nOld dog.\nMonitor.",
			listId:'2007-dry-end',
			ivermectin: 1,
        });
    }
});
