Ext.namespace('Tarpo.Report');

// single col, single result
Tarpo.Report.querySingle = function(sql){
    // This is hacky and should be fixed
    var instance = Ext.sql.Connection.getInstance();
    instance.open(Tarpo.Config.DB_FILENAME);
    
    var result = instance.query(sql)[0];
    var results = new Array();
    for (p in result) {
        return result[p]; // return first
    }
}

Tarpo.Report.getChildren = function(listId){
    if (Tarpo.Report.querySingle('select isFolder from list where listId = "' + listId + '"') == 0) {
        return ['"' + listId + '"'];
    }
    else {
        var cs = Tarpo.Data.getConnection().queryBy('select listId from list where parentId = "' + listId + '"');
        var l = [];
        for (var i = 0; i < cs.length; i++) {
            var c = cs[i]['listId'];
            l = l.concat(Tarpo.Report.getChildren(c));
        }
        return l;
    }
}

Tarpo.Report.show = function(listId){
    var xF, filter_for;
    if (listId && typeof listId === 'string') {
        if (querySingle('select isFolder from list where listId = "' + listId + '"') == 1) {
            var children = Tarpo.Report.getChildren(listId);
            if (children) {
                children = children.join(',');
                xF = ' AND listId in (' + children + ')';
                filter_for = 'Data In Folder "' + Tarpo.store.list.getName(listId) + '"';
            }
        }
        else {
            xF = ' AND listId="' + listId + '"';
            filter_for = 'Data In List "' + Tarpo.store.list.getName(listId) + '"';
        }
    }
    else {
        xF = '';
        filter_for = 'All Tarpo Data';
    }
    
    var houses_with_dogs = Tarpo.Report.querySingle('select count(distinct house) from visit where type="Dog"' + xF);
    var dogs = Tarpo.Report.querySingle('select count(*) from visit where type="Dog"' + xF);
    
    var report_data = {
        houses: Tarpo.Report.querySingle('select count(distinct house) from visit where 1' + xF),
        houses_with_dogs: houses_with_dogs,
        dogs: dogs,
        cats: Tarpo.Report.querySingle('select count(*) from visit where type="Cat"' + xF),
        puppies: Tarpo.Report.querySingle('select count(*) from visit where type="Puppy"' + xF),
        kittens: Tarpo.Report.querySingle('select count(*) from visit where type="Kitten"' + xF),
        pigs: Tarpo.Report.querySingle('select count(*) from visit where type="Pig"' + xF),
        other: Tarpo.Report.querySingle('select count(*) from visit where type="Other"' + xF),
        ivermectin: Tarpo.Report.querySingle('select count(*) from visit where ivermectin=1' + xF),
        covinan: Tarpo.Report.querySingle('select count(*) from visit where covinan=1' + xF),
        
        avg_bcs: Tarpo.Util.sigFigs(Tarpo.Report.querySingle('select avg(bcs) from visit where type="Dog"' + xF)),
        avg_mange: Tarpo.Util.sigFigs(Tarpo.Report.querySingle('select avg(mange) from visit where type="Dog"' + xF)),
        avg_dogs_per_house: Tarpo.Util.sigFigs(dogs / houses_with_dogs),
        
        surgical_cases: Tarpo.Report.querySingle('select count(*) from surg where 1' + xF),
        speys: Tarpo.Report.querySingle('select count(*) from surg where desex="Spey"' + xF),
        castrations: Tarpo.Report.querySingle('select count(*) from surg where desex="Castrate"' + xF),
        other_procedures: Tarpo.Report.querySingle('select count(*) from surg where other_procedures = 1' + xF),
        penile_tvt: Tarpo.Report.querySingle('select count(*) from surg where tvt="Penile"' + xF),
        vaginal_tvt: Tarpo.Report.querySingle('select count(*) from surg where tvt="Vaginal"' + xF),
        surgical_vaccinations: Tarpo.Report.querySingle('select count(*) from surg where vacc=1' + xF),
        
        medical_cases: Tarpo.Report.querySingle('select count(*) from med where 1' + xF),
        fight_wounds: Tarpo.Report.querySingle('select count(*) from med where reason="Fight Wound"' + xF),
        hunting_wounds: Tarpo.Report.querySingle('select count(*) from med where reason="Hunting Wound"' + xF),
        car_accidents: Tarpo.Report.querySingle('select count(*) from med where reason="Car Accident"' + xF),
        other_reasons: Tarpo.Report.querySingle('select count(*) from med where reason="Other"' + xF),
        medical_vaccinations: Tarpo.Report.querySingle('select count(*) from med where vacc=1' + xF),
        
        euth_unwanted: Tarpo.Report.querySingle('select count(*) from med where euth="Unwanted"' + xF),
        euth_humane: Tarpo.Report.querySingle('select count(*) from med where euth="Humane"' + xF),
        euth_cheeky: Tarpo.Report.querySingle('select count(*) from med where euth="Cheeky"' + xF),
    };
    
    Ext.Msg.show({
        title: 'Report: ' + filter_for,
        msg: Tarpo.Templates.report.apply(report_data),
        minWidth: 400,
    });
};
