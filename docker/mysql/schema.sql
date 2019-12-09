CREATE DATABASE sparschwein;
CREATE TABLE sparschwein.purchases (
    ID VARCHAR(40) PRIMARY KEY,
    Title VARCHAR(255),
    User VARCHAR(255),
    Timestamp DATETIME,
    Total INTEGER,
    Comment VARCHAR(255)
);

CREATE TABLE sparschwein.periods (
    ID VARCHAR(40) PRIMARY KEY,
    Comment VARCHAR(255),
    Start DATETIME,
    End DATETIME,
    Budget INTEGER
);

CREATE USER dev@'%' IDENTIFIED BY 'dev';
GRANT ALL PRIVILEGES ON sparschwein.* TO dev@'%';
