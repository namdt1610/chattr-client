import React from 'react'
import { motion } from 'framer-motion'

interface MobileSidebarOverlayProps {
    isMobileSidebarOpen: boolean
    setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileSidebarOverlay: React.FC<MobileSidebarOverlayProps> = ({
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
}) => {
    return isMobileSidebarOpen ? (
        <motion.div
            className="md:hidden fixed inset-0 bg-black/50 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
        />
    ) : null
}

export default MobileSidebarOverlay
