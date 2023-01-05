import ValidationError from './common/errors/ValidationError';
import { IDataAccess } from './IDataAccess';

export default class GetLeaderboard {
	private RESULTS_PER_PAGE: number;
	private dataAccess: IDataAccess;

	constructor(dataAccess: IDataAccess, resultsPerPage: number) {
		this.dataAccess = dataAccess;
		this.RESULTS_PER_PAGE = resultsPerPage;
	}

	/**
	 * Get paginated Leaderboard rankings 
	 * @param pageNo leaderboard page no
	 * @returns Promise to return array of {userId, pnlValue} objects sorted by rank
	 */
	async getPage(pageNo: number | string) {
		const pageNoValidated: number = typeof pageNo === 'number' ? pageNo : parseInt(pageNo, 10);
		if (pageNoValidated <= 0) {
			throw new ValidationError('pageNo is invalid');
		}

		// TODO: The two following db calls can be combined into single call for some performance improvement (time complexity will remain the same (O(log(n) + m)))
		const rankings = await this.dataAccess.fetchRankingsByRange((pageNoValidated - 1) * this.RESULTS_PER_PAGE + 1, pageNoValidated * this.RESULTS_PER_PAGE);
		const usernames = await this.dataAccess.fetchUsernamesByUserIds(rankings.map(({ userId }) => userId));
		return rankings.map(({ userId, pnlValue}) => ({
			userId,
			username: usernames[userId],
			pnlValue,
		}));
	}
}
