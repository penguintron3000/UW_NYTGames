#DELETE FROM connections.cnouns;
#WHERE LENGTH(TRIM(noun)) < 100 OR noun = NULL;
#ALTER TABLE connections.cnouns AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM connections.ctopic
WHERE LENGTH(TRIM(topic)) < 100;


#CTopic Loading
LOAD DATA LOCAL INFILE 'C:/Users/Nathan Kang/Documents/cs506/Project_05/Database/ConnectionWordsV2.json'
#'%LOCALAPPDATA%/ConnectionWordsV2.json'
INTO TABLE connections.ctopic
FIELDS TERMINATED BY ',' #ESCAPED BY '}'
LINES starting by '"topic":{' TERMINATED BY ','
IGNORE 1 LINES;
#Will manually set fetched to 0 for all

#CNoun Loading

#INSERT INTO connections.cnouns (noun)
#VALUES (' "Red"');

#LOAD DATA LOCAL INFILE 'C:/Users/Nathan Kang/Documents/cs506/Project_05/Database/ConnectionWordsV2.json'
#'%LOCALAPPDATA%/ConnectionWordsV2.json'
#INTO TABLE connections.cnouns
#FIELDS TERMINATED BY '{' 
#LINES starting by '"noun":' TERMINATED BY ','
#IGNORE 1 LINES (noun);

#Load Data started tweaking when inputting topics, so will manually insert into list.
#SET FOREIGN_KEY_CHECKS=1;
#UPDATE connections.cnouns
#SET topic = '"Celestial Bodies"'
#WHERE nounid < 5;
#WHERE nounid BETWEEN 393 AND 396;

SELECT * FROM connections.ctopic;
SELECT * FROM connections.cnouns;