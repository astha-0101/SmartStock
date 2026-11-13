package com.smartstock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the SmartStock backend.
 *
 * @SpringBootApplication is itself a combination of three annotations:
 *  - @Configuration      : this class can define Spring beans
 *  - @EnableAutoConfiguration : Spring Boot auto-configures the embedded
 *      Tomcat server, the JPA/Hibernate layer, the DataSource, etc. based
 *      on the dependencies found on the classpath (pom.xml) and the
 *      properties in application.properties
 *  - @ComponentScan      : Spring scans this package and all sub-packages
 *      (controller, service, repository, config) for classes annotated
 *      with @RestController, @Service, @Repository, @Configuration, etc.
 *      and registers them as beans automatically
 *
 * Running this class starts an embedded Tomcat server on port 8080 and
 * brings the whole application (Controller -> Service -> Repository -> DB)
 * to life with a single command: ./mvnw spring-boot:run
 */
@SpringBootApplication
public class SmartstockBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartstockBackendApplication.class, args);
    }
}
