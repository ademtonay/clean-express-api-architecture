import httpStatus from 'http-status'
import BaseError from './BaseError'

export default class Http403Error extends BaseError {
	constructor(
		public readonly code: string = 'FORBIDDEN',
		public readonly message: string = 'Permision denied for the resource.',
	) {
		super('AuthorizationError', httpStatus.FORBIDDEN, true, code, message)
	}
}
