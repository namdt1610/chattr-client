import { useEffect, useState } from 'react'

// Define a more specific type for log arguments
type LogArgument = string | number | boolean | object | null | undefined

export const useConsoleLogs = () => {
    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        const originalLog = console.log
        const originalError = console.error
        const originalWarn = console.warn

        const capture = (type: string, ...args: LogArgument[]) => {
            const message = `[${type.toUpperCase()}] ${args
                .map((a) =>
                    typeof a === 'object' ? JSON.stringify(a) : String(a)
                )
                .join(' ')}`
            setLogs((prev) => [...prev, message])
        }

        console.log = (...args) => {
            capture('log', ...args)
            originalLog(...args)
        }

        console.error = (...args) => {
            capture('error', ...args)
            originalError(...args)
        }

        console.warn = (...args) => {
            capture('warn', ...args)
            originalWarn(...args)
        }

        return () => {
            console.log = originalLog
            console.error = originalError
            console.warn = originalWarn
        }
    }, [])

    return logs
}
