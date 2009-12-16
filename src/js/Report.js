Ext.namespace('Tarpo.Report');

Tarpo.Report.getChildren = function(listId){
    if (Tarpo.Db.queryScalar('select isFolder from list where listId = "' + listId + '"') == 0) {
        return ['"' + listId + '"'];
    }
    else {
        var cs = Tarpo.Db.queryBy('select listId from list where parentId = "' + listId + '"');
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
    
    var houses_with_dogs = Tarpo.Db.queryScalar('select count(distinct house) from visit where type="Dog"' + xF);
    var dogs = Tarpo.Db.queryScalar('select count(*) from visit where type="Dog"' + xF);
    
    var report_data = {
        houses: Tarpo.Db.queryScalar('select count(distinct house) from visit where 1' + xF),
        houses_with_dogs: houses_with_dogs,
        dogs: dogs,
        cats: Tarpo.Db.queryScalar('select count(*) from visit where type="Cat"' + xF),
        puppies: Tarpo.Db.queryScalar('select count(*) from visit where type="Puppy"' + xF),
        kittens: Tarpo.Db.queryScalar('select count(*) from visit where type="Kitten"' + xF),
        pigs: Tarpo.Db.queryScalar('select count(*) from visit where type="Pig"' + xF),
        other: Tarpo.Db.queryScalar('select count(*) from visit where type="Other"' + xF),
        ivermectin: Tarpo.Db.queryScalar('select count(*) from visit where ivermectin=1' + xF),
        covinan: Tarpo.Db.queryScalar('select count(*) from visit where covinan=1' + xF),
        
        avg_bcs: Tarpo.Util.sigFigs(Tarpo.Db.queryScalar('select avg(bcs) from visit where type="Dog"' + xF)),
        avg_mange: Tarpo.Util.sigFigs(Tarpo.Db.queryScalar('select avg(mange) from visit where type="Dog"' + xF)),
        avg_dogs_per_house: Tarpo.Util.sigFigs(dogs / houses_with_dogs),
        
        surgical_cases: Tarpo.Db.queryScalar('select count(*) from surg where 1' + xF),
        speys: Tarpo.Db.queryScalar('select count(*) from surg where desex="Spey"' + xF),
        castrations: Tarpo.Db.queryScalar('select count(*) from surg where desex="Castrate"' + xF),
        other_procedures: Tarpo.Db.queryScalar('select count(*) from surg where other_procedures = 1' + xF),
        penile_tvt: Tarpo.Db.queryScalar('select count(*) from surg where tvt="Penile"' + xF),
        vaginal_tvt: Tarpo.Db.queryScalar('select count(*) from surg where tvt="Vaginal"' + xF),
        surgical_vaccinations: Tarpo.Db.queryScalar('select count(*) from surg where vacc=1' + xF),
        
        medical_cases: Tarpo.Db.queryScalar('select count(*) from med where 1' + xF),
        fight_wounds: Tarpo.Db.queryScalar('select count(*) from med where reason="Fight Wound"' + xF),
        hunting_wounds: Tarpo.Db.queryScalar('select count(*) from med where reason="Hunting Wound"' + xF),
        car_accidents: Tarpo.Db.queryScalar('select count(*) from med where reason="Car Accident"' + xF),
        other_reasons: Tarpo.Db.queryScalar('select count(*) from med where reason="Other"' + xF),
        medical_vaccinations: Tarpo.Db.queryScalar('select count(*) from med where vacc=1' + xF),
        
        euth_unwanted: Tarpo.Db.queryScalar('select count(*) from med where euth="Unwanted"' + xF),
        euth_humane: Tarpo.Db.queryScalar('select count(*) from med where euth="Humane"' + xF),
        euth_cheeky: Tarpo.Db.queryScalar('select count(*) from med where euth="Cheeky"' + xF),
    };
    
    Ext.Msg.show({
        title: 'Report: ' + filter_for,
        msg: Tarpo.Templates.report.apply(report_data),
        minWidth: 400,
    });
};
