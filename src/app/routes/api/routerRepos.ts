import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import * as superagent from 'superagent';
import { config } from '../../../config/impl/Config';
import { UserSession } from '../../db/types/Session';
import { logger } from '../../logger/Logger';

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

router.get('/repos', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	if (token) {
		superagent
			.get('http://api.github.com/user/repos')
			.set('Authorization', `token ${token}`)
			.then((result) => {
				res.status(202).json({
					message: 'Error: cannot get logger',
					repos: result.body,
					success: true,
				});
			}).catch((err) => {
				console.log(err);
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
		});
	}
});

export default router;