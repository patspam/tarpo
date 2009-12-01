/**
 * Tarpo.GroupingStore.Med
 */
Ext.namespace('Tarpo.GroupingStore.Med');
Tarpo.GroupingStore.Med = Ext.extend(Ext.data.GroupingStore, {
    constructor: function(){
        Tarpo.GroupingStore.Med.superclass.constructor.call(this, {
            sortInfo: {
                field: 'd',
                direction: "ASC"
            },
            groupField: 'd',
            medFilter: 'all',
            reader: new Ext.data.JsonReader({
                id: 'id',
                fields: Tarpo.Data.Med
            })
        });
        this.conn = Tarpo.Data.getConnection();
        this.proxy = new Ext.sql.Proxy(Tarpo.Data.getConnection(), 'med', 'id', this);
    },
    
    applyFilter: function(filter){
        if (filter !== undefined) {
            this.medFilter = filter;
        }
        var value = this.medFilter;
        if (value == 'all') {
            return this.clearFilter();
        }
        return this.filterBy(function(item){
            return item.data.completed === value;
        });
    },
    
    addMed: function(data){
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
		this.conn.execBy('delete from med where listId = ?', [listId]);
		this.reload();
	},
    
    prepareTable: function(){
        try {
            this.createTable({
                name: 'med',
                key: 'id',
                fields: Tarpo.Data.Med.prototype.fields
            });
        } 
        catch (e) {
            Tarpo.log(e);
        }
    },
    
    createMed: function(listText){
		var listId = '';
		if(!Ext.isEmpty(listText)){
			listId = Tarpo.store.list.addList(Ext.util.Format.htmlEncode(listText)).id;
		}else{
			listId = Tarpo.store.list.newList(false).id;
		}
		var newId = Ext.uniqueId();
        this.addMed({
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
        Tarpo.GroupingStore.Med.superclass.afterEdit.apply(this, arguments);
    },
    
    init: function(){
//		Tarpo.store.list.load();
    },
    
    lookup: function(id){
        var med;
        if (med = this.getById(id)) {
            return med;
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
        this.addMed({
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
            
			reason: 'Fight Wound',
			vacc: '',
			euth: '',
			details: 'Halitosis.  Severe tartar & periodontal disease.  Needs a dental badly.  Clav inj for now.',
        });
        this.addMed({
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
            
			reason: 'Hunting Wound',
			vacc: '',
			euth: '',
			details: 'Still quite lame.  Small raised ? Pus-filled swellings over P1/P2 joints.  Repeat Rimadyl - cat ate others  C5 vaccination.  Supply Baytril tabs.',
        });
        this.addMed({
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
            
			reason: 'Other',
			vacc: '',
			euth: '',
			details: 'Chronic skin probs - constant pruritis No fleas seen.  Ongoing for years, seasonally worse in the wet.  Dermatitis paws, chin, ears.  Now getting scabby.  Seborrheic smell.  Mas Malaseb.  Rx scabies Tx , course of Cartrophen, course of macrolone.',
        });
        this.addMed({
 			id: Ext.uniqueId(),
			d: s.add('d', -3),
			listId:'2007-dry-start',
			loc: 'Bottom Camp',
            house: '673',
			
			balanda: 0,
			owner: 'C.J.',
			domicile: 'Outstation',
			
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
            
			reason: 'Car Accident',
			vacc: '',
			euth: '',
			details: 'Redress leg.  Dressing been on too long.  Skin & wound look just OK.  Wound a bit open laterally, but still holding.  Some slough around tension sutures tubing areas.  Supply bandages & dressings.   Phone calls in following weeks - all healed uneventfully. ',
        });
        this.addMed({
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
            
			reason: 'Other',
			vacc: '1',
			euth: '',
			details: 'Desexed a few days ago.  C5 vaccination     To send vacc cards',
        });
        this.addMed({
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
            
			reason: 'Other',
			vacc: '',
			euth: 'Unwanted',
			details: 'Survived Rimadyl ingestion',
        });
		this.addMed({
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
            
			reason: 'Other',
			vacc: '1',
			euth: '',
			details: 'Phone calls.  HWT negative.  Cough a bit better.  Discussed rads in Darwin if no better.',
        });
    }
});
