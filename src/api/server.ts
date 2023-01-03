import express, { Request, Response } from 'express';
import morgan from 'morgan';
import { hasKey } from '../common/helpers';
import handleExpressRequest from './handleExpressRequest';
import routes from './routes';

const app = express();

app.use(morgan((tokens, req, res) => [
	tokens.method(req, res),
	tokens.url(req, res),
	tokens.status(req, res),
	`userId=${req.user ? req.user.userId : '-'}`,
	`body=${JSON.stringify(req.body)}`,
].join(' ')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', 1);

routes.forEach((route) => {
	const { path, ...controllers } = route;
	Object.entries<any>(controllers).forEach(([method, middlewares]: [string, Array<any>]) => {
		if (hasKey(app, method)) {
			const [controller] = middlewares.splice(middlewares.length - 1, 1);
			app[method](path, middlewares, async (req: Request, res: Response) => {
				await handleExpressRequest(req, res, controller);
			});
		} else {
			console.log(method);
			console.log(typeof app);
		}
	});
});

export default app;
