import Database, { DatabaseOptions } from '../libs/Database'
import config from 'config'

const { postgres } = config.get<{
	postgres: Omit<DatabaseOptions, 'useCustomPort' | 'dialect'>
}>('database')

class Postgres extends Database {
	private static instance: Postgres
	public readonly initializedDatabase: string = 'Postgres'

	private constructor() {
		super({
			...postgres,
			dialect: 'postgres',
		})
	}

	public static getInstance(): Postgres {
		if (!this.instance) this.instance = new Postgres()
		return this.instance
	}
}

export default Postgres.getInstance()
