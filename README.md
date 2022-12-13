This is my README For my Final App & Repo Assessment My web application is called CalorieBuddy.

R1: Home page (Implemented):

R1A: Display the name of the web application.

R1B:  Display links to other pages or a navigation bar that contains links to other pages.

<b>R1A and R1B has fully been implemented into the web application you can find the file in views/home.html and the logic for it in routes/main.js at lines 20-24</b>



R2: About page (Implemented): 

R2A: Display information about the web application including your name as the developer. Display a link to the home page or a navigation bar that contains links to other pages.

<b>R2A has been fully implemented into the web application you can find the file in views/about.html and the logic for it in routes/main.js at lines 25-30</b>


R3: Register page (Implemented):

R3A: Display a form to users to add a new user to the database. The form should consist of the following items: first name, last name, email address, username, and password.  Display a link to the home page or a navigation bar that contains links to other pages.

R3B:  Collect form data to be passed to the back-end (database) and store user data in the database. Each user data consists of the following fields: first name, last name, email address, username and password. To provide security of data in storage, a hashed password should only be saved in the database, not a plain password.

R3C: Display a message indicating that add operation has been done.

<b>R3A, R3B and R3C have been fully implemented into the web application you can find the file in views/register.html and the logic for it in routes/main.js at lines 404-447</b>



R4: Login page (Implemented):

R4A: Display a form to users to log in to the dynamic web application. The form should consist of the following items: username and password.  Display a link to the home page or a navigation bar that contains links to other pages.

R4B: Collect form data to be checked against data stored for each registered user in the database. Users are logged in if and only if both username and password are correct.

R4C: Display a message indicating whether login is successful or not and why not successful.

<b>R4A, R4B and R4C have been fully implemented into the web application you can find the file in views/login.html and the logic for it in routes/main.js at lines 450-502</b>


R5: Logout (Implemented):

There is a way to logout, a message is displayed upon successful logout.

<b>R5 has been fully implemented into the web application you can find the logic for it in routes/main.js at lines 505-516</b>



R6: Add food page (only available to logged-in users) (Implemented):

R6A: Display a form to users to add a new food item to the database. The form should consist of the following items: name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar.  Display a link to the home page or a navigation bar that contains links to other pages.

R6B:  Collect form data to be passed to the back-end (database) and store food items in the database. Each food item consists of the following fields: name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. Here is an example of a food item:
name: flour, typical values per:100, unit of the typical value: gram, calories:  381 kilocalories, carbs: 81 g, Fat: 1.4 g, Protein: 9.1 g, salt: 0.01 g, and sugar: 0.6 g. The unit of the typical value may have values such as gram, liter, tablespoon, cup, etc. Going beyond by saving the username of the user who has added this food item to the database.

R6C: Display a message indicating that add operation has been done.

<b>R6A, R6B, R6C has fully been implemented into the web application you can find the file for it in views/addfood.html and the logic for it in routes/main.js at lines 360-401</b>



R7: Search food page (Implemented):

R7A: Display a form to users to search for a food item in the database. 'The form should contain just one field - to input the name of the food item'. Display a link to the home page or a navigation bar that contains links to other pages.

R7B:  Collect form data to be passed to the back-end (database) and search the database based on the food name collected from the form. If food found, display a template file (ejs, pug, etc) including data related to the food found in the database to users; name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. Display a message to the user, if not found.

R7C: Going beyond, search food items containing part of the food name as well as the whole food name. As an example, when searching for bread display data related to pitta bread, white bread, wholemeal bread, and so on.

<b>R7A, R7B, R7C has been fully implemented into the web application you can find the files for it in views/search.html and views/searchlist.ejs and you can find the logic for it in routes/main.js at lines 33-64</b>


R8: Update food page (only available to logged-in users) (Implemented):

R8A: Display search food form. Display a link to the home page or a navigation bar that contains links to other pages.

R8B: If food found, display data related to the food found in the database to users including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar in forms so users can update each field. Display a message to the user if not found. Collect form data to be passed to the back-end (database) and store updated food items in the database. Display a message indicating the update operation has been done. You can go beyond this requirement by letting ONLY the user who created the same food item update it.

R8C: Implement a delete button to delete the whole record, when the delete button is pressed, it is good practice to ask 'Are you sure?' and then delete the food item from the database, and display a message indicating the delete has been done. You can go beyond this requirement by letting ONLY the user who created the same food item delete it.

<b>R8A, R8B, R8C has been fully implemented into the web application you can find the files for it in views/updatefood.html and views/updatefoodlist.ejs and you can find the logic for it in routes/main.js at lines 66-188</b>



R9: List food page (available to all users) (Partially implemented):

R9A: Display all foods stored in the database including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar, sorted by name. Display a link to the home page or a navigation bar that contains links to other pages.

R9B: You can gain more marks for your list page is organised in a tabular format instead of a simple list.

R9C: going beyond by letting users select some food items (e.g. by displaying a checkbox next to each food item and letting the user input the amount of each food item in the recipe e.g. 2x100 g flour). Then collect the name of all selected foods and calculate the sum of the nutritional information (calories, carbs, fat, protein, salt, and sugar) related to all selected food items for a recipe or a meal and display them as nutritional information and calorie count of a recipe or a meal. Please note, it is not necessary to store recipes or meals in the database.

<b>R9A, R9B has been fully implemented into the web application and R9C has been attempted you can find the file for it in views/list.ejs and the logic for it in routes/main.js at lines 313-358</b>

 

R10: API (Implemented):

There is a basic API displayed on '/api' route listing all foods stored in the database in JSON format. i.e. food content can also be accessed as JSON via HTTP method, It should be clear how to access the API (this could include comments in code). Additional credit will be given for an API that implements get, post, push and delete.

<b>R10 has fully been implemented into the web application you can find the code for it in routes/main.js at lines 190-311 (There are comments there explaining how to use going beyond for API)</b>



R11: form validation (Implemented):

All form data should have validations, examples include checking password length, email validation, integer data is integer and etc.

<b>Form validation has been implemented at each post request where the user is required to input data to be submitted also sanitization has been implemented for all data that the user inputs.</b>


R12: Your dynamic web application must be implemented in Node.js on your virtual server. The back-end of the web application could be MongoDB or MySQL. Make sure you have included comments in your code explaining all sections of the code including database interactions.

<b>My dynamic web application has been implemented in Node.js on my virtual server. The back-end of the web application is Mongodb and there are comments in my code explaining all sections of the code including database interactions.</b>


As you can see above, you need your own model (backend data structure), your own operations on that model, and the ability to access those operations through the web and (to some extent) through an API. Your dynamic web application has a database backend that implements CRUD operations (the database can be MySQL or MongoDB)

|-----------------------------------------------------------------------------------------------------------------------------------------------------------|

<b>R1: Home page Implemented. - R1A and R1B has fully been implemented into the web application you can find the file in views/home.html and the logic for it in routes/main.js at lines 20-24</b>

<b>R2: About page Implemented. - R2A has been fully implemented into the web application you can find the file in views/about.html and the logic for it in routes/main.js at lines 25-30</b>

<b>R3: Register page Implemented. - R3A, R3B and R3C have been fully implemented into the web application you can find the file in views/register.html and the logic for it in routes/main.js at lines 404-447</b>

<b>R4: Login page Implemented. - R4A, R4B and R4C have been fully implemented into the web application you can find the file in views/login.html and the logic for it in routes/main.js at lines 450-502</b>

<b>R5: Logout Implemented. - R5 has been fully implemented into the web application you can find the logic for it in routes/main.js at lines 505-516</b>

<b>R6: Add food page (only available to logged-in users) Implemented. - R6A, R6B, R6C has fully been implemented into the web application you can find the file for it in views/addfood.html and the logic for it in routes/main.js at lines 360-401</b>

<b>R7: Search food page Implemented. - R7A, R7B, R7C has been fully implemented into the web application you can find the files for it in views/search.html and views/searchlist.ejs and you can find the logic for it in routes/main.js at lines 33-64</b>

<b>R8: Update food page (only available to logged-in users) Implemented. - R8A, R8B, R8C has been fully implemented into the web application you can find the files for it in views/updatefood.html and views/updatefoodlist.ejs and you can find the logic for it in routes/main.js at lines 66-188</b>

<b>R9: List food page (available to all users) Paritally Implemented. - R9A, R9B has been fully implemented into the web application and R9C has been attempted you can find the file for it in views/list.ejs and the logic for it in routes/main.js at lines 313-358</b>

<b>R10: API Implemented. - R10 has fully been implemented into the web application you can find the code for it in routes/main.js at lines 190-311 (There are comments there explaining how to use going beyond for API)</b>

<b>R11: Form Validation Implemented. - Form validation has been implemented at each post request where the user is required to input data to be submitted also sanitization has been implemented for all data that the user inputs. </b>

<b>R12: Implemented - My dynamic web application has been implemented in Node.js on my virtual server. The back-end of the web application is Mongodb and there are comments in my code explaining all sections of the code including database interactions.</b>

My dynamic web application uses Mongodb. It has 2 collections one called users and the other called foods these collections are stored in the CalorieBuddy database. The foods collection contains all the information of the foods in the collection so one document in foods would have 10 fields which are name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar, user and those fields contain all the information for a specific food. The user collection contains all the registered users information where one document would have 5 fields which are username, firstname, lastname, email and password (which is the hashedpassword) and those fields contain all the information for a specific user.

|------------------------------------------------------------------------------------------------------------|

   How My Database Looks                                                                                    
   Database name:                                                                                            
   CalorieBuddy                                                                                             
                                                                                                            
   Collections:                                                                                             
   foods (contains all the foods added to the database                                                      
   users (contains the information of users that registered)                                                
                                                                                                            
   Fields For Foods:                                                                                         
   name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar, user   
                                                                                                            
   Fields For Users:                                                                                        
   username, firstname, lastname, email and password (which is the hashedpassword)                          

|------------------------------------------------------------------------------------------------------------|
