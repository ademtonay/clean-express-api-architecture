import BaseError from '../errors/BaseError'
import Http400Error from '../errors/Http400Error'
import Http500Error from '../errors/Http500Error'
import { ValidationError, DatabaseError } from 'sequelize'

export default class ErrorHandler {
	// Check if an error is trusted (e.g., a custom error)
	public static isTrustedError(err: Error): boolean {
		if (err instanceof BaseError) return err.isOperatinal
		return false
	}

	public static handle(err: Error): BaseError {
		// If the error is a trusted error and an instance of BaseError, return it directly
		if (this.isTrustedError(err) && err instanceof BaseError) return err

		// sequelize validation errors
		if (err instanceof ValidationError) {
			if (err.errors[0].validatorKey === 'not_unique')
				return new Http400Error('EMAIL_IS_NOT_UNIQUE', err.errors[0].message)

			return new Http400Error('VALIDATION_ERROR', err.errors[0].message)
		} else if (err instanceof DatabaseError) {
			return new Http400Error('INVALID_INPUT_SYNTAX', err.message)
		}

		// If the error is not filtered or trusted, send an internal server error
		return new Http500Error()
	}
}
