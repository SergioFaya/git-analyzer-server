import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import * as superagent from 'superagent';
import { config } from '../../../config/impl/Config';
import { UserSession } from '../../db/types/Session';
import { logger } from '../../logger/Logger';

const payload = {
	exp: Date.now() + (10 * 60),
	iat: Date.now(),
	// identica al creador del token
	iss: 'Iv1.618440b9cb61855a',
};

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
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant get access to the repository',
					trace: err.message,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get user token',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get user repositories',
			success: false,
		});
	}
});

router.get('/repos/reponame', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	// const username = req.header('username');
	const reponame = req.header('reponame');
	if (token && reponame) {
		superagent
			.get(`http://api.github.com/repos/${reponame}`)
			.set('Authorization', `token ${token}`)
			.then((result) => {
				res.status(202).json({
					message: 'User repositories',
					repo: result.body,
					success: true,
				});
			}).catch((err) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant get access to the repository',
					trace: err.message,
				});
				res.status(202).json({
					message: 'Error: cannot get repos of user',
					repo: null,
					success: false,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get username, token or reponame',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get user repo',
			success: false,
		});
	}
});
// todo a pelo.... TODO: Limpiar

router.get('/contributors', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	const reponame = req.header('reponame');
	if (token && reponame) {
		superagent
			.get(`https://api.github.com/repos/${reponame}/contributors`)
			.set('Authorization', `token ${token}`)
			.then((result) => {
				const contributors = result.body;
				const final = contributors.map((x: any) => {
					return {
						avatar_url: x.avatar_url,
						contributions: x.contributions,
						login: x.login,
					};
				});
				superagent
					.get(`https://api.github.com/repos/${reponame}/stats/contributors`)
					.set('Authorization', `token ${token}`)
					.then((result2) => {
						const arr = result2.body;
						const total: any[] = [];
						return popullateTotal(final, arr, total);
					}).then((total) => {
						res.status(202).json({
							contributors: total,
							message: 'User collaborators',
							success: true,
						});
					});
			}).catch((err) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant get access to the repository',
					trace: err.message,
				});
				res.status(202).json({
					message: 'Error: cannot get repos of user',
					repo: null,
					success: false,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get username, token or reponame',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get user repo',
			success: false,
		});
	}
});

async function popullateTotal(final: [], arr: [], total: any) {
	if (arr instanceof Array && final instanceof Array) {
		final.forEach((i: any) => {
			arr.forEach((j: any) => {
				const reduced = j.weeks.reduce((anterior: any, actual: any) => {
					return {
						a: anterior.a + actual.a,
						c: anterior.c + actual.c,
						d: anterior.d + actual.d,
					};
				});
				if (i.login === j.author.login) {
					total.push({
						avatar_url: i.avatar_url,
						contributions: i.contributions,
						login: i.login,
						modifications: reduced,
						total: j.total,
					});
				}
			});
		});
	}
	return total;
}

async function sendResponse(final: any, arr: any, res: any) {
	const total: any[] = [];
	await popullateTotal(final, arr, total);
	res.status(202).json({
		contributors: total,
		message: 'User collaborators',
		success: true,
	});
}
export default router;