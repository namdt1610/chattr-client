'use client'
import { SWRConfig } from 'swr'
import { SWRGlobalConfig } from '@/utils/swrConfig'

type SWRProviderProps = {
    children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
    return <SWRConfig value={SWRGlobalConfig}>{children}</SWRConfig>
}
