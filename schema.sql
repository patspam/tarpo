CREATE TABLE list (
	listId TEXT NOT NULL PRIMARY KEY,
	parentId TEXT,
	listName TEXT,
	isFolder INTEGER
);
CREATE TABLE task (
	taskId TEXT NOT NULL PRIMARY KEY,
	listId TEXT,
	title TEXT,
	description TEXT,
	dueDate TEXT,
	completed INTEGER,
	completedDate TEXT,
	reminder TEXT
);
CREATE TABLE visit (
	id TEXT NOT NULL PRIMARY KEY,
	
	d TEXT,
	addr TEXT,
	loc TEXT,
	type TEXT,
	
	name TEXT,
	colour TEXT,
	sex TEXT,
	desexed INTEGER,
	bcs TEXT,
	mange TEXT,
	ticks TEXT,
	fleas TEXT,
	covinan INTEGER,
	tvt INTEGER,
	comments TEXT
);
CREATE TABLE surg (
	id TEXT NOT NULL PRIMARY KEY,
	
	d TEXT,
	a_id TEXT,
	a_name TEXT,
	o_balanda INTEGER,
	o_name TEXT,
	o_addr TEXT,
	o_loc TEXT,
	loc TEXT,
	type TEXT,
	colour TEXT,
	sex TEXT,
	bcs TEXT,
	mange TEXT,
	charge TEXT,
	
	spey INTEGER,
	castration INTEGER,
	euth INTEGER,
	vacc INTEGER,
	other_procedures TEXT,
	
	history TEXT,
	clinical TEXT,
	diagnosis TEXT,
	
	comments TEXT
);