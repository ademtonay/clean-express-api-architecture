import httpStatus from 'http-status'
import BaseError from './BaseError'

export default class Http401Error extends BaseError {
	constructor(
		public readonly code: string = 'AUTHENTICATION_REQUIRED',
		public readonly message: string = 'Authentication is require for the resource that is been requested.',
	) {
		super('AuthenticationError', httpStatus.UNAUTHORIZED, true, code, message)
	}
}
