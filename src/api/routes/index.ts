import getLeaderboardController from '../controllers/getLeaderboardController';
import patchPnLController from '../controllers/patchPnLController';
import postPnLController from '../controllers/postPnLController';
import authorizationMiddleware from '../services/auth.service';

const routes: {
	path: string,
	get?: any[],
	post?: any[],
	patch?: any[],
}[] = [
	{
		path: '/pnl',
		post: [authorizationMiddleware, postPnLController],
		patch: [authorizationMiddleware, patchPnLController],
	},
	{
		path: '/leaderboard',
		get: [getLeaderboardController],
	},
];

export default routes;
