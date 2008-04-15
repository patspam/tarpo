delete from list;
delete from visit;
delete from surg;
delete from med;

CREATE TABLE list (
        listId TEXT NOT NULL PRIMARY KEY,
        parentId TEXT,
        listName TEXT,
        isFolder INTEGER
);
CREATE TABLE surg (
        id TEXT NOT NULL PRIMARY KEY,
        listId TEXT,
        d TEXT,
        loc TEXT,
        house TEXT,

        balanda INTEGER,
        charge TEXT,
        owner TEXT,
        domicile TEXT,

        type TEXT,
        mc TEXT,
        name TEXT,
        breed TEXT,
        colour TEXT,
        sex TEXT,
        desexed INTEGER,
        bcs TEXT,
        mange TEXT,

        desex TEXT,
        other_procedures TEXT,
        tvt TEXT,
        vacc INTEGER,
        details TEXT
);
CREATE TABLE med (
        id TEXT NOT NULL PRIMARY KEY,
        listId TEXT,
        d TEXT,
        loc TEXT,
        house TEXT,

        balanda INTEGER,
        charge TEXT,
        owner TEXT,
        domicile TEXT,

        type TEXT,
        mc TEXT,
        name TEXT,
        breed TEXT,
        colour TEXT,
        sex TEXT,
        desexed INTEGER,
        bcs TEXT,
        mange TEXT,

        reason TEXT,
        vacc INTEGER,
        euth TEXT,
        details TEXT
);
CREATE TABLE visit (
        id TEXT NOT NULL PRIMARY KEY,
        listId TEXT,
        d TEXT,
        loc TEXT,
        house TEXT,
        owner TEXT,
        type TEXT,
        name TEXT,
        colour TEXT,
        sex TEXT,
        desexed INTEGER,
        bcs TEXT,
        mange TEXT,
        ticks TEXT,
        fleas TEXT,
        ivermectin INTEGER,
        covinan INTEGER,
        tvt INTEGER,
        comments TEXT
);