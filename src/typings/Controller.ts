import { Request, Response, NextFunction, Router } from 'express'

export enum Methods {
	GET = 'get',
	POST = 'post',
	PATCH = 'patch',
	DELETE = 'delete',
	PUT = 'put',
}

interface Route {
	path: string
	method: Methods
	handler: (
		req: Request,
		res: Response,
		next: NextFunction,
	) => Promise<void> | void
	localMiddlewares: ((
		req: Request,
		res: Response,
		next: NextFunction,
	) => Promise<void> | void)[]
}

interface SuccessResponse {
	status: number
	success: boolean
	code: string
	message: string
	data?: unknown
}

export default abstract class Controller {
	public readonly router = Router()
	public abstract readonly path: string
	public abstract readonly routes: Route[]

	public setRoutes(): Router {
		for (const route of this.routes) {
			// Apply both local middlewares and handlers for the route
			this.router[route.method](
				route.path,
				...route.localMiddlewares,
				route.handler.bind(this),
			)
		}
		return this.router
	}

	protected sendSuccess(
		res: Response,
		response: Omit<SuccessResponse, 'success'>,
	): Response {
		return res.status(response.status).json({
			success: true,
			code: response.code,
			message: response.message,
			data: response.data,
		})
	}
}
