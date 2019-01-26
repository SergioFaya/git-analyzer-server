import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import { config } from '../../../config/impl/Config';
import { UserSession } from '../../db/Session';
import { logger } from '../../logger/Logger';

import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import NodeRSA from 'node-rsa';

const payload = {
	exp: Date.now() + (10 * 60),
	iat: Date.now(),
	iss: 'Iv1.618440b9cb61855a',
};

const options = {};

// const privatePem = fs.readFileSync(config.res.private_key, 'UTF-8');
// const key =  new NodeRSA();
// key.importKey(privatePem);
// const privateKey = key.exportKey();
// const token = jwt.sign(payload, privateKey, options);

const router = Router();
const octokit = new Octokit({
	agent: undefined,
	headers: {
		// 'accept': 'application/vnd.github.v3+json',
		// custom media type for accesing API during preview
		'accept': 'application/vnd.github.machine-man-preview+json',
		// 'accept': 'application/vnd.github.machine-man+json',
		'user-agent': config.oauth.userAgent,
		// 'user-agent': 'octokit/rest.js v16.0.1',
	},
	timeout: 0,
});

router.get('/repos', (req: Request, res: Response): void => {
	const userSession: UserSession = req.session.userSession;
	if (userSession) {
		octokit.apps.listRepos({})
			.then((result: any) => {
				res.status(202).json({
					message: 'repo list obtained',
					result,
					success: true,
					userSession,
				});
			})
			.catch((err: any) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Error: error when calling api',
					trace: err,
				});
				res.status(500).json({
					message: 'Error with github api',
					trace: err,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get user session',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get logger',
			success: false,
			userSession,
		});
	}
});

export default router;