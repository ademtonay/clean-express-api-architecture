import config from 'config'
import { Sequelize, Options } from 'sequelize'
import PrettyLogger from '../utils/PrettyLogger'

export type DatabaseOptions = Options & {
	dbName: string
	useCustomPort?: boolean
}

const { env } = config.get<{ env: string }>('server')

export default abstract class Database extends Sequelize {
	public abstract readonly initializedDatabase: string

	/**
	 * Constructor for the Database class.
	 * @param {DatabaseOptions} options - The options for configuring the database connection.
	 */
	constructor(readonly options: DatabaseOptions) {
		let dbUri = `${options.dialect}://${options.host}/${options.dbName}`

		// Use custom port if specified in options
		if (options.useCustomPort || (env === 'development' && options.port)) {
			dbUri = `${options.dialect}://${options.host}:${options.port}/${options.dbName}`
		}

		super(dbUri, options)
	}

	/**
	 * Connect to the database, authenticate, and sync tables.
	 * @returns {Promise<void>}
	 */
	public async connect(): Promise<void> {
		try {
			await this.authenticate()
			PrettyLogger.info('Database is authenticated successfully.')

			await this.sync({ alter: true })
			PrettyLogger.info('Database and tables synced.')
		} catch (err) {
			PrettyLogger.error(err, 'Database Connection Error:')
		}
	}
}
