//ES6 class
module.exports = (mongoclient) => class CrudManager {

    /**
     * 
     * @param {JSON} config include host, collection(col) and query to perform the request
     * @param {Function} callback returns null if err, results otherwise
     */
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

    /**
     * 
     * @param {JSON} config include host, collection(col) and data to be inserted 
     * @param {Function} callback returns the status of the insertion, err or the record info
     */
    insert(config, callback){
        mongoclient.connect(config.host, (err,db) => {
            if(err){
                console.log(err);
                callback(null);
            }else{
                db.collection(config.col).insert(config.data,(err, records)=>{
                    if(err){
                        console.log(err);
                        callback(null);
                    }else{
                        callback(records);
                    }
                });
            }
        });
    }

    /**
     * 
     * @param {JSON} config include host, collection(col) and data to be inserted 
     * @param {Function} callback returns the status of the insertion, err or the record info
     */
    insertMany(config, callback){
        mongoclient.connect(config.host, (err,db) => {
            if(err){
                console.log(err);
                callback(null);
            }else{
                db.collection(config.col).insertMany(config.data,(err, records)=>{
                    if(err){
                        console.log(err);
                        callback(null);
                    }else{
                        callback(records);
                    }
                });
            }
        });
    }
};