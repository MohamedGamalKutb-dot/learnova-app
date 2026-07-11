import { useState, useCallback } from 'react';
import { useApp } from '../../shared/context/AppContext';
import { useData } from '../../shared/context/DataContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useGlobalData } from '../../shared/context/GlobalDataContext';

import EmotionsNavbar from './components/EmotionsNavbar';
import EmotionsQuizResult from './components/EmotionsQuizResult';
import EmotionsQuizActive from './components/EmotionsQuizActive';
import EmotionsLearnMode from './components/EmotionsLearnMode';

export default function Emotions() {
    const { isDark, isArabic } = useApp();
    const { trackEmotionLearn, trackEmotionQuiz } = useData();
    const { currentChild, updateChildEmotionStats } = useAuth();
    const { emotions: { allEmotions = [] }, isLoading } = useGlobalData();

    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false);

    const emotions = allEmotions.filter(e => e.difficultyLevel <= currentLevel);
    const currentEmotion = emotions[currentIndex] || emotions[0] || {};
    const historyEntries = Object.entries(currentChild?.emotionHistory || {}).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 5);

    const speak = useCallback((t) => {
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(t); u.lang = isArabic ? 'ar' : 'en-US'; u.rate = 0.8; speechSynthesis.speak(u);
        }
    }, [isArabic]);

    const nextEmotion = () => { setCurrentIndex(i => (i + 1) % emotions.length); trackEmotionLearn(); };
    const prevEmotion = () => { setCurrentIndex(i => (i - 1 + emotions.length) % emotions.length); trackEmotionLearn(); };

    const startQuiz = () => {
        let pool = [...emotions].sort(() => Math.random() - 0.5);
        while (pool.length < 10) {
            pool = [...pool, ...[...emotions].sort(() => Math.random() - 0.5)];
        }

        const finalSelection = pool.slice(0, 10);
        const questions = finalSelection.map(answer => {
            const options = [answer, ...emotions.filter(e => e.id !== answer.id).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
            return { answer, options };
        });

        setQuizQuestions(questions); setCurrentQuestionIdx(0); setCorrectAnswers(0);
        setTotalAttempts(0); setLastAnswerCorrect(null); setSelectedOptionId(null); setQuizFinished(false); setIsQuizMode(true);
    };

    const nextQuiz = useCallback(() => {
        if (currentQuestionIdx >= quizQuestions.length - 1) {
            setQuizFinished(true);
        } else {
            setCurrentQuestionIdx(p => p + 1);
            setLastAnswerCorrect(null);
            setSelectedOptionId(null);
        }
    }, [currentQuestionIdx, quizQuestions.length]);

    const answerQuiz = (optionId) => {
        if (lastAnswerCorrect !== null) return;
        const correct = quizQuestions[currentQuestionIdx].answer.id === optionId;
        setSelectedOptionId(optionId);
        setLastAnswerCorrect(correct);

        const newTotal = totalAttempts + 1;
        const newCorrect = correct ? correctAnswers + 1 : correctAnswers;

        setTotalAttempts(newTotal);
        setCorrectAnswers(newCorrect);
        trackEmotionQuiz(correct);

        const todayKey = new Date().toLocaleDateString('en-CA');
        if (currentChild) updateChildEmotionStats(currentChild.childId, todayKey, correct ? 1 : 0, 1);

        setTimeout(() => {
            nextQuiz();
        }, 1500);
    };

    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;

    if (isLoading || allEmotions.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isQuizMode ? 'bg-amber-500/10' : 'bg-purple-600/10'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-rose-600/10' : 'bg-rose-400/20'}`} />
            </div>

            <EmotionsNavbar 
                isDark={isDark} 
                isArabic={isArabic} 
                isQuizMode={isQuizMode} 
                setIsQuizMode={setIsQuizMode} 
            />

            <main className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20">
                <div className="space-y-10 w-full text-center">
                    {isQuizMode && quizFinished ? (
                        <EmotionsQuizResult 
                            isDark={isDark}
                            isArabic={isArabic}
                            accuracy={accuracy}
                            correctAnswers={correctAnswers}
                            totalAttempts={totalAttempts}
                            startQuiz={startQuiz}
                            setIsQuizMode={setIsQuizMode}
                            historyEntries={historyEntries}
                        />
                    ) : isQuizMode ? (
                        <EmotionsQuizActive 
                            isDark={isDark}
                            isArabic={isArabic}
                            currentQuestionIdx={currentQuestionIdx}
                            quizQuestions={quizQuestions}
                            correctAnswers={correctAnswers}
                            totalAttempts={totalAttempts}
                            selectedOptionId={selectedOptionId}
                            lastAnswerCorrect={lastAnswerCorrect}
                            answerQuiz={answerQuiz}
                        />
                    ) : (
                        <EmotionsLearnMode 
                            isDark={isDark}
                            isArabic={isArabic}
                            currentLevel={currentLevel}
                            setCurrentLevel={setCurrentLevel}
                            setCurrentIndex={setCurrentIndex}
                            startQuiz={startQuiz}
                            currentEmotion={currentEmotion}
                            speak={speak}
                            prevEmotion={prevEmotion}
                            nextEmotion={nextEmotion}
                            historyEntries={historyEntries}
                        />
                    )}
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
