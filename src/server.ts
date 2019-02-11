import { Router } from 'express';
import app from './app/App';
import { logger } from './app/logger/Logger';
import routerRepos from './app/routes/api/routerRepos';
import routerForm from './app/routes/routerForm';
import routerSession from './app/routes/routerSession';
import routerWebhooks from './app/routes/routerWebhooks';
import routerUserData from './app/routes/user/routerUserData';

import { config } from './config/impl/Config';

app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, UPDATE, PUT');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
	next();
});

const privateSites = [routerSession, routerWebhooks, routerRepos, routerForm, routerUserData];

privateSites.filter((x: Router) => {
	app.use('/', x);
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
