import * as bodyParser from 'body-parser';
import express from 'express';
import expressSession from 'express-session';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config/impl/Config';

class App {

	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.dbSetUp();
		this.sessionSetUp();
	}

	private config(): void {
		// support application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({ extended: true }));
		// support application/json type post data
		this.app.use(bodyParser.json());
	}

	private dbSetUp(): void {
		mongoose.connect(config.db.host, { useNewUrlParser: true }, (err: MongoError): void => {
			if (err) {
				throw new Error('Db error: ' + err);
			}
		});
	}

	private sessionSetUp(): void {
		this.app.use(expressSession({
			resave: true,
			saveUninitialized: true,
			secret: 'abcdefg',
		}));
	}
}

export default new App().app;