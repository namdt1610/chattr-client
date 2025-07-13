import { SWRConfiguration } from 'swr'
import { buildApiUrl } from './apiConfig'

// Global SWR fetcher that handles token refresh
export const fetcher = async (url: string) => {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // If the request is unauthorized, try to refresh the token
    if (response.status === 401) {
        try {
            // Try to refresh the token
            const refreshResponse = await fetch(
                buildApiUrl('/api/auth/refresh'),
                {
                    method: 'POST',
                    credentials: 'include',
                }
            )

            // If refresh was successful, retry the original request
            if (refreshResponse.ok) {
                // Retry the original request with new cookies set by the server
                const retryResponse = await fetch(url, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (retryResponse.ok) {
                    return retryResponse.json()
                }
            } else {
                // If refresh failed, notify the app
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('session-expired'))
                }
            }
        } catch {
            // If refresh throws an error, notify the app
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('session-expired'))
            }
        }
    }

    // For non-401 errors or if refresh failed, handle normally
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.json()
}

// Global SWR configuration
export const SWRGlobalConfig: SWRConfiguration = {
    fetcher,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: Number(process.env.NEXT_PUBLIC_SWR_REFRESH_INTERVAL) || 0,
    shouldRetryOnError: true,
    dedupingInterval:
        Number(process.env.NEXT_PUBLIC_SWR_DEDUPE_INTERVAL) || 2000,
    errorRetryCount: Number(process.env.NEXT_PUBLIC_SWR_RETRY_COUNT) || 3,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry on 401 errors as they're handled in the fetcher
        if (error.message.includes('Status: 401')) return

        // Don't retry on 404
        if (error.message.includes('Status: 404')) return

        // Only retry up to the configured number of times
        const maxRetryCount =
            Number(process.env.NEXT_PUBLIC_SWR_RETRY_COUNT) || 3
        if (retryCount >= maxRetryCount) return

        // Retry after a delay
        setTimeout(() => revalidate({ retryCount }), 3000 * (retryCount + 1))
    },
}
