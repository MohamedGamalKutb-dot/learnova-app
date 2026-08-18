import { motion, AnimatePresence } from 'framer-motion';

interface PianoCurrentNoteProps {
    isDark: boolean;
    isArabic: boolean;
    lastNote: string | null;
    KEY_COLORS: Record<string, string>;
}

export default function PianoCurrentNote({ isDark, isArabic, lastNote, KEY_COLORS }: PianoCurrentNoteProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 text-center p-4 rounded-[24px] border backdrop-blur-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-amber-100'}`}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={lastNote || 'empty'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                >
                    <span className="text-4xl sm:text-5xl font-black" style={{ color: lastNote ? KEY_COLORS[lastNote] : (isDark ? '#e2e8f0' : '#1e293b') }}>
                        {lastNote || '🎵'}
                    </span>
                    {lastNote && (
                        <span className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isArabic ? 'النغمة الحالية' : 'Current Note'}
                        </span>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
