import ValidationError from './common/errors/ValidationError';
import { IDataAccess } from './IDataAccess';

export default class GetLeaderboard {
	private RESULTS_PER_PAGE = 50;
	private dataAccess: IDataAccess;

	constructor(dataAccess: IDataAccess) {
		this.dataAccess = dataAccess;
	}

	/**
	 * Get paginated Leaderboard rankings 
	 * @param pageNo leaderboard page no
	 * @returns Promise to return array of {userId, pnlValue} objects sorted by rank
	 */
	async getPage(pageNo: number) {
		if (typeof pageNo === 'number' && pageNo <= 0) {
			throw new ValidationError('pageNo is invalid');
		}

		const rankings = await this.dataAccess.fetchRankingsByRange((pageNo - 1) * this.RESULTS_PER_PAGE, pageNo * this.RESULTS_PER_PAGE - 1);
		return rankings;
	}
}
