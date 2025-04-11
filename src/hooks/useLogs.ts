import { useEffect, useState } from 'react'

export const useConsoleLogs = () => {
      const [logs, setLogs] = useState<string[]>([])

      useEffect(() => {
            const originalLog = console.log
            const originalError = console.error
            const originalWarn = console.warn

            const capture = (type: string, ...args: any[]) => {
                  const message = `[${type.toUpperCase()}] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`
                  setLogs(prev => [...prev, message])
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
