import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
})

// Define interface for queue items with proper types
interface QueueItem {
    resolve: (value: string | null) => void
    reject: (reason?: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (error: unknown | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

// Add Authorization header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Handle 401 errors and automatically refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean
        }

        // If 401 (Unauthorized) error and haven't tried refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        if (originalRequest.headers && token) {
                            originalRequest.headers[
                                'Authorization'
                            ] = `Bearer ${token}`
                        }
                        return axios(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Get refresh token from localStorage
                const refreshToken = localStorage.getItem('refreshToken')

                if (!refreshToken) {
                    throw new Error('No refresh token available')
                }

                // Call API to refresh token - use withCredentials to send cookies if available
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,
                    { refreshToken }, // Send refresh token from localStorage
                    { withCredentials: true } // Send cookies (if any)
                )

                const { accessToken, refreshToken: newRefreshToken } =
                    response.data

                // Save new tokens to localStorage
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('refreshToken', newRefreshToken)

                // Update header for original request
                if (originalRequest.headers) {
                    originalRequest.headers[
                        'Authorization'
                    ] = `Bearer ${accessToken}`
                }

                // Process queued requests
                processQueue(null, accessToken)

                isRefreshing = false

                // Retry original request
                return axios(originalRequest)
            } catch (error) {
                // If refresh fails, handle logout
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')

                // Notify waiting requests
                processQueue(error, null)

                isRefreshing = false

                // Redirect to login page
                window.location.href = '/beta?showLogin=true'

                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

export default api
