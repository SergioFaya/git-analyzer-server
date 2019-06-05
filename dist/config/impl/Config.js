"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deployType = process.argv[2];
const argPort = +(process.argv[3]);
const local = {
    app: {
        port: argPort || 3001,
        source: '0.0.0.0',
        tokenSecret: 'WjKJHMvaLkEnfsN3JHFY',
        repositoryFilesPath: './resources/',
        chartsConfig: {
            logOptions: ['--all', '--date-order', '--pretty=%H|%P|%d|%an']
        }
    },
    db: {
        collections: {
            commits: 'commits',
            users: 'users',
        },
        host: 'mongodb://127.0.0.1:27017/git-analyzer',
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
const deploy = {
    app: {
        port: argPort || 3001,
        source: '0.0.0.0',
        tokenSecret: 'WjKJHMvaLkEnfsN3JHFY',
        repositoryFilesPath: './resources/',
        chartsConfig: {
            logOptions: ['--all', '--date-order', '--pretty=%H|%P|%d|%an']
        }
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
            baseUrl: 'http://ec2-34-243-245-144.eu-west-1.compute.amazonaws.com',
        },
    },
};
const preConfig = {
    deploy,
    local,
};
exports.config = preConfig[deployType];
//# sourceMappingURL=Config.js.map