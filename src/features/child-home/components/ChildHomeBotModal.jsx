import { Modal, ModalContent, ModalBody } from '@heroui/react';
import AutismSupportBot from '../../../shared/components/AutismSupportBot';

export default function ChildHomeBotModal({ isOpen, onClose, isDark }) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size="2xl" 
            backdrop="blur" 
            classNames={{ 
                base: `backdrop-blur-3xl border rounded-[50px] overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-indigo-100'}`,
                backdrop: 'bg-indigo-950/70 backdrop-blur-sm'
            }}
        >
            <ModalContent>
                <ModalBody className="p-0">
                    <AutismSupportBot mode="child" />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
