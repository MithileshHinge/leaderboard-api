import { randomInt } from "crypto";
import ValidationError from "../common/errors/ValidationError";
import id from "../common/id";
import DataAccess from "../db/DataAccess";
import GetLeaderboard from "../GetLeaderboard";

jest.mock('../db/DataAccess');

describe('Get Leaderboard use case tests', () => {
	const mockDataAccess = new DataAccess() as jest.Mocked<DataAccess>;
	mockDataAccess.fetchRankingsByRange.mockImplementation(async (from, to) => Array(to - from).map(() => ({
		userId: id.createId(),
		pnlValue: randomInt(-100, 300),
	})));
	const getLeaderboard = new GetLeaderboard(mockDataAccess);
	
	const testUserId = id.createId();

	afterEach(() => {
		Object.values(mockDataAccess).forEach((mockMethod) => {
			if (typeof mockMethod === 'function') {
				mockMethod.mockClear();
			}
		});
	});
	
	it('Can get leaderboard page', async () => {
		const leaderboard = await getLeaderboard.getPage(randomInt(1, 10));
		expect(leaderboard.length).toBeGreaterThan(0);
		leaderboard.forEach((item) => {
			expect(item).toStrictEqual(expect.objectContaining({
				userId: expect.any(String),
				pnlValue: expect.any(Number),
			}));
		});
	});

	it('Throw error if pageNo <= 0', async () => {
		await expect(getLeaderboard.getPage(0)).rejects.toThrow(ValidationError);
	});
});
