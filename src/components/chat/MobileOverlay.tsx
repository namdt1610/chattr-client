import { motion } from 'framer-motion'

const MobileOverlay = ({ onClick }: { onClick: () => void }) => (
    <motion.div
        className="md:hidden fixed inset-0 bg-black/50 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
    />
)

export default MobileOverlay
