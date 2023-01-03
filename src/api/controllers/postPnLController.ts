import handleControllerError from './handleControllerError';
import { IBaseController } from './IBaseController';
import { addPnL } from '../useCases';
import { HTTPResponseCode } from '../HttpResponse';

const postPnLController: IBaseController = async (req) => {
	try {
		const userId = req.userId!;
		const { pnl } = req.body;

		await addPnL.add(userId, pnl);

		return {
			statusCode: HTTPResponseCode.CREATED,
		}
	} catch (err: any) {
		return handleControllerError(err);
	}
};

export default postPnLController;
