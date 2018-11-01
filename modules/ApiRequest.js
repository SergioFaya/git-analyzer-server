//ES6 class
module.exports = (https) => class ApiRequest {
    constructor(user, method = 'GET') {
        const host = 'api.github.com'
        var path = '/repos/' + user.username + '/' + user.repo + '/commits';
        var headers = { 'user-agent': 'SergioFaya' };
        var content = 'json'

        if (!arguments.length) {
            //empty constructor
            console.log("Regular api call")
            path = '';
        }
        this.options = {
            'host': host,
            'path': path,
            'method': method,
            'headers': headers,
            'content-type': 'json'
        }
    }

    //Setters and getters are authomatic ()
    get options() {
        return this._options;
    }

    set options(options) {
        this._options = options;
    }

    performRequest(callback) {
        var request = https.request(this.options, (resp) => {
            var data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk.toString('utf8');
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                data = eval( '('+data+')')
                callback(data);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            return null;
        });
        request.end();
    }
}