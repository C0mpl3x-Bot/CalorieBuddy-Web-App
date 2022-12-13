//commit 16
//getting access to the express module in node.js
var express = require('express');
//getting access to body-parser to be able to handle post data request
var bodyParser = require('body-parser');
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }))
var session = require('express-session');
var validator = require('express-validator');
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());


//importing MongoDB module in to  Node.js
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/mybookshopdb";
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

///added for session management
app.use(session({
  secret: 'somerandomstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
  }
}));
//////////////


// new code added to your Express web server
//get access to the main.js file in the routes folder
require('./routes/main')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
/////////////
//get access to the custom.css file in the design/css folder
app.set('design', __dirname + '/design');
app.use(express.static('design'))


//////////////
//when the server is running it is listening for connections on the specified host and port
//and would would return example app listening on port 8000 to show that it is running
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

