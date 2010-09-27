var fs = require("fs");
var sys = require("sys");

var configFile = process.env.HOME + "/.no.de-config";
var config = {};

// TODO: get rid of the nasty Sync stuff
// The config file is tiny and this is needed, so ok for the moment

try {
	config = JSON.parse(fs.readFileSync(configFile));
} catch(e) {
	fs.writeFileSync(configFile, JSON.stringify(config));
}

exports.get = function(key) {
	return config[key];
};

exports.set = function(key, value) {
	config[key] = value;
};

exports.save = function() {
	fs.writeFileSync(configFile, JSON.stringify(config));
}

