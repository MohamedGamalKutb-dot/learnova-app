import { motion } from 'framer-motion';

export default function PuzzleBoard({ TOTAL_PIECES, COLS, ROWS, placedPieces, draggedPiece, isDark, isArabic, imageLoaded, currentImage, handleDragOver, handleDrop, handleSlotTap }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`rounded-[30px] border p-4 sm:p-6 backdrop-blur-2xl shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-violet-100'}`}
        >
            <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-4 text-center ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                {isArabic ? '🎯 ركّب الصورة هنا' : '🎯 Build Image Here'}
            </h3>
            <div className="grid grid-cols-4 grid-rows-2 gap-1.5 sm:gap-2 aspect-[2/1]">
                {Array.from({ length: TOTAL_PIECES }).map((_, slotIndex) => {
                    const isPlaced = placedPieces[slotIndex] !== null;
                    const row = Math.floor(slotIndex / COLS);
                    const col = slotIndex % COLS;

                    return (
                        <div
                            key={`slot-${slotIndex}`}
                            className={`relative rounded-xl sm:rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300 cursor-pointer ${
                                isPlaced
                                    ? 'border-transparent'
                                    : draggedPiece !== null
                                        ? isDark ? 'border-violet-400/60 bg-violet-500/10' : 'border-violet-400 bg-violet-50'
                                        : isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, slotIndex)}
                            onClick={() => handleSlotTap(slotIndex)}
                        >
                            {isPlaced && imageLoaded ? (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    className="w-full h-full"
                                    style={{
                                        backgroundImage: `url(${currentImage})`,
                                        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                                        backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xl opacity-20">{slotIndex + 1}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
