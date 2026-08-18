import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/shared/context/AppContext';
import { useAuth } from '@/shared/context/AuthContext';
import MainNavbar from '@/shared/components/MainNavbar';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

import { recordWordAnswer, getGameStats, getWordsConfig, getWordGameConfig } from './server/wordServer';

import WordGameHeader from './components/WordGameHeader';
import WordGameStats from './components/WordGameStats';
import WordGameFilters from './components/WordGameFilters';
import WordGameSlots from './components/WordGameSlots';
import WordGameControls from './components/WordGameControls';

function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomWord(words: any, difficulty: string, difficultyConfig: any): string {
    if (!difficultyConfig) return (Object.values(words).flat()[0] as string) || '';
    const diff = difficultyConfig[difficulty] || { min: 3, max: 50 };
    const { min, max } = diff;
    const filtered = Object.values(words).flat().filter((w: any) => typeof w === 'string' && w.length >= min && w.length <= max);
    if (filtered.length === 0) return (Object.values(words).flat()[0] as string) || '';
    return filtered[Math.floor(Math.random() * filtered.length)] as string;
}

function splitLetters(word: string, isArabic: boolean) {
    if (isArabic) {
        return [...word];
    }
    return word.split('');
}

export default function WordGame() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();

    const [difficulty, setDifficulty] = useState('easy');
    const [currentWord, setCurrentWord] = useState('');
    const [shuffledLetters, setShuffledLetters] = useState<any[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [answer, setAnswer] = useState<any[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [stats, setStats] = useState({ correct: 0, wrong: 0, score: 0, streak: 0 });
    const [category, setCategory] = useState<string | null>(null);

    const [wordsConfig, setWordsConfig] = useState<{ words: any, labels: any }>({ words: {}, labels: {} });
    const [wordGameConfig, setWordGameConfig] = useState<{ DIFFICULTY: any, encouragements: { ar: string[], en: string[] } }>({
        DIFFICULTY: { easy: { min: 3, max: 4 } },
        encouragements: { ar: ['أحسنت!'], en: ['Great job!'] }
    });

    useEffect(() => {
        getWordGameConfig().then((config: any) => {
            if (config) setWordGameConfig(config);
        });
    }, []);

    useEffect(() => {
        getWordsConfig(isArabic).then((config: any) => {
            if (config) {
                setWordsConfig(config);
            }
        });
    }, [isArabic]);

    useEffect(() => {
        if (currentChild?.childId) {
            const gameStats = getGameStats(currentChild.childId);
            setStats({
                correct: gameStats.wordCorrect || 0,
                wrong: gameStats.wordWrong || 0,
                score: gameStats.wordScore || 0,
                streak: gameStats.wordStreak || 0,
            });
        }
    }, [currentChild]);

    const loadNewWord = useCallback(() => {
        const words = wordsConfig.words;
        if (!words || Object.keys(words).length === 0) return;

        let wordPool = words;
        if (category) {
            wordPool = { [category]: words[category] || [] };
        }
        const word = getRandomWord(wordPool, difficulty, wordGameConfig.DIFFICULTY);
        if (!word) return;

        const letters = splitLetters(word, isArabic);
        setCurrentWord(word);
        setShuffledLetters(shuffleArray(letters.map((l: string, i: number) => ({ letter: l, originalIndex: i, id: `${l}-${i}` }))));
        setSelectedIndices([]);
        setAnswer([]);
        setIsCorrect(null);
        setShowResult(false);
    }, [isArabic, difficulty, category, wordsConfig, wordGameConfig.DIFFICULTY]);

    useEffect(() => {
        loadNewWord();
    }, [loadNewWord]);

    const playTapSound = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600 + Math.random() * 400, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch { /* */ }
    };

    const playSuccessSound = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            [523, 659, 784, 1047].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
                gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
                osc.connect(gain).connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.3);
            });
        } catch { /* */ }
    };

    const playErrorSound = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch { /* */ }
    };

    const handleLetterSelect = (index: number) => {
        if (selectedIndices.includes(index)) return;
        const newSelected = [...selectedIndices, index];
        const newAnswer = [...answer, shuffledLetters[index]];
        setSelectedIndices(newSelected);
        setAnswer(newAnswer);

        playTapSound();

        if (newAnswer.length === currentWord.length) {
            const formed = newAnswer.map(l => l.letter).join('');
            const correct = formed === currentWord;
            setIsCorrect(correct);
            setShowResult(true);

            if (correct) {
                const msgs = isArabic ? wordGameConfig.encouragements.ar : wordGameConfig.encouragements.en;
                setResultMessage(msgs[Math.floor(Math.random() * msgs.length)]);
                playSuccessSound();
            } else {
                setResultMessage(isArabic ? 'حاول مرة أخرى! 💪' : 'Try again! 💪');
                playErrorSound();
            }

            if (currentChild?.childId) {
                const updated = recordWordAnswer(currentChild.childId, correct);
                if (updated) {
                    setStats({
                        correct: updated.wordCorrect,
                        wrong: updated.wordWrong,
                        score: updated.wordScore,
                        streak: updated.wordStreak,
                    });
                }
            }

            setTimeout(() => {
                if (correct) {
                    loadNewWord();
                } else {
                    setSelectedIndices([]);
                    setAnswer([]);
                    setIsCorrect(null);
                    setShowResult(false);
                }
            }, correct ? 2500 : 1500);
        }
    };

    const handleRemoveLetter = (answerIndex: number) => {
        if (showResult) return;
        const newAnswer = [...answer];
        const removedItem = newAnswer.splice(answerIndex, 1)[0];
        const shuffledIdx = shuffledLetters.findIndex(l => l.id === removedItem.id);
        const newSelected = selectedIndices.filter(i => i !== shuffledIdx);
        setAnswer(newAnswer);
        setSelectedIndices(newSelected);
    };

    const handleSkip = () => {
        if (currentChild?.childId) {
            recordWordAnswer(currentChild.childId, false);
        }
        loadNewWord();
    };

    const words = wordsConfig.words;
    const categoryLabels = wordsConfig.labels;
    const difficultyLabels = {
        easy: isArabic ? 'سهل' : 'Easy',
        medium: isArabic ? 'متوسط' : 'Medium',
        hard: isArabic ? 'صعب' : 'Hard',
    };
    const totalAttempts = stats.correct + stats.wrong;
    const accuracy = totalAttempts > 0 ? Math.round((stats.correct / totalAttempts) * 100) : 0;

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🔤</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك أولاً' : 'Please Log In'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-emerald-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/20'}`} />
                <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDark ? 'bg-teal-600/10' : 'bg-teal-400/20'}`} />
            </div>

            <MainNavbar userType="child" />

            <main className="relative max-w-[800px] mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
                <WordGameHeader isDark={isDark} isArabic={isArabic} />
                
                <WordGameStats isDark={isDark} isArabic={isArabic} stats={stats} accuracy={accuracy} />

                <WordGameFilters 
                    isArabic={isArabic} 
                    wordGameConfig={wordGameConfig} 
                    difficulty={difficulty} 
                    setDifficulty={setDifficulty} 
                    difficultyLabels={difficultyLabels} 
                    words={words} 
                    category={category} 
                    setCategory={setCategory} 
                    categoryLabels={categoryLabels} 
                />

                {stats.streak > 2 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}`}
                    >
                        🔥 {isArabic ? `سلسلة: ${stats.streak} كلمات!` : `Streak: ${stats.streak} words!`}
                    </motion.div>
                )}

                <WordGameSlots 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    currentWord={currentWord} 
                    answer={answer} 
                    showResult={showResult} 
                    isCorrect={isCorrect} 
                    resultMessage={resultMessage} 
                    shuffledLetters={shuffledLetters} 
                    selectedIndices={selectedIndices} 
                    handleRemoveLetter={handleRemoveLetter} 
                    handleLetterSelect={handleLetterSelect} 
                />

                <WordGameControls 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    setSelectedIndices={setSelectedIndices} 
                    setAnswer={setAnswer} 
                    setIsCorrect={setIsCorrect} 
                    setShowResult={setShowResult} 
                    handleSkip={handleSkip} 
                    loadNewWord={loadNewWord} 
                />
            </main>
        </div>
    );
}
