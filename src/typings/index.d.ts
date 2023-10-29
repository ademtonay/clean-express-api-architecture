declare global {
	namespace Express {
		interface Request {
			savedFilePath: string
		}
	}
}

export {}
