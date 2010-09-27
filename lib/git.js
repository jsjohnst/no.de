var posix  = require('child_process');
var sys = require("sys");

exports.add_remote = function(remote, cb) {
	posix.exec('git remote add no.de "' + remote + '"', function(error, stdout, stderr) {
		if(error) {
			sys.puts("Git returned: \n\t" + stderr.replace(/\n/, "\n\t"));
			cb && cb(false);
		} else {
			cb && cb(true);
		}
	});
}

exports.get_domain = function(cb, ignore_error) {
	posix.exec("git config joyent.no_de.domain", function(error, stdout, stderr) {
		if(error) {
			if(ignore_error) return cb(null);
			sys.puts("Git returned: \n\t" + stderr.replace(/\n/, "\n\t"));
			cb(null);
		} else if(!stdout.length) {
			sys.puts("We could not find the domain for your no.de instance. Have you called create or bind yet?");
			cb(null);
		} else {
			var hostname = stdout.replace(/\s+/, "");
			cb(hostname);
		}
	});
};

exports.set_domain = function(domain, cb) {
	posix.exec('git config joyent.no_de.domain "' + domain + '"', function(error, stdout, stderr) {
		if(error) {
			sys.puts("Git returned: \n\t" + stderr.replace(/\n/, "\n\t"));
			cb && cb(false);
		} else {
			cb && cb(true);
		}
	});	
};

exports.get_instanceid = function(cb, ignore_error) {
	posix.exec("git config joyent.no_de.instanceid", function(error, stdout, stderr) {
		if(error) {
			if(ignore_error) return cb(null);
			sys.puts("Git returned: \n\t" + stderr.replace(/\n/, "\n\t"));
			cb(null);
		} else if(!stdout.length) {
			sys.puts("We could not find the instanceid for your no.de instance. Have you called create or bind yet?");
			cb(null);
		} else {
			var hostname = stdout.replace(/\s+/, "");
			cb(hostname);
		}
	});
};

exports.set_instanceid = function(instanceid, cb) {
	posix.exec('git config joyent.no_de.instanceid "' + instanceid + '"', function(error, stdout, stderr) {
		if(error) {
			sys.puts("Git returned: \n\t" + stderr.replace(/\n/, "\n\t"));
			cb && cb(false);
		} else {
			cb && cb(true);
		}
	});
};