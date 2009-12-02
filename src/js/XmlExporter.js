Tarpo.Exporter = function(){
	var lists = Tarpo.Db.query('select * from list');
	
	var doc = new runtime.flash.xml.XMLDocument();
	
	var root = doc.createElement('tarpo');
	doc.appendChild(root);
	
	root.attributes['version'] = '1.0';
	
	for(var i = 0, len = lists.length; i < len; i++){
		var list = lists[i];
		
		var listNode = doc.createElement('list');
		root.appendChild(listNode);
		
		for(var k in list){
			if(list.hasOwnProperty(k)){
				listNode.attributes[k] = String(list[k]);
			}
		}
		
		var visits = Tarpo.Db.queryBy('select * from visit where listId = ?', [list.listId]);
		for(var j = 0, jlen = visits.length; j < jlen; j++){
			var visit = visits[j];
			
			var visitNode = doc.createElement('visit');
			listNode.appendChild(visitNode);
			
			for(var t in visit){
				if(visit.hasOwnProperty(t)){
					visitNode.attributes[t] = String(visit[t]);
				}
			}
		}
		
		var surgeries = Tarpo.Db.queryBy('select * from surg where listId = ?', [list.listId]);
		for(var j = 0, jlen = surgeries.length; j < jlen; j++){
			var surg = surgeries[j];
			
			var surgNode = doc.createElement('surg');
			listNode.appendChild(surgNode);
			
			for(var t in surg){
				if(surg.hasOwnProperty(t)){
					surgNode.attributes[t] = String(surg[t]);
				}
			}
		}
		
		var meds = Tarpo.Db.queryBy('select * from med where listId = ?', [list.listId]);
		for(var j = 0, jlen = meds.length; j < jlen; j++){
			var med = meds[j];
			
			var medNode = doc.createElement('med');
			listNode.appendChild(medNode);
			
			for(var t in med){
				if(med.hasOwnProperty(t)){
					medNode.attributes[t] = String(med[t]);
				}
			}
		}
	}
	
	var file = new air.File(air.File.documentsDirectory.nativePath + air.File.separator + 'tarpo.xml');
	
	file.addEventListener('select', function(e){
		var target = e.target;
		var stream = new air.FileStream();
        stream.open(target, air.FileMode.WRITE);
		stream.writeUTFBytes('<?xml version="1.0" encoding="UTF-8"?>');
        stream.writeUTFBytes(doc.toString());
        stream.close();
	});
	
	// I wonder why no filter for Save As?
	// var filter = new air.FileFilter("Tasks XML File", "*.xml");
	file.browseForSave('Save As');
};
