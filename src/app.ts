import { RequestHandler } from 'express'
import Server from './Server'
import Controller from './typings/Controller'
import config from 'config'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import PrettyLogger from './utils/PrettyLogger'

// global middlewares setup
const globalMiddlewares: RequestHandler[] = [
	json(),
	urlencoded({ extended: false }),
	cookieParser(),
	cors(),
]

// Controllers setup (this list will be populated as we add controllers)
const controllers: Controller[] = []

const server = new Server()

async function initializeServer() {
	try {
		// initializing controllers and middlewares
		server.initializeControllers(controllers)
		server.initializeGlobalMiddlewares(globalMiddlewares)

		// setting up static folders if configured
		if (config.has('server.staticFiles')) {
			const { staticFiles } = config.get<{ staticFiles: string[] }>('server')
			server.initializeStaticFolders(staticFiles)
		}

		// start the server
		server.start()
	} catch (err) {
		PrettyLogger.error(err, 'Server initialization error.')
	}
}

// kick off the server initialization
initializeServer()
