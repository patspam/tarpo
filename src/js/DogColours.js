/**
 * Tarpo.DogColours
 */
Ext.namespace('Tarpo.DogColours');

Tarpo.DogColours.get = function() {
	var dogColours = Tarpo.Settings.get('dogColours', []);
	if (!Ext.isArray) {
		dogColours = [];
	}
	return dogColours;
}

Tarpo.DogColours.set = function(array) {
	if (!Ext.isArray) {
		air.trace('Tarpo.DogColours.set expects an array');
		return;
	}
	Tarpo.Settings.set('dogColours', _(array).uniq().sort());
}