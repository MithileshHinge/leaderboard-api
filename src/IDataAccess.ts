/**
 * DataAccess interface provided by the domain layer
 */
export interface IDataAccess {
	/**
	 * Insert PnL value into the db
	 * @throws DatabaseError if operation failed
	 */
	insertPnLValue({userId, pnlValue}: {
		userId: string;
		pnlValue: number;
	}): Promise<void>;

	/**
	 * Fetch pnlValue by userId
	 * @throws DatabaseError if operation failed
	 * @returns Promise to return pnlValue if found, otherwise null
	 */
	fetchPnLValue(userId: string): Promise<number | null>;

	/**
	 * Update pnlValue for given userId
	 * @throws DatabaseError if operation failed
	 */
	updatePnLValue({userId, pnlValue}: {
		userId: string;
		pnlValue: number;
	}): Promise<void>;

	/**
	 * Fetch rank by userId (rank starts from 1, not 0)
	 * @throws DatabaseError if operation failed
	 * @returns Promise to return rank if pnlValue is found otherwise null
	 */
	fetchRankByUserId(userId: string): Promise<number | null>;

	/**
	 * Fetch rankings by range (all inclusive, rank starts from 1, not 0)
	 * @throws DatabaseError if operation failed
	 * @returns Promise to return array of { userId, pnlValue } objects sorted by rank
	 */
	fetchRankingsByRange(from: number, to: number): Promise<{
		userId: string;
		pnlValue: number;
	}[]>;

	/**
	 * Fetch names of users by userIds
	 * @throws DatabaseError if operation failed
	 * @returns Promise to return object map of userIds to usernames, username is null for non-existent userIds
	 */
	fetchUsernamesByUserIds(userIds: string[]): Promise<{ [userId: string] : string | null}>;
}
