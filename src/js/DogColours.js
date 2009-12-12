/**
 * Tarpo.DogColours
 */
Ext.namespace('Tarpo.DogColours');

Tarpo.DogColours.get = function(){
    var dogColours = Tarpo.Settings.get('dogColours', []);
    if (!Ext.isArray(dogColours)) {
		air.trace('Tarpo.DogColours.get() got a non-array');
        dogColours = [];
    }
    return dogColours;
}

Tarpo.DogColours.set = function(dogColours){
    if (!Ext.isArray(dogColours)) {
        air.trace('Tarpo.DogColours.set expects an array');
        return;
    }
    Tarpo.Settings.set('dogColours', Tarpo.DogColours.filter(dogColours));
}

Tarpo.DogColours.filter = function(dogColours) {
	return uniq(dogColours).filter(function(e){ return e && e.length > 0}).sort();
}

Tarpo.DogColours.getDefaults = function(){
    return ['Black', 'Black/Blue', 'Black/White', 'Black/Tan', 'Blue', 'Blue/Black', 'Blue/White', 'Blue Roan', 'Blue Roan/White', 'Blue Roan/Black', 'Brindle', 'Brindle/White', 'Brown', 'Brown/Black', 'Brown/White', 'Chestnut', 'Chestnut/White', 'Chocolate', 'Chocolate/White', 'Fawn', 'Fawn/White', 'Fawn/Black', 'Ginger', 'Golden', 'Golden/White', 'Liver', 'Liver/White', 'Red', 'Red/Brown', 'Red Roan', 'Red Roan/White', 'Red Roan/Tan', 'Tabby', 'Tan', 'Tan/White', 'Tan/Black', 'Tri', 'Tri/White', 'White', 'White/Black', 'White/Blue', 'White/Brindle', 'White/Brown', 'White/Fawn', 'White/Tan', 'White/Tri'];
}

function uniq(list) {
	var seen = {};
	return list.filter(function(item){
		if (seen[item] != 1) {
			seen[item] = 1;
			return true;
		}
	});
}
