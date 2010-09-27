no.de deployment tool
=====================

This tool is designed to automate the process of setting up new no.de instances
and connect them to your existing git repository to allow easy and fast
deployment of nodejs projects.

Commands
--------

$ no.de config --api [username] [password]
    -- used to set the username and password for your node account

$ no.de config --sshkeys [optional path to ssh public key]
    -- adds the specified SSH public key to the access list, or uses ~/.ssh/id_[dsa|rsa].pub if not provided

$ no.de instances
    -- lists your existing node instances and their current status

$ no.de coupons
    -- lists your existing coupon codes

$ no.de coupons --request
    -- requests a new coupon code
    
$ no.de create [hostname]
    -- creates a new no.de instance and adds a git remote named 'no.de'

$ no.de info
    -- shows information about the instance this repository is linked too

$ no.de deploy
    -- short cut alias for `git push no.de master`

$ no.de open
    -- short cut alias for `open http://[your domain].no.de/`
