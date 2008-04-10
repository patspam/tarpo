// In AIR, XTemplates must be created at load time
Templates = {
	simpleCombo: new Ext.XTemplate(
		'<tpl for="."><div class="x-combo-list-item">{singleField}</div></tpl>'
	)
};

Date.precompileFormats('D d/m/Y');

Templates.report = new Ext.XTemplate(
'<div class="report">',

	'<H2>House Visits</H2>',
	
	'<H3>Totals</H3>',
	'<dl>',
		'<dt>Houses</dt><dd>{houses}</dd>',
		'<dt>Houses with dogs</dt><dd>{houses_with_dogs}</dd>',
		'<dt>Dogs</dt><dd>{dogs}</dd>',
		'<dt>Cats</dt><dd>{cats}</dd>',
		'<dt>Puppies</dt><dd>{puppies}</dd>',
		'<dt>Kittens</dt><dd>{kittens}</dd>',
		'<dt>Pigs</dt><dd>{pigs}</dd>',
		'<dt>Other</dt><dd>{other}</dd>',
		'<dt>Covinan</dt><dd>{covinan}</dd>',
	'</dl>',
		
	'<H3>Averages</H3>',
	'<dl>',
		'<dt>BCS</dt><dd>{avg_bcs}</dd>',
		'<dt>Mange</dt><dd>{avg_mange}</dd>',
		'<dt>Dogs per dog-owning house</dt><dd>{avg_dogs_per_house}</dd>',
	'</dl>',
	
	'<H2>Surgery</H2>',
	
	'<H3>Totals</H3>',
	'<dl>',
		'<dt>Speys</dt><dd>{speys}</dd>',
		'<dt>Castrations</dt><dd>{castrations}</dd>',
		'<dt>Other Procedures</dt><dd>{other_procedures}</dd>',
	'</dl>',
	
	'<H2>Medical</H2>',
	
	'<H3>Totals</H3>',
	'<dl>',
		'<dt>Cases</dt><dd>{cases}</dd>',
		'<dt>Fight Wounds</dt><dd>{fight_wounds}</dd>',
		'<dt>Car Accidents</dt><dd>{car_accidents}</dd>',
		'<dt>Other</dt><dd>{other_medical}</dd>',
	'</dl>',
	
	'<H3>Euth</H3>',
	'<dl>',
		'<dt>Unwanted</dt><dd>{euth_unwanted}</dd>',
		'<dt>Humane Grounds</dt><dd>{euth_humane}</dd>',
		'<dt>Cheeky</dt><dd>{euth_cheeky}</dd>',
	'</dl>',

'</div>'

);