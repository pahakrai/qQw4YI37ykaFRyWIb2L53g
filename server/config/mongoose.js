var mongoose = require('mongoose'),
    rateModel = require('../models/Rate');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection ------ errror!!!'));
  db.once('open', function callback(){
    console.log('aftership db connected');
  });

  rateModel.createDefaultRates();
}
