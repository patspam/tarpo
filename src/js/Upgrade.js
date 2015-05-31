/**
 * Tarpo database files know what version of Tarpo they were
 * created with. This class detects if the open file needs
 * to be upgraded, and figures out what upgrades to run.
 *
 * Upgrades are functions of this class named, e.g. '1.0.2', '1.1.0' etc..
 *
 * Tarpo will automatically run patch-level upgrades, then minor upgrades,
 * and finally major upgrades in order. It is assumed that there are no
 * shunt upgrades (e.g. all upgrades are run sequentially).
 *
 * To create a new upgrade, add a new function at the end of this file,
 * and remember to bump the version number in application.xml
 */

Ext.namespace('Tarpo.Upgrade');

/**
 * Returns the version number of the currently open database
 */
Tarpo.Upgrade.getDbVersion = function() {
  var dbVersion = Tarpo.Db.query('select version from version order by d desc limit 1');
  if (dbVersion.length == 0) {
    // Assume that this is a newly created db (from skeleton.tarpo), so set the inital
    // row in the version table
    Tarpo.trace('Setting initial version row');
    Tarpo.Upgrade.setVersion(Tarpo.Util.getVersion(), 'New');
    return Tarpo.Util.getVersion();
  }
  return dbVersion[0].version;
}

/**
 * Returns true if the currently open database has a version number less than
 * the Tarpo version number
 */
Tarpo.Upgrade.dbNeedsUpgrade = function() {
  return Tarpo.Upgrade.cmp(Tarpo.Upgrade.getDbVersion(), Tarpo.Util.getVersion()) < 0;
}

/**
 * Returns true if Tarpo's version number is less than the currently opened db
 * connection version number
 */
Tarpo.Upgrade.tarpoNeedsUpgrade = function() {
  return Tarpo.Upgrade.cmp(Tarpo.Upgrade.getDbVersion(), Tarpo.Util.getVersion()) > 0;
}

/**
 * Finds and runs all upgrades (recursively)
 */
Tarpo.Upgrade.run = function() {
  if (!Tarpo.Upgrade.dbNeedsUpgrade()) {
    air.trace('Database is now up to date');
    return;
  }

  var dbVersion = Tarpo.Upgrade.parseVersionString(Tarpo.Upgrade.getDbVersion());
  var upgrades = [
    dbVersion.major + '.' + dbVersion.minor + '.' + (dbVersion.patch + 1),
    dbVersion.major + '.' + (dbVersion.minor + 1) + '.0',
    (dbVersion.major + 1) + '.0.0',
  ];

  // Try upgrades in order of patch, minor, major
  for (var i = 0; i < upgrades.length; i++) {
    var upFnName = upgrades[i];
    var upFn = Tarpo.Upgrade[upFnName];
    if (upFn) {
      air.trace('Running upgrade', upFnName);
      upFn(); // Should throw exception on failure
      air.trace('Upgrade successful, setting version..');
      Tarpo.Upgrade.setVersion(upFnName, 'Upgrade');
      return Tarpo.Upgrade.run();
    }
  }
  throw "No suitable upgrade found";
}

/**
 * Compares two version strings, assumed to be of the form major.minor.patch
 */
Tarpo.Upgrade.cmp = function(x, y) {
  x = Tarpo.Upgrade.parseVersionString(x);
  y = Tarpo.Upgrade.parseVersionString(y);

  if (x.major < y.major) {
    return -1;
  }
  if (x.major > y.major) {
    return 1;
  }

  // same major number..

  if (x.minor < y.minor) {
    return -1;
  }
  if (x.minor > y.minor) {
    return 1;
  }

  // same minor number..

  if (x.patch < y.patch) {
    return -1;
  }
  if (x.patch > y.patch) {
    return 1;
  }

  // identical
  return 0;
}

/**
 * Parses a version string of the form: major.minor.patch
 */
Tarpo.Upgrade.parseVersionString = function(v) {
  if (typeof(v) != 'string') { throw 'Invalid version string: ' + v }
  v = v.split('.');
  return {
    major: parseInt(v[0]) || 0,
    minor: parseInt(v[1]) || 0,
    patch: parseInt(v[2]) || 0,
  };
}

/**
 * Performs sanity checks on a (presumably newly opened) database connection.
 * This is typically run prior to attempting upgrades (in case the user
 * opens a non-Tarpo sqlite file)
 */
Tarpo.Upgrade.sanityCheck = function() {

  // Check version information
  var schema = Tarpo.Db.getSchema();
  if (!schema.tables.some(function(t){ return t.name == 'version' })) {
    var proceed = confirm('Version table not found, can I create it?');
    if (proceed) {
      air.trace('Creating version table');
      Tarpo.Db.createTable({
        name: 'version',
        key: 'version',
        fields: [{
          name: 'version',
        }, {
          name: 'description',
          allowNull: false,
        }, {
          name: 'd',
          allowNull: false,
          unique: true,
        }]
      });
      Tarpo.Upgrade.setVersion(Tarpo.Util.getVersion(), 'New');
    }
    else {
      throw 'Chose not to create version table';
    }
  }
  return true;
};

/**
 * Adds a new row to the version table in the database, indicating
 * that the database has been upgraded to this version.
 *
 * The description parameter is either "New" or "Upgrade"
 */
Tarpo.Upgrade.setVersion = function (version, description) {
  Tarpo.Db.getTable('version', 'version').insert({
    version: version,
    description: description,
    d: new Date().getTime().toString(),
  });
}

Tarpo.Upgrade['1.0.3'] = function(){
  Tarpo.DogColours.set(Tarpo.DogColours.getDefaults());
  Tarpo.DogBreeds.set(Tarpo.DogBreeds.getDefaults());
}

Tarpo.Upgrade['1.0.4'] = function(){
  // migrate surg.tvt from text to bool
  Tarpo.Db.execBy('update surg set tvt=1 where tvt=? or tvt=?', ['Penile', 'Vaginal'] );
  Tarpo.Db.execBy('update surg set tvt=0 where tvt != ?', [1] );

  // Sqlite doesn't support full ALTER TABLE, so we need to delete surg and recreate to
  // change tvt column type
  Tarpo.Db.exec('CREATE TEMPORARY TABLE surg_temp( \n\
        id TEXT NOT NULL PRIMARY KEY, \n\
        listId TEXT, \n\
        d TEXT, \n\
        loc TEXT, \n\
        house TEXT, \n\
        \n\
        balanda INTEGER, \n\
        charge TEXT, \n\
        owner TEXT, \n\
        domicile TEXT, \n\
        \n\
        type TEXT, \n\
        mc TEXT, \n\
        name TEXT, \n\
        breed TEXT, \n\
        colour TEXT, \n\
        sex TEXT, \n\
        desexed INTEGER, \n\
        bcs TEXT, \n\
        mange TEXT, \n\
        \n\
        desex TEXT, \n\
        other_procedures TEXT, \n\
        tvt TEXT, \n\
        vacc INTEGER, \n\
        details TEXT \n\
        )');
  Tarpo.Db.exec('INSERT INTO surg_temp SELECT * FROM surg');
  Tarpo.Db.exec('DROP TABLE surg');
  Tarpo.Db.exec('CREATE TABLE surg ( \n\
        id TEXT NOT NULL PRIMARY KEY, \n\
        listId TEXT, \n\
        d TEXT, \n\
        loc TEXT, \n\
        house TEXT, \n\
        \n\
        balanda INTEGER, \n\
        charge TEXT, \n\
        owner TEXT, \n\
        domicile TEXT, \n\
        \n\
        type TEXT, \n\
        mc TEXT, \n\
        name TEXT, \n\
        breed TEXT, \n\
        colour TEXT, \n\
        sex TEXT, \n\
        desexed INTEGER, \n\
        bcs TEXT, \n\
        mange TEXT, \n\
        \n\
        desex TEXT, \n\
        other_procedures TEXT, \n\
        tvt INTEGER, \n\
        vacc INTEGER, \n\
        details TEXT \n\
        )');
  Tarpo.Db.exec('INSERT INTO surg SELECT * FROM surg_temp');
  Tarpo.Db.exec('DROP TABLE surg_temp');
}

Tarpo.Upgrade['1.0.5'] = function(){}
Tarpo.Upgrade['1.0.6'] = function(){}
Tarpo.Upgrade['1.0.7'] = function(){}
Tarpo.Upgrade['1.0.8'] = function(){}
Tarpo.Upgrade['1.0.9'] = function(){}
Tarpo.Upgrade['1.0.10'] = function(){}
Tarpo.Upgrade['1.0.11'] = function(){}
