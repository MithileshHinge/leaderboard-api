import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import DataAccess from '../db/DataAccess';
import GetRankSelf from '../GetRankSelf';
jest.mock('../db/DataAccess');

describe('Get Rank Self use case tests', () => {
	const mockDataAccess = new DataAccess() as jest.Mocked<DataAccess>;
	mockDataAccess.fetchRankByUserId.mockImplementation(async () => 23);
	const getRankSelf = new GetRankSelf(mockDataAccess);
	
	const testUserId = id.createId();

	afterEach(() => {
		Object.values(mockDataAccess).forEach((mockMethod) => {
			if (typeof mockMethod === 'function') {
				mockMethod.mockClear();
			}
		});
	});

	it('User can get their own rank', async () => {
		await expect(getRankSelf.getRank(testUserId)).resolves.toEqual(23);
		expect(mockDataAccess.fetchRankByUserId).toHaveBeenCalledWith(testUserId);
	});

	describe('Throw error if userId is invalid', () => {
		['abc', 123, undefined, null].forEach((userId: any) => {
			it(`Should throw error for userId: ${userId}`, async () => {
				await expect(getRankSelf.getRank(userId)).rejects.toThrow(ValidationError);
				expect(mockDataAccess.fetchRankByUserId).not.toHaveBeenCalled();
			});
		});
	});

	it('Throw error if user has not added PnL', async () => {
		mockDataAccess.fetchRankByUserId.mockImplementationOnce(async () => null);
		await expect(getRankSelf.getRank(testUserId)).rejects.toThrow(ValidationError);
	});
});
