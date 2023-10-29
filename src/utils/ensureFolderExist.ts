import fs from 'fs'
import path from 'path'

export default function ensureFolderExists(folder: string): string {
	const rootDir = path.dirname(require.main?.filename ?? '')
	const folderPath = path.join(rootDir, folder)

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}

	return folderPath
}
