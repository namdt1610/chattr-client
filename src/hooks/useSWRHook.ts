import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { fetcher } from '@/utils/swrConfig'

export function useAPI<T = unknown>(
    url: string | null,
    options?: SWRConfiguration
): SWRResponse<T, Error> & { isLoading: boolean } {
    const { data, error, isValidating, mutate } = useSWR<T>(
        url,
        fetcher,
        options
    )

    return {
        data,
        error,
        isValidating,
        isLoading: !error && !data,
        mutate,
    }
}
