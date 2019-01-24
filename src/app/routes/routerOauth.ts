import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import * as request from 'superagent';
import { config } from '../../config/impl/Config';
import { UserSession } from '../db/Session';
import { IUser, UserType } from '../db/User';
import User from '../db/impl/User';
import { logger } from '../logger/Logger';

import jwt from 'jsonwebtoken';
import redis from 'redis';

const redisClient = redis.createClient(config.redis.port);

const router = Router();
const octokit = new Octokit({
	agent: undefined,
	headers: {
		'accept': 'application/vnd.github.v3+json',
		'user-agent': config.oauth.userAgent,
	},
	timeout: 0,
});

// https://github.com/settings/connections/applications/{{client_id}}
router.post('/config', (_req: Request, res: Response): void => {
	res.status(202).json({
		message: 'config',
		success: true,
	});
	// call to auth with the client id
});

// https://github.com/login/oauth/authorize?client_id={{client_id}}&scope={{scope}}
router.get('/login', (_req: Request, res: Response): void => {
	res.redirect('https://github.com/login/oauth/authorize?client_id='
		+ config.oauth.client_id + '&scope=' + config.oauth.scope);
});

/**
 * Se envia el client id con el secret y el
 * codigo que nos manda github después del oauth.
 * -
 * Si el client_id, el client_secre y el code son
 * correctos github nos envía un access token.
 */
router.get('/auth', (req: Request, res: Response) => {
	request
		.post('https://github.com/login/oauth/access_token')
		.send({
			client_id: config.oauth.client_id,
			client_secret: config.oauth.client_secret,
			code: req.query.code,
		})
		.set('Accept', 'application/json')
		.then((result) => {
			const accessToken = result.body.access_token;
			// utilizamos la autenticación de octokit
			octokit.authenticate({
				token: accessToken,
				type: 'oauth',
			});
			saveUserData(req, res, accessToken);
		}).catch((err) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'error when getting the github access token',
				trace: err,
			});
			res.status(404).json({
				message: 'ERROR: cannot get the access token',
				success: false,
			});
		});
});

router.post('/logout', (req: Request, res: Response): void => {
	// Clean the user session
	logger.log({
		date: Date.now().toString(),
		level: 'info',
		message: 'Logout, user:' + req.session.data,
	});
	req.session.data = null;
	res.status(202).json({
		message: 'user session removed',
		success: true,
	});
});
/**
 * Guarda en sesion los datos del usuario que se pillan de github con el token de acceso,
 * genera un token para el usuario normal y corriente y lo añade a la sesion
 * -
 * aqui se implementará un sistema de base de datos basado en redis para guardar los
 * datos de la sesion del usuario
 * -
 * @param req request
 * @param res response
 * @param accessToken token de github
 */
async function saveUserData(_req: Request, res: Response, accessToken: string) {
	request
		.get('https://api.github.com/user')
		.set('Authorization', 'token ' + accessToken)
		.then((result): Promise<UserSession> => {
			const userSession = createSession(accessToken,
				result.body.avatar_url,
				result.body.login,
				result.body.user_id,
				result.body.login,
				result.body.name,
				result.body.type);
			createUser(result.body.avatar_url,
				result.body.login,
				result.body.login,
				result.body.type);
			// Pasamos el userserssion al siguiente then
			return userSession;
		}).then((userSession: UserSession) => {
			const token = jwt.sign(userSession, config.app.tokenSecret, {
				// no le meto expiración pero si fuera necesario
				// expiresIn: 86400
			});
			// Guardamos en redis la sesion del usuario
			redisClient.set(token, JSON.stringify(userSession));

			res.status(202).json({
				message: 'Success in authorizing the user',
				success: true,
				token,
			});
		}).then(() => {
			logger.log({
				date: Date.now().toString(),
				level: 'info',
				message: 'Assigning the user data to the session',
			});
		}).catch((err) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'error when getting the user data',
				trace: err,
			});
			res.status(404).json({
				message: 'ERROR: cannot authenticate, try making another request',
				success: false,
			});
		});
}

async function createSession(accessToken: string, avatarUrl: string, email: string,
	githubUserId: string, login: string, name: string, type: string): Promise<UserSession> {
	const userSession: UserSession = {
		accessToken,
		avatarUrl,
		email,
		githubUserId,
		login,
		name,
		type,
	};
	return userSession;
}

async function createUser(avatarUrl: string, email: string, login: string, type: UserType) {
	const userModel = new User().getModelForClass(User);
	const userData: IUser = {
		avatarUrl,
		email,
		login,
		type,
	};
	const u = new userModel(userData);
	userModel.findOne({
		avatarUrl,
		email,
		login,
		type,
	}, (err, res) => {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'error when finding the user',
			trace: err,
		});
		if (res == null) {
			u.save();
		}
	});
}

export default router;