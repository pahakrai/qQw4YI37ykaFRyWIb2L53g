var http = require('http'),
    fs = require('fs');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];

require('./server/config/mongoose')(config);

var Rate = require('mongoose').model('Rate');


function updatedata(keys) {
  console.log(keys);
  setInterval(function(){
    var fromCur = 'USD',
        toCur = 'HKD';


    var options = {
      host : 'api.fixer.io',
      path : "/latest?base="+fromCur+"&symbols="+toCur,
      port : 80,
      method : 'GET'
    }

    var request = http.request(options, function(response){
      var body = "";
      response.on('data', function(data) {
        body += data;
      });
      response.on('end', function() {
        var response = JSON.parse(body);
        var query = {from: 'USD', to: 'HKD'};
        var update = {date: new Date(), rate: response.rates.HKD };
        var options = {new: true};
        Rate.findOneAndUpdate(query, update, options).exec(function(err, rate) {
          if (err) {
            console.log('got an error');
          }else {
            console.log( rate );
            console.log('updated properly');
          }
        });
      });
    });

    request.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
    });

    request.end();
  },6000);
  /*var fromCur = 'USD',
      toCur = 'HKD';


  var options = {
    host : 'api.fixer.io',
    path : "/latest?base="+fromCur+"&symbols="+toCur,
    port : 80,
    method : 'GET'
  }

  var request = http.request(options, function(response){
    var body = "";
    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {
      var response = JSON.parse(body);
      var query = {from: 'USD', to: 'HKD'};
      var update = {date: new Date(), rate: response.rates.HKD };
      var options = {new: true};
      Rate.findOneAndUpdate(query, update, options).exec(function(err, rate) {
        if (err) {
          console.log('got an error');
        }else {
          console.log( rate + 'updated properly');
        }
      });
    });
  });

  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });

  request.end();*/

}

exports.updatedata = updatedata;
