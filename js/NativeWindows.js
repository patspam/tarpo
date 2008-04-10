Ext.air.NativeWindowManager.getVisitWindow = function(visitId){
	visitId = visitId || 'New';
	var win, winId = 'visit' + visitId;

	if(win = this.get(winId)) {
		win.instance.orderToFront();
	} else {
		win = new Ext.air.NativeWindow({
			id: winId,
			file: 'visit.html?visitId=' + visitId,
			width: 500,
			height:650
		});
	}
	return win;
}

Ext.air.NativeWindowManager.getSurgWindow = function(surgId){
	surgId = surgId || 'New';
	var win, winId = 'surg' + surgId;

	if(win = this.get(winId)) {
		win.instance.orderToFront();
	} else {
		win = new Ext.air.NativeWindow({
			id: winId,
			file: 'surg.html?surgId=' + surgId,
			width: 500,
			height:650
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
			width:350,
			height:300,
			resizable: false,
            type:'utility'
        });
	}
	return win;
}