#!/usr/bin/env node

var sys = require("sys");
var no_de = require("./no.de");

var argv = process.argv.slice(2);

var command = argv.shift();

var method = command;
var params = [];

switch(command) {
	case "sshkeys":
		if(argv.length) {
			method = method + "_" + argv.shift().substr(2);
			params = argv;
		}
		break;
	case "config":
		method = method + "_" + argv.shift().substr(2);
		params = argv;
		break;
	case "coupons":
		if(argv.length) {
			method = method + "_" + argv.shift().substr(2);
		}
		break;
	case "help":
		if(argv.length) {
			params = argv.shift();
		}
		break;
	case "bind":
		params = argv;
		break;
	case "create":
		if(argv.length) {
			if(argv[0].substr(2) == "bind") {
				argv.shift();
				params = argv;
				params.push(true);
			} else {
				params = argv;
				params.push(false);
			}
		} else {
			sys.puts("Missing arguments to create.");
			method = null;
		}
		break;
}

if(method && no_de.commands.hasOwnProperty(method) && no_de.commands[method].call) {
	no_de.commands[method].apply(no_de, params);
} else {
	sys.puts("invalid or missing command: `no.de help` for a list of commands");
}