const mongoose = require('mongoose');

const excerciseSchema = mongoose.Schema({
  username: String,
  _id: String,
  log: Array
}, {
  collection: 'fitness'
});

const Excercise = module.exports = mongoose.model('Excercise', excerciseSchema);