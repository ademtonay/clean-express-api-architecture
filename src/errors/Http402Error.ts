import httpStatus from 'http-status'
import BaseError from './BaseError'

export default class Http402Error extends BaseError {
	constructor(
		public readonly code: string = 'PAYMENT_REQUIRED',
		public readonly message: string = 'Complate the payment for further action(s)',
	) {
		super('PaymentError', httpStatus.PAYMENT_REQUIRED, true, code, message)
	}
}
