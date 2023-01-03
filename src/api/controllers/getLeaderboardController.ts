import { HTTPResponseCode } from '../HttpResponse';
import { getLeaderboard } from '../useCases';
import handleControllerError from './handleControllerError';
import { IBaseController } from './IBaseController';

const getLeaderboardController: IBaseController = async (req) => {
	try {
		const { pageNo } = req.query;

		const leaderboard = await getLeaderboard.getPage(pageNo);

		return {
			statusCode: HTTPResponseCode.OK,
			body: leaderboard,
		};
	} catch (err: any) {
		return handleControllerError(err);
	}
};

export default getLeaderboardController;
