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
	'<dl>',
		'<dt>Houses</dt><dd>{houses}</dd>',
		'<dt>Houses with dogs</dt><dd>{houses_with_dogs}</dd>',
		'<dt>Dogs</dt><dd>{dogs}</dd>',
		'<dt>Cats</dt><dd>{cats}</dd>',
		'<dt>Puppies</dt><dd>{puppies}</dd>',
		'<dt>Kittens</dt><dd>{kittens}</dd>',
		'<dt>Pigs</dt><dd>{pigs}</dd>',
		'<dt>Other</dt><dd>{other}</dd>',
		'<dt>Ivermectin</dt><dd>{ivermectin}</dd>',
		'<dt>Covinan</dt><dd>{covinan}</dd>',
		'<dt>Average BCS</dt><dd>{avg_bcs}</dd>',
		'<dt>Average Mange</dt><dd>{avg_mange}</dd>',
		'<dt>Average Dogs per dog-owning house</dt><dd>{avg_dogs_per_house}</dd>',
	'</dl>',
	
	'<H2>Surgical Cases</H2>',
	'<dl>',
		'<dt>Total Cases</dt><dd>{surgical_cases}</dd>',
		'<dt>Speys</dt><dd>{speys}</dd>',
		'<dt>Castrations</dt><dd>{castrations}</dd>',
		'<dt>Other Procedures</dt><dd>{other_procedures}</dd>',
		'<dt>Penile TVT</dt><dd>{penile_tvt}</dd>',
		'<dt>Vaginal TVT</dt><dd>{vaginal_tvt}</dd>',
		'<dt>Vaccinations</dt><dd>{surgical_vaccinations}</dd>',		
	'</dl>',
	
	'<H2>Medical Cases</H2>',
	'<dl>',
		'<dt>Total Cases</dt><dd>{medical_cases}</dd>',
		'<dt>Fight Wounds</dt><dd>{fight_wounds}</dd>',
		'<dt>Hunting Wounds</dt><dd>{hunting_wounds}</dd>',
		'<dt>Car Accidents</dt><dd>{car_accidents}</dd>',
		'<dt>Other Reasons</dt><dd>{other_reasons}</dd>',
		'<dt>Vaccinations</dt><dd>{medical_vaccinations}</dd>',		
	'</dl>',
	
	'<H3>Euthanasia</H3>',
	'<dl>',
		'<dt>Unwanted</dt><dd>{euth_unwanted}</dd>',
		'<dt>Humane Grounds</dt><dd>{euth_humane}</dd>',
		'<dt>Cheeky</dt><dd>{euth_cheeky}</dd>',
	'</dl>',

'</div>'

);