import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PianoHeaderProps {
    isDark: boolean;
    isArabic: boolean;
    totalNotes: number;
}

export default function PianoHeader({ isDark, isArabic, totalNotes }: PianoHeaderProps) {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <Button variant="light" radius="full" className={`mb-2 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`} onPress={() => navigate('/games')}>
                    {isArabic ? '← العودة' : '← Back'}
                </Button>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
                    {isArabic ? 'بيانو الموسيقى' : 'Music Piano'}
                    <span className="text-amber-500 animate-pulse">.</span>
                </h1>
            </div>
            <div className="flex gap-3">
                <div className={`px-4 py-3 rounded-[20px] border backdrop-blur-2xl text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-amber-100'}`}>
                    <div className={`text-xl font-black ${isDark ? 'text-amber-300' : 'text-amber-500'}`}>🎵 {totalNotes}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40">{isArabic ? 'النغمات' : 'Notes'}</div>
                </div>
            </div>
        </motion.div>
    );
}
