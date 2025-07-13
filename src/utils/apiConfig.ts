// API Configuration for different environments
export const getApiBaseUrl = () => {
    if (typeof window === 'undefined') {
        // Server-side rendering
        return process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_API_URL ||
                  'https://chatapp-backend-l6tv.onrender.com'
            : 'http://localhost:5050'
    }

    // Client-side
    if (process.env.NODE_ENV === 'production') {
        return (
            process.env.NEXT_PUBLIC_API_URL ||
            'https://chatapp-backend-l6tv.onrender.com'
        )
    }

    // Development - use proxy
    return ''
}

export const getSocketUrl = () => {
    return process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SOCKET_URL ||
              'https://chatapp-backend-l6tv.onrender.com'
        : 'http://localhost:5050'
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
    const baseUrl = getApiBaseUrl()
    return baseUrl ? `${baseUrl}${endpoint}` : endpoint
}
