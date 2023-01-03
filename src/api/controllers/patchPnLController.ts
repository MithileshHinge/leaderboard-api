import { HTTPResponseCode } from '../HttpResponse';
import { updatePnL } from '../useCases';
import handleControllerError from './handleControllerError';
import { IBaseController } from './IBaseController';

const patchPnLController: IBaseController = async (req) => {
	try {
		const userId = req.userId!;
		const { pnl } = req.body;

		await updatePnL.update(userId, pnl);

		return {
			statusCode: HTTPResponseCode.OK,
		}
	} catch (err: any) {
		return handleControllerError(err);
	}
};

export default patchPnLController;
