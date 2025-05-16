import axios, { AxiosError, AxiosRequestConfig } from 'axios'

// Use environment variables with fallback to local dev and production URLs
const getBaseUrl = () => {
    // Use NEXT_PUBLIC_BASE_API_URL if defined
    if (process.env.NEXT_PUBLIC_BASE_API_URL) {
        return process.env.NEXT_PUBLIC_BASE_API_URL
    }

    // Otherwise use environment-specific defaults
    return process.env.NODE_ENV === 'production'
        ? 'https://chatapp-backend-l6tv.onrender.com'
        : 'http://localhost:5050'
}

const api = axios.create({
    baseURL: getBaseUrl(),
})

// Define interface for queue items with proper types
interface QueueItem {
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
    config: AxiosRequestConfig
}

let isRefreshing = false
let failedQueue: QueueItem[] = []
let tokenExpirationTime: number | null = null // Lưu thời gian hết hạn của token

// Kiểm tra token có hợp lệ không (chưa hết hạn)
const isTokenValid = (): boolean => {
    const expirationTime = tokenExpirationTime
    return !!expirationTime && Date.now() < expirationTime
}

// Xử lý hàng đợi các request bị lỗi 401
const processQueue = (
    error: unknown | null,
    newToken: string | null = null
) => {
    failedQueue.forEach((item) => {
        if (error) {
            item.reject(error)
        } else if (newToken && item.config.headers) {
            item.config.headers['Authorization'] = `Bearer ${newToken}`
            item.resolve(axios(item.config))
        } else {
            item.resolve(axios(item.config))
        }
    })

    failedQueue = []
}

// Thêm token vào header chỉ khi cần thiết
api.interceptors.request.use(
    (config) => {
        // Kiểm tra nếu là request refresh token, không cần thêm Authorization header
        const isRefreshRequest = config.url?.includes('/auth/refresh')

        if (!isRefreshRequest) {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Xử lý lỗi 401 và tự động refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalConfig = error.config as AxiosRequestConfig & {
            _retry?: boolean
        }

        // Nếu không có config hoặc đã retry, từ chối promise
        if (!originalConfig || originalConfig._retry) {
            return Promise.reject(error)
        }

        // Chỉ xử lý lỗi 401 Unauthorized
        if (error.response?.status !== 401) {
            return Promise.reject(error)
        }

        // Đánh dấu request này đã được thử refresh
        originalConfig._retry = true

        // Nếu đang refresh, thêm request vào hàng đợi
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                    config: originalConfig,
                })
            })
        }

        isRefreshing = true

        try {
            // Lấy refresh token từ localStorage
            const refreshToken = localStorage.getItem('refreshToken')

            if (!refreshToken) {
                throw new Error('Không có refresh token')
            }

            // Gọi API để refresh token
            const response = await axios.post(
                `${getBaseUrl()}/api/auth/refresh`,
                { refreshToken },
                { withCredentials: true }
            )

            const {
                accessToken,
                refreshToken: newRefreshToken,
                expiresIn,
            } = response.data

            // Lưu tokens mới vào localStorage
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Tính và lưu thời gian hết hạn (nếu API trả về expiresIn)
            if (expiresIn) {
                // expiresIn thường là giây
                tokenExpirationTime = Date.now() + expiresIn * 1000
            }

            // Cập nhật header cho request gốc
            originalConfig.headers = {
                ...originalConfig.headers,
                Authorization: `Bearer ${accessToken}`,
            }

            // Xử lý hàng đợi các request đang chờ
            processQueue(null, accessToken)

            isRefreshing = false

            // Thử lại request gốc
            return axios(originalConfig)
        } catch (error) {
            // Nếu refresh thất bại, xử lý đăng xuất
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            tokenExpirationTime = null

            // Thông báo cho các request đang đợi
            processQueue(error)

            isRefreshing = false

            // Chuyển hướng đến trang đăng nhập
            // Sử dụng timeout để tránh chuyển hướng khi đang xử lý nhiều request
            setTimeout(() => {
                window.location.href = '/login'
            }, 100)

            return Promise.reject(error)
        }
    }
)

export default api
