import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@heroui/react';
import { useState } from 'react';

interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLinkChild: (childId: string) => Promise<void>;
    isDark: boolean;
    isArabic: boolean;
}

export default function AddChildModal({
    isOpen,
    onClose,
    onLinkChild,
    isDark,
    isArabic
}: AddChildModalProps) {
    const [newChildId, setNewChildId] = useState('');

    const handleLink = async () => {
        if (!newChildId.trim()) return;
        await onLinkChild(newChildId);
        setNewChildId(''); // clear input after successful link
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size="md" 
            backdrop="blur" 
            classNames={{ 
                base: isDark ? 'bg-[#0E101F] border border-white/10' : 'bg-white border border-slate-200', 
                closeButton: 'hidden' 
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={`flex flex-col gap-1 text-center mt-2 pb-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <h3 className="m-0 text-lg font-bold">
                                {isArabic ? 'ربط طفل جديد' : 'Link a New Child'}
                            </h3>
                        </ModalHeader>
                        <ModalBody className="pb-6">
                            <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isArabic 
                                    ? 'أدخل كود الطفل المتاح في ملف الطفل الشخصي لربطه بحسابك ومتابعة تقدمه.' 
                                    : "Enter the child code from the child's profile to link them and start monitoring."}
                            </p>
                            <div className={`p-4 rounded-[14px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                <label className={`block text-xs mb-2 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {isArabic ? 'كود الطفل' : 'Child Code'}
                                </label>
                                <div className="flex gap-2">
                                    <Input 
                                        variant="bordered" 
                                        radius="lg"
                                        value={newChildId} 
                                        onChange={e => setNewChildId(e.target.value.toUpperCase())}
                                        placeholder="LN-XXXXXX" 
                                        className="flex-1"
                                        classNames={{ 
                                            inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-indigo-500` 
                                        }} 
                                    />
                                    <Button className="bg-indigo-600 text-white font-bold" radius="lg" onPress={handleLink}>
                                        {isArabic ? 'ربط' : 'Link'}
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className="pt-0">
                            <Button 
                                fullWidth 
                                variant="bordered" 
                                radius="lg" 
                                className={`${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'}`} 
                                onPress={onClose}
                            >
                                {isArabic ? 'إلغاء' : 'Cancel'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
