import httpStatus from 'http-status'
import BaseError from './BaseError'

export default class Http404Error extends BaseError {
	constructor(
		public readonly code: string = 'NOT_FOUND',
		public readonly message: string = 'The resource is not found.',
	) {
		super('NotFoundError', httpStatus.NOT_FOUND, true, code, message)
	}
}
