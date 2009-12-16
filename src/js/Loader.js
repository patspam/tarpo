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
	var TARPO_DEBUG_MODE = true;
	
	var js = [
		'adobe/AIRAliases.js',
		// AIRIntrospector gets conditionally spliced in here (at index 1) 
		
		'extjs/adapter/ext/ext-base.js',
		'extjs/ext-all.js',
		'extjs/air/ext-air.js',
		
		'js/Settings.js',
		'js/Util.js',
		'js/Overrides.js',
		
		'js/Db.js',
		'js/Upgrade.js',
		'js/Data.js',
		'js/Actions.js',
		'js/Templates.js',
		'js/DogColours.js',
		'js/DogBreeds.js',
		
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
		
		'js/Form.js',
		
		'js/Export/XML.js',
		'js/Export/CSV.js',
	];
	
	// Selectively add the debug console 
	TARPO_DEBUG_MODE && js.splice(1,0,'adobe/AIRIntrospector.js');
	
	function ucfirst(str) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
	
	// Add the window-specific js file
	var win = window.location.pathname.replace(/.*?(\w+)\.html?$/i, "$1");
	js.push('js/Window/' + ucfirst(win) + '.js');
	
	//approach1(); // 1.8 sec
	//approach2(); // 4.5 secs
	//approach3(); // 5.4 secs
	
	if (TARPO_DEBUG_MODE) {
		
		// In debug mode we need per-file diagnostics
		approach2();
	} else {
		
		// In production mode we want the fastest approach
		approach1();
	}
	
	/**
	 * Approach 1 - eval files
	 */
	function approach1(){
		var airFS = runtime.flash.filesystem;
		
		function slurp(file){
			if (!file.exists) {
				runtime.trace('File not found: ' + file.nativePath);
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
	 * (can do css too)
	 */
	function approach2(){
		document.write(
			js
			.map(function(src){ return '<script src="../' + src + '"></script>' })
			.join("\n")
		);
	}
	
	/**
	 * Approach 3 - dynamic script creation
	 * Needs event-triggered sequential insertion for deterministic script execution order
	 */
	function approach3(){
		var head = document.getElementsByTagName("head")[0];
		function insertScript(){
			var next = js.shift();
			if (next) {
				var el = document.createElement("script");
				el.type = 'text/javascript';
				el.src = '../' + next;
				el.onload = insertScript;
				head.appendChild(el);
			};
		}
		insertScript();
	}
})();
