import { Router } from 'express';
import app from './app/App';
import routerForm from './app/routes/impl/RouterForm';
import routerHome from './app/routes/impl/RouterHome';
// import routerNotFound from './app/routes/impl/RouterNotFound';
import routerOauth from './app/routes/impl/RouterOauth';
import routerSession from './app/routes/impl/RouterSession';
import routerWebhooks from './app/routes/impl/RouterWebhooks';
import { config } from './config/impl/Config';

const routers = [routerForm, routerHome, routerOauth, routerSession, routerWebhooks];
routers.filter((x: Router) => {
	app.use('/', x);
});

app.listen(config.app.port, config.app.source, () => {
	// tslint:disable-next-line:no-console
	console.log('Express server listening on port ' + config.app.port);
});