import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/shared/context/AppContext';
import { useAuth } from '@/shared/context/AuthContext';
import MainNavbar from '@/shared/components/MainNavbar';
import { getPuzzleConfig, getPuzzleStats, recordPuzzleComplete } from './server/puzzleServer';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

import PuzzleHeader from './components/PuzzleHeader';
import PuzzleBoard from './components/PuzzleBoard';
import PuzzlePiecesTray from './components/PuzzlePiecesTray';
import PuzzleCelebration from './components/PuzzleCelebration';

const GRID_SIZE = 4; // 4x2 = 8 pieces
const COLS = 4;
const ROWS = 2;
const TOTAL_PIECES = COLS * ROWS;

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function Puzzle() {
    const navigate = useNavigate();
    const { isDark } = useApp();
    const isArabic = false; // Forced to English based on user request
    const { currentChild } = useAuth();

    const [shuffledImages, setShuffledImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [pieces, setPieces] = useState<number[]>([]);
    const [placedPieces, setPlacedPieces] = useState<(number | null)[]>([]);
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMsg, setCelebrationMsg] = useState('');
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [imageLoaded, setImageLoaded] = useState(false);

    const imageRef = useRef<HTMLImageElement>(null);

    const [puzzleConfig, setPuzzleConfig] = useState<{ PUZZLE_IMAGES: string[], encouragements: { ar: string[], en: string[] } }>({
        PUZZLE_IMAGES: [],
        encouragements: { ar: ['أحسنت!'], en: ['Great job!'] }
    });

    useEffect(() => {
        getPuzzleConfig().then((config: any) => {
            if (config) {
                setPuzzleConfig(config);
            }
        });
    }, []);

    const initPuzzle = useCallback((imgIndex: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const indices = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
        let newPieces = shuffleArray(indices);
        let attempts = 0;
        while (newPieces.every((val, i) => val === i) && attempts < 5) {
            newPieces = shuffleArray(indices);
            attempts++;
        }
        setPieces(newPieces);
        setPlacedPieces(new Array(TOTAL_PIECES).fill(null));
        setIsComplete(false);
        setShowCelebration(false);
        setStartTime(Date.now());
        setDraggedPiece(null);
    }, []);

    useEffect(() => {
        if (puzzleConfig.PUZZLE_IMAGES && puzzleConfig.PUZZLE_IMAGES.length > 0) {
            setShuffledImages(shuffleArray([...puzzleConfig.PUZZLE_IMAGES]));
        }
    }, [puzzleConfig.PUZZLE_IMAGES]);

    useEffect(() => {
        if (shuffledImages.length > 0) {
            setImageLoaded(false);
            initPuzzle(currentImageIndex);
        }
    }, [currentImageIndex, shuffledImages, initPuzzle]);

    useEffect(() => {
        if (currentChild?.childId) {
            const stats = getPuzzleStats(currentChild.childId);
            setScore(stats.puzzleScore);
        }
    }, [currentChild]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleDragStart = (e: any, pieceIndex: number) => {
        setDraggedPiece(pieceIndex);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', pieceIndex.toString());
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: any, slotIndex: number) => {
        e.preventDefault();
        let pIndex = draggedPiece;
        if (pIndex === null && e.dataTransfer) {
            const data = e.dataTransfer.getData('text/plain');
            if (data) {
                pIndex = parseInt(data, 10);
            }
        }
        if (pIndex === null || isNaN(pIndex)) return;

        const pieceValue = pieces[pIndex];
        if (pieceValue === slotIndex) {
            const newPlaced = [...placedPieces];
            newPlaced[slotIndex] = pieceValue;
            setPlacedPieces(newPlaced);

            const newPieces = [...pieces];
            newPieces[pIndex] = -1;
            setPieces(newPieces);

            playTapSound();

            if (newPlaced.every((p, i) => p === i)) {
                handlePuzzleComplete();
            }
        }
        setDraggedPiece(null);
    };

    const handleSlotTap = (slotIndex: number) => {
        if (draggedPiece === null) return;
        const pieceValue = pieces[draggedPiece];

        if (pieceValue === slotIndex) {
            const newPlaced = [...placedPieces];
            newPlaced[slotIndex] = pieceValue;
            setPlacedPieces(newPlaced);

            const newPieces = [...pieces];
            newPieces[draggedPiece] = -1;
            setPieces(newPieces);

            playTapSound();

            if (newPlaced.every((p, i) => p === i)) {
                handlePuzzleComplete();
            }
        }
        setDraggedPiece(null);
    };

    const handlePuzzleComplete = () => {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        setIsComplete(true);
        setShowCelebration(true);

        const msgs = isArabic ? puzzleConfig.encouragements.ar : puzzleConfig.encouragements.en;
        setCelebrationMsg(msgs[Math.floor(Math.random() * msgs.length)]);

        playSuccessSound();

        if (currentChild?.childId) {
            const updated = recordPuzzleComplete(currentChild.childId, elapsed);
            if (updated) setScore(updated.puzzleScore);
        }

        setTimeout(() => {
            setShowCelebration(false);
            setCurrentImageIndex(prev => {
                const nextIndex = prev + 1;
                if (nextIndex >= shuffledImages.length) {
                    const lastImage = shuffledImages[shuffledImages.length - 1];
                    let newShuffled = shuffleArray([...puzzleConfig.PUZZLE_IMAGES]);
                    let attempts = 0;
                    while (newShuffled[0] === lastImage && newShuffled.length > 1 && attempts < 10) {
                        newShuffled = shuffleArray([...puzzleConfig.PUZZLE_IMAGES]);
                        attempts++;
                    }
                    setShuffledImages(newShuffled);
                    return 0;
                }
                return nextIndex;
            });
        }, 3000);
    };

    const playTapSound = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch { /* ignore audio errors */ }
    };

    const playSuccessSound = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
                osc.connect(gain).connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 0.4);
            });
        } catch { /* ignore */ }
    };

    const currentImage = shuffledImages.length > 0 ? shuffledImages[currentImageIndex] : (puzzleConfig.PUZZLE_IMAGES[0] || '');

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🧩</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك أولاً' : 'Please Log In'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-violet-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-violet-600/10' : 'bg-violet-400/20'}`} />
                <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/20'}`} />
            </div>

            <MainNavbar userType="child" />

            <main className="relative max-w-[900px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
                <PuzzleHeader 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    score={score} 
                    currentImageIndex={currentImageIndex} 
                    totalImages={Math.max(1, puzzleConfig.PUZZLE_IMAGES.length)} 
                />

                <img ref={imageRef} src={currentImage} onLoad={handleImageLoad} className="hidden" alt="" />

                {draggedPiece !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-4 text-center py-3 px-6 rounded-2xl font-bold text-sm ${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}
                    >
                        {isArabic ? '👆 الآن اضغط على المكان الصحيح في الصورة!' : '👆 Now tap the correct slot in the grid!'}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PuzzleBoard 
                        TOTAL_PIECES={TOTAL_PIECES}
                        COLS={COLS}
                        ROWS={ROWS}
                        placedPieces={placedPieces}
                        draggedPiece={draggedPiece}
                        isDark={isDark}
                        isArabic={isArabic}
                        imageLoaded={imageLoaded}
                        currentImage={currentImage}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleSlotTap={handleSlotTap}
                    />

                    <PuzzlePiecesTray 
                        pieces={pieces}
                        COLS={COLS}
                        ROWS={ROWS}
                        draggedPiece={draggedPiece}
                        isDark={isDark}
                        isArabic={isArabic}
                        imageLoaded={imageLoaded}
                        currentImage={currentImage}
                        handleDragStart={handleDragStart}
                        setDraggedPiece={setDraggedPiece}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 flex justify-center"
                >
                    <div className={`px-4 py-3 rounded-2xl border backdrop-blur-2xl flex items-center gap-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-violet-100'}`}>
                        <img src={currentImage} alt="Hint" className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-contain" />
                        <span className="text-xs sm:text-sm font-bold opacity-50">
                            {isArabic ? '💡 الصورة الأصلية كمساعدة' : '💡 Original image for reference'}
                        </span>
                    </div>
                </motion.div>

                <div className="mt-6 flex justify-center">
                    <Button
                        radius="full"
                        variant="bordered"
                        className={`font-bold ${isDark ? 'border-white/20 text-slate-300' : 'border-violet-200 text-violet-600'}`}
                        onPress={() => initPuzzle(currentImageIndex)}
                    >
                        🔄 {isArabic ? 'إعادة ترتيب القطع' : 'Shuffle Pieces'}
                    </Button>
                </div>
            </main>

            <PuzzleCelebration 
                showCelebration={showCelebration}
                isDark={isDark}
                isArabic={isArabic}
                celebrationMsg={celebrationMsg}
                score={score + 1}
            />
        </div>
    );
}
