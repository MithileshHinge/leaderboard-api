import { Request, Response } from 'express';
import { IBaseController } from './controllers/IBaseController';
import { HTTPRequest, HTTPRequestMethod } from './HttpRequest';

declare global {
	namespace Express {
		interface User {
			userId: string;
		}
		interface Request {
			user?: User | undefined;
		}
	}
}

export default async function handleExpressRequest(
	req: Request,
	res: Response,
	controller: IBaseController,
  ) {
  
	const httpRequest: HTTPRequest = {
	  body: req.body,
	  query: req.query,
	  params: req.params,
	  method: req.method as HTTPRequestMethod,
	  path: req.path,
	  userId: req.user ? req.user.userId : undefined,
	};
	const httpResponse = await controller(httpRequest);
	return res.status(httpResponse.statusCode).json(httpResponse.body);
}