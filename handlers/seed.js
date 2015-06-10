var aftershipvar = require('../aftership');

module.exports = function()
{
	function SeedHandler()
	{
		this.type = 'seed';
	}
	// This is an extremely silly kind of job.
	SeedHandler.prototype.work = function(payload, callback)
	{	var keys = Object.keys(payload);
		aftershipvar.updatedata(keys);
		/*var keys = Object.keys(payload);
		for (var i = 0; i < keys.length; i++)
			console.log(payload[keys[i]]);*/
		callback('success');
	};

	var handler = new SeedHandler();
	return handler;
};
