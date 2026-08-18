import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PuzzleHeaderProps {
    isDark: boolean;
    isArabic: boolean;
    score: number;
    currentImageIndex: number;
    totalImages: number;
}

export default function PuzzleHeader({ isDark, isArabic, score, currentImageIndex, totalImages }: PuzzleHeaderProps) {
    const navigate = useNavigate();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
            <div>
                <Button
                    variant="light"
                    radius="full"
                    className={`mb-3 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    onPress={() => navigate('/games')}
                >
                    {isArabic ? '← العودة للألعاب' : '← Back to Games'}
                </Button>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
                    {isArabic ? 'تحدي البازل' : 'Puzzle Challenge'}
                    <span className="text-violet-500 animate-pulse">.</span>
                </h1>
            </div>

            <div className="flex gap-3">
                <div className={`px-5 py-3 rounded-[20px] border backdrop-blur-2xl text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-violet-100'}`}>
                    <div className={`text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-500'}`}>⭐ {score}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">{isArabic ? 'النقاط' : 'Score'}</div>
                </div>
                <div className={`px-5 py-3 rounded-[20px] border backdrop-blur-2xl text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-violet-100'}`}>
                    <div className={`text-2xl font-black ${isDark ? 'text-violet-300' : 'text-violet-500'}`}>🧩 {currentImageIndex + 1}/{totalImages}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">{isArabic ? 'الصورة' : 'Image'}</div>
                </div>
            </div>
        </motion.div>
    );
}
