//ES6 class
module.exports = (mongoclient) => class CrudManager {

    getAll(config, callback) {
        mongoclient.connect(config.host, (err, db) => {
            if (err) {
                console.log(err);
                callback(null);
            } else {
                db.collection(config.col).find(config.query).toArray((err, result) => {
                    if (err) {
                        console.log(err);
                        callback(null);
                    } else {
                        callback(result);
                    }
                });
                db.close();
            }
        });
    }
}