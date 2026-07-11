import { motion, AnimatePresence } from 'framer-motion';

export default function WordGameSlots({ isDark, isArabic, currentWord, answer, showResult, isCorrect, resultMessage, shuffledLetters, selectedIndices, handleRemoveLetter, handleLetterSelect }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`rounded-[30px] border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-emerald-100'}`}
        >
            <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-5 text-center ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {isArabic ? '📝 رتّب الحروف لتكوين الكلمة' : '📝 Arrange letters to form the word'}
            </h3>

            {/* Answer display */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
                {Array.from({ length: currentWord.length }).map((_, i) => {
                    const hasLetter = answer[i];
                    return (
                        <motion.div
                            key={`slot-${i}`}
                            layout
                            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black transition-all duration-300 cursor-pointer ${
                                hasLetter
                                    ? showResult
                                        ? isCorrect
                                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500'
                                            : 'border-red-500 bg-red-500/20 text-red-500'
                                        : isDark
                                            ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                                            : 'border-emerald-400 bg-emerald-50 text-emerald-800'
                                    : isDark
                                        ? 'border-white/10 bg-white/5'
                                        : 'border-slate-200 bg-slate-50'
                            }`}
                            onClick={() => hasLetter && handleRemoveLetter(i)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {hasLetter ? (
                                <motion.span
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                >
                                    {hasLetter.letter}
                                </motion.span>
                            ) : (
                                <span className="opacity-15 text-sm">{i + 1}</span>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Result message */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`text-center py-3 px-6 rounded-2xl font-black text-lg mb-5 ${
                            isCorrect
                                ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                : isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {resultMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shuffled letters */}
            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                {shuffledLetters.map((letterObj, index) => {
                    const isUsed = selectedIndices.includes(index);
                    return (
                        <motion.button
                            key={letterObj.id}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: isUsed ? 0.8 : 1, opacity: isUsed ? 0.3 : 1 }}
                            transition={{ delay: index * 0.03, type: 'spring' }}
                            disabled={isUsed || showResult}
                            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black transition-all duration-300 ${
                                isUsed
                                    ? 'opacity-30 cursor-not-allowed'
                                    : isDark
                                        ? 'border-white/20 bg-white/5 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-90'
                                        : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-400 hover:bg-emerald-50 active:scale-90'
                            }`}
                            onClick={() => handleLetterSelect(index)}
                        >
                            {letterObj.letter}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
