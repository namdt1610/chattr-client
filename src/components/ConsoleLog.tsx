import React from 'react'

const ConsoleLog = ({ logs }: any) => {
    return (
        <>
            <h2 className="text-xl mt-4">Console Logs</h2>
            <div
                className="w-full h-full flex flex-col items-center justify-center "
                style={{
                    background: '#0000',
                    color: '#111',
                    padding: '10px',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                }}
            >
                <h3>🧾 Logs</h3>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {logs.map((log: any, index: any) => (
                        <div key={index}>{log}</div>
                    ))}
                </pre>
            </div>
        </>
    )
}

export default ConsoleLog
