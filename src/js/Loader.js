/**
 * Loader
 * 
 * This class is used to load in all of the required css and javascript,
 * so that we don't have to repeat them on every html page.
 * 
 * If we want to optimise, we could add some smarts here to only load
 * the minimal set required for each page.
 */

var ENABLE_CONSOLE = 0;

var css = [
	'extjs/resources/css/ext-all.css',
	'extjs/air/resources/ext-air.css',
	'css/tarpo.css',
];

var js = [
	'adobe/AIRAliases.js',
	'adobe/AIRIntrospector.js', // this gets filtered depending on ENABLE_CONSOLE
	
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
	'js/SelectBox.js',
	'js/DateTimeField.js',
	'js/ListLoader.js',
	'js/TreePanel/List.js',
	'js/TreeSelector/TreeSelector.js',
	'js/TreeSelector/List.js',
	'js/Form.js',
	'js/WindowManager.js',
	'js/XmlExporter.js',
	'js/CsvExporter.js',
];

document.write(
	css
	.map(function(src){ return '<link rel="stylesheet" type="text/css" href="../' + src + '" />' })
	.join('\n')
);

var debug_re = /AIRIntrospector/;
document.write(
	js
	.filter(function(src){ return ENABLE_CONSOLE || !debug_re.test(src) })
	.map(function(src){ return '<script src="../' + src + '"></script>' })
	.join('\n')
);