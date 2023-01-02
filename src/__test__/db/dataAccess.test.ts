import id from "../../common/id";
import { DATABASE_CONFIG } from "../../config";
import DataAccess from "../../db/DataAccess";
import DbConnection from "../../db/DbConnection";

describe('Data Access implementation tests', () => {
	const dbConnection = new DbConnection();
	const dataAccess = new DataAccess(dbConnection);
	const testUserId = id.createId();

	afterEach(async () => {
		await dbConnection.redis.del(DATABASE_CONFIG.REDIS_SORTED_SET_NAME);
	});

	afterAll(async () => {
		await dbConnection.close();
	})

	it('Can insert PnL value into db', async () => {
		await expect(dataAccess.insertPnLValue({ userId: testUserId, pnlValue: -20 })).resolves.not.toThrowError();
		await expect(dbConnection.redis.zscore(DATABASE_CONFIG.REDIS_SORTED_SET_NAME, testUserId)).resolves.toBe("-20");
	});

	it.todo('Can fetch PnL value from db');

	it.todo('Can update PnL value into db');

	it.todo('Can fetch rank by userId');

	it.todo('Can fetch rankings by range');
});
