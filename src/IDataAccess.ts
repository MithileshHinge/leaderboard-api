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
	 * Fetch rank by userId
	 * @throws DatabaseError if operation failed
	 * @returns Promise to return rank if pnlValue is found otherwise null
	 */
	fetchRankByUserId(userId: string): Promise<number | null>;
}
