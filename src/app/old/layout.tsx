import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chat App - Beta',
    description: 'A minimalist chat application',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen min-w-screen">{children}</div>
}
