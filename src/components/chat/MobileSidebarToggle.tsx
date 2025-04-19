import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const MobileSidebarToggle = ({ onClick }: { onClick: () => void }) => (
    <div className="md:hidden fixed bottom-4 left-4 z-30">
        <motion.button
            onClick={onClick}
            className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <MessageCircle size={24} />
        </motion.button>
    </div>
)

export default MobileSidebarToggle
