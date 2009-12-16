/**
 * Export Tarpo data to CSV
 * 
 * The user exports data via the list/folder context menu
 */
Ext.namespace('Tarpo.Export.CSV');

/**
 * This is a very bad, broken, csv encoder
 */
Tarpo.Export.CSV.encode = function(k){
    var s = String(k);
    s = s.replace(/\n/g, ' ');
    s = s.replace(/"/g, '\\"');
    return '"' + s + '"';
}

Tarpo.Export.CSV.generate = function(name, listId){
    var xF;
    if (listId) {
        if (Tarpo.Db.queryScalar('select isFolder from list where listId = ?', [listId]) == 1) {
            var children = Tarpo.Report.getChildren(listId) || [];
            xF = ' AND ' + name + '.listId in (' + children.join(',') + ')';
        }
        else {
            xF = ' AND ' + name + '.listId = "' + listId + '"';
        }
    }
    
    var things = Tarpo.Db.queryBy('select ' + name + '.*, list.listName from ' + name + ', list where ' + name + '.listId = list.listId' + xF);
    
    // Heading row
    var headings = [];
    var thing = things[0];
    for (var k in thing) {
        if (thing.hasOwnProperty(k)) {
            headings.push(Tarpo.Export.CSV.encode(k));
        }
    }
    
    // Start with the heading
    var csv = headings.join(',') + "\n";
    
    // Then build up the body
    things.forEach(function(thing){
        var attrs = [];
        for (var k in thing) {
            if (thing.hasOwnProperty(k)) {
                attrs.push(Tarpo.Export.CSV.encode(thing[k]));
            }
        }
        csv += attrs.join(',') + "\n";
    });
    
    // Trigger the Save-As dialog
    var file = new air.File(air.File.documentsDirectory.nativePath + air.File.separator + 'tarpo-' + name + '.csv');
    file.addEventListener('select', function(e){
        var target = e.target;
        var stream = new air.FileStream();
        stream.open(target, air.FileMode.WRITE);
        stream.writeUTFBytes(csv);
        stream.close();
    });
    file.browseForSave('Save As');
};

Tarpo.Export.CSV.Visit = function(listId){
    Tarpo.Export.CSV.generate('visit', listId)
};
Tarpo.Export.CSV.Med = function(listId){
    Tarpo.Export.CSV.generate('med', listId)
};
Tarpo.Export.CSV.Surg = function(listId){
    Tarpo.Export.CSV.generate('surg', listId)
};
