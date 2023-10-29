import request from 'supertest'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import ExampleController from '../../controllers/ExampleController'
import httpStatus from 'http-status'

describe('ExampleController', () => {
	let app: Express

	const setupApp = (): void => {
		app = express()
		app.use(bodyParser.json())
		const controller = new ExampleController()
		app.use(controller.path, controller.setRoutes().bind(controller))
	}

	const HELLO_WORLD_RESPONSE = {
		success: true,
		code: 'DESEIRED_RESPONSE_CODE',
		message: 'Hello world!',
	}

	const TEST_DATA = {
		name: 'John',
		lastname: 'Doe',
	}

	beforeEach(setupApp)

	describe('GET /example', () => {
		it('should respond with a greeting message', async () => {
			const res = await request(app).get('/example')
			expect(res.status).toBe(httpStatus.OK)
			expect(res.body).toEqual(HELLO_WORLD_RESPONSE)
		})
	})

	describe('POST /example/post', () => {
		it('should respond with the provided user details', async () => {
			const res = await request(app).post('/example/post').send(TEST_DATA)
			expect(res.status).toBe(httpStatus.OK)
			expect(res.body.data).toEqual(TEST_DATA)
		})

		// Additional tests, like for invalid input, can be added here.
	})
})
