import { AnimatePresence } from 'framer-motion'
import ExpiredSessionModal from '@/components/ExpiredSessionModal'
import { ModalHandlerProps } from '@/types/chat'

const ModalHandler = ({
    isLoggedIn,
    showLoginModal,
    setShowLoginModal,
}: ModalHandlerProps) => (
    <AnimatePresence>
        {showLoginModal && (
            <ExpiredSessionModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        )}
    </AnimatePresence>
)

export default ModalHandler
