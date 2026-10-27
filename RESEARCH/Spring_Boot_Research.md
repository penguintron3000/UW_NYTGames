# Research Report


## Java Spring Boot


### Summary of Work


I researched installing Spring Boot. I specifically researched how to do it 
In Visual Studio Code[^1] with Spring Initializr. Along with this, 
I learned some of the different annotations of Spring Boot such as
@GetMapping(“”) to get arguments from a request, @PathVariable for an input
From a request. I learned these following a simple “Hello World Program”.
Finally, I expanded off of this to create a crude local version of Wordle.


### Motivation


Spring Boot is our Java backend. It needs to interact with both the Database and Frontend. Knowing the 
Basics of it and how to recieve/retrieve data from a request is the most important part of our project. 


### Time Spent


40 minutes - downloading software (was problems with out of date IDE to fix)
60 minutes - Following tutorial and completing tutorial
60 minutes - Making mock wordle, debugging


### Results


Spring Initializr creates a zip file of an Application class, an XML file,
As well as a Maven or Gradle file.[^3]
Next, I used the command ./mvnw package in the terminal to create an 
Executable maven jar file out of my java file after following tutorial[^4]
After this, I used java -jar target/spring-boot-docker-0.0.1-SNAPSHOT.jar to
Start the host locally.[^4] 
My local backend code can be found here:

package com.example.spring_boot_docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Random;
import java.io.File;
import java.util.Scanner;



@RestController
@SpringBootApplication
public class SpringBootDockerApplication {


	ArrayList<String> lis = new ArrayList<String>();
	String word = "";

	@RequestMapping("/add/{name}")
	public String home(@PathVariable String name) {
		lis.add(name);
		return "Success";
	}

	@RequestMapping("/get") 
	public String get() {
		return lis.toString();
	}

	@RequestMapping("/start")
	public String Start() {
		loadFile();
		Random rand = new Random();
		int random = rand.nextInt(2000);

		word = lis.get(random);
		return "Key: Letter = Correct, ! = wrong place, - = not in word";
	}

	public void loadFile() {
		try {
		File filePath = new File("valid-wordle-words.txt");
		
		Scanner scanner = new Scanner(filePath);
		
		while(scanner.hasNextLine()) {
			String line = scanner.nextLine();
			lis.add(line);
		}
		scanner.close();

		}

		catch(Exception e) {}

		
	}

	@RequestMapping("/guess/{str}")
	public String Guess(@PathVariable String str) {
		 if(str.length() != 5) {
			return "Needs to be 5 characters long";
		}
		System.out.println(str);
		boolean checked = false;
		String returnStr = "";
		for(int i = 0; i < str.length(); i++) {
			for(int j = 0; j < str.length(); j++) {

			if(str.charAt(i) == word.charAt(i)) {
				returnStr += str.charAt(i);
				checked = true;
				break;
			}
			else if(str.charAt(i) == word.charAt(j)) {
					returnStr += "!";
					checked = true;
					break;
			}

			}
			if(!checked) {
				returnStr += "-";
			} 
			checked = false;
		}

		

		return "str\n" + returnStr;
	}

	@RequestMapping("/reveal")
	public String reveal() {
		return word;
	}


	public static void main(String[] args) {
		SpringApplication.run(SpringBootDockerApplication.class, args);
	}

}




### Sources




[^1]: https://spring.io/guides/gs/guides-with-vscode


[^2]: https://spring.io/guides/gs/spring-boot


[^3]: https://start.spring.io/


[^4]: https://www.docker.com/blog/kickstart-your-spring-boot-application-development/



