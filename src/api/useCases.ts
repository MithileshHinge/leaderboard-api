import AddPnL from '../AddPnL';
import DataAccess from '../db/DataAccess';
import DbConnection from '../db/DbConnection';
import UpdatePnL from '../UpdatePnL';

export const dbConnection = new DbConnection();
const dataAccess = new DataAccess(dbConnection);

export const addPnL = new AddPnL(dataAccess);
export const updatePnL = new UpdatePnL(dataAccess);
