import { Connection, connect, Options } from 'amqplib'
import config from 'config'
import PrettyLogger from '../../utils/PrettyLogger'
import Producer from './Producer'
import Consumer from './Consumer'

export type ExchangeType = 'direct' | 'topic' | 'headers' | 'fanout'

const rabbitMQConf = config.get<Options.Connect>('rabbitMQ')

export class RabbitMQ {
	private connection!: Connection
	private isInitialized = false
	private constructor() {}

	private static instance: RabbitMQ

	public static getInstance(): RabbitMQ {
		if (!this.instance) this.instance = new RabbitMQ()
		return this.instance
	}

	public async initialize(): Promise<void> {
		try {
			if (this.isInitialized) return

			this.connection = await connect(rabbitMQConf)

			this.isInitialized = true
		} catch (err) {
			PrettyLogger.error(err, 'RabbitMQ initialization error:')
		}
	}

	public async createProducer(
		exchangeName: string,
		type: ExchangeType = 'direct',
	): Promise<Producer> {
		const channel = await this.connection.createChannel()

		return new Producer(channel, exchangeName, type)
	}

	public async createConsumer(): Promise<Consumer> {
		const channel = await this.connection.createChannel()

		return new Consumer(channel)
	}

	public async closeConnection(): Promise<void> {
		await this.connection.close()
		this.isInitialized = false
	}
}

export default RabbitMQ.getInstance()
