var mongoose = require('mongoose');

var exSchema = mongoose.Schema({
  from: String,
  to: String,
  date: Date,
  rate: String
});

var Rate = mongoose.model('Rate', exSchema);


function createDefaultRates() {
  Rate.find({}).exec(function(err, collection){
    if(collection.length === 0){
      Rate.create({from:'USD',to:'NPR',date: new Date(),rate: '100'});
      Rate.create({from:'USD',to:'HKD',date: new Date(),rate: '7.25'});
    }
  })
}

exports.createDefaultRates = createDefaultRates;
