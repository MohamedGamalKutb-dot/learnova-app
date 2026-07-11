import { motion } from 'framer-motion';

export default function PuzzlePiecesTray({ pieces, COLS, ROWS, draggedPiece, isDark, isArabic, imageLoaded, currentImage, handleDragStart, setDraggedPiece }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`rounded-[30px] border p-4 sm:p-6 backdrop-blur-2xl shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-violet-100'}`}
        >
            <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-4 text-center ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                {isArabic ? '🧩 القطع المتاحة' : '🧩 Available Pieces'}
            </h3>
            <div className="grid grid-cols-4 grid-rows-2 gap-1.5 sm:gap-2 aspect-[2/1]">
                {pieces.map((pieceValue, index) => {
                    if (pieceValue === -1) {
                        return <div key={`empty-${index}`} className="rounded-xl sm:rounded-2xl opacity-0" />;
                    }

                    const row = Math.floor(pieceValue / COLS);
                    const col = pieceValue % COLS;
                    const isSelected = draggedPiece === index;

                    return (
                        <motion.div
                            key={`piece-${pieceValue}`}
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.05, type: 'spring' }}
                            className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all duration-300 ${
                                isSelected
                                    ? 'border-violet-500 shadow-lg shadow-violet-500/30 scale-105 ring-2 ring-violet-400'
                                    : isDark ? 'border-white/10 hover:border-violet-500/50' : 'border-slate-200 hover:border-violet-400'
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onClick={() => {
                                if (draggedPiece === index) {
                                    setDraggedPiece(null);
                                } else {
                                    setDraggedPiece(index);
                                }
                            }}
                        >
                            {imageLoaded && (
                                <div
                                    className="w-full h-full aspect-[1/1]"
                                    style={{
                                        backgroundImage: `url(${currentImage})`,
                                        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                                        backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                                    }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
