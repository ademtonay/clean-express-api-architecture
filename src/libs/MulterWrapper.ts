import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import Http400Error from '../errors/Http400Error'
import ensureFolderExists from '../utils/ensureFolderExist'

class MulterWrapper {
	private memoryStorage: multer.StorageEngine = multer.memoryStorage()
	public keepOnMemory: multer.Multer = multer({ storage: this.memoryStorage })

	private static instance: MulterWrapper

	private constructor() {}

	public static getInstance(): MulterWrapper {
		if (!this.instance) this.instance = new MulterWrapper()
		return this.instance
	}

	/**
	 * Set up disk storage configurations.
	 *
	 * @param pathToSave - Path to the storage folder.
	 * @param filename - Name of the file to be saved.
	 * @returns Configured storage.
	 */
	private createDiskStorage(
		pathToSave: string,
		filename: string,
	): multer.StorageEngine {
		return multer.diskStorage({
			destination: (_req, _file, callback) => {
				callback(null, ensureFolderExists(pathToSave))
			},
			filename: (req: Request, file, callback) => {
				const extension = file.originalname.split('.').pop() || ''
				req.savedFilePath = `${filename}.${extension}`
				callback(null, req.savedFilePath)
			},
		})
	}

	/**
	 * Validate the uploaded file's MIME type.
	 *
	 * @param allowedMimeTypes - List of allowed MIME types.
	 * @returns A filter function.
	 */
	private fileFilter(
		allowedMimeTypes?: string[],
	): (
		req: Request,
		file: Express.Multer.File,
		callback: FileFilterCallback,
	) => void {
		return (req, file, callback) => {
			if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
				callback(
					new Http400Error(
						'INVALID_MIMETYPE',
						`Invalid mimetype. Allowed: ${allowedMimeTypes.join(', ')}`,
					) as Error,
				)
			} else {
				callback(null, true)
			}
		}
	}

	/**
	 * Configure Multer for file saving.
	 *
	 * @param pathToSave - Path to the storage folder.
	 * @param filename - Name of the file to be saved.
	 * @param allowedMimeTypes - List of allowed MIME types.
	 * @returns Configured Multer instance.
	 */
	public saveToDisk(
		pathToSave: string,
		filename: string,
		allowedMimeTypes?: string[],
	): multer.Multer {
		return multer({
			storage: this.createDiskStorage(pathToSave, filename),
			fileFilter: this.fileFilter(allowedMimeTypes),
		})
	}
}

export default MulterWrapper.getInstance()
