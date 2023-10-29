import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp'
import path from 'path'
import fs from 'fs'
import Http400Error from '../errors/Http400Error'

export interface ResizeOptions {
	fileName: string
	format: keyof FormatEnum | AvailableFormatInfo
	path: string
	width?: number
	height?: number
	allowedMimetypes?: string[]
}

export default class ImageProcessor {
	private static ensureFolderExists(folder: string): string {
		const rootDir = path.dirname(require.main?.filename ?? '')
		const folderPath = path.join(rootDir, folder)

		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true })
		}

		return folderPath
	}

	private static validateMimetype(
		mimetype: string,
		allowedMimetypes?: string[],
	): void {
		if (allowedMimetypes && !allowedMimetypes.includes(mimetype)) {
			throw new Http400Error(
				'INVALID_MIMETYPE',
				`Please provide an allowed mimetype. Allowed mimetypes: ${allowedMimetypes.join(
					', ',
				)}`,
			)
		}
	}

	public static async resizeImageFile(
		file: {
			buffer: Buffer
			mimetype: string
		},
		options: ResizeOptions,
	): Promise<string> {
		this.validateMimetype(file.mimetype, options.allowedMimetypes)

		try {
			const outputPath = path.join(
				this.ensureFolderExists(options.path),
				`_${options.fileName}.${options.format}`,
			)

			await sharp(file.buffer)
				.resize(options.width, options.height)
				.toFormat(options.format)
				.toFile(outputPath)

			const paths = options.path.split('/')
			paths.shift()
			const pathWithoutStaticFolder = paths.join('/')

			return `${pathWithoutStaticFolder}/${options.fileName}.${options.format}`
		} catch (err) {
			console.error(err)
			throw err
		}
	}
}
