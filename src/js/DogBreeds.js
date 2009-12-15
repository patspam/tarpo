/**
 * Tarpo.DogBreeds
 */
Ext.namespace('Tarpo.DogBreeds');

Tarpo.DogBreeds.get = function(){
    var dogBreeds = Tarpo.Settings.get('dogBreeds', []);
    if (!Ext.isArray(dogBreeds)) {
		air.trace('Tarpo.DogBreeds.get() got a non-array');
        dogBreeds = [];
    }
    return dogBreeds;
}

Tarpo.DogBreeds.set = function(dogBreeds){
    if (!Ext.isArray(dogBreeds)) {
        air.trace('Tarpo.DogBreeds.set expects an array');
        return;
    }
    Tarpo.Settings.set('dogBreeds', Tarpo.DogBreeds.filter(dogBreeds));
}

Tarpo.DogBreeds.filter = function(dogBreeds) {
	return Tarpo.Util.uniq(dogBreeds).filter(function(e){ return e && e.length > 0}).sort();
}

Tarpo.DogBreeds.getDefaults = function(){
    return ['Camp Dog', 'Boxer', 'Staffie', 'Dingo', 'Irish Wolfhound X', 'DSH', 'DLH', 'Pit Bull', 'Mastiff X', 'Labrador', 'Golder Retriever', 'German Shephers', 'Rottweiler', 'Jack Russell', 'Ridgeback', 'Kelpie', 'Border Collie', 'Blue Heeler', 'Red Heeler', 'GSP', 'Shar Pei X', 'Pig Dog Crossbreed', 'Small crossbreed', 'Bull Arab', 'Shitzu' ];
}
