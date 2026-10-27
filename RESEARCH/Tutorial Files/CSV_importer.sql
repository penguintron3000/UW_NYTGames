LOAD DATA LOCAL INFILE 'C:/Users/Nathan Kang/Documents/cs506/Project_05/docker/wordList.csv' 
INTO TABLE wordlist 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS (`Word`);