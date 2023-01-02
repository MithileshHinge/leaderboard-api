import { IDataAccess } from '../IDataAccess';

export default class DataAccess implements IDataAccess {
	async insertPnLValue({ userId, pnlValue }: {
		userId: string;
		pnlValue: number;
	}): Promise<void> {
		throw new Error('Method not implemented.');
	}
	
	async fetchPnLValue(userId: string): Promise<number | null> {
		throw new Error('Method not implemented.');
	}
}
