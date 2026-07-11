import { motion, AnimatePresence } from 'framer-motion';

export default function PuzzleCelebration({ showCelebration, isDark, isArabic, celebrationMsg, score }) {
    return (
        <AnimatePresence>
            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`p-10 sm:p-14 rounded-[50px] border text-center space-y-5 shadow-2xl backdrop-blur-3xl max-w-[400px] mx-4 ${isDark ? 'bg-[#161B22]/90 border-white/20' : 'bg-white/95 border-violet-200'}`}
                    >
                        {/* Confetti emojis */}
                        <div className="flex justify-center gap-2 text-5xl">
                            {['🎉', '⭐', '🏆', '⭐', '🎉'].map((e, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: -50, opacity: 0, rotate: -30 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    transition={{ delay: i * 0.1, type: 'spring' }}
                                >
                                    {e}
                                </motion.span>
                            ))}
                        </div>
                        <motion.h2
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-violet-900'}`}
                        >
                            {celebrationMsg}
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`text-lg font-bold ${isDark ? 'text-violet-300' : 'text-violet-600'}`}
                        >
                            {isArabic ? `النقاط: ${score}` : `Score: ${score}`}
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-sm opacity-50"
                        >
                            {isArabic ? 'جاري الانتقال للصورة التالية...' : 'Moving to next puzzle...'}
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
