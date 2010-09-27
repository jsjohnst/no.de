no.de deployment tool
=====================

This tool is designed to automate the process of setting up new no.de instances
and connect them to your existing git repository to allow easy and fast
deployment of nodejs projects.

Commands
--------

$ no.de config --api [username] [password]
    -- used to set the username and password for your node account

$ no.de instances
    -- lists your existing node instances and their current status

$ no.de coupons
    -- lists your existing coupon codes

$ no.de coupons --request
    -- requests a new coupon code

$ no.de bind [no.de instance id]
    -- binds the given no.de instance to this repository (like create, but without the actual creation)

$ no.de info
    -- shows information about the instance this repository is linked too

$ no.de deploy
    -- short cut alias for `git push no.de master`

$ no.de open
    -- short cut alias for `open http://[your domain].no.de/`

$ no.de shell
    -- (WARNING BUGGY!) short cut alias for `ssh node@[your domain].no.de`

$ no.de log
    -- short cut alias for `ssh node@[your domain].no.de /opt/nodejs/bin/node-service-log`

$ no.de help
	-- prints out a list of commands

Methods still pending implementation
------------------------------------	

> no.de sshkeys
    -- lists all the keys in the access list for your node account

> no.de sshkeys --add [optional path to ssh public key]
    -- adds the specified SSH public key to the access list, or uses ~/.ssh/id_[dsa|rsa].pub if not provided

> no.de sshkeys --rm [sshkey id]
	-- removes the specified ssh key from the access list
	
> no.de create [hostname]
    -- creates a new no.de instance and adds a git remote named 'no.de'