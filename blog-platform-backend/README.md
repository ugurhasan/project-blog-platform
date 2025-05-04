## 🛠 General Requirements

| Tool       | Purpose                                 | Side      |
|------------|------------------------------------------|-----------|
| Node.js    | Run the Next.js frontend                | Frontend  |
| npm        | Install dependencies for Next.js        | Frontend  |
| Java 17+   | Run the Spring Boot backend             | Backend   |
| PostgreSQL | Stores users, blog posts, and other data| Backend   |
| Git        | Clone repositories                      | Both      |

---

(Try to use latest versions of Node.js, My current version of Node.js is v22.11.0)

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


## How to run apps?

There are 2 different repositories, main and backend. In main repo, you will find Next.js fronend. After clone you will see files. After cloning complete, please make another folder (e.g backend), clone app again there and switch branch to backend.(git checkout backend
)

Before run Next.js frontend make sure you installed node modules(npm i or npm install).

Folder structure can be..

blog-platform/ 
   frontend/
   backend/

You can run both app on VScode, You can run Backend using VSCode's GUI. You just need to open src/main/java\com\example\demo/user/DemoApplication.java and click Run button right top of VsCode.

Frontend will be running on localhost:3000
Backend will be running on localhost:8080

Use localhost:3000 to see all functionality of website.
