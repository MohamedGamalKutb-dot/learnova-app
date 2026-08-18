import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ArtStudioHeaderProps {
    isDark: boolean;
    isArabic: boolean;
    savedDrawingsCount: number;
    onGalleryOpen: () => void;
    handleSave: () => void;
}

export default function ArtStudioHeader({ isDark, isArabic, savedDrawingsCount, onGalleryOpen, handleSave }: ArtStudioHeaderProps) {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <Button variant="light" radius="full" className={`mb-1 font-bold text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`} onPress={() => navigate('/games')}>
                    {isArabic ? '← العودة' : '← Back'}
                </Button>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter">
                    {isArabic ? 'استوديو الرسم' : 'Art Studio'}
                    <span className="text-pink-500 animate-pulse">.</span>
                </h1>
            </div>
            <div className="flex gap-2">
                <Button radius="full" size="sm" variant="bordered" className={`font-bold ${isDark ? 'border-white/20' : 'border-pink-200'}`} onPress={onGalleryOpen}>
                    🖼️ {isArabic ? 'رسوماتي' : 'My Art'} ({savedDrawingsCount})
                </Button>
                <Button radius="full" size="sm" className="bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/20" onPress={handleSave}>
                    💾 {isArabic ? 'حفظ' : 'Save'}
                </Button>
            </div>
        </motion.div>
    );
}
