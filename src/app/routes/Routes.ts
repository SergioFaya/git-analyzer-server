import {  Router } from 'express';

export abstract class Routes {

	public readonly router: Router;

	constructor() {
		this.router = Router();
	}
}