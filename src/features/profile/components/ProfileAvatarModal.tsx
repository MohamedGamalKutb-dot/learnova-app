import { Modal, ModalContent, ModalBody, ModalHeader, Button } from '@heroui/react';

interface ProfileAvatarModalProps {
    isDark: boolean;
    isArabic: boolean;
    showAvatarPicker: boolean;
    setShowAvatarPicker: (show: boolean) => void;
    isUploadingAvatar: boolean;
    activeUser: any;
    avatarOptions: string[];
    updateChildProfile: (updates: any) => void;
    handleImageUpload: (e: any) => void;
}

export default function ProfileAvatarModal({ isDark, isArabic, showAvatarPicker, setShowAvatarPicker, isUploadingAvatar, activeUser, avatarOptions, updateChildProfile, handleImageUpload }: ProfileAvatarModalProps) {
    return (
        <Modal isOpen={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} size="sm" backdrop="blur"
            classNames={{
                base: `backdrop-blur-3xl border rounded-[50px] overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-indigo-100'}`,
                backdrop: 'bg-indigo-950/40 backdrop-blur-sm'
            }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={`flex flex-col gap-1 text-center justify-center w-full mt-6 font-black text-xl ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>
                            {isArabic ? '✨ اختر مظهر بطلنا' : '✨ Choose Your Hero'}
                        </ModalHeader>
                        <ModalBody className="pb-12 pt-4 px-10">
                            <div className="mb-6">
                                <Button fullWidth radius="full" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black h-14 shadow-xl shadow-indigo-500/20"
                                    onPress={() => document.getElementById('avatar-upload')?.click()}
                                    isLoading={isUploadingAvatar}
                                    startContent={!isUploadingAvatar && <span className="text-xl">📸</span>}>
                                    {isArabic ? 'رفع صورة حقيقية' : 'UPLOAD PHOTO'}
                                </Button>
                                {/* We keep the input hidden, handled in parent */}
                            </div>
                            <div className={`grid grid-cols-4 gap-4 border-t pt-8 transition-colors duration-1000 ${isDark ? 'border-white/5' : 'border-indigo-100'}`}>
                                {avatarOptions.map(em => (
                                    <Button key={em} isIconOnly radius="lg" variant={activeUser.avatar === em ? 'flat' : 'bordered'} color={activeUser.avatar === em ? 'primary' : 'default'}
                                        className={`w-full h-auto aspect-square text-3xl transition-transform hover:scale-110 ${activeUser.avatar !== em ? (isDark ? 'border-white/10' : 'border-indigo-100') : ''}`}
                                        onPress={() => { updateChildProfile({ avatar: em }); onClose(); }}>
                                        {em}
                                    </Button>
                                ))}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
