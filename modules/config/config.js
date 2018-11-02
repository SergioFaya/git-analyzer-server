// We check in which environment state are we running
// export NODE_ENV=dev
// TODO: cambiar este valor dinamicamente a la hora de iniciar la app
/*
LEER POR CONSOLA SI ES PARA TEST O PARA RELEASE
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    console.log("you entered: [" + 
        d.toString().trim() + "]");
  });
*/
const env = process.env.NODE_ENV;

const dev = {
    app:{
        port: 3000
    },
    db: {
        host: 'mongodb://admin:admin1@ds247223.mlab.com:47223/git-analyzer',
        port: 27017,
        name: 'db',
        collections:{
            commits: 'commits'
        },
        queries: {
            allCommits: {}
        }
    },
    oauth: {
        client_id: 'c4c42af4e127583d6c40',
        client_secret: 'd6aa5e40a8d48ffe98c831f65a244879982fe237',
        state: 'abcdefgh'
    }
};

const test = {
    app:{
        port: 3000
    },
    db: {
        host: 'mongodb://admin:admin1@ds247223.mlab.com:47223/git-analyzer',
        port: 27017,
        name: 'test'
    }
};

const config = {
    dev,
    test
};

//Get the configuration if its being tested or released
//module.exports = config[env];
module.exports = config['dev'];