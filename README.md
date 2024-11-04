# Local Gov App

This project is designed to connect a React Native frontend with a Node.js and MySQL backend for managing local government data. Follow the steps below to set up and run the project.

## Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (optional, for database management)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Database Setup

1. **Run Database File**:
   - In the `backend` folder, find the file `molg_db.sql`.
   - Open this file in MySQL Workbench or a similar SQL interface and run it to create the necessary database and tables.

2. **Configure Database Connection**:
   - In the `backend` folder, open the file `db.js`.
   - Update the MySQL credentials to match your setup:

     ```javascript
     const db = mysql.createConnection({
         host: 'localhost',       // Change if using a different host
         user: 'root',            // Change to your MySQL username
         password: 'password',    // Change to your MySQL password
         database: 'molg_db'      // Name of your database
     });
     ```

## Backend Setup

1. Open a terminal and navigate to the `backend` directory:

   ```bash
   cd backend
   npm install express mysql cors nodemon
   npm install mysql
   nodemon server.js

# Running the Front end
1. you can open a different instance of the terminal and navigate to govapp
   in the utils.js file replace the IP address with your computer ip_address and the port number(if necessary ie. you are not running your backend on 3000)
   ```bash
   cd govapp
   npm install
   npx expo start  
