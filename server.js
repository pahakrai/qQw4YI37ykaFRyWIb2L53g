var http = require('http'),
    fs = require('fs'),
    socketio = require('socket.io'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    express = require('express');



//var app = express();

function compile(str,path){
  return stylus(str).set('filename', path);
}


/*app.set('views',__dirname + '/server/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());*/


//if(env==="development"){
mongoose.connect('mongodb://localhost/newscloud');
//}
//else{
//mongoose.connect('mongodb://pahak:newscloud@ds061278.mongolab.com:61278/newscloud');
//}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection ------ errror!!!'));
db.once('open', function callback(){
  console.log('cloudnews db connected');
});


var exSchema = mongoose.Schema({from: String, to: String, date: Date, rate: String });
var Rate = mongoose.model('Rate', exSchema);
var mongoEx;
createDefaultEx();

function createDefaultEx() {
  Rate.find({}).exec(function(err, collection){
    if(collection.length === 0){
      Rate.create({from:'USD',to:'NPR',date: new Date(),rate: '100'});
      Rate.create({from:'USD',to:'HKD',date: new Date(),rate: '7.25'});
    }
  })
}

/*Rate.findOne({from:'USD',to:'NPR'}).exec(function(err, exDoc){
  mongoEx = exDoc.rate;
});*/


var handler = function(req,res){
  fs.readFile("index.html", function(err,data){
    if(err){
      res.writeHead(500);
      return res.end("error finding index.html")
    }
    else{
      res.writeHead(200);
      res.end(data);
    }
  });

};

var app = http.createServer(handler);
//var io = socketio.listen(app);

/*io.sockets.on('connection', function(socket){
  setInterval(function{
    console.log({name:pahak});
    socket.emit('name',{name:pahak});
  },4000);
});*/



/*app.get('/', function(req, res){
  res.render('index')//, {exchangeRate: mongoEx})
}).listen(8080);*/

var io = socketio.listen(app);

/*io.sockets.on('connection', function(socket){
  setInterval(updatedata(socket), 3000);
});*/


function updatedata(socket) {
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
          console.log( rate + 'updated properly');
        }
      });
    });
  });

  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });

  request.end();

}

setInterval(updatedata, 60000);

app.listen(8080);
