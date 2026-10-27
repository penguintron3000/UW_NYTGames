# Research Report

## Connecting MySQL and Spring Boot through Docker

### Summary of Work

I researched how to use Docker Compose to dockerize a Spring Boot application and connect to a MySQL database.

### Motivation

Our project is using a MySQL database to store the words for our Wordle game while the backend server was implemented using Spring Boot. We want to make sure that our server is also accessible through Docker so the frontend does not have to run the backend server or database through local host. We also want to have a Docker Compose file so that the entire application can run when called in the GitLab Pipeline.  

### Time Spent

~75 minutes watching the tutorials/informational videos

### Results

I started by watching this short guide on how to run a database from within Spring Boot, in which Docker Compose is run when the application is begun[^1]. Realizing that wasn't enough information as the database should be on a separate Docker container I watched the example[^2] in which the person created a customer Dockerfile for their backend and then created a Docker image using it. The tutorial also shows how to connect the two containers over network. Once I had learned this information, I learned the difference between a Dockerfile, Docker image, and a Docker Compose file and what was needed to create the first two files. To create the Docker Compose file that works with the Dockerfile, I watched the last tutorial[^3]. At this point, I realized that I would have to run the JAR on the CSL machines to create the container on the VM so I learned how to do this through the Docker blog guide which provided me with all the information that I needed to be able to run the backend on a Docker container.

### Sources

- Spring Boot Docker Compose Module[^1]
- Docker Spring Boot MySQL Example[^2]
- Docker Compose Example [^3]
- Kickstart Your Spring Boot Application Development [^4]

[^1]: https://www.youtube.com/watch?v=lS1GwdIfk0c
[^2]: https://www.youtube.com/watch?v=PAQvxqocb6A
[^3]: https://www.youtube.com/watch?v=-ekBqIvAGY4
[^4]: https://www.docker.com/blog/kickstart-your-spring-boot-application-development/