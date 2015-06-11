var fivebeans = require('fivebeans');

var host = 'localhost';
var port = 11300;
var tube = 'aftership-tube';
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

var continuer = function(err, jobid)
{
	console.log('emitted job id: ' + jobid);
	if (joblist.length === 0)
		return doneEmittingJobs();

	emitter.put(0, 0, 60, JSON.stringify(['testtube', joblist.shift()]), continuer);
};

var recursive = function(data,callback)
{
		setInterval(function(){
			callback(null,data)
		}, 60000);
}

var emitter = new fivebeans.client(host, port);
emitter.on('connect', function()
{
	emitter.use('testtube', function(err, tname)
	{
		console.log("using " + tname);
		recursive(1,function(err,data){
			emitter.put(0, 0, 3000, JSON.stringify(['testtube', job1]), function(err, jobid)
			{
				if(err){
					fcount++;
				}else{
				console.log('queued a seed job in testtube: ' + jobid);
				scount++;}
				if(scount == 10 || fcount == 3){
					return doneEmittingJobs();
				}
			}
		)}
	);
	});
});


emitter.connect();
