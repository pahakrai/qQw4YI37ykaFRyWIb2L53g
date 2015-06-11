var http = require('http'),
    fs = require('fs');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];

require('./server/config/mongoose')(config);

var Rate = require('mongoose').model('Rate');

//var count = 0;

function updatedata(payload) {

    var keys = Object.keys(payload);

    var fromCur = payload[keys[0]],
        toCur = payload[keys[1]];


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
        var responseapi = JSON.parse(body);
        var ratenew = Math.round(responseapi.rates.HKD * 100) / 100;
        var query = {from: 'USD', to: 'HKD'};
        var update = {date: new Date(), rate: ratenew };
        var options = {new: true};
        Rate.findOneAndUpdate(query, update, options).exec(function(err, rate) {
            if (err) {
              console.log('query:' + err.message);
            }else {
              console.log( rate + ' ' + 'updated properly');
            }
          });
      });
    });

    request.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
    });

    request.end();

}

exports.updatedata = updatedata;
