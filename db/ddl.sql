CREATE DATABASE StagingFootballBuddy;

USE StagingFootballBuddy;

CREATE TABLE PlayerNeed (
	id int NOT NULL AUTO_INCREMENT,
    uuid varchar(36) NOT NULL,
    isActive boolean default true,
    playerName varchar(255) NOT NULL,
    availability varchar(512) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(32),
    about varchar(512),
    dateAdded DATETIME NOT NULL,
    
    PRIMARY KEY (id)
);

ALTER TABLE PlayerNeed
ADD UNIQUE (uuid);

CREATE TABLE District (
    code int NOT NULL,
    districtName varchar(128) NOT NULL,
    abbreviations varchar(512) NOT NULL,
    region varchar(128) NOT NULL,
    
    PRIMARY KEY (code)
);
ALTER TABLE District
ADD UNIQUE (districtName);

INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bánovce nad Bebravou", "BN", 301, "Trenčiansky");
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Banská Bystrica", "BB, BC, BK", 601, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Banská Štiavnica", "BS", 602, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bardejov", "BJ", 701, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bratislava I", "BA, BL, BT, BD, BE, BI", 101, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bratislava II", "BA, BL, BT, BD, BE, BI", 102, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bratislava III", "BA, BL, BT, BD, BE, BI", 103, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bratislava IV", "BA, BL, BT, BD, BE, BI", 104, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bratislava V", "BA, BL, BT, BD, BE, BI", 105, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Brezno", "BR", 603, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Bytča", "BY", 501, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Čadca", "CA", 502, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Detva", "DT", 604, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Dolný Kubín", "DK", 503, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Dunajská Streda", "DS", 201, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Galanta", "GA", 202, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Gelnica", "GL", 801, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Hlohovec", "HC", 203, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Humenné", "HE", 702, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Ilava", "IL", 302, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Kežmarok", "KK", 703, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Komárno", "KN", 401, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Košice I", "KE, KC, KI", 802, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Košice II", "KE, KC, KI", 803, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Košice III", "KE, KC, KI", 804, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Košice IV", "KE, KC, KI", 805, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Košice-okolie", "KS", 806, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Krupina", "KA", 605, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Kysucké Nové Mesto", "KM", 504, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Levice", "LV, LL", 402, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Levoča", "LE", 704, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Liptovský Mikuláš", "LM", 505, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Lučenec", "LC", 606, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Malacky", "MA", 106, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Martin", "MT", 506, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Medzilaborce", "ML", 705, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Michalovce", "MI", 807, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Myjava", "MY", 303, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Námestovo", "NO", 507, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Nitra", "NR, NI, NT", 403, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Nové Mesto nad Váhom", "NM", 304, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Nové Zámky", "NZ, NC", 404, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Partizánske", "PE", 305, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Pezinok", "PK", 107, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Piešťany", "PN", 204, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Poltár", "PT", 607, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Poprad", "PP", 706, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Považská Bystrica", "PB", 306, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Prešov", "PO, PV, PS", 707, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Prievidza", "PD", 307, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Púchov", "PU", 308, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Revúca", "RA", 608, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Rimavská Sobota", "RS", 609, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Rožňava", "RV", 808, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Ružomberok", "RK", 508, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Sabinov", "SB", 708, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Senec", "SC", 108, "Bratislavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Senica", "SE", 205, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Skalica", "SI", 206, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Snina", "SV", 709, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Sobrance", "SO", 809, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Spišská Nová Ves", "SN", 810, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Stará Ľubovňa", "SL", 710, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Stropkov", "SP", 711, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Svidník", "SK", 712, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Šaľa", "SA", 405, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Topoľčany", "TO", 406, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Trebišov", "TV", 811, "Košický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Trenčín", "TN, TC, TE", 309, "Trenčiansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Trnava", "TT, TA, TB", 207, "Trnavský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Turčianske Teplice", "TR", 509, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Tvrdošín", "TS", 510, "Žilinský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Veľký Krtíš", "VK", 610, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Vranov nad Topľou", "VT", 713, "Prešovský"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Zlaté Moravce", "ZM", 407, "Nitriansky"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Zvolen", "ZV", 611, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Žarnovica", "ZC", 612, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Žiar nad Hronom", "ZH", 613, "Banskobystrický"); 
INSERT INTO District(districtName, abbreviations, code, region) VALUE ("Žilina", "ZA, ZI, ZL", 511, "Žilinský");

CREATE TABLE PlayerNeedDistrict (
    playerNeedId int NOT NULL,
    districtCode int NOT NULL,

    PRIMARY KEY (playerNeedId, districtCode),
    FOREIGN KEY (playerNeedId) REFERENCES PlayerNeed(id) ON DELETE CASCADE,
    FOREIGN KEY (districtCode) REFERENCES District(code) ON DELETE CASCADE
);

CREATE TABLE Consent (
    id int NOT NULL,
    consentTarget varchar(512) NOT NULL,
    wording varchar(1024) NOT NULL,
    
    PRIMARY KEY (id)
);

INSERT INTO Consent(id, consentTarget, wording) VALUE (1, "PLAYER", "Súhlasím s tým, aby prevádzkovateľ služby futbal-spoluhráč.sk ukladal moje meno, preferované okresy a časy, email telefón a daľšie informácie o mne na svojich serveroch za účelom hľadania futbalového tímu. Beriem na vedomie, že tento súhlas môžem kedykoľvek odvolať prostredníctvom linku, ktorý bude poskytnutý v potvrdzovacom emaile.");
INSERT INTO Consent(id, consentTarget, wording) VALUE (2, "PLAYER", "Súhlasím s tým, aby prevádzkovateľ služby futbal-spoluhráč.sk poskytol moje meno, preferované okresy a časy, email telefón a daľšie informácie o mne tretím stranám za účelom hľadania futbalového tímu. Tretími stranami sa tu myslia futbalové tímy, ktoré hľadajú hráčov. Beriem na vedomie, že tento súhlas môžem kedykoľvek odvolať prostredníctvom linku, ktorý bude poskytnutý v potvrdzovacom emaile.");
INSERT INTO Consent(id, consentTarget, wording) VALUE (3, "PLAYER", "Potvrdzujem, že môj vek je 18 rokov, alebo viac.");
INSERT INTO Consent(id, consentTarget, wording) VALUE (4, "PLAYER", "Súhlasím s tým, aby prevádzkovateľ služby futbal-spoluhráč.sk poskytol moje meno, preferované okresy a časy, email telefón a daľšie informácie o mne tretím stranám za účelom marketingovej komunikácie. Beriem na vedomie, že tento súhlas môžem kedykoľvek odvolať prostredníctvom linku, ktorý bude poskytnutý v potvrdzovacom emaile.");

INSERT INTO Consent(id, consentTarget, wording) VALUE (101, "TEAM", "Súhlasím s tým, aby prevádzkovateľ služby futbal-spoluhráč.sk ukladal adresu hry, čas hry, moje meno, email, telefón a daľšie informácie o mojom tíme na svojich serveroch za účelom hľadania futbalového tímu. Beriem na vedomie, že tento súhlas môžem kedykoľvek odvolať prostredníctvom linku, ktorý bude poskytnutý v potvrdzovacom emaile.");
INSERT INTO Consent(id, consentTarget, wording) VALUE (102, "TEAM", "Súhlasím s tým, aby prevádzkovateľ služby futbal-spoluhráč.sk poskytol adresu hry, čas hry, moje meno, email, telefón a daľšie informácie o mojom tíme tretím stranám za účelom hľadania futbalového tímu. Tretími stranami sa tu myslia hráči, ktorí hľadajú futbalové tímy. Beriem na vedomie, že tento súhlas môžem kedykoľvek odvolať prostredníctvom linku, ktorý bude poskytnutý v potvrdzovacom emaile.");
INSERT INTO Consent(id, consentTarget, wording) VALUE (103, "TEAM", "Potvrdzujem, že môj vek a vek mojich spoluhráčov je 18 rokov, alebo viac.");
INSERT INTO Consent(id, consentTarget, wording) VALUE (104, "TEAM", "Súhlasím s tým, aby prevádzkovateľ služby futbal-spoluhráč.sk poskytol adresu hry, čas hry, moje meno, email, telefón a daľšie informácie o mojom tíme tretím stranám za účelom marketingovej komunikácie. Beriem na vedomie, že tento súhlas môžem kedykoľvek odvolať prostredníctvom linku, ktorý bude poskytnutý v potvrdzovacom emaile.");

CREATE TABLE PlayerNeedConsent (
    playerNeedId int NOT NULL,
    consentId int NOT NULL,
    isActive boolean default true,
    dateGranted datetime NOT NULL,
    dateRevoked datetime,

    PRIMARY KEY (playerNeedId, consentId),
    FOREIGN KEY (playerNeedId) REFERENCES PlayerNeed(id) ON DELETE CASCADE,
    FOREIGN KEY (consentId) REFERENCES Consent(id) ON DELETE CASCADE
);

CREATE TABLE TeamNeed (
	id int NOT NULL AUTO_INCREMENT,
    uuid varchar(36) NOT NULL,
    isActive boolean default true,
    districtCode int NOT NULL,
    address varchar(512),
    time varchar(512) NOT NULL,
    playerName varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(32),
    about varchar(512),
    dateAdded DATETIME NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (districtCode) REFERENCES District(code) ON DELETE CASCADE
);

ALTER TABLE TeamNeed
ADD UNIQUE (uuid);

CREATE TABLE TeamNeedConsent (
    teamNeedId int NOT NULL,
    consentId int NOT NULL,
    isActive boolean default true,
    dateGranted datetime NOT NULL,
    dateRevoked datetime,

    PRIMARY KEY (teamNeedId, consentId),
    FOREIGN KEY (teamNeedId) REFERENCES TeamNeed(id) ON DELETE CASCADE,
    FOREIGN KEY (consentId) REFERENCES Consent(id) ON DELETE CASCADE
);

CREATE USER 'application' IDENTIFIED BY 'XXXXXXX';
GRANT SELECT, INSERT, UPDATE ON StagingFootballBuddy.PlayerNeed TO 'application';
GRANT SELECT, INSERT, UPDATE ON StagingFootballBuddy.PlayerNeedDistrict TO 'application';
GRANT SELECT, INSERT, UPDATE ON StagingFootballBuddy.PlayerNeedConsent TO 'application';
GRANT SELECT, INSERT, UPDATE ON StagingFootballBuddy.TeamNeed TO 'application';
GRANT SELECT, INSERT, UPDATE ON StagingFootballBuddy.TeamNeedConsent TO 'application';
