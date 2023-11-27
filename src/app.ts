import { RequestHandler } from 'express'
import Server from './Server'
import Controller from './typings/Controller'
import config from 'config'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import PrettyLogger from './utils/PrettyLogger'
import Postgres from './databases/Postgres'
import RabbitMQ from './libs/rabbitMQ'
import ExampleController from './controllers/ExampleController'
import ErrorMiddleware from './middlewares/ErrorMiddleware'
import helmet from 'helmet'

// global middlewares setup
const globalMiddlewares: RequestHandler[] = [
	json(),
	urlencoded({ extended: false }),
	cookieParser(),
	cors(),
	helmet(),
]

// Controllers setup (this list will be populated as we add controllers)
const controllers: Controller[] = [new ExampleController()]

const server = new Server()

async function initializeServer() {
	try {
		server.unCaughtErrorHandler()

		// initializing database
		await server.initializeDatabase(Postgres)

		// initializing RabbitMQ
		await server.initializeRabbitMQ(RabbitMQ)

		// initializing controllers and middlewares
		server.initializeGlobalMiddlewares(globalMiddlewares)
		server.initializeControllers(controllers)

		// setting up static folders if configured
		if (config.has('server.staticFiles')) {
			const { staticFiles } = config.get<{ staticFiles: string[] }>('server')
			server.initializeStaticFolders(staticFiles)
		}

		// initializing custom error handler
		server.initializeCustomErrorHandler(ErrorMiddleware.globalErrorHandler)

		// start the server
		server.start()
	} catch (err) {
		PrettyLogger.error(err, 'Server initialization error.')
	}
}

// kick off the server initialization
initializeServer()
