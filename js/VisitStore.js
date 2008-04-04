tx.data.VisitStore = Ext.extend(Ext.data.GroupingStore, {
	constructor: function(){
		tx.data.VisitStore.superclass.constructor.call(this, {
	        sortInfo:{field: 'd', direction: "ASC"},
	        groupField:'d',
	        visitFilter: 'all',
	        reader: new Ext.data.JsonReader({
	            id: 'id',
				fields: tx.data.Visit
	        })
	    });
		this.conn = tx.data.conn;
	    this.proxy = new Ext.sql.Proxy(tx.data.conn, 'visit', 'id', this);
	},
	
	applyFilter : function(filter){
    	if(filter !== undefined){
    		this.visitFilter = filter;
    	}
        var value = this.visitFilter;
        if(value == 'all'){
            return this.clearFilter();
        }
        return this.filterBy(function(item){
            return item.data.completed === value;
        });
    },

    addVisit : function(data){
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
	
    prepareTable : function(){
        try{
        this.createTable({
            name: 'visit',
            key: 'id',
            fields: tx.data.Visit.prototype.fields
        });
        }catch(e){console.log(e);}
    },
		
	createVisit : function(d, addr, loc, type){
		if(!Ext.isEmpty(addr)){
            this.addVisit({
                id: Ext.uniqueId(),
				d: d||'',
                addr: Ext.util.Format.htmlEncode(addr),
                loc: loc||'',
                type: type||''
            });
        }
	},
	
	afterEdit : function(r){
        if(r.isModified(this.getGroupState())){
			this.applyGrouping();
		}
		//workaround WebKit cross-frame date issue
		fixDateMember(r.data, 'd');
		tx.data.VisitStore.superclass.afterEdit.apply(this, arguments);
    },
	
	init : function(){
		this.load({
			callback: function(){
				// first time?
//				if (this.getCount() >= 1) {
//					Ext.Msg.confirm('Delete Visits?', 'Your database currently contains data. Would you like to clear it?', 
//						function(btn){
//							if(btn == 'yes'){
//								this.removeAll();
//							}
//						}, this);
//				}
					
				if(this.getCount() < 1){
					Ext.Msg.confirm('Create Visits?', 'Your database is currently empty. Would you like to insert some demo data?', 
						function(btn){
							if(btn == 'yes'){
								this.loadDemoVisits();	
							}
						}, this);
				}
			},
			scope: this
		});
	},
	
	lookup : function(id){
		var visit;
		if(visit = this.getById(id)){
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
	loadDemoVisits: function(){
		var s = new Date();
		this.addVisit({id: Ext.uniqueId(), addr:'213', loc:'outstation 1', type:'DOG', d: s.add('d', 21)});
		this.addVisit({id: Ext.uniqueId(), addr:'213', loc:'outstation 1', type:'DOG', d:s.add('d', 2)});
		this.addVisit({id: Ext.uniqueId(), addr:'213', loc:'outstation 1', type:'DOG', d:s.add('d', 2)});
		this.addVisit({id: Ext.uniqueId(), addr:'322', loc:'outstation 1', type:'DOG', d:s.add('d', 2)});
		this.addVisit({id: Ext.uniqueId(), addr:'322', loc:'outstation 1', type:'CAT', d:s.add('d', -1)});
		this.addVisit({id: Ext.uniqueId(), addr:'411', loc:'outstation 1', type:'CAT', d:s.add('d', -1)});
		this.addVisit({id: Ext.uniqueId(), addr:'412', loc:'outstation 1', type:'CAT', d:s});
		this.addVisit({id: Ext.uniqueId(), addr:'413', loc:'outstation 2', type:'CAT', d:s});
	}
});