CREATE DATABASE sparschwein;
CREATE USER 'dev'@'%' IDENTIFIED BY 'dev';

USE sparschwein;
CREATE TABLE purchases (
    ID varchar(40) PRIMARY KEY,
    Title varchar(255),
    User varchar(255),
    Timestamp DATETIME,
    Total int,
    Comment Text
);
CREATE TABLE periods (
    ID varchar(40) PRIMARY KEY,
    Comment varchar(255),
    Start DATETIME,
    End DATETIME,
    Budget int,
);