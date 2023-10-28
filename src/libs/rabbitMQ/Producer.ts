import { Channel } from 'amqplib'
import PrettyLogger from '../../utils/PrettyLogger'
import { ExchangeType } from '.'

export default class Producer {
	constructor(private readonly channel: Channel) {}

	public async publishMessage(
		exchangeName: string,
		routingKey: string,
		message: any,
		type: ExchangeType = 'direct',
	) {
		await this.channel.assertExchange(exchangeName, type)

		const successfull = this.channel.publish(
			exchangeName,
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
