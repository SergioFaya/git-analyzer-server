const jwt = require('jsonwebtoken');
const fs = require('fs');
const NodeRsa = require('node-rsa');
var key = new NodeRsa();
var superagent = require('superagent');

//PKCS#1 RSAPrivateKey
var pemBuffer = fs.readFileSync('./resources/git-analyzer.2019-01-30.private-key.pem');
key.importKey(pemBuffer);
var private_key = key.exportKey('pkcs1-private');
//console.log(private_key);
var iat = Date.now().toString();
iat = iat.substring(0, 10);
var exp = (Date.now() + (10 * 60)).toString();
exp = exp.substring(0, 10);
var payload = {
    // issued at time
    iat: parseInt(iat),
    // expiration time
    exp: parseInt(exp),
    // github app identifier
    iss: 18416
}
var token = jwt.sign(payload, private_key, { algorithm: 'RS256' });
//console.log(token);

superagent.get('https://api.github.com/app')
    .set("Accept", "application/vnd.github.machine-man-preview+json")
    .set("Authorization", "Bearer " + token)
    .then((result) => {
        console.log(result.body);
    }).catch(err => {
        console.log(err);
    });

