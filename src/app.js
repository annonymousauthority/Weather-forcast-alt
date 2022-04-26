const express = require('express');
const bodyParser = require('body-parser');
const {Op} = require("sequelize")
const {sequelize} = require('./model')
const https = require('https');
const { json } = require('express/lib/response');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)



app.post('/addlocation/:slug', async (req, res)=>{
    var forcast
    var location;
    var locationdata = [];
    var jsonLocationdata = "";
    var temp = [];
    var maxTemp = [];
    var minTemp = [];
    var resultJson
    const {Location} = req.app.get('models')
    const {Forcast} = req.app.get('models')
    const forcastoptions = "https://www.7timer.info/bin/astro.php?lon=" + req.query.long + "&lat=" + req.query.lat + "&ac=0&unit=metric&output=json&tzshift=0"
    // console.log(forcastoptions)
    const _request = https.request(forcastoptions, function(res) {
        console.log(`statusCode: ${res.statusCode}`)
      
        res.on('data',function(chunk){
          locationdata.push(chunk) 
        })

        res.on('end',function(){
          jsonLocationdata = JSON.parse(locationdata.join(''))
          // console.log(jsonLocationdata)
          for (let index = 0; index < jsonLocationdata.dataseries.length; index++) {
            temp.push(jsonLocationdata.dataseries[index].temp2m);
          }
          // console.log(temp)
          minTemp = Math.min.apply(null, temp),
          maxTemp = Math.max.apply(null, temp);
          var todayDate = new Date().toISOString().slice(0, 10);
          // console.log(todayDate)
          // console.log(minTemp,maxTemp)
          // json = {
          //   "date" :todayDate,
          //   "min":minTemp,
          //   "max":maxTemp
          // }
        //   console.log("Json", json)

        // forcast = Forcast.create({min: minTemp, max: maxTemp})
        location = Location.create({longitude: req.query.long, latitude: req.query.lat, slug: req.params.slug, min: minTemp, max:maxTemp}) 
        })
        _request.on('error', error => {
            console.error(error)
        })
    })
    _request.end()
  
    res.send("Completed Successfully")
})

app.get('/forcast/:slug', async(req,res)=>{
  const {Location}  = req.app.get('models')
  const {slug} = req.params
  const location = await Location.findOne({attributes: { exclude: ['id','slug', 'updatedAt','longitude', 'latitude'] }, where: {slug}})
  if(!location) return res.status(404).end()
  var jsonQuery = {
    "date": location.createdAt,
    "min-forcasted": location.min,
    "max-forcasted": location.max
  }
  res.json(jsonQuery)
})

app.get('/getalllocation/', async(req,res)=>{
  const {Location}  = req.app.get('models')
  const location = await Location.findAll({attributes: [[sequelize.fn('DISTINCT', sequelize.col('createdAt')), 'createdAt'], 'min', 'max', 'slug'],  exclude: ['id','updatedAt','longitude', 'latitude'] })
  var jsonQuery;
  for (let index = 0; index < location.length; index++) {
    var json = {
      "location_name": location[index].slug,
      "min-forcast": location[index].min,
      "max-forcast": location[index].max,
      "createdAt" : location[index].createdAt
    }
    jsonQuery.push(json)
  }
  if(!location) return res.status(404).end()
  res.json(jsonQuery)
})

app.get('/getforcast', async(req,res) =>{
  var forcast
  var location;
  var locationdata = [];
  var jsonLocationdata = "";
  var temp = [];
  var maxTemp = [];
  var minTemp = [];
  var resultJson
  const {Location} = req.app.get('models')
  const forcastoptions = "https://www.7timer.info/bin/astro.php?lon=" + req.query.long + "&lat=" + req.query.lat + "&ac=0&unit=metric&output=json&tzshift=0"
  const _request = https.request(forcastoptions, function(response) {
    console.log(`statusCode: ${response.statusCode}`)
  
    response.on('data',function(chunk){
      locationdata.push(chunk) 
    })

    response.on('end',function(){
      jsonLocationdata = JSON.parse(locationdata.join(''))
      // console.log(jsonLocationdata)
      for (let index = 0; index < jsonLocationdata.dataseries.length; index++) {
        temp.push(jsonLocationdata.dataseries[index].temp2m);
      }
      // console.log(temp)
      minTemp = Math.min.apply(null, temp),
      maxTemp = Math.max.apply(null, temp);
      var todayDate = new Date().toISOString().slice(0, 10);
      var json = {
        "date" :todayDate,
        "min":minTemp,
        "max":maxTemp
      }
      res.send(json)
    })
    _request.on('error', error => {
        console.error(error)
    })
})
_request.end()

})


app.get('/getforcast/:slug', async (req, res)=>{
  var dateRange = [];
  var forcast  = [];
  var startdate = req.query.start_date
  var enddate = req.query.end_date
  for(var arr=[],dt=new Date(startdate); dt<=new Date(enddate); dt.setDate(dt.getDate()+1)){
    dateRange.push(new Date(dt).toISOString().slice(0, 10));
  }
  const {Location} = req.app.get('models')
  console.log(dateRange)
  for (let index = 0; index < dateRange.length; index++) {
    var location = await Location.findOne({ group: 'createdAt', attributes: { exclude: ['id','slug', 'updatedAt','longitude', 'latitude'] },where: {createdAt: dateRange[index]}})
    var jsonQuery = {
      "date": location.createdAt,
      "min-forcasted": location.min,
      "max-forcasted": location.max
    }
    forcast.push(jsonQuery)
  }
  
  res.send(forcast)
})


app.get('/updateforcast/:slug', async (req,res)=>{
  const lat = req.query.lat
  const long = req.query.long

  const slug = req.params.slug

  const {Location} = req.app.get('models')
  await Location.update({longitude: long, latitude: lat}, {where:{slug}})

  res.send("Your location has been updated correctly")
})

app.get('/deleteforcast/:slug', async (req,res)=>{
  const slug = req.params.slug

  const {Location} = req.app.get('models')

  await Location.destroy({where:{slug}})

  res.send("Location successfully removed from your Database")
})



const CronJob = require('cron').CronJob;

console.log('Before job instantiation');
const job = new CronJob('00 00 00 * * *', async function()  {
 
  var resultJson
  const {Location}  = app.get('models')
  const location = await Location.findAll({ group: 'slug', attributes: {exclude: ['id','updatedAt','min', 'max', 'createdAt']} })
  // console.log(location)
  for (let index = 0; index < location.length; index++) {
   
  
    console.log("Count:", index)
    const forcastoptions = "https://www.7timer.info/bin/astro.php?lon=" + location[index].longitude + "&lat=" + location[index].latitude + "&ac=0&unit=metric&output=json&tzshift=0"
    // console.log(forcastoptions)
    const _request = https.request(forcastoptions, function(res) {
        console.log(`statusCode: ${res.statusCode}`)
        var locationdata = [];
        var jsonLocationdata = "";
        var temp = [];
        var maxTemp = [];
        var minTemp = [];
        res.on('data',function(chunk){
          locationdata.push(chunk) 
          // console.log(locationdata)
        })

        res.on('end',function(){
          jsonLocationdata = JSON.stringify(locationdata.join('')).replace(/(?:\\[rtn])+/g, '') 
          var parsedJson = JSON.parse(jsonLocationdata)
          var pJson = JSON.parse(parsedJson)
          // console.log(pJson.dataseries)
          for (let index = 0; index < pJson.dataseries.length; index++) {
            temp.push(pJson.dataseries[index].temp2m);
          }
          minTemp = Math.min.apply(null, temp),
          maxTemp = Math.max.apply(null, temp);
          
        var _location = Location.create({longitude: location[index].longitude, latitude: location[index].latitude , slug: location[index].slug, min: minTemp, max:maxTemp}) 
        })
        _request.on('error', error => {
            console.error(error)
        })
    })
    _request.end()
  }

  console.log("data inputed")
});

console.log('Waiting for midnight to check forcast')
job.start();




module.exports = app