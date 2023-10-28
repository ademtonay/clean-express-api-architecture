import { ExchangeType } from '.'
import { Channel } from 'amqplib'
import PrettyLogger from '../../utils/PrettyLogger'

export default class Consumer {
	constructor(private readonly channel: Channel) {}

	public async consumeMessages<T>(
		exchangeName: string,
		routingKey: string,
		queueName: string,
		callback: (data: T) => Promise<void> | void,
		type: ExchangeType = 'direct',
	): Promise<void> {
		try {
			await this.channel.assertExchange(exchangeName, type)

			const { queue } = await this.channel.assertQueue(queueName)

			await this.channel.bindQueue(queue, exchangeName, routingKey)

			this.channel.consume(queue, async (msg) => {
				if (msg) {
					const data = JSON.parse(msg?.content.toString())

					await callback(data as T)

					this.channel.ack(msg)
				}
			})
		} catch (err) {
			PrettyLogger.error(err, 'Error setting up consumer:')
		}
	}

	// Close method added to ensure channels can be closed gracefully.
	public async close(): Promise<void> {
		await this.channel.close()
	}
}
