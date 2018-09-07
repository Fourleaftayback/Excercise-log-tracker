const mongoose = require('mongoose');
const shortId = require('shortid');
const User = require('./models/users');
const Exercise = require('./models/excercise');
const moment = require('moment');

const findUser = (name) => {
  return new Promise(resolve => {
    User.findOne({user_name: name}, (err, mongoData) => {
      resolve(mongoData);
    });
  })  
}

const createNewUser = (name) => {
  return new Promise(resolve => {
    User.create({user_name: name, _id: shortId.generate()}, (err, data) => {
      if (err) console.log(err);
      User.findOne({user_name: name}, (err, mongoData) => {
        resolve(mongoData);
      })    
    })
  })
}

async function findUserAndSave(name) {
  let data =  await findUser(name);
  if(data === null) {
    data = await createNewUser(name);
    return data;
  } else {
    return false;
  }
}

const findIt = (myId) => {
  return new Promise(resolve => {
    User.findById(myId, (err, data) => {
      if(err) console.log(err);
      resolve(data);
    });
  })
}

const addExercise = (myId, obj) => {
  return new Promise(resolve => {
   User.findByIdAndUpdate(myId,{$push: {log: obj}}, 
     {new: true, upsert: true}, (err, data) => {
     if(err) console.log(err);
     resolve(data);
   }) 
 })
}

async function findAndAddExercise(myId, obj) {
  let data = await findIt(myId);
  if (data === null) {
    return false;
  } else {
    data = await addExercise(myId, obj);
    return data;
  }
}

const findAndFilter = (myId) => {
  return new Promise(resolve => {
    User.findById(myId, (err, data) => {
      if(err) console.log(err);
      resolve(data);
    }).select('_id user_name log.date log.description log.duration');
  })
}

const displayLog = (fullLog, start, end) => {
  return new Promise(resolve => {
    if(start === undefined && end === undefined) { 
      resolve(fullLog)
    } else if (start !== undefined && end === undefined) {
      fullLog.log = fullLog.log.filter((item) => {
        return item.date.getTime() >= new Date(start).getTime() 
      })
      resolve(fullLog);
    } else if (start === undefined && end !== undefined) {    
      fullLog.log = fullLog.log.filter((item) => {
        return item.date.getTime() <= new Date(end).getTime() 
      })
      resolve(fullLog);
    } else {
      fullLog.log = fullLog.log.filter((item) => {
        return item.date.getTime() >= new Date(start).getTime() &&
               item.date.getTime() <= new Date(end).getTime() 
      })
      resolve(fullLog);
    }
  })
   
}
//convert returned date to readable date 
const convertDate = (obj) => {
  let convertedLog = [];
  obj.log.map(item => convertedLog
   .push({Date: moment(item.date).format('dddd MMMM Do YYYY'),
   description: item.description,
   duration: item.duration}));
  return convertedLog;
}

exports.findUserAndSave = findUserAndSave;
exports.findAndAddExercise = findAndAddExercise;
exports.findIt = findIt;
exports.findAndFilter = findAndFilter;
exports.displayLog = displayLog;
exports.convertDate = convertDate;