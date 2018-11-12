var mongo = require('mongodb');
var mongoclient = mongo.MongoClient;
module.exports = class CRUDObject {

	/**
	 * @param {JSON} config include host and collection(col) 
	 */
	constructor(config) {
		this.config = config;
	}

	/**
	 * @param {Function} callback returns null if err, results otherwise
	 */
	create(callback) {
		mongoclient.connect(this.config.host, (err, db) => {
			if (err) {
				console.log(err);
				callback(null);
			} else {
				db.collection(this.config.col).insert(this.config.data, (err, records) => {
					if (err) {
						console.log(err);
						callback(null);
					} else {
						callback(records);
					}
				});
			}
		});
	}

	/**
	 * @param {Function} callback returns the status of the insertion, err or the record info
	 */
	createMany(config, callback){
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

	/**
	 * 
	 * @param {Function} callback returns the data from the db and 
	 */
	retrieve(callback) {
		mongoclient.connect(this.config.host, (err, db) => {
			if (err) {
				console.log(err);
				callback(null);
			} else {
				db.collection(this.config.col).find(this.config.query).toArray((err, result) => {
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

	update() {

	}

	delete() {

	}

};