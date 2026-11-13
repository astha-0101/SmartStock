# SmartStock Backend (Spring Boot)

A real Spring Boot REST API implementing the three-layer architecture
(Controller -> Service -> Repository -> Database) described in the
SmartStock Spring Boot report and architecture diagram.

## What's inside

```
src/main/java/com/smartstock/
  SmartstockBackendApplication.java   - main class, starts embedded Tomcat
  model/Product.java                 - JPA entity (productId, productName, category, quantity, price)
  repository/ProductRepository.java  - Spring Data JPA repository
  service/ProductService.java        - validation rules + low-stock logic
  controller/ProductController.java  - REST endpoints
  config/CorsConfig.java             - allows the React dev server to call this API
  exception/GlobalExceptionHandler.java - turns validation errors into clean 400 responses
src/main/resources/
  application.properties             - picks which profile is active
  application-h2.properties          - zero-install in-memory database (default)
  application-mysql.properties       - real MySQL, matching your submitted report
  data.sql                           - 8 sample products, loaded automatically with H2
src/test/java/.../ProductServiceTest.java - JUnit 5 + Mockito unit tests
```

## Endpoints

| Method | Path                     | Description                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/api/products`          | List all products                    |
| GET    | `/api/products/low-stock`| List products with quantity <= 10    |
| POST   | `/api/products`          | Add a new product (JSON body)        |

Example POST body:
```json
{ "productName": "Webcam", "category": "Electronics", "quantity": 25, "price": 2100 }
```

## How to run it

This project needs Maven and a JDK (17+) to download its dependencies from
Maven Central the first time — that step needs **your own computer's
internet connection**, not this chat.

1. Unzip the project.
2. Open a terminal inside the `smartstock-backend` folder.
3. Run:
   ```
   mvn spring-boot:run
   ```
   (If you don't have Maven installed, install it first, or open the folder
   in IntelliJ IDEA / Eclipse / VS Code with the Java extensions and run
   `SmartstockBackendApplication.java` directly — they manage Maven for you.)
4. The API starts on **http://localhost:8080** using the built-in H2
   database — nothing else to install. Visit
   `http://localhost:8080/api/products` in a browser to see the 8 sample
   products as JSON.

### Switching to real MySQL (matches your submitted report exactly)

1. Install MySQL and make sure it's running.
2. In `application-mysql.properties`, set your MySQL username/password.
3. In `application.properties`, change:
   ```
   spring.profiles.active=mysql
   ```
4. Run `mvn spring-boot:run` again — Hibernate creates the `product` table
   in your `smartstockdb` database automatically.

## Connecting the React frontend

The `smartstock-react` project has been updated to fetch product data from
this backend (see its own README). Run this backend first (port 8080), then
start the frontend with `npm run dev` (port 5173) — `CorsConfig.java` is
already set up to allow that connection.

## A note on this sandbox vs. your computer

This code was written and reviewed carefully, following standard Spring Boot
conventions, but it could **not be compiled or run inside this chat's
sandbox** — the sandbox's network policy blocks Maven Central (where
`spring-boot-starter-web`, Hibernate, etc. are downloaded from), and no
MySQL server is installed here either. Your own computer has normal
internet access, so `mvn spring-boot:run` will work there. If you hit any
error when you run it, paste it back and it can be fixed immediately.
