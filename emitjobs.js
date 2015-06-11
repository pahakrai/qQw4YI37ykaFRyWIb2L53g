var fivebeans = require('fivebeans');

var host = 'localhost';
var port = 11300;
var testtube = 'pahakrai';
var scount = 0;
var fcount = 0;
var job1 =
{
	type: 'seed',
	payload:
	{
	  from: 'USD',
	  to: 'HKD'
	}
};

var doneEmittingJobs = function()
{
	console.log('We reached our completion callback. Now closing down.');
	emitter.end();
	process.exit(0);
};

/*var continuer = function(err, jobid)
{
	console.log('emitted job id: ' + jobid);
	if (joblist.length === 0)
		return doneEmittingJobs();

	emitter.put(0, 0, 60, JSON.stringify(['testtube', joblist.shift()]), continuer);
};*/

var recursive = function(delay,callback)
{
		setInterval(function(){
			callback(null,delay)
		}, 60000);
}

/*

var emitter = new fivebeans.client(host, port);
emitter.on('connect', function()
{
	emitter.use('testtube', function(err, tname)
	{
		console.log("using " + tname);
			(function iterate(delay){
				if(scount === 10 || fcount === 3){
					return doneEmittingJobs();
				}
			emitter.put(0, 0, delay, JSON.stringify(['testtube', job1]), function(err, jobid)
			{
				if(err){
					fcount++;
					iterate(3000);
				}
				console.log('queued a seed job in testtube: ' + jobid);
				scount++;
				iterate(60000);

			}
		)})(60000);
	});
});

*/

var emitter = new fivebeans.client(host, port);
emitter.on('connect', function()
{
	emitter.use('testtube', function(err, tname)
	{
		console.log("using " + tname);
		recursive(60000,function(err,delay){

			emitter.put(0, 0, delay, JSON.stringify(['testtube', job1]), function(err, jobid)
			{
				if(err){
					fcount++;
					scount = 0;
				}else{
					console.log('queued a seed job in testtube: ' + jobid);
					scount++;
					fcount = 0;
				}
				if(scount === 10 || fcount === 3){
					return doneEmittingJobs();
				}
			})
		})
	})
});


emitter.connect();
