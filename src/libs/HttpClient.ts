import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class HttpClient {
	private static instance: { [baseURL: string]: HttpClient } = {}
	private axiosInstance: AxiosInstance

	private constructor(baseURL: string, config?: AxiosRequestConfig) {
		this.axiosInstance = axios.create({
			baseURL,
			...config,
		})

		this.axiosInstance.interceptors.request.use(
			(request) => {
				// Add any request interceptors if needed, for example:
				// request.headers.Authorization = `Bearer YOUR_TOKEN`;
				return request
			},
			(error) => {
				return Promise.reject(error)
			},
		)

		this.axiosInstance.interceptors.response.use(
			(response) => {
				return response
			},
			(error) => {
				// Handle errors globally, if needed.
				return Promise.reject(error)
			},
		)
	}

	public static getInstance(
		baseURL: string,
		config?: AxiosRequestConfig,
	): HttpClient {
		if (!this.instance[baseURL])
			this.instance[baseURL] = new HttpClient(baseURL, config)
		return this.instance[baseURL]
	}

	public get<T = any, R = AxiosResponse<T>>(
		url: string,
		config?: AxiosRequestConfig,
	): Promise<R> {
		return this.axiosInstance.get<T, R>(url, config)
	}

	public post<T = any, R = AxiosResponse<T>>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<R> {
		return this.axiosInstance.post<T, R>(url, data, config)
	}

	public put<T = any, R = AxiosResponse<T>>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<R> {
		return this.axiosInstance.put<T, R>(url, data, config)
	}

	public patch<T = any, R = AxiosResponse<T>>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<R> {
		return this.axiosInstance.patch<T, R>(url, data, config)
	}
}
