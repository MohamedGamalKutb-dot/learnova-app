import { Modal, ModalContent, ModalBody, ModalHeader, Button } from '@heroui/react';

export default function ArtStudioGalleryModal({ isGalleryOpen, onGalleryClose, isDark, isArabic, savedDrawings, handleLoadDrawing, handleDeleteDrawing }) {
    return (
        <Modal isOpen={isGalleryOpen} onClose={onGalleryClose} size="3xl" backdrop="blur"
            classNames={{
                base: `backdrop-blur-3xl border rounded-[30px] ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-pink-100'}`,
                backdrop: 'bg-pink-950/50 backdrop-blur-sm'
            }}
        >
            <ModalContent>
                <ModalHeader className={`font-black text-xl ${isDark ? 'text-white' : 'text-pink-900'}`}>
                    🖼️ {isArabic ? 'رسوماتي' : 'My Drawings'}
                </ModalHeader>
                <ModalBody className="pb-6">
                    {savedDrawings.length === 0 ? (
                        <div className="text-center py-10 opacity-40">
                            <div className="text-5xl mb-3">🎨</div>
                            <p className="font-bold">{isArabic ? 'لا توجد رسومات محفوظة بعد' : 'No saved drawings yet'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {savedDrawings.map((d) => (
                                <div key={d.id} className={`rounded-xl border overflow-hidden group relative ${isDark ? 'border-white/10' : 'border-pink-100'}`}>
                                    <img src={d.data} alt="Drawing" className="w-full aspect-video object-cover cursor-pointer" onClick={() => handleLoadDrawing(d.data)} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button size="sm" radius="full" className="bg-white/90 text-black font-bold" onPress={() => handleLoadDrawing(d.data)}>
                                            {isArabic ? 'فتح' : 'Open'}
                                        </Button>
                                        <Button size="sm" radius="full" className="bg-red-500 text-white font-bold" onPress={() => handleDeleteDrawing(d.id)}>
                                            🗑️
                                        </Button>
                                    </div>
                                    <div className="p-2 text-[10px] opacity-40">
                                        {new Date(d.createdAt).toLocaleDateString()}
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
