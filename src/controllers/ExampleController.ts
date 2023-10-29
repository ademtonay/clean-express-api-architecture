import { Request, Response, NextFunction } from 'express'
import Controller, { Methods } from '../typings/Controller'
import httpStatus from 'http-status'

export default class ExampleController extends Controller {
	path = '/example'
	routes = [
		{
			path: '/',
			method: Methods.GET,
			handler: this.handleGet,
			localMiddlewares: [], // Add middlewares specific to this route if needed
		},
		{
			path: '/post',
			method: Methods.POST,
			handler: this.handlePost,
			localMiddlewares: [], // Add middlewares specific to this route if needed
		},
	]

	public handleGet(req: Request, res: Response, next: NextFunction): void {
		// Business logic here or call a service function

		// Send a response to the client
		this.sendSuccess(res, {
			code: 'DESEIRED_RESPONSE_CODE',
			status: httpStatus.OK,
			message: 'Hello world!',
		})
	}

	public handlePost(req: Request, res: Response, next: NextFunction): void {
		const { name, lastname } = req.body

		// Optional: Add validation for name and lastname here

		// Business logic here or call a service function

		// Send a response to the client
		this.sendSuccess(res, {
			code: 'DESEIRED_RESPONSE_CODE',
			status: httpStatus.OK,
			message: 'Greats!',
			data: {
				name,
				lastname,
			},
		})
	}
}
