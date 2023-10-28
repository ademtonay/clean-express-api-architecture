# Express REST API

![Node.js](https://img.shields.io/badge/Node.js-14.x-green)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue)
![License](https://img.shields.io/badge/License-MIT-red)

Clean class based `Node / Typescript` REST API Architecture.
An ideal template for those who want to get rid of the hassle and start developing directly.

## Table of Contents

- [Features](#Features)
- [Technologies used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Endpoints](#endpoints)
- [License](#license)

## Features

- Control your controllers from a single point.
- Manage settings such as CORS and static folders centrally.
- Easy to implement it.

## Technologies used

- Typescript
- Express.js

## Getting Started

### Prerequisites

- Node.js (16.x)

### Setup

1. Clone the repository.

```bash
git clone https://github.com/mariocoski/rest-api-node-typescript.git
```

2. Install dependencies.

```bash
npm install or yarn
```

3. Configure your environment variables in `config` file.

```json
{
	"server": {
		"env": "development",
		"port": 3000,
		// enable if application has static file(s)
		//"staticFolders": ["folderName2", "folderName2"],
		"cors": {
			"origins": null,
			"methods": null,
			"allowedHeaders": null,
			"exposedHeaders": null,
			"credentials": null,
			"maxAge": null,
			"preflightContinue": null,
			"optionsSuccessStatus": null
		}
	}
}
```

4. Build your api.

```bash
npm run build or yarn build
```

5. Start your api.

```bash
npm run start or yarn start
```

## Development

```bash
npm run dev or yarn dev
```

## Endpoints

For check is api working.

```http
http://localhost:3000/health
```

Result:

```json
{
	"success": true,
	"code": "API_IS_WORKING",
	"message": "Api is working."
}
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
