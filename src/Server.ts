import express, {
	Application,
	RequestHandler,
	ErrorRequestHandler,
} from 'express'
import Controller from './typings/Controller'
import path from 'path'
import config from 'config'
import PrettyLogger from './utils/PrettyLogger'
import Database from './libs/Database'
import { RabbitMQ } from './libs/rabbitMQ'

export default class Server {
	private readonly app: Application = express()
	private readonly port: number = config.get<number>('server.port')
	private readonly env: string = config.get<string>('server.env')

	public initializeGlobalMiddlewares(middlewares: RequestHandler[]): void {
		middlewares.forEach((mw) => this.app.use(mw))
		PrettyLogger.info('Global middlewares initialized successfully.')
	}

	public initializeCustomErrorHandler(errorHandler: ErrorRequestHandler): void {
		this.app.use(errorHandler)
		PrettyLogger.info('The custom error handler initialized successfully.')
	}

	public unCaughtErrorHandler(): void {
		process.on('uncaughtException', (err) => {
			PrettyLogger.error(err)

			process.exit(1)
		})
	}

	public initializeStaticFolders(folders: string[]): void {
		folders.forEach((folder) =>
			this.app.use(express.static(path.join(__dirname, folder))),
		)
		PrettyLogger.info('Static folders initialized successfully.')
	}

	public initializeControllers(controllers: Controller[]): void {
		controllers.forEach((controller) =>
			this.app.use(controller.path, controller.setRoutes().bind(controller)),
		)
		PrettyLogger.info('Controllers initialized successfully.')
	}

	public async initializeDatabase(db: Database): Promise<void> {
		await db.connect()
		PrettyLogger.info(
			`${db.initializedDatabase} Database initialized successfully.`,
		)
	}

	public async initializeRabbitMQ(amqp: RabbitMQ): Promise<void> {
		await amqp.initialize()
		PrettyLogger.info('RabbitMQ initialized successfully.')
	}

	public start(): void {
		this.app
			.listen(this.port, () => {
				PrettyLogger.info(`Server started on ${this.port} in ${this.env} mode`)
			})
			.on('error', (err) => {
				PrettyLogger.error(
					`Server failed to start due to error: ${err.message}`,
				)
			})
	}
}
