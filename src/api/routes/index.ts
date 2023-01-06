import getLeaderboardController from '../controllers/getLeaderboardController';
import getRankController from '../controllers/getRankController';
import getTotalPagesController from '../controllers/getTotalPagesController';
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
	{
		path: '/leaderboard/totalPages',
		get: [getTotalPagesController],
	},
	{
		path: '/rank',
		get: [authorizationMiddleware, getRankController],
	},
];

export default routes;
