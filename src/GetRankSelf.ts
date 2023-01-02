import ValidationError from './common/errors/ValidationError';
import id from './common/id';
import { IDataAccess } from './IDataAccess';

export default class GetRankSelf {
	private dataAccess: IDataAccess;

	constructor(dataAccess: IDataAccess) {
		this.dataAccess = dataAccess;
	}

	/**
	 * Get rank of a user
	 * @param userId userId of user
	 */
	async getRank(userId: string) {
		if (!id.isValidId(userId)) {
			throw new ValidationError('userId is invalid');
		}

		const rank = await this.dataAccess.fetchRankByUserId(userId);
		
		if (!rank) {
			throw new ValidationError('User has not submitted PnL value');
		}

		return rank;
	}
}
