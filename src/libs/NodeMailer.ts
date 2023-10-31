import config from 'config'
import nodemailer from 'nodemailer'
import PrettyLogger from '../utils/PrettyLogger'

export interface IMailOptions {
	to: string
	cc?: string
	bcc?: string
	subject: string
	text?: string
	html: string
}

class NodeMailer {
	private constructor() {}
	private transporter!: nodemailer.Transporter

	private static instance: NodeMailer
	private isInitialized = false

	public static getInstance(): NodeMailer {
		if (!NodeMailer.instance) {
			NodeMailer.instance = new NodeMailer()
		}
		return NodeMailer.instance
	}

	public async initialize(): Promise<void> {
		try {
			this.transporter = nodemailer.createTransport(config.get('smtp'))

			await this.transporter.verify()

			this.isInitialized = true

			PrettyLogger.info('Connected to the smtp server.')
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	public async sendEmail(options: IMailOptions): Promise<void> {
		if (!this.isInitialized) await this.initialize()

		await this.transporter.sendMail({
			from: config.get<string>('smtp.auth.user'),
			...options,
		})
	}
}

export default NodeMailer.getInstance()
