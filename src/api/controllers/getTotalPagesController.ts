import { HTTPResponseCode } from '../HttpResponse';
import { getLeaderboard } from '../useCases';
import handleControllerError from './handleControllerError';
import { IBaseController } from './IBaseController';

const getTotalPagesController: IBaseController = async (req) => {
	try {
		const count = await getLeaderboard.getTotalPages();

		return {
			statusCode: HTTPResponseCode.OK,
			body: count,
		};
	} catch (err: any) {
		return handleControllerError(err);
	}
};

export default getTotalPagesController;
