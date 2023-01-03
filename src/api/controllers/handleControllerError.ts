import ValidationError from '../../common/errors/ValidationError';
import { HTTPResponse, HTTPResponseCode } from '../HttpResponse';

export default function handleControllerError(err: Error): HTTPResponse {
	switch (err.constructor) {
    	case ValidationError:
    		return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
    		break;
		default:
			console.error(err);
			return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
			break;
  }
}