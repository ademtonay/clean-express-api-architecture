import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'
import PrettyLogger from '../utils/PrettyLogger'

export default class ErrorMiddleware {
	public static globalErrorHandler(
		err: Error,
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		const { status, name, code, message, isOperatinal } =
			ErrorHandler.handle(err)

		PrettyLogger.error(err, 'Error Middleware: ')

		// add micro service central error logic here

		res
			.status(status)
			.json({ success: false, name, code, message, isOperatinal, status })
	}
}
