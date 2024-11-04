# local-gov-app
# This is a guide for running the project

# connect to the Database
 in the backend folder you will find the db file molg_db run it in your workbench 
 in the backend folder edit the file db.js to suit your database credentials
const db = mysql.createConnection({
    host: 'localhost',       
    user: 'root',   
    password: 'password', 
    database: 'molg_db' 
});
$

# Running the backend
navigate to the backend dir in the project
$ cd backend
$ start by running the command "npm install express mysql cors nodemon" once successful proceed to the next step
$ npm install mysql 
$ nodemon server.js

# Running the Front end
you can open a different instance of the terminal and navigate to govapp
$ cd govapp
$ npm install
in the utils.js file replace the IP address with your computer ip_address and the port number(if necessary ie. you are not running your backend on 3000)
 after all have succeffully been done run:
$ npx expo start  
 to start your application
