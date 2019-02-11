import { Config } from '../Config';

// If an argument is provided in the initialization
// of the server, parses it to number and uses it in the config
// + is the unary operator for parsing numbers
const argPort: number = +(process.argv[2]);

export const config: Config = {
	app: {
		port: argPort || 3001,
		source: '0.0.0.0',
		tokenSecret: 'WjKJHMvaLkEnfsN3JHFY',
	},
	db: {
		collections: {
			commits: 'commits',
			users: 'users',
		},
		host: 'mongodb://admin:admin1@ds247223.mlab.com:47223/git-analyzer',
		name: 'db',
		port: 27017,
		queries: [
			['allCommits', {}],
		],
	},
	oauth: {
		client_id: 'c4c42af4e127583d6c40',
		client_secret: 'd6aa5e40a8d48ffe98c831f65a244879982fe237',
		scope: 'repo',
		state: 'abcdefgh',
		userAgent: 'SergioFaya',
	},
	redis: {
		port: 6379,
	},
	res: {
		private_key: '../../res/privateKey.pem',
		public_key: '../../res/publicKey.pem',
	},
	services: {
		auth: {
			baseUrl: 'localhost:3000',
		},
	},
};
