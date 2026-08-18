import { motion, AnimatePresence } from 'framer-motion';

interface ArtStudioShapesPanelProps {
    showShapes: boolean;
    isDark: boolean;
    isArabic: boolean;
    SHAPES: Record<string, { icon: string; label: { ar: string; en: string } }>;
    handleDrawShape: (shapeKey: string) => void;
}

export default function ArtStudioShapesPanel({ showShapes, isDark, isArabic, SHAPES, handleDrawShape }: ArtStudioShapesPanelProps) {
    return (
        <AnimatePresence>
            {showShapes && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mb-3 p-3 rounded-[16px] border backdrop-blur-2xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-pink-100'}`}
                >
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(SHAPES).map(([key, shape]) => (
                            <button
                                key={key}
                                onClick={() => handleDrawShape(key)}
                                className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${isDark ? 'hover:bg-white/10 border border-white/10' : 'hover:bg-pink-50 border border-pink-100'}`}
                            >
                                <span>{shape.icon}</span>
                                <span className="hidden sm:inline">{isArabic ? shape.label.ar : shape.label.en}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
