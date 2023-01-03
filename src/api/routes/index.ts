import postPnLController from '../controllers/postPnLController';
import authorizationMiddleware from '../services/auth.service';

const routes: {
	path: string,
	get?: any[],
	post?: any[],
	patch?: any[],
}[] = [{
	path: '/pnl',
	post: [authorizationMiddleware, postPnLController],
}];

export default routes;
