import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface WordGameHeaderProps {
    isDark: boolean;
    isArabic: boolean;
}

export default function WordGameHeader({ isDark, isArabic }: WordGameHeaderProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <Button
                variant="light"
                radius="full"
                className={`mb-3 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                onPress={() => navigate('/games')}
            >
                {isArabic ? '← العودة للألعاب' : '← Back to Games'}
            </Button>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
                {isArabic ? 'صانع الكلمات' : 'Word Builder'}
                <span className="text-emerald-500 animate-pulse">.</span>
            </h1>
        </motion.div>
    );
}
