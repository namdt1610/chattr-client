import { motion } from 'framer-motion'
import Sidebar, { SidebarProps } from './sidebar'

const SidebarWrapper = ({ isMobileSidebarOpen, fadeIn, ...props }) => (
    <motion.div
        className={`bg-white md:relative fixed inset-y-0 left-0 z-20 w-full md:w-80 xl:w-96 border-r border-gray-200 transition-transform ${
            isMobileSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full md:translate-x-0'
        }`}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
    >
        <Sidebar {...props} />
    </motion.div>
)

export default SidebarWrapper
