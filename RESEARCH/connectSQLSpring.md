# Research Report


## Connecting a SQL database to a Java Spring Boot backend


### Summary of Work

I researched how to connect a Spring Boot application to a MySQL database that has been dockerized. I also installed an application called Postman which I could use to test that the container was online by hitting the endpoints in the backend. I also spent some time learning about the difference between JPA and JDBC to determine what would be best to communicate with MySQL.

### Motivation


Spring Boot is what is going to be used develop our backend services. It will have to communicate with the database to get the daily words from the database. We intend to completely dockerize the database to save overhead on our personal computers. As such, it would be best to know how to connect to MySQL tables that are on docker containers.

### Time Spent

30 minutes - Watching videos
5 minutes - Downloading software (Postman)
45 minutes - Developing based on the tutorial (setting up the Spring Boot backend and deploying container)

### Results


I was able to hit the database using a postman call. Here is the controller file I used:

package com.example.db_setup;

import com.example.db_setup.persistence.UserEntity;
import com.example.db_setup.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {

    UserRepository userRepository;

    @Autowired
    public Controller(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public String getUserByName(@RequestParam String name){

        UserEntity user = userRepository.findByName(name);

        return user.toString();
    }
}


### Sources

https://www.youtube.com/watch?v=dGchzmKmOJk&ab_channel=Randomcode

https://www.youtube.com/watch?v=XuLUnTlAWmw&ab_channel=ProCoder

https://www.youtube.com/watch?v=GX3D0OIFOhE&ab_channel=JavaMaster

https://stackoverflow.com/questions/11881548/jpa-or-jdbc-how-are-they-different


