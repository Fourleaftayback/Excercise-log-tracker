const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const moment = require('moment');

mongoose.connect('mongodb://localhost:27017/freecodecamp');

const mongoFunc = require('./services');
const exerciselog = require('./routes/api');

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(exerciselog);


app.post('/api/exercise/new-user', (req, res) => {
  mongoFunc.findUserAndSave(req.body.username)
  .then((data) => {
    if(data === false) {
      res.send("The User Already Exist")
    } else {
      res.json({username: data.user_name, id: data._id});
    }
  }); 
})


app.post('/api/exercise/add', (req, res) => {

  let newData = {
    _id: req.body.userId,
    date: req.body.date,
    description: req.body.description,
    duration: req.body.duration
  }

  mongoFunc.findAndAddExercise(req.body.userId, newData)
  .then((data) => {
    if(data === false) {
      res.send("ID does not exist")
    } else {
      let ind = data.log.length;
      res.json({
        username: data.user_name,
        description: data.log[ind-1].description,
        duration: data.log[ind-1].duration,
        _id: data._id,
        date: moment(data.log[ind-1].date).format('dddd MMMM Do YYYY')
      }); 
    }
  })
})


app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})


app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
