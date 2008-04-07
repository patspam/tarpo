// In AIR, XTemplates must be created at load time
Templates = {
	simpleCombo: new Ext.XTemplate(
		'<tpl for="."><div class="x-combo-list-item">{singleField}</div></tpl>'
	)
};

Date.precompileFormats('D d/m/Y');