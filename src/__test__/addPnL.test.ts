import AddPnL from '../AddPnL';
import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import DataAccess from '../db/DataAccess';
jest.mock('../db/DataAccess');

describe('Add PnL use case tests', () => {
	const mockDataAccess = new DataAccess() as jest.Mocked<DataAccess>;
	const addPnL = new AddPnL(mockDataAccess);
	
	const testUserId = id.createId();

	afterEach(() => {
		Object.values(mockDataAccess).forEach((mockMethod) => {
			if (typeof mockMethod === 'function') {
				mockMethod.mockClear();
			}
		});
	});

	it('User can successfully add PnL', async () => {
		await expect(addPnL.add(testUserId, -20)).resolves.not.toThrow();
		expect(mockDataAccess.insertPnLValue).toHaveBeenCalledWith({ userId: testUserId, pnlValue: -20 });
	});

	describe('Throw error if userId is invalid', () => {
		['abc', 123, undefined, null].forEach((userId: any) => {
			it(`Should throw error for userId: ${userId}`, async () => {
				await expect(addPnL.add(userId, -20)).rejects.toThrow(ValidationError);
				expect(mockDataAccess.insertPnLValue).not.toHaveBeenCalled();
			});
		});
	});

	it('Throw error if PnL is less than -100', async () => {
		await expect(addPnL.add(testUserId, -101)).rejects.toThrow(ValidationError);
		expect(mockDataAccess.insertPnLValue).not.toHaveBeenCalled();
	});

	it('Throw error if PnL already submitted', async () => {
		mockDataAccess.fetchPnLValue.mockImplementationOnce(async () => 23);
		await expect(addPnL.add(testUserId, 120)).rejects.toThrow(ValidationError);
		expect(mockDataAccess.insertPnLValue).not.toHaveBeenCalled();
	});
});
