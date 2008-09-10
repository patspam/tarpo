Ext.air.NativeWindowManager.getVisitWindow = function(visitId){
	var visitId = visitId || 'New';
	var win, winId = 'visit' + visitId;

	if(win = this.get(winId)) {
		win.instance.orderToFront();
	} else {
		win = new Ext.air.NativeWindow({
			id: winId,
			file: 'visit.html?visitId=' + visitId,
			width: 550,
			height:650
		});
	}
	return win;
}

Ext.air.NativeWindowManager.getSurgWindow = function(surgId){
	var surgId = surgId || 'New';
	var win, winId = 'surg' + surgId;

	if(win = this.get(winId)) {
		win.instance.orderToFront();
	} else {
		win = new Ext.air.NativeWindow({
			id: winId,
			file: 'surg.html?surgId=' + surgId,
			width: 550,
			height:550
		});
	}
	return win;
}

Ext.air.NativeWindowManager.getMedWindow = function(medId){
	var medId = medId || 'New';
	var win, winId = 'med' + medId;

	if(win = this.get(winId)) {
		win.instance.orderToFront();
	} else {
		win = new Ext.air.NativeWindow({
			id: winId,
			file: 'med.html?medId=' + medId,
			width: 550,
			height:550
		});
	}
	return win;
}

Ext.air.NativeWindowManager.getAboutWindow = function(){
	var win, winId = 'about';
	if(win = this.get(winId)) {
		win.instance.orderToFront();
	} else {
		win = new Ext.air.NativeWindow({
			id: winId,
			file: 'about.html',
			width:550,
			height:550,
			resizable: false,
            type:'utility'
        });
	}
	return win;
}