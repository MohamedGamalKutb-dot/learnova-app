import { motion } from 'framer-motion';

interface NoteObj {
    note: string;
    key: string;
    type: string;
}

interface PianoKeyboardProps {
    isDark: boolean;
    isArabic: boolean;
    NOTES: NoteObj[];
    KEY_COLORS: Record<string, string>;
    activeKeys: Set<string>;
    playNote: (noteObj: NoteObj) => void;
}

export default function PianoKeyboard({ isDark, isArabic, NOTES, KEY_COLORS, activeKeys, playNote }: PianoKeyboardProps) {
    const whiteKeys = NOTES.filter(n => n.type === 'white');
    const blackKeys = NOTES.filter(n => n.type === 'black');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-[30px] border p-4 sm:p-6 backdrop-blur-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-amber-100'}`}
        >
            <div className="relative" style={{ perspective: '800px' }}>
                <div className="flex justify-center relative" style={{ transform: 'rotateX(5deg)', transformOrigin: 'bottom' }}>
                    {/* White keys */}
                    <div className="flex gap-[3px] relative">
                        {whiteKeys.map((noteObj) => {
                            const isActive = activeKeys.has(noteObj.note);
                            return (
                                <motion.button
                                    key={noteObj.note}
                                    className={`relative w-[42px] sm:w-[56px] md:w-[64px] h-[160px] sm:h-[200px] md:h-[220px] rounded-b-xl transition-all duration-100 select-none border ${
                                        isActive
                                            ? 'shadow-lg translate-y-[2px]'
                                            : isDark
                                                ? 'bg-gradient-to-b from-slate-200 to-white border-slate-300 hover:from-slate-100 shadow-md'
                                                : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 hover:from-slate-50 shadow-md'
                                    }`}
                                    style={isActive ? {
                                        background: `linear-gradient(to bottom, ${KEY_COLORS[noteObj.note]}33, ${KEY_COLORS[noteObj.note]}66)`,
                                        borderColor: KEY_COLORS[noteObj.note],
                                        boxShadow: `0 4px 20px ${KEY_COLORS[noteObj.note]}44`,
                                    } : undefined}
                                    onPointerDown={() => playNote(noteObj)}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div className="absolute bottom-3 left-0 right-0 text-center">
                                        <div className={`text-xs sm:text-sm font-black ${isActive ? 'opacity-100' : 'opacity-30'}`} style={isActive ? { color: KEY_COLORS[noteObj.note] } : undefined}>
                                            {noteObj.note}
                                        </div>
                                        <div className={`text-[9px] uppercase font-bold mt-0.5 ${isActive ? 'opacity-80' : 'opacity-20'}`}>
                                            {noteObj.key.toUpperCase()}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Black keys */}
                    <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="flex gap-[3px] relative">
                            {whiteKeys.map((wk, i) => {
                                const blackNote = blackKeys.find(bk => {
                                    const whiteIdx = NOTES.indexOf(wk);
                                    const blackIdx = NOTES.indexOf(bk);
                                    return blackIdx === whiteIdx + 1;
                                });

                                if (!blackNote) return <div key={`gap-${i}`} className="w-[42px] sm:w-[56px] md:w-[64px]" />;

                                const isActive = activeKeys.has(blackNote.note);

                                return (
                                    <div key={`black-${blackNote.note}`} className="w-[42px] sm:w-[56px] md:w-[64px] relative">
                                        <motion.button
                                            className={`absolute pointer-events-auto z-10 w-[28px] sm:w-[36px] md:w-[40px] h-[100px] sm:h-[125px] md:h-[140px] rounded-b-lg transition-all duration-100 select-none ${
                                                isActive
                                                    ? 'translate-y-[1px]'
                                                    : ''
                                            }`}
                                            style={{
                                                left: '100%',
                                                transform: `translateX(-50%) ${isActive ? 'translateY(1px)' : ''}`,
                                                background: isActive
                                                    ? `linear-gradient(to bottom, ${KEY_COLORS[blackNote.note]}, ${KEY_COLORS[blackNote.note]}cc)`
                                                    : 'linear-gradient(to bottom, #1e293b, #0f172a)',
                                                boxShadow: isActive
                                                    ? `0 2px 15px ${KEY_COLORS[blackNote.note]}66`
                                                    : '0 3px 8px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
                                            }}
                                            onPointerDown={() => playNote(blackNote)}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <div className="absolute bottom-2 left-0 right-0 text-center">
                                                <div className={`text-[9px] sm:text-[10px] font-black text-white ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                                    {blackNote.note}
                                                </div>
                                                <div className={`text-[8px] uppercase font-bold text-white ${isActive ? 'opacity-70' : 'opacity-20'}`}>
                                                    {blackNote.key.toUpperCase()}
                                                </div>
                                            </div>
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <p className={`text-center mt-4 text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {isArabic ? '💡 استخدم لوحة المفاتيح: A S D F G H J K L Z X C V (المفاتيح البيضاء) | W E T Y U O (المفاتيح السوداء)' : '💡 Use keyboard: A S D F G H J K L Z X C V (white keys) | W E T Y U O (black keys)'}
            </p>
        </motion.div>
    );
}
