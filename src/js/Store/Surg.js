/**
 * Tarpo.Store.Surg
 */
Ext.namespace('Tarpo.Store.Surg');
Tarpo.Store.Surg = Ext.extend(Ext.data.GroupingStore, {
    constructor: function(){
        Tarpo.Store.Surg.superclass.constructor.call(this, {
            sortInfo: {
                field: 'd',
                direction: "ASC"
            },
            groupField: 'd',
            surgFilter: 'all',
            reader: new Ext.data.JsonReader({
                id: 'id',
                fields: Tarpo.Data.Surg
            })
        });
        this.conn = Tarpo.Db;
        this.proxy = new Ext.sql.Proxy(Tarpo.Db, 'surg', 'id', this);
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
		this.conn.execBy('delete from surg where listId = ?', [listId]);
		this.reload();
	},
    
    prepareTable: function(){
        try {
            this.createTable({
                name: 'surg',
                key: 'id',
                fields: Tarpo.Data.Surg.prototype.fields
            });
        } 
        catch (e) {
            Tarpo.log(e);
        }
    },
    
    createSurg: function(listText){
		var listId = '';
		if(!Ext.isEmpty(listText)){
			listId = Tarpo.store.list.addList(Ext.util.Format.htmlEncode(listText)).id;
		}else{
			listId = Tarpo.store.list.newList(false).id;
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
        Tarpo.Util.fixDateMember(r.data, 'd');
        Tarpo.Store.Surg.superclass.afterEdit.apply(this, arguments);
    },
    
    init: function(){
//		Tarpo.store.list.load();
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
			listId:'2007-dry-start',
			loc: 'Bottom Camp',
            house: '533',
			
			balanda: 0,
			owner: '',
			domicile: 'Community',
			
			mc: '956000000331729',
			name: 'Julius',
			type: 'DOG',
			breed: '',
			colour: 'Blue',
			sex: 'M',
			desexed: '',
			bcs: 5,
			mange: 1,
			charge: 0,
            
			desex: 'Castrate',
			other_procedures: '',
			tvt: 1,
			vacc: 0,
			
			details: '',
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
			listId:'2007-dry-start',
			loc: 'Bottom Camp',
            house: '673',
			
			balanda: 0,
			owner: 'C.J.',
			domicile: 'Community',
			
			mc: '956000000332622',
			name: '',
			type: 'DOG',
			breed: '',
			colour: 'Tri',
			sex: 'F',
			desexed: '',
			bcs: 3,
			mange: 2,
			charge: 0,
            
			desex: 'Spey',
			other_procedures: '',
			tvt: 0,
			vacc: 0,
			
			details: "Vaginal TVT 3cm multifocal.\nDebride. \nImpression smears. \nLumps for path. \nVincristine 0.5mg",
        });
        this.addSurg({
            id: Ext.uniqueId(),
			d: s.add('d', -3),
			listId:'2007-dry-start',
			loc: 'Bottom Camp',
            house: '533',
			
			balanda: 0,
			owner: '',
			domicile: 'Community',
			
			mc: '956000000333778',
			name: '',
			type: 'DOG',
			breed: '',
			colour: 'B/T',
			sex: 'M',
			desexed: '',
			bcs: 4,
			mange: 2,
			charge: 0,
            
			desex: 'Castrate',
			other_procedures: '',
			tvt: 0,
			vacc: 0,
			
			details: '',	
        });
        this.addSurg({
 			id: Ext.uniqueId(),
			d: s.add('d', -3),
			listId:'2007-dry-start',
			loc: 'Bottom Camp',
            house: '673',
			
			balanda: 0,
			owner: 'C.J.',
			domicile: 'Community',
			
			mc: '956000000332968',
			name: '',
			type: 'DOG',
			breed: '',
			colour: 'B',
			sex: 'F',
			desexed: '',
			bcs: 3,
			mange: 2,
			charge: 0,
            
			desex: 'Spey',
			other_procedures: '',
			tvt: 1,
			vacc: 0,
			
			details: "",
        });
        this.addSurg({
           id: Ext.uniqueId(),
			d: s.add('d', -2),
			listId:'2007-dry-end',
			loc: 'Side Camp',
            house: '111',
			
			balanda: 1,
			owner: 'Karen & Peter',
			domicile: 'Outstation',
			
			mc: '956000000330332',
			name: 'Billy',
			type: 'DOG',
			breed: '',
			colour: 'T',
			sex: 'M',
			desexed: '',
			bcs: 5,
			mange: 2,
			charge: 0,
            
			desex: 'Castrate',
			other_procedures: '',
			tvt: 0,
			vacc: 0,
			
			details: "",
        });
        this.addSurg({
            d: s.add('d', -2),
			listId:'2007-dry-end',
			loc: 'Side Camp',
            house: '111',
			
			balanda: 1,
			owner: 'Karen & Peter',
			domicile: 'Outstation',
			
			mc: '956000000330498',
			name: 'Marlin',
			type: 'DOG',
			breed: '',
			colour: 'T',
			sex: 'M',
			desexed: '',
			bcs: 5,
			mange: 4,
			charge: 0,
            
			desex: 'Castrate',
			other_procedures: '1',
			tvt: 0,
			vacc: 0,
			
			details: "Scabby lesions on head-ventral-?Demodex. \nDectomax + dexafort inj.",
        });
		this.addSurg({
           id: Ext.uniqueId(),
			d: s.add('d', -2),
			listId:'2007-dry-end',
			loc: 'Side Camp',
            house: '232',
			
			balanda: '',
			owner: 'Bob',
			domicile: 'Outstation',
			
			mc: '956000000330222',
			name: 'Billy',
			type: 'DOG',
			breed: '',
			colour: 'Brown',
			sex: 'F',
			desexed: '',
			bcs: 1,
			mange: 1,
			charge: 0,
            
			desex: '',
			other_procedures: '',
			tvt: 0,
			vacc: 0,
			
			details: "",
        });
    }
});
