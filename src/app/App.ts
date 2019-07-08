import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config/impl/Config';
import { logger } from '../logger/Logger';

/**
 * Builds the application configuration
 */
class App {

	public app: express.Application;

	/**
	 * Creates an express application with the system config and sets up the database
	 */
	constructor() {
		this.app = express();
		this.config();
		this.dbSetUp();
	}

	/**
	 * Server configuration
	 */
	private config(): void {
		// support application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({ extended: true }));
		// support application/json type post data
		this.app.use(bodyParser.json());
		// cross origin
		this.app.use(cors());
	}

	/**
	 * Connects the application to the database
	 */
	private dbSetUp(): void {
		mongoose.connect(config.db.host, { useNewUrlParser: true }, (err: MongoError): void => {
			if (err) {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Unable to connect to database',
				});
				throw new Error('Db error: ' + err);
			}
		});
	}
}

/**
 * Creates new serverjs application
 */
export default new App().app;
