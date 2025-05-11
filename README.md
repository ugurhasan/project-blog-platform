# 🚀 Project Setup Instructions

You need to install **Node.js**, **Java JDK 17+**, and **PostgreSQL** to run this full-stack application.

---

## 🔧 Prerequisites

Install the following tools if you haven't already:

- [Node.js](https://nodejs.org/en)
- [Java JDK](https://www.oracle.com/java/technologies/javase-downloads.html)
- [PostgreSQL](https://www.postgresql.org/download/)

---

## ⚙️ Setting Up Environment Variables (Windows)

To run the backend from terminal (e.g., using `mvnw.cmd`), Java must be properly configured:

### Step 1: Find your JDK path

Your JDK is usually installed in a directory like:

```
C:\Program Files\Java\jdk-17
```

Make sure it includes the `bin` folder (which has `javac.exe` and `java.exe`).

### Step 2: Set JAVA_HOME and Update PATH

1. Press `Win + S`, search for `Environment Variables`, and open it.
2. Click `Environment Variables...`
3. Under `System variables`, click `New`:
   * Variable name: `JAVA_HOME`
   * Variable value: `C:\Program Files\Java\jdk-17` (or your actual JDK path)
4. Find the `Path` variable under System variables > click `Edit` > `New`:
   * Add: `%JAVA_HOME%\bin`
5. Click `OK` on all dialogs to save changes.
6. Restart your terminal and test:

```bash
java -version
javac -version
```

You should see the version printed correctly.

---

## 📊 PostgreSQL Setup

1. Download & install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Open **pgAdmin** or terminal and do the following:
   - Create a new database called `student`.
   - (Optional) Create a new user and password, or use the default `postgres` user.
3. Update your `application.properties` file in `blog-platform-backend/src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student
spring.datasource.username=postgres
spring.datasource.password=your-password
```

---

## 🏃‍♂️ Running the Application

### Backend
1. Navigate to the backend directory:
```bash
cd blog-platform-backend
```

2. Run using Maven wrapper:
```bash
./mvnw spring-boot:run
```
(On Windows, use `mvnw.cmd` instead)

### Frontend
1. Navigate to the frontend directory:
```bash
cd blog-platform-main
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Access the application at [http://localhost:3000](http://localhost:3000)

---

## 🔍 Troubleshooting

If you encounter any issues with Java configuration:
- Ensure JAVA_HOME points to the correct directory
- Verify that %JAVA_HOME%\bin is in your PATH
- Try restarting your computer after making environment variable changes
