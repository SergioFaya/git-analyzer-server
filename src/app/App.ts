import bodyParser from 'body-parser';
import express from 'express';
import * as expressSession from 'express-session';
import {config} from '../config/Config';
import {logger} from './logger/Logger';

class App {

	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
	}

	private config(): void {
		// support application/json type post data
		this.app.use(bodyParser.json());
		// support application/x-www-form-urlencoded post data
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

}

export default new App().app;