CREATE DATABASE sparschwein;
CREATE TABLE sparschwein.purchases (
    ID VARCHAR(40) PRIMARY KEY,
    Title VARCHAR(255),
    User VARCHAR(255),
    Timestamp DATETIME,
    Total INTEGER,
    Comment VARCHAR(255),
    Payment VARCHAR(255),
    CONSTRAINT CHK_Payment CHECK (Payment = 'Barzahlung' OR Payment = 'Kartenzahlung')
);

CREATE TABLE sparschwein.periods (
    ID VARCHAR(40) PRIMARY KEY,
    Comment VARCHAR(255),
    Start DATETIME,
    End DATETIME,
    Budget INTEGER
);

CREATE TABLE sparschwein.shoppingList (
    ID VARCHAR(40) PRIMARY KEY,
    Done BOOLEAN NOT NULL,
    Description TEXT
);

CREATE VIEW sparschwein.orphanedPayments AS SELECT * FROM sparschwein.purchases p WHERE NOT EXISTS (SELECT * FROM sparschwein.periods WHERE date(p.Timestamp) BETWEEN date(Start) AND date(End));
CREATE VIEW sparschwein.currentPeriod AS SELECT ID, Budget, (SELECT COALESCE(SUM(Total), 0) FROM sparschwein.purchases pu WHERE date(pu.Timestamp) BETWEEN date(pe.Start) AND date(pe.End)) AS Spent FROM sparschwein.periods pe WHERE End >= NOW() AND Start <= NOW() ORDER BY Start DESC LIMIT 1;

CREATE USER dev@'%' IDENTIFIED BY 'dev';
GRANT ALL PRIVILEGES ON sparschwein.* TO dev@'%';
