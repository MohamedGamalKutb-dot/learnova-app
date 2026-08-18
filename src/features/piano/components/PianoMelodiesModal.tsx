import { Modal, ModalContent, ModalBody, ModalHeader, Button } from '@heroui/react';

interface PianoMelodiesModalProps {
    isMelodiesOpen: boolean;
    onMelodiesClose: () => void;
    isDark: boolean;
    isArabic: boolean;
    savedMelodies: any[];
    handleDeleteMelody: (id: string) => void;
    handlePlaySavedMelody: (notes: any[]) => void;
    isPlaying: boolean;
}

export default function PianoMelodiesModal({ isMelodiesOpen, onMelodiesClose, isDark, isArabic, savedMelodies, handleDeleteMelody, handlePlaySavedMelody, isPlaying }: PianoMelodiesModalProps) {
    return (
        <Modal isOpen={isMelodiesOpen} onClose={onMelodiesClose} size="lg" backdrop="blur"
            classNames={{
                base: `backdrop-blur-3xl border rounded-[30px] ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-amber-100'}`,
                backdrop: 'bg-amber-950/50 backdrop-blur-sm'
            }}
        >
            <ModalContent>
                <ModalHeader className={`font-black text-xl ${isDark ? 'text-white' : 'text-amber-900'}`}>
                    🎼 {isArabic ? 'ألحاني المحفوظة' : 'Saved Melodies'}
                </ModalHeader>
                <ModalBody className="pb-6">
                    {savedMelodies.length === 0 ? (
                        <div className="text-center py-10 opacity-40">
                            <div className="text-5xl mb-3">🎵</div>
                            <p className="font-bold">{isArabic ? 'لا توجد ألحان محفوظة بعد' : 'No saved melodies yet'}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedMelodies.map((melody, i) => (
                                <div
                                    key={melody.id}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-amber-100 hover:bg-amber-50'}`}
                                >
                                    <div>
                                        <div className={`font-black ${isDark ? 'text-white' : 'text-amber-900'}`}>
                                            🎵 {isArabic ? `لحن #${savedMelodies.length - i}` : `Melody #${savedMelodies.length - i}`}
                                        </div>
                                        <div className="text-xs opacity-40">
                                            {melody.notes.length} {isArabic ? 'نغمة' : 'notes'} • {new Date(melody.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm" radius="full" variant="flat" color="danger"
                                            className="font-bold"
                                            onPress={() => handleDeleteMelody(melody.id)}
                                        >
                                            {isArabic ? 'حذف' : 'Delete'}
                                        </Button>
                                        <Button
                                            size="sm" radius="full"
                                            className="bg-amber-500 text-white font-bold"
                                            onPress={() => handlePlaySavedMelody(melody.notes)}
                                            isLoading={isPlaying}
                                        >
                                            ▶️ {isArabic ? 'تشغيل' : 'Play'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
