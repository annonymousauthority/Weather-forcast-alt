# APPTWEAK BACKEND TASK

🌜 An Introduction to the project.

✨✨✨✨ TASKS
1. Create/List/Remove/Delete Locations they are interested in
2. Get historical forecasted temperature values for locations they are interested in

😫💭 
# ASSUMPTIONS

* --> The datebase represent weather forcast and locations of a single user
* --> The user won't require authentication to carry out CRUD functions.
* --> The user cannot create multiple location with the same `slug`
> *** All db Models are defined in the src/model.js**


### APIs IMPLEMENTED
# Create Location
To add a favorite location to the database call the `.../addlocation/:slug?long=&lat=`
This function checks the forcast for that day using the 7Timer api, returns this values in a clean json format and stores this data to the database.

# Check Forcast
A simple url to check the present day forcast without storing it's values in the database 
`.../getforcast?long=&lat=`

# Update Slug name
Let's say you want the user to update a slug name (eg. myhome from certain location(lat,lng) to another location details). 
call the `.../updateforcast/:slug?lat=&long=`

# Delete Forcast
The user has relocated and has a newhome and has no need for the old `myhome` slug. You can just call the 
`.../deleteforcast/:slug`

# Forcast History
The user is interested in seeing the history of forcast around a date range. Just call the 
`.../getforcast/:slug?start_date=&end_date=` the dates should be in `DATE` type alone `YYYY-MM-DD`

# Daily Data crawl
New Forcast for user's slug is checked every midnight... `00 00` 


### POTENTIAL UPGRADES
* --> User can undergo simple authentication by being given a `unique identifier` at the beginning to addlocation and for every operation by the user, the user must add this `unique identifier` to match with what's on the system.

* --> A new users table can be set where each user is given a unique `id` or `api_key` where this key would be added to the url get request for every query done on the `location` database

he exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

 ## Technical Notes

1. Start by cloning this repository.

  

2. In the repo root directory, run `npm install` to gather all dependencies.

  

3. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

  

4. Then run `npm start` which should start both the server and the React client.


5. The database is the `LOCATION` database.
  

# Project Information
  

- The server is running with [nodemon](https://nodemon.io/).

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. 

- The server is running on port 3001.

- For Authentication I've created a little checker in the middleware folder that checks for a user's account details accessing location details,
although not functional, this function can be called inside every get function in the `app.js` file.



# Test
--> `You can easily test the codes by running localhost using the information above`
--> Access the database.sqlite file to access already existing file from date `2022-04-26` and `2022-04-27`

