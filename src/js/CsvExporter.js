Tarpo.VisitCsvExporter = function(){
	function filter(k){
		var s = String(k);
		s = s.replace(/\n/g, ' ');
		s = s.replace(/"/g, '\\"');
		return '"' + s + '"';
	}
	
	var csv = '';
	
	var visits = Tarpo.Db.queryBy('select visit.*, list.listName from visit, list where visit.listId = list.listId');
	
	// Heading row
	var atts = [];
	var visit = visits[0];
	for(var k in visit){
		if(visit.hasOwnProperty(k)){
			atts.push(filter(k));
		}
	}
	csv += atts.join(',');
	csv += "\n";
		
	for(var i = 0, len = visits.length; i < len; i++){
		var visit = visits[i];
		
		var atts = [];
		for(var k in visit){
			if(visit.hasOwnProperty(k)){
				atts.push(filter(visit[k]));
			}
		}
		csv += atts.join(',');
		csv += "\n";
	}
	
	var file = new air.File(air.File.documentsDirectory.nativePath + air.File.separator + 'tarpo-house-visits.csv');
	
	file.addEventListener('select', function(e){
		var target = e.target;
		var stream = new air.FileStream();
        stream.open(target, air.FileMode.WRITE);
        stream.writeUTFBytes(csv);
        stream.close();
	});
	
	file.browseForSave('Save As');
};

Tarpo.SurgCsvExporter = function(){
	function filter(k){
		var s = String(k);
		s = s.replace(/\n/g, ' ');
		s = s.replace(/"/g, '\\"');
		return '"' + s + '"';
	}
	
	var csv = '';
	
	var surgeries = Tarpo.Db.queryBy('select surg.*, list.listName from surg, list where surg.listId = list.listId');
	
	// Heading row
	var atts = [];
	var surg = surgeries[0];
	for(var k in surg){
		if(surg.hasOwnProperty(k)){
			atts.push(filter(k));
		}
	}
	csv += atts.join(',');
	csv += "\n";
		
	for(var i = 0, len = surgeries.length; i < len; i++){
		var surg = surgeries[i];
		
		var atts = [];
		for(var k in surg){
			if(surg.hasOwnProperty(k)){
				atts.push(filter(surg[k]));
			}
		}
		csv += atts.join(',');
		csv += "\n";
	}
	
	var file = new air.File(air.File.documentsDirectory.nativePath + air.File.separator + 'tarpo-surgical-cases.csv');
	
	file.addEventListener('select', function(e){
		var target = e.target;
		var stream = new air.FileStream();
        stream.open(target, air.FileMode.WRITE);
        stream.writeUTFBytes(csv);
        stream.close();
	});
	
	file.browseForSave('Save As');
};

Tarpo.MedCsvExporter = function(){
	function filter(k){
		var s = String(k);
		s = s.replace(/\n/g, ' ');
		s = s.replace(/"/g, '\\"');
		return '"' + s + '"';
	}
	
	var csv = '';
	
	var meds = Tarpo.Db.queryBy('select med.*, list.listName from med, list where med.listId = list.listId');
	
	// Heading row
	var atts = [];
	var med = meds[0];
	for(var k in med){
		if(med.hasOwnProperty(k)){
			atts.push(filter(k));
		}
	}
	csv += atts.join(',');
	csv += "\n";
		
	for(var i = 0, len = meds.length; i < len; i++){
		var med = meds[i];
		
		var atts = [];
		for(var k in med){
			if(med.hasOwnProperty(k)){
				atts.push(filter(med[k]));
			}
		}
		csv += atts.join(',');
		csv += "\n";
	}
	
	var file = new air.File(air.File.documentsDirectory.nativePath + air.File.separator + 'tarpo-medical-cases.csv');
	
	file.addEventListener('select', function(e){
		var target = e.target;
		var stream = new air.FileStream();
        stream.open(target, air.FileMode.WRITE);
        stream.writeUTFBytes(csv);
        stream.close();
	});
	
	file.browseForSave('Save As');
};