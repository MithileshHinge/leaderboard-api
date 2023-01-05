import { HTTPResponseCode } from '../HttpResponse';
import { getRankSelf } from '../useCases';
import handleControllerError from './handleControllerError';
import { IBaseController } from './IBaseController';

const getRankController: IBaseController = async (req) => {
	try {
		const userId = req.userId!;
		const rank = await getRankSelf.getRank(userId);

		return {
			statusCode: HTTPResponseCode.OK,
			body: rank,
		};
	} catch (err: any) {
		return handleControllerError(err);
	}
};

export default getRankController;
