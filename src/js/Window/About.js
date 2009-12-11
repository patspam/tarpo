/**
 * Tarpo.Window.About
 * 
 * The About page displays the license, Tarpo version, AIR version, etc..
 */
Ext.namespace('Tarpo.Window.About');

/**
 * Builds the dynamic elements on the About page.
 */
Tarpo.Window.About.init = function() {
	// Figure out the current Tarpo and AIR version numbers
	var details = [
		'Tarpo Version', Tarpo.Util.getVersion(),
		'Air Runtime Version', air.NativeApplication.nativeApplication.runtimeVersion,
	];
	var detailsString = '';
	for(var i = 0; i < details.length; i += 2) {
		detailsString += details[i] + ": " + details[i+1] + '<br>';
	}
	document.getElementById('about-version').innerHTML = detailsString;
	
	// Pull in the contents of the LICENSE file
	var license = air.File.applicationDirectory.resolvePath('LICENSE');
	var stream = new air.FileStream();
	stream.open(license, air.FileMode.READ);
	var text = stream.readUTFBytes(stream.bytesAvailable);
	stream.close();
	document.getElementById('about-license').innerHTML = text;
}

Tarpo.Window.About.init();
