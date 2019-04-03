import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config/impl/Config';
import { logger } from '../logger/Logger';

class App {

	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.dbSetUp();
		// no se necesita session, pasamos a tokens
		// this.sessionSetUp();
	}

	private config(): void {
		// support application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({ extended: true }));
		// support application/json type post data
		this.app.use(bodyParser.json());
		// cross origin
		this.app.use(cors());
	}

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

export default new App().app;
