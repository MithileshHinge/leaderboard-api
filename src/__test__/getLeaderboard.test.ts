import { faker } from '@faker-js/faker';
import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import DataAccess from '../db/DataAccess';
import GetLeaderboard from '../GetLeaderboard';

jest.mock('../db/DataAccess');

describe('Get Leaderboard use case tests', () => {
	const mockDataAccess = new DataAccess() as jest.Mocked<DataAccess>;
	const testDataPnL = new Array(50).fill(null).map((item) => ({
		userId: id.createId(),
		pnlValue: faker.datatype.number({ min: -100, max: 300, precision: 0.1 }),
	}));
	const testDataUsernames: { [userId: string]: string} = {};
	testDataPnL.forEach(({ userId }) => {
		testDataUsernames[userId] = faker.internet.userName();
	});
	mockDataAccess.fetchUsernamesByUserIds.mockImplementation(async (userIds) => Object.fromEntries(Object.entries(testDataUsernames).filter(([userId, username]) => userIds.includes(userId))));
	mockDataAccess.fetchRankingsByRange.mockImplementation(async (from, to) => testDataPnL.sort((a, b) => b.pnlValue - a.pnlValue).slice(from - 1, to));
	const resultsPerPage = 10;
	const getLeaderboard = new GetLeaderboard(mockDataAccess, resultsPerPage);

	afterEach(() => {
		Object.values(mockDataAccess).forEach((mockMethod) => {
			if (typeof mockMethod === 'function') {
				mockMethod.mockClear();
			}
		});
	});
	
	it('Can get leaderboard page', async () => {
		const pageNo = faker.datatype.number({ min: 1, max: 5, precision: 1 });
		const leaderboard = await getLeaderboard.getPage(pageNo);
		expect(leaderboard.length).toBeGreaterThan(0);
		const leaderboardExpected = testDataPnL
			.sort((a, b) => b.pnlValue - a.pnlValue)
			.slice((pageNo - 1) * resultsPerPage, pageNo * resultsPerPage)
			.map(({ userId, pnlValue }) => ({
				userId,
				username: testDataUsernames[userId],
				pnlValue,
			}));
		expect(leaderboard).toStrictEqual(leaderboardExpected);
		expect(mockDataAccess.fetchUsernamesByUserIds).toHaveBeenCalled();
		expect(mockDataAccess.fetchRankingsByRange).toHaveBeenCalled();
	});

	describe('Throw error if pageNo value is invalid', () => {
		[null, undefined, -1, 0, '1'].forEach((pageNo: any) => {
			it(`Should throw error for pageNo: ${pageNo}`, async () => {
				await expect(getLeaderboard.getPage(0)).rejects.toThrow(ValidationError);
			});
		});
	});

	it('Return empty array if pageNo > totalPages', async () => {
		const totalPages = Math.ceil(testDataPnL.length / resultsPerPage);
		await expect(getLeaderboard.getPage(totalPages + 1)).resolves.toStrictEqual([]);
	});

	it('Can count totalPages', async () => {
		const totalPages = Math.ceil(testDataPnL.length / resultsPerPage);
		mockDataAccess.countTotalPnLEntries.mockResolvedValueOnce(testDataPnL.length);
		await expect(getLeaderboard.getTotalPages()).resolves.toStrictEqual(totalPages);
	});
});
