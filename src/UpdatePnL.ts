import ValidationError from './common/errors/ValidationError';
import id from './common/id';
import validatePnL from './common/validators/validatePnL';
import { IDataAccess } from './IDataAccess';

export default class UpdatePnL {
	private dataAccess: IDataAccess;

	constructor(dataAccess: IDataAccess) {
		this.dataAccess = dataAccess;
	}

	/**
	 * Update PnL value for user
	 * @param userId userId of user
	 * @param pnlValue PnL value in percentage (for e.g. -20 for -20%)
	 */
	async update(userId: string, pnlValue: number) {
		if (!id.isValidId(userId)) {
			throw new ValidationError('userId is invalid');
		}

		if (!validatePnL(pnlValue)) {
			throw new ValidationError('pnlValue is invalid');
		}

		if (!(await this.dataAccess.fetchPnLValue(userId))) {
			throw new ValidationError('pnlValue has not been submitted');
		}

		await this.dataAccess.updatePnLValue({
			userId,
			pnlValue
		});
	}
}
