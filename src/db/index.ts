import DataAccess from './DataAccess';
import DbConnection from './DbConnection';

export const dbConnection = new DbConnection();
export const dataAccess = new DataAccess(dbConnection);
