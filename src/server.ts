import { Request, Router } from 'express';
import { Response } from 'express-serve-static-core';
import app from './app/App';
import routerCharts from './app/routes/api/charts/ChartRouter';
import routerCommits from './app/routes/api/commit/CommitRouter';
import routerOrganizations from './app/routes/api/orgs/OrgsRouter';
import routerIssues from './app/routes/api/recentActivity/IssuesRouter';
import routerReposContributions from './app/routes/api/repo/ContributionRouter';
import routerRepos from './app/routes/api/repo/RepoRouter';
import routerCodeReview from './app/routes/api/review/CodeReviewRouter';
import routerUserData from './app/routes/api/user/UserDataRouter';
import routerSession from './app/routes/auth/AuthenticactionMiddleware';
import routerWebhooks from './app/routes/hooks/WebHooksRouter';
import { config } from './config/impl/Config';
import { logger } from './logger/Logger';

var path = require('path');

const globalAny: any = global;
globalAny.appRoot = path.resolve(__dirname);

// TODO: considerar cambiar por el módulo cors
app.use((_req: Request, res: Response, next: any) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, UPDATE, PUT');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
	next();
});

const privateSites = [
	routerWebhooks,
	routerSession,
	routerRepos,
	routerCommits,
	routerIssues,
	routerUserData,
	routerReposContributions,
	routerOrganizations,
	routerCharts,
	routerCodeReview
];

privateSites.filter((router: Router) => {
	app.use('/', router);
});

app.listen(config.app.port, config.app.source, () => {
	// tslint:disable-next-line:no-console
	console.log('Express server listening on port ' + config.app.port);
	logger.log({
		date: Date.now().toString(),
		level: 'info',
		message: 'Server started',
	});


});
