import ValidationError from './common/errors/ValidationError';
import id from './common/id';
import validatePnL from './common/validators/validatePnL';
import { IDataAccess } from './IDataAccess';

export default class AddPnL {
	private dataAccess: IDataAccess;

	constructor(dataAccess: IDataAccess) {
		this.dataAccess = dataAccess;
	}

	/**
	 * Add new PnL value for user
	 * @param userId userId of the user
	 * @param pnlValue PnL value in percentage (for e.g. -20 for -20%)
	 */
	async add(userId: string, pnlValue: number) {
		if (!id.isValidId(userId)) {
			throw new ValidationError('userId is invalid');
		}

		if (!validatePnL(pnlValue)) {
			throw new ValidationError('pnlValue is invalid');
		}

		if (await this.dataAccess.fetchPnLValue(userId)) {
			throw new ValidationError('pnlValue already submitted');
		}

		await this.dataAccess.insertPnLValue({
			userId,
			pnlValue
		});
	}
}
