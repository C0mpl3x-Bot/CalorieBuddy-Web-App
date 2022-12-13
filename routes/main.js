//gets module app:
module.exports = function (app) {

    const { check, validationResult } = require('express-validator');

//////////////////////-------------------------Checks Whether The User trying to access the page is logged in or not ---------------\\\\\\\\\\\\\\\\\\\\\\\\
    const redirectLogin = (req, res, next) => {
        //if user is not logged in redirect them to the login route
        if (!req.session.userId) {
            res.redirect('./login')
        }
        else {
            //if user is logged in then carry on as usual.
            next();
            //console.log("going next"); 
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

/////////////////////-------------------------------Home Page index.html Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    app.get('/', function (req, res) {
        res.render('home.html')
    });

//////////////////////------------------------------- About Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    app.get('/about', function (req, res) {
        res.render('about.html');
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////------------------------------- SEARCH PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //search route allows you to search for a food
    app.get('/searchfood', function (req, res) {
        res.render('searchfood.html')
    });

    //once user has entered the food name get request would be handled it would access the database then use the word entered by the user to find similar food names and would 
    //return them as an ejs file which would have a list in a table form with the simialr foods searched for in the database.
    app.get('/search-result', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy');//access to the CalorieBuddy database
            var word = req.query.keyword;
            //searches foods collection for any similar names
            db.collection('foods').find({ name: { $regex: word, $options: 'i' } }).toArray((findErr, results) => {
                if (findErr) throw findErr;
                //if there are no results then it tells the user nothing was found
                if (results == false) {
                    res.send(("Food You are Looking For Is Not Found, Please Search For Something Else Or Make Sure You Have Spelt It Right") + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>')
                }
                //if there are any results then it would call the searchlist.ejs and display all information gathered for that specific search from the database.
                else {
                    res.render('searchlist.ejs', { pagetitle: "The Result For The " + word + " ", UniqueWord: " according to your search here", availablefoods: results });
                    client.close();
                }
            });
        });
    });
 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

//////////////////////------------------------------- Update Food Page -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //update route allows you to update/delete a food user needs to be logged in the access this route. Only the user that has added that food can change it.
    app.get('/updatefood', redirectLogin, function (req, res) {
        res.render('updatefood.html')
    });

    //////////////////////------------------------------- Search For Food You Want To Update/Delete -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //user would need to search the food they want to update and 
    //once user has entered the food name get request would be handled it would access the database then use the word entered by the user to find similar food names and would 
    //return them as an ejs file which would have a list in a table form with the simialr foods searched for in the database. 
    //then it would render the updatefoodlist.ejs where all information is displayed with the update and delete forms
    app.get('/updatingfood', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy');//access to the CalorieBuddy database
            var word = req.query.keyword;
            //searches foods collection for any similar names
            db.collection('foods').find({ name: { $regex: word, $options: 'i' } }).toArray((findErr, results) => {
                if (findErr) throw findErr;
                //if there are no results then it tells the user nothing was found
                if (results == false) {
                    res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ("Food You are Looking For Is Not Found, Please Search For Something Else Or Make Sure You Have Spelt It Right") + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>')
                }
                //if there are any results then it would call the updatefoodlist.ejs and display all information gathered for that specific search from the database.
                //it would also display all the forms for update and delete
                else {
                    res.render('updatefoodlist.ejs', { pagetitle: "The Result For The " + word + " ", UniqueWord: " according to your search here", availablefoods: results });
                    client.close();
                }
            });
        });
    });


    //////////////////////------------------------------- Update Food In db -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //If user decides to update a food they would need to fill in all boxes for update and certain boxes eg kilocalories have to contain a number otherwise it would redirect the user to the search page for update food
    app.post('/updateresult', [check('name').notEmpty(), check('typicalvalues').notEmpty().isNumeric(), check('unit_of_the_typical_value').notEmpty(), check('kilocalories').notEmpty().isNumeric(), check('carbs').notEmpty().isNumeric(), check('fat').notEmpty().isNumeric(), check('protein').notEmpty().isNumeric(), check('salt').notEmpty().isNumeric(), check('sugar').notEmpty().isNumeric()], function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            //if any form box is not populated with data required by the user then it would redirect the user to updatefood route
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('./updatefood');
            }
            else {
                var sessionname = req.session.userId; //gets the username of the user that is logged in and saves it to sessionname
                var word = req.sanitize(req.body.name); //sanitizes entered name and saves it to word
                //searches foods collection for the name entered
                db.collection('foods').findOne({ name: word }, function (err, results) {
                    if (err) throw err;
                    //if there are no results then it tells the user nothing was found
                    if (results == null) {
                        res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + (' food not found in the database') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>');
                    }
                    else {
                        //console.log(results.user);
                        //checks whether the user that is trying to update that food is the creator of the food
                        if (results.user == sessionname) {
                            db.collection('foods').updateOne(
                                //the user would need to enter the name of the food they want to update and would fill in all the form boxes as required for that food and would submit and this would update that foods fields and then show the user that it has been updated.
                                { name: req.sanitize(req.body.name) },
                                { $set: { typicalvalues: req.sanitize(req.body.typicalvalues), unit_of_the_typical_value: req.sanitize(req.body.unit_of_the_typical_value), kilocalories: req.sanitize(req.body.kilocalories), carbs: req.sanitize(req.body.carbs), fat: req.sanitize(req.body.fat), protein: req.sanitize(req.body.protein), salt: req.sanitize(req.body.salt), sugar: req.sanitize(req.body.sugar) } })
                            res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + (' This food is added to the database, name: ' + req.body.name + ', typical value: ' + req.body.typicalvalues + ', unit of the typical value is: ' + req.body.unit_of_the_typical_value + ', calories: ' + req.body.kilocalories + ', carbs: ' + req.body.carbs + ', fat: ' + req.body.fat + ', protein: ' + req.body.protein + ', salt: ' + req.body.salt + ', sugar: ' + req.body.sugar) + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>'); //shows what was added to the database           
                        }
                        //If user that is trying to update that food is not the creator is would display a message saying they cannot update this food as they are not the creator.
                        else {
                            res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + (' You cannot edit this food as you are not the creator of the food in the database') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>');
                        }
                    }
                })
            }
        })

    })
   
    //////////////////////------------------------------- DELETE FOOD IN DB BY NAME -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //If user decides to delete a food they would need to type the name of the food they want to delete if left empty it would redirect the user to the search page for update food
    app.post('/deletedfood', [check('name').notEmpty()], function (req, res) {
        //saving data in database
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy');  //access to the CalorieBuddy database
            var word1 = req.sanitize(req.body.name); //sanitizes entered name and saves it to word1
            var sessionname = req.session.userId; //gets the username of the user that is logged in and saves it to sessionname
            //if any form box is not populated with data required by the user then it would redirect the user to updatefood route
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('./updatefood');
            }
            else {
                //searches foods collection for the name entered
                db.collection('foods').findOne({ name: word1 }, function (err, result) { //find if the username entered is in the database if so it would get all the information for that user
                    if (err) throw err;
                    if (result != null) { //If result is not equal to null that means the food name exists in the database so it would execute the code within the if statement
                        if (result.user == sessionname) { //checks whether the user that is trying to update that food is the creator of the food. If it is the creator it would allow them to delete the food
                            //deletes that food from the collection and displays a message that it is deleted this is done by comparing food name entered with the food name in the collection and then delete all of that foods information from the database
                            db.collection('foods').deleteOne({ name: word1 }, function (err, results) {
                                res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('Deleting food ' + word1 + ' from the database') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>')
                            })
                        }
                        //If user that is trying to update that food is not the creator is would display a message saying they cannot update this food as they are not the creator.
                        else {
                            res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + (' You cannot delete this food as you are not the creator of the food in the database') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>');
                        }
                    }
                    else { //If food name is not found in the database that means results is equal to null then tell the user that the food name entered does not exist in the collection
                        res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('The food name entered is ' + word1 + ', does not exist in the database') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>')
                    }

                })
            }
        })
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////------------------------------- Api Page -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //gets all the information from the foods collection and prints it to the api route in json form
    app.get('/api', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            //gets all the foods data from the foods collection
            db.collection('foods').find().toArray((findErr, results) => {
                if (findErr) throw findErr;
                else {
                    //prints all the data in the foods collection in json format
                    res.json(results);
                }
                client.close();
            });
        });
    });

    //gets speicfic data for a food name 
    //you can test this by doing http://www.doc.gold.ac.uk/usr/400/api/name where you change name to the name of the food you want to get data on.
    //Or you can test it using curl where you can type curl -i www.doc.gold.ac.uk/usr/400/api/name where you change name to the name of the food you want to get data on and you do this via the terminal.
    app.get('/api/:name', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            //gets the data of the food in the url via req.params.name which req.params searches the url path, body, and query string of the request for the specified parameter which in this case is name.
            //then it would search the collection foods for the name in the url and get the data for it.
            db.collection('foods').find({ name: req.params.name }).toArray((findErr, results) => {
                if (findErr) throw findErr;
                //If data is found for that food name it would print it out in json form 
                if (results != false) {
                    res.json(results);
                    client.close();
                }
                //If no data found then it would tell you that no data exists for the food name entered.
                else {
                    res.json("The name You entered cannot be found")
                    client.close();
                }
            })
        })
    })

    //updates specific data for via food name
    //you can test this using curl by doing curl -d typicalvalues=DATA -d unit_of_the_typical_value=DATA -d kilocalories=DATA-d carbs=DATA -d fat=DATA -d protein=DATA -d salt=DATA -d sugar=DATA -d user=DATA -X PUT http://www.doc.gold.ac.uk/usr/400/api/name where name is the name of the food that you want to use to change its fields and DATA is the data you want to put in for those fields.
    //curl -d typicalvalues=100 -d unit_of_the_typical_value=grams -d kilocalories=42 -d carbs=5 -d fat=1 -d protein=3.4 -d salt=0.044 -d sugar=5 -d user=oguve001 -X PUT http://www.doc.gold.ac.uk/usr/400/api/milk
    app.put("/api/:name", function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            //gets the name of the food you want to update via curl by using req.params.name then it would change the old values to the new values entered.by using updateOne if the name is found if not nothing would be update as the name does not exist
            db.collection('foods').updateOne(
                { name: req.params.name },
                { $set: { typicalvalues: req.body.typicalvalues, unit_of_the_typical_value: req.body.unit_of_the_typical_value, kilocalories: req.body.kilocalories, carbs: req.body.carbs, fat: req.body.fat, protein: req.body.protein, salt: req.body.salt, sugar: req.body.sugar } }, function (findErr, results) {
                    if (findErr) throw findErr;
                    //this would then display the results in json format 
                    res.json(results)
                    client.close();
                })
        })
    })



    //Adds new data to the foods collection
    //you can test this using curl by doing curl -d name=DATA-d typicalvalues=DATA -d unit_of_the_typical_value=DATA -d kilocalories=DATA -d carbs=DATA -d fat=DATA -d protein=DATA -d salt=DATA -d sugar=DATA -d user=DATA -X POST http://www.doc.gold.ac.uk/usr/400/api where DATA is the data you want to put in for those fields.
    //curl -d name=apple -d typicalvalues=100 -d unit_of_the_typical_value=grams -d kilocalories=52 -d carbs=14 -d fat=0.2 -d protein=0.3 -d salt=0.01 -d sugar=10 -d user=oguve001 -X POST http://www.doc.gold.ac.uk/usr/400/api
    app.post("/api", function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            db.collection('foods').insertOne({   //inserts information into foods collection using the data entered via curl
                name: req.body.name,
                typicalvalues: req.body.typicalvalues,
                unit_of_the_typical_value: req.body.unit_of_the_typical_value,
                kilocalories: req.body.kilocalories,
                carbs: req.body.carbs,
                fat: req.body.fat,
                protein: req.body.protein,
                salt: req.body.salt,
                sugar: req.body.sugar,
                user: req.body.user
            },
                function (findErr, results) {
                    if (findErr) throw findErr;
                    //this would then display the results in json format 
                    res.json(results)
                    client.close();
                });
        })
    })



    //Deletes a column using the name of the food you want to delete from the collection.
    //you can test this using curl by doing curl -X DELETE http://www.doc.gold.ac.uk/usr/400/api/name  where name is the name of the food that you want to delete
    //curl -X DELETE http://www.doc.gold.ac.uk/usr/400/api/apple
    app.delete("/api/:name", function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            //gets the name of the food you want to delete via curl by using req.params.name then it would use deleteOne to find the name in the collection and delete it or do delete nothing if it is not found as the name does not exist in the collection
            db.collection('foods').deleteOne({ name: req.params.name }, function (err, results) {
                if (err) throw err;
                //this would then display the results in json format 
                res.json(results);
                client.close();
            })
        })
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////-------------------------------List Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //This Page gets all the foods in the database and displays them in a table using list.ejs in alphabetical order 
    app.get('/list', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            db.collection('foods').find().sort({ name: 1 }).toArray((findErr, results) => { //gets all foods from the foods collection and sorts them alphabetically
                if (findErr) throw findErr;
                else {
                    res.render('list.ejs', { pagetitle: "The List", UniqueWord: " here", availablefoods: results }); //diplays all books in the books collection of the database to the user
                }
                client.close();
            });
        });
    });

    //Once submit button is pressed on the list page it would redirect you to the InfoCalculated page
    app.get("/InfoCalculated", (req, res) => {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            var checkboxValue = req.query.checkbox; //stores all the checkboxes selected to checkboxValue 
            var inputtedValue = req.query.inputAmount; //stores all inputted numbers by user as inputtedValue
            //console.log(checkboxValue)
            //console.log(inputtedValue)
            //loops over number of numbers inputted by the user from first number to last number
            for (var i = 0; i < inputtedValue.length; i++) {
                //if a box was left empty it does nothing else it would carry on executing the code within the if statement
                if (inputtedValue[i] != '') {
                    db.collection('foods').find().sort({ name: 1 }).toArray((findErr, results) => { //gets all foods from the foods collection and sorts 
                        //x stores the value inputted by the user for a paritcular food
                        var x = parseFloat(inputtedValue[i])
                        // var z = 5 * x;
                        // console.log(x)
                    })
                }
            }
            res.send("Ticked Check Boxes: " + checkboxValue + " Values Inputted: " +  inputtedValue)
        })
    })
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

//////////////////////------------------------------- Add Food Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //addfood route allows you to add food to the database
    app.get('/addfood', redirectLogin, function (req, res) {
        res.render('addfood.html')
    });

    //handles the post request submitted it would access the database and connect to the collection that you want to store the new information in so in this case it is going to access the foods 
    //collection and store all the information submited with the post request and display what was added to the database back to the person. there is validation so that certain form boxes require numbers and all boxes cannot be empty.
    app.post('/foodadded', [check('name').notEmpty(), check('typicalvalues').notEmpty().isNumeric(), check('unit_of_the_typical_value').notEmpty(), check('kilocalories').notEmpty().isNumeric(), check('carbs').notEmpty().isNumeric(), check('fat').notEmpty().isNumeric(), check('protein').notEmpty().isNumeric(), check('salt').notEmpty().isNumeric(), check('sugar').notEmpty().isNumeric()], function (req, res) {
        // saving data in database
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy');  //access the CalorieBuddy db
            //if any form box is not populated with data required by the user then it would redirect the user to addfood route
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('./updatefood');
            }
            else {
                var sessionname = req.session.userId; //gets the username of the user that is logged in and saves it to sessionname
                db.collection('foods').insertOne({    //inserts information into foods collection including the user who is adding the food via insetOne and it would show user what is being inserted if all form boxes are populated correctly
                    name: req.sanitize(req.body.name),
                    typicalvalues: req.sanitize(req.body.typicalvalues),
                    unit_of_the_typical_value: req.sanitize(req.body.unit_of_the_typical_value),
                    kilocalories: req.sanitize(req.body.kilocalories),
                    carbs: req.sanitize(req.body.carbs),
                    fat: req.sanitize(req.body.fat),
                    protein: req.sanitize(req.body.protein),
                    salt: req.sanitize(req.body.salt),
                    sugar: req.sanitize(req.body.sugar),
                    user: sessionname
                });
                res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + (' This food is added to the database, name: ' + req.body.name + ', typical value: ' + req.body.typicalvalues + ', unit of the typical value is: ' + req.body.unit_of_the_typical_value + ', calories: ' + req.body.kilocalories + ', carbs: ' + req.body.carbs + ', fat: ' + req.body.fat + ', protein: ' + req.body.protein + ', salt: ' + req.body.salt + ', sugar: ' + req.body.sugar) + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>'); //shows what was added to the database
            }
            client.close();
        });
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////------------------------------- Register Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //register route allows you to register
    app.get('/register', function (req, res) {
        res.render('register.html')
    });


    //handels the post request submitted by user that wants to register to the page it would take all the information submitted by the user and add it to the database it would hash thier password
    //and save the hashed password to the database not the plain password. It hashes the password by using saltRounds and the bcrypt.hash function which would hash the password then it would store
    //username,firstname,lastname,email and the hashed password
    app.post('/registered', [check('username').notEmpty(), check('firstname').notEmpty(), check('lastname').notEmpty(), check('email').isEmail(), check('password').isLength({ min: 8 })], function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            const bcrypt = require('bcrypt'); //access to bcrypt functions
            const saltRounds = 10;  //declars the length of the saltRounds it is going to use
            const plainPassword = req.sanitize(req.body.password); //saves inputted password as plainPassword
            //if any form box is not populated with data required by the user then it would redirect the user to register route
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('./register');
            }
            else {
                bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) { //hashes plainPassword using saltRounds and calls it hashedPassword
                    db.collection('users').insertOne({ //inserts all information submitted via insertOne if all form boxes are populated correctly
                        username: req.sanitize(req.body.username), //sanitizes inputed username
                        firstname: req.sanitize(req.body.firstname), //sanitizes inputed firstname
                        lastname: req.sanitize(req.body.lastname), //sanitizes inputed lastname
                        email: req.sanitize(req.body.email), //sanitizes inputed email
                        password: hashedPassword
                    });

                    client.close();
                    res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('You are now registered, Your user name is: ' + req.body.username + ', your password is: ' + req.body.password + ', your first name is ' + req.body.firstname + ', your last name is ' + req.body.lastname + ', your Email is: ' + req.body.email + ', your hashed password is: ' + hashedPassword) + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>');
                })
            }
        });
    });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////------------------------------- Login Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //login route allows you to login
    app.get('/login', function (req, res) {
        res.render('login.html')
    });

    //handles the post request submitted by user that wants to login to their account on the page. It would ask for a username and password and check if the given information is in the database for that user and if it is correct if so it would allow user to login, if not it would tell user which information given is incorrect which maybe username or password.
    app.post('/loggedin', [check('username').notEmpty(), check('password').notEmpty()], function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db('CalorieBuddy'); //access to the CalorieBuddy database
            const bcrypt = require('bcrypt');   //access to the bcrypt functions
            const saltRounds = 10;              //declares the length of the saltRounds it is going to use
            const plainPassword = req.sanitize(req.body.password); //sets plainPassword to equal to inputted password
            var word1 = req.sanitize(req.body.username); //sanitizes entered username and saves it to word1
            //if any form box is not populated with data required by the user then it would redirect the user to login route
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect('./login');
            }
            else {
                db.collection('users').findOne({ username: word1 }, function (err, results) { //checks for the username in the users collection if username is found it would get all of that users information and store it in results
                    if (err) throw err;
                    if (results != null) { //if username is incorrect it would execute the outer else if not it would carry on executing the outer if statement
                        // console.log(results.password);
                        bcrypt.compare(plainPassword, results.password, function (err, result) { // this would compare the plainPassword with the hashedPassword stored in the users collection
                            if (err) throw err;
                            if (result == true) { //if the plainPassword matches with the hashedPassword it would tell the user they have logged in and give them the option to go to the homepage
                                // **** save user session here, when login is successful
                                req.session.userId = req.sanitize(req.body.username);
                                res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('Logged In, All information provided is correct') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>')
                                // console.log(req.session.userId);
                                // console.log(req.body.username);
                            }
                            else { //if the plainPassword does not match with the hashedPassword then it would tell the user that the password entered is incorrect and give them the option to go to the homepage
                                res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('Invalid Password Entered') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>')
                            }
                        })
                    }
                    else { //if username entered is incorrect it would tell user the username is incorrect and give them option to go to the homepage
                        res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('Invalid Username Entered') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>');
                    }
                })
                client.close();
            }
        });
    });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////------------------------------- Logout Route -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
    //this page would logout the user that is logged in if they are not logged in it would ask them to login
    //logs the user out by req.session.destroy
    app.get('/logout', redirectLogin, (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('./')
            }
            res.send('<link rel = "stylesheet" type = "text/css" href="css/custom.css"/>' + ('you are now logged out.') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './about' + '> About </a> ' + '<a href=' + './addfood' + '> Add Food</a>' + '<a href=' + './Register' + '> Register </a>' + '<a href=' + './searchfood' + '> Search Food </a>' + '<a href=' + './updatefood' + '> Update Food </a>' + '<a href=' + './list' + '> List </a>' + '<a href=' + './login' + '> Login </a>' + '<a href=' + './logout' + '> Logout</a>');
        })
    })
/////////////////////////////////////////////////////////////////////////////////////

}


