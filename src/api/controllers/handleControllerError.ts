import ValidationError from '../../common/errors/ValidationError';
import { HTTPResponse, HTTPResponseCode } from '../HttpResponse';

export default function handleControllerError(err: Error): HTTPResponse {
	if (process.env.NODE_ENV !== 'test') console.log(err);
	switch (err.constructor) {
	case ValidationError:
		return { statusCode: HTTPResponseCode.BAD_REQUEST, body: err.message };
		break;
	default:
		return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: err.message };
		break;
	}
}
