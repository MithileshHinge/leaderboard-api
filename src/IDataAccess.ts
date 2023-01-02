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
}
