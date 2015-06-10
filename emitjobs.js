var fivebeans = require('fivebeans');

var host = 'localhost';
var port = 11300;
var tube = 'aftership-tube';

var job1 =
{
	type: 'seed',
	payload:
	{
	  from: 'HKD',
	  to: 'USD'
	}
};

var joblist = [{
	type: 'seed',
	payload:
	{
	  from: 'USD',
	  to: 'HKD'
	}
}];

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

var emitter = new fivebeans.client(host, port);
emitter.on('connect', function()
{
	emitter.use('testtube', function(err, tname)
	{
		console.log("using " + tname);
		emitter.put(0, 0, 3000, JSON.stringify(['testtube', job1]), function(err, jobid)
		{
			console.log('queued a seed job in testtube: ' + jobid);
			//emitter.put(0, 0, 60, JSON.stringify(['testtube', job2]), function(err, jobid)
			//{
			//	console.log('queued a key emitter job in testtube: ' + jobid);
			return doneEmittingJobs();

				// And an example of submitting jobs in a loop.
				//emitter.put(0, 0, 3000, JSON.stringify(['testtube', joblist.shift()]), continuer);
			//});
		});
	});
});

emitter.connect();
