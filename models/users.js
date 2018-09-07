const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_name: String,
  _id: String,
  log: [{_id: String, date: Date , description: String, duration: Number, Date: String}]
}, {
  collection: 'fitness'
});

const User = module.exports = mongoose.model('User', userSchema);