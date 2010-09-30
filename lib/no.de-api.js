var sys = require("sys");
var http = require("http");
var config = require("./config");

exports.coupons = {};

var client = http.createClient("443", "api.no.de", true);

var auth = new Buffer(config.get("username") + ":" + config.get("password")).toString("base64");

var headers = {host: "api.no.de", authorization: "Basic " + auth};

function make_request(method, path, params, done_cb) {
	headers["content-length"] = params ? params.length : 0;
	var request = client.request(method, path, headers);
	request.__data = "";
	
	request.on("response", function(response) {
		response.on("error", function(error) {
			done_cb(error, response.statusCode, null);
		});
		response.on("data", function(chunk) {
			request.__data += chunk;
		});
		response.on("end", function() {
			var json = null;
			if(request.__data.length) {
				json = JSON.parse(request.__data);
			}
			done_cb(null, response.statusCode, json);
		});
	});
	
	request.end(params);
} 

exports.coupons.list = function(cb) {
	make_request("GET", "/coupons", null, cb);
};

exports.coupons.request = function(cb) {
	make_request("POST", "/heart", null, cb);
};

exports.nodes = {};

exports.nodes.list = function(cb) {
	make_request("GET", "/smartmachines/node", null, cb);
};

exports.nodes.get = function(id, cb) {
	make_request("GET", "/smartmachines/node/" + id, null, cb);
};

exports.create = function(subdomain, coupon, cb) {
	make_request("POST", "/smartmachines/node", "coupon=" + coupon + "&subdomain=" + subdomain, cb);
};