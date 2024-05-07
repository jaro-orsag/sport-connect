CREATE DATABASE StagingFootballBuddy;

USE StagingFootballBuddy;

CREATE TABLE PlayerNeed (
	id int NOT NULL AUTO_INCREMENT,
    uuid varchar(36) NOT NULL,
    playerName varchar(255) NOT NULL,
    availability varchar(512) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(32),
    about varchar(512),
    consent varchar(512) NOT NULL,
    
	PRIMARY KEY (id)
);

ALTER TABLE PlayerNeed
ADD UNIQUE (uuid);

CREATE USER 'application' IDENTIFIED BY 'XXXXXXX';
GRANT SELECT, INSERT, UPDATE ON StagingFootballBuddy.PlayerNeed TO 'application';


INSERT INTO PlayerNeed (uuid, playerName, availability, email, consent) VALUES (
	'3c203888-3dcd-47a0-a87a-abc17cbec3b2',
    'Tenkrat Poprve',
    'hocikedy',
    'jhrfgjk@gdjfgl.com',
    'SOMETHING');
SELECT * FROM PlayerNeed;