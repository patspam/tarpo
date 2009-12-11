/**
 * Loader
 * 
 * This class is used to load in all of the required css and javascript,
 * so that we don't have to repeat them on every html page.
 * 
 * If we want to optimise, we could add some smarts here to only load
 * the minimal set required for each page.
 */

(function() {
	
	var DEBUG_MODE = 0;
	
	var js = [
		'adobe/AIRAliases.js',
		
		'extjs/adapter/ext/ext-base.js',
		'extjs/ext-all.js',
		'extjs/air/ext-air.js',
		
		'underscore/underscore-min.js',
		
		'js/Settings.js',
		'js/Util.js',
		'js/Overrides.js',
		
		'js/Db.js',
		'js/Upgrade.js',
		'js/Data.js',
		'js/Actions.js',
		'js/Templates.js',
		'js/DogColours.js',
		
		'js/Report.js',
		'js/Store/Visit.js',
		'js/Store/Surg.js',
		'js/Store/Med.js',
		'js/Store/List.js',
		'js/EditorGridPanel/Visit.js',
		'js/EditorGridPanel/Surg.js',
		'js/EditorGridPanel/Med.js',
		'js/ListLoader.js',
		'js/TreePanel/List.js',
		'js/TreeSelector/TreeSelector.js',
		'js/TreeSelector/List.js',
		'js/WindowManager.js',
		/*
		'js/Form.js',
		*/
		
		'js/XmlExporter.js',
		'js/CsvExporter.js',
	];
	
	// Selectively add the debug console 
	DEBUG_MODE &&  js.push('adobe/AIRIntrospector.js');
	
	// Add the window-specific js file
	var win = htmlLoader.location.replace(/.*?(\w+)\.html?$/i, "$1");
	js.push('js/Window/' + ucfirst(win) + '.js');
	
	function ucfirst(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
	
	//approach1(); // 1.8 sec
	//approach2(); // 4.5 secs
	//approach3(); // 5.4 secs
	
	if (DEBUG_MODE) {
		approach2();
	} else {
		approach1();
	}
	
	/**
	 * Approach 1 - eval files
	 */
	function approach1(){
		var airFS = window.runtime.flash.filesystem;
		function slurp(file){
			if (!file.exists) {
				alert('File not found: ' + file.nativePath);
				return;
			}
			var stream = new airFS.FileStream();
			stream.open(file, airFS.FileMode.READ);
			var text = stream.readUTFBytes(stream.bytesAvailable);
			stream.close();
			return text;
		}
		
		js.forEach(function(src){
			var appDir = airFS.File.applicationDirectory;
			window.eval(slurp(appDir.resolvePath('src/' + src)));
		});
	}
	
	/**
	 * Approach 2 - document.write
	 */
	function approach2(){
	
		// This method can do css too
		// - if using this, use cssTags.concat(jsTags) in document.write()
		/*
		var css = [
	       'extjs/resources/css/ext-all.css',
	       'extjs/air/resources/ext-air.css',
	       'css/tarpo.css',
	    ];
		var cssTags = css.map(function(src){
			return '<link rel="stylesheet" type="text/css" href="../' + src + '" />'
		});
		*/
		var jsTags = js.map(function(src){
			return '<script src="../' + src + '"></script>'
		});
		document.write(jsTags.join("\n"));
	}
	
	/**
	 * Approach 3 - dynamic script creation
	 */
	function approach3(){
		var head = document.getElementsByTagName("head")[0];
		function insertNextScript(){
			var next = js.shift();
			if (!next) {
				air.trace('Finished loading', win);
				return;
			}
			var el = document.createElement("script");
			el.type = 'text/javascript';
			el.src = '../' + next;
			el.onload = insertNextScript;
			head.appendChild(el);
		}
		insertNextScript();
	}
})();
