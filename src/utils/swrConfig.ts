import { SWRConfiguration } from 'swr'
import api from '@/services/api'

// Global SWR fetcher that uses our API instance
export const fetcher = async (url: string) => {
    const response = await api.get(url)
    return response.data
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
}
