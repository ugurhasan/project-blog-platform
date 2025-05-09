## Installation instructions

You need to install Node.js, Java 17+(Im using 17) and PostgreSQL. 

I will show you step-by-step how to install these to run app. 

- You can install Node.js from https://nodejs.org/en 
- You can install Java JDK from https://www.oracle.com/java/technologies/javase-downloads.html
- You can install PostgreSQL Database from https://www.postgresql.org/download/

## ⚙️ PostgreSQL Setup 

1. Download & install PostgreSQL from [https://www.postgresql.org/download](https://www.postgresql.org/download).
2. Open **pgAdmin** or terminal and do the following:
   - Create a new database called `student`.
   - (Optional) Create a new user and password, or use the default `postgres` user.
3. Update your `application.properties` file in `backend/src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student
spring.datasource.username=postgres
spring.datasource.password=your_password
```

❗ **If PostgreSQL is not installed or configured properly, the Spring Boot backend will fail to start, usually with a "connection refused" or "database not found" error.**

Install all these if you have not on your computer. 
