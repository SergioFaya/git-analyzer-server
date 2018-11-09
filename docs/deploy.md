# Deployment on aws EC2

We will select an ubuntu server for the deployment. And change the security group to include TCP and HTTP by default and a custom TCP protocol with the port you want the app to run.

## Install nodejs

```bash
sudo apt-get install nodejs
```

Then just clone the repo and install express with all the dependencies.

```bash
sudo apt-get install npm
sudo npm install express
sudo npm install 
```

## Run the app

Run `node index.js` serves the app on port 3000, if the port is allowed in the security group you should be able to see it using the public_dns:3000 on a browser.

## References

* [Digital Ocean Production Node js](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04#prerequisites)
  
* [Hackernoon tutorial](https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-2-5fbdea95f8a1)
* [Digital Ocean Docs](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7)