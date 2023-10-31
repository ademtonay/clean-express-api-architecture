import { Channel } from 'amqplib'
import PrettyLogger from '../../utils/PrettyLogger'
import { ExchangeType } from '.'

export default class Producer {
	constructor(
		private readonly channel: Channel,
		private readonly exchangeName: string,
		private readonly type: ExchangeType = 'direct',
	) {}

	public async assert(): Promise<void> {
		await this.channel.assertExchange(this.exchangeName, this.type)
	}

	public async publishMessage(routingKey: string, message: any) {
		const successfull = this.channel.publish(
			this.exchangeName,
			routingKey,
			Buffer.from(JSON.stringify(message)),
		)

		if (!successfull) {
			PrettyLogger.error(`Error publishing message: ${JSON.stringify(message)}`)
			throw new Error('Failed to send message')
		}

		PrettyLogger.info(
			`The message: ${JSON.stringify(message)} has been send successfully.`,
		)
	}

	// Close method added to ensure channels can be closed gracefully.
	public async close(): Promise<void> {
		await this.channel.close()
	}
}
