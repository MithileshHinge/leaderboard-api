import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JSON_SECRET } from '../../config';
import { HTTPResponseCode } from '../HttpResponse';

export default function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.authorization?.slice(7, undefined);
	if (!token) return res.status(HTTPResponseCode.UNAUTHORIZED).json({});

	try {
		const payload = jwt.verify(token, JSON_SECRET);
		if (typeof payload === 'string') return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
		req.user = { userId: payload.userId };
	} catch (err: any) {
		return res.status(HTTPResponseCode.UNAUTHORIZED).json({});
	}

	return next();
}
