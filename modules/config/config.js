
// if an argument is specified 
const env = process.argv[2] || 'dev';
if (env != 'dev' && env != 'test' && env != 'deploy') {
	console.error('error', 'environment config not valid');
	process.exit();
}
const dev = {
	app: {
		//if a port is provided runs it else 3000
		port: process.argv[3] || 3000,
		// 0.0.0.0 allows access from any ip address not only from 127.0.0.1 aka localhost
		source: '0.0.0.0'
	},
	db: {
		host: 'mongodb://admin:admin1@ds247223.mlab.com:47223/git-analyzer',
		port: 27017,
		name: 'db',
		collections: {
			commits: 'commits',
			users: 'users'
		},
		queries: {
			allCommits: {}
		}
	},
	oauth: {
		client_id: 'c4c42af4e127583d6c40',
		client_secret: 'd6aa5e40a8d48ffe98c831f65a244879982fe237',
		state: 'abcdefgh',
		scope: 'repo'
	}
};

//Create when specific run is stablished
const test = {
	app: {
		//if a port is provided runs it else 3000
		port: process.argv[3] || 3000,
		source: '0.0.0.0'
	},
	db: {
		host: 'mongodb://admin:admin1@ds247223.mlab.com:47223/git-analyzer',
		port: 27017,
		name: 'db',
		collections: {
			commits: 'commits',
			users: 'users'
		},
		queries: {
			allCommits: {}
		}
	},
	oauth: {
		client_id: 'c4c42af4e127583d6c40',
		client_secret: 'd6aa5e40a8d48ffe98c831f65a244879982fe237',
		state: 'abcdefgh',
		scope: 'repo'
	}
};

const deploy = {

};

const config = {
	dev: dev,
	test:test,
	deploy: deploy
};

//Get the configuration if its being under dev, tested or released
module.exports = config[env];