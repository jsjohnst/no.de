var sys = require("sys");
var fs = require("fs");

var api = require("./lib/no.de-api");
var git = require("./lib/git");
var config = require("./lib/config");

var no_de = {};

no_de.commands = {
	config_api: function(username, password) {
		if(!username && !password) {
			sys.puts("Current no.de API config");
			sys.puts("\tusername: " + config.get("username"));
			sys.puts("\tpassword: " + config.get("password"));
		} else if(!password) {
			sys.error("Please provide a password for this account!");
		} else {
			config.set("username", username);
			config.set("password", password);
			config.save();
			sys.puts("New config options for API have been saved!");
		}
	},
	sshkeys: function() {
		sys.puts("Not implemented!");
	},
	sshkeys_add: function() {
		sys.puts("Not implemented!");
	},
	sshkeys_rm: function() {
		sys.puts("Not implemented!");
	},
	instances: function() {
		git.get_instanceid(function(instanceid) {
			api.nodes.list(function(err, status, json) {
				if(status == 200) {
					if(json.length) {
						var found = false;
						sys.puts("Instances:");
						for(var i=0;i<json.length;i++) {
							var id = json[i].uri.split("/").pop();
							var found = instanceid == id ? true : found;
							sys.puts((instanceid == id ? "  *  " : "     ") + "Host (id #" + id + ") -- http://" + json[i].hostname + " (" + json[i].ip + ")");
						}
						if(found) sys.puts("\n\n* - the instance belonging to this git repo");
					} else {
						sys.puts("You have no instances currently! Try creating one maybe?");
					}
				} else {
					sys.puts("Unable to connect to no.de API. Try checking your credentials maybe?");
				}
			});
		}, true);
	},
	coupons: function() {
		api.coupons.list(function(err, status, json) {
			if(status == 200) {
				if(json.length) {
					for(var i=0;i<json.length;i++) {
						sys.puts("Coupon #" + (i+1) + ": " + json[i].code);
					}
				} else {
					sys.puts("You have no available coupons! Try requesting one maybe?");
				}
			} else {
				sys.puts("Unable to connect to no.de API. Try checking your credentials maybe?");
			}
		});
	},
	coupons_request: function() {
		api.coupons.request(function(err, status, json) {
			if(status == 201) {
				sys.puts("You are one lucky person! Here's your coupon code: " + json.code);
			} else if(status == 202) {
				sys.puts("Ahh darn! Guess you got waitlisted... :(");
			} else if(status == 409) {
				sys.puts(json.errors[0]);
			} else {
				sys.puts("Unable to connect to no.de API. Try checking your credentials maybe?");
			}
		});
	},
	bind: function(id) {
		api.nodes.get(id, function(error, status, json) {
			if(status == 200) {
				var instanceid = json.uri.split("/").pop();
				if(instanceid != id) {
					sys.puts("Something very bad happened! Please file a bug!");
				} else {
					git.add_remote(json.repo, function() {
						git.set_domain(json.hostname, function() {
							git.set_instanceid(instanceid, function() {
								sys.puts("Successfully bound this git repo to: " + json.hostname);
							});
						});
					});
				}
			}
		});
	},
	create: function(hostname, coupon) {
		sys.puts("Not implemented!");
	},
	info: function() {
		git.get_instanceid(function(instanceid) {
			if(instanceid) {
				api.nodes.get(instanceid, function(error, status, json) {
					sys.puts("no.de info for id #" + instanceid);
					sys.puts("\thostname: " + json.hostname + "(" + json.ip + ")");
					sys.puts("\tremote repository: " + json.repo);
				});
			} else {
				sys.puts("Have you called `no.de create` or `no.de bind` yet on this repository?");
			}
		});
	},
	deploy: function() {
		var child = posix.exec("git push no.de master", function(error, stdout, stderr) {
			if(error) {
				sys.puts("Git returned: \n\t" + stderr.replace(/\n/, "\n\t"));
				
				if(error.code == 128) {
					sys.puts("Did you setup this repository yet using `no.de create` or `no.de bind`?");
				}
			} else {
				stdout && sys.puts(stdout);
				stderr && sys.puts(stderr);
			}
		});
	},
	open: function() {
		git.get_domain(function(hostname) {
			if(hostname) {
				posix.exec("open http://" + hostname, function(error, stdout, stderr) {
					if(error) {
						sys.puts("Failed to open website");
					} else {
						sys.puts("Opened http://" + hostname);
					}
				});
			} else {
				sys.puts("Failed!");
			}
		});
	},
	shell: function() {
		// TODO: This is still very buggy!
		sys.puts("This will probably break your shell and is buggy!");
		git.get_domain(function(hostname) {
			if(hostname) {
				sys.puts("connecting to: node@" + hostname);
				
				var stdin = process.openStdin();
				
				var child = posix.spawn("ssh", ["node@" + hostname], {
					cwd: process.cwd(),
					env: process.env,
					customFds: [stdin, -1, -1]
				});
				
				child.stdout.on('data', function(data) {
					sys.print(data);
				});
				
				child.stderr.on('data', function(data) {
					sys.print(data);
				});
			} else {
				sys.puts("Failed!");
			}
		});
	},
	log: function() {
		git.get_domain(function(hostname) {
			if(hostname) {
				sys.puts("node logs on: " + hostname);
				
				var child = posix.spawn("ssh", ["node@" + hostname, "/opt/nodejs/bin/node-service-log"], {
					cwd: process.cwd(),
					env: process.env
				});
				
				child.stdout.on('data', function(data) {
					sys.puts(data);
				});
			} else {
				sys.puts("Failed!");
			}
		});
	},
	help: function(command) {
		fs.readFile(__dirname + "/README.md", function(err, data) {
			var lines = data.toString().split("\n");
			for(var i=0;i<lines.length;i++) {
				if(lines[i].match(/^\$/)) {
					sys.puts(lines[i].substr(2));
					sys.puts(lines[i+1]);
				}
			}
		});
	}
}

exports.commands = no_de.commands;