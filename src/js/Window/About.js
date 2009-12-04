/**
 * Tarpo.Window.About
 * 
 * The About page displays the license, Tarpo version, AIR version, etc..
 */
Ext.namespace('Tarpo.Window.About');

Tarpo.Window.About.init = function() {
	var na = air.NativeApplication.nativeApplication;
	var appXML = new DOMParser().parseFromString(na.applicationDescriptor, "text/xml");
	var version = appXML.getElementsByTagName('version')[0].firstChild.nodeValue
	var details = [
		'Tarpo Version', version,
		'Air Runtime Version', na.runtimeVersion,
	];
	var detailsString = '';
	for(var i = 0; i < details.length; i += 2) {
		detailsString += details[i] + ": " + details[i+1] + '<br>';
	}
	document.getElementById('about-version').innerHTML = detailsString;
	
	
	var license = air.File.applicationDirectory.resolvePath('LICENSE');
	var stream = new air.FileStream();
	stream.open(license, air.FileMode.READ);
	var text = stream.readUTFBytes(stream.bytesAvailable);
	stream.close();
	document.getElementById('about-license').innerHTML = text;
}