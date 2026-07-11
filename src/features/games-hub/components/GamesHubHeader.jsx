import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function GamesHubHeader({ isDark, isArabic, stats }) {
    const navigate = useNavigate();
    return (
        <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14 md:mb-16"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
                <div className="space-y-3">
                    <Button
                        variant="light"
                        radius="full"
                        className={`mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                        onPress={() => navigate('/child-home')}
                    >
                        {isArabic ? '← العودة للرئيسية' : '← Back to Home'}
                    </Button>
                    <div className={`flex items-center gap-3 font-black tracking-[0.3em] uppercase text-[10px] transition-colors duration-1000 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                        <span className={`w-12 h-[1px] transition-colors duration-1000 ${isDark ? 'bg-violet-500/50' : 'bg-violet-300'}`} />
                        {isArabic ? 'مركز الألعاب' : 'Game Center'}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                        {isArabic ? 'هيا نلعب!' : 'Let\'s Play!'}
                        <span className="text-violet-500 animate-pulse">.</span>
                    </h1>
                    <p className={`text-lg max-w-[500px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isArabic ? 'اختر لعبتك المفضلة وابدأ المتعة والتعلم!' : 'Pick your favorite game and start the fun!'}
                    </p>
                </div>

                {stats && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className={`px-6 sm:px-8 py-4 sm:py-5 rounded-[24px] sm:rounded-[32px] backdrop-blur-2xl border flex flex-col items-center min-w-[130px] sm:min-w-[160px] shadow-2xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-violet-100'}`}
                    >
                        <span className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-amber-300' : 'text-amber-500'}`}>⭐ {stats.totalGamePoints}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">{isArabic ? 'إجمالي النقاط' : 'Total Points'}</span>
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
}
