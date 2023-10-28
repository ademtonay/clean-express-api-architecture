export default {
	server: {
		env: 'development',
		port: 3000,
	},
	database: {
		postgres: {
			host: '127.0.0.1',
			port: 5432,
			username: 'service_user',
			password: '123456',
			dbName: 'development',
			charset: 'utf8',
			collate: 'utf8_general_ci',
			pool: {
				max: 10,
				min: 0,
				acquire: 30000,
				idle: 10000,
				maxUses: 10,
			},
			timezone: '+02:00',
		},
	},
	rabbitMQ: {
		host: '127.0.0.1',
		port: 5672,
		username: 'service_user',
		password: '123456',
		hearthbeat: 10,
	},
}
