import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { allEmotions, getUpToLevel } from '../data/emotionData';
import { Button, Card, CardBody, Navbar, Chip } from '@heroui/react';
import { FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';

export default function EmotionsPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { trackEmotionLearn, trackEmotionQuiz } = useData();
    const { currentChild, updateChildEmotionStats } = useAuth();

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

    const emotions = getUpToLevel(currentLevel);
    const currentEmotion = emotions[currentIndex] || emotions[0];
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

        // Instant save to profile for parent to see
        const todayKey = new Date().toLocaleDateString('en-CA');
        if (currentChild) updateChildEmotionStats(currentChild.childId, todayKey, correct ? 1 : 0, 1);

        setTimeout(() => {
            nextQuiz();
        }, 1500);
    };

    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;

    const HistorySection = ({ entries }) => (
        <div className="space-y-6 w-full max-w-[600px] mx-auto">
            <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center`}>
                {isArabic ? 'سجل الأداء السابق' : 'PREVIOUS PERFORMANCE'}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2 justify-center">
                {entries.map(([date, stats]) => {
                    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                    return (
                        <Card key={date} className={`min-w-[140px] rounded-[30px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.02] border-white/5 shadow-xl' : 'bg-white shadow-md border-indigo-50'}`}>
                            <CardBody className="p-6 flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">{date.split('-').slice(1).reverse().join('/')}</span>
                                <span className={`text-2xl font-black ${pct >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{pct}%</span>
                                <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">{stats.correct}/{stats.total}</span>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isQuizMode ? 'bg-amber-500/10' : 'bg-purple-600/10'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-rose-600/10' : 'bg-rose-400/20'}`} />
            </div>

            <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#0C0D17]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="bordered" radius="full" size="sm" className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} onPress={() => isQuizMode ? setIsQuizMode(false) : navigate(-1)}>
                        {isArabic ? '→' : '←'}
                    </Button>
                    <div className="flex flex-col">
                        <h1 className={`text-xl font-black leading-none ${isDark ? 'text-rose-100' : 'text-rose-900'} flex items-center gap-2`}>
                            <div className="w-8 h-8 overflow-hidden rounded-lg flex items-center justify-center">
                                <img src="/icons/emotions.png" alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                            </div>
                            {isArabic ? 'مستكشف المشاعر' : 'Emotion Lab'}
                        </h1>
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{isArabic ? 'افهم مشاعرك' : 'UNDERSTAND YOURSELF'}</span>
                    </div>
                </div>
            </nav>

            <main className="relative max-w-[1300px] mx-auto px-8 pt-32 pb-20">
                <div className="space-y-10 w-full text-center">

                    {isQuizMode && quizFinished ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12 animate-appearance-in">
                            {/* Main Result Card */}
                            <Card className={`w-full max-w-[600px] rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl p-10 flex flex-col items-center ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/95 border-indigo-50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]'}`}>
                                <CardBody className="items-center gap-6 p-0">
                                    <div className="w-32 h-32 animate-bounce mb-2 overflow-hidden flex items-center justify-center">
                                        <img src={`/icons/${accuracy  >= 0.8 ? 'quiz_excellent.png' : accuracy >= 0.5 ? 'quiz_good.png' : 'quiz_try.png'}`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                        <span style={{ display: 'none' }} className="text-8xl">{accuracy >= 0.8 ? '🎉' : accuracy >= 0.5 ? '👏' : '💪'}</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                                        {accuracy >= 0.8 ? (isArabic ? 'رائع يا بطل!' : 'Amazing, Hero!') : (isArabic ? 'محاولة جيدة!' : 'Good Effort!')}
                                    </h2>

                                    <div className="grid grid-cols-3 gap-4 w-full my-6">
                                        <div className={`p-4 rounded-[25px] flex flex-col items-center border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                                            <FaCheckCircle className="w-8 h-8 mb-2 text-emerald-500" />
                                            <span className="text-2xl font-black text-emerald-500">{correctAnswers}</span>
                                            <span className="text-[9px] font-black uppercase opacity-40">{isArabic ? 'صحيح' : 'CORRECT'}</span>
                                        </div>
                                        <div className={`p-4 rounded-[25px] flex flex-col items-center border ${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
                                            <FaTimesCircle className="w-8 h-8 mb-2 text-rose-500" />
                                            <span className="text-2xl font-black text-rose-500">{totalAttempts - correctAnswers}</span>
                                            <span className="text-[9px] font-black uppercase opacity-40">{isArabic ? 'خاطئ' : 'WRONG'}</span>
                                        </div>
                                        <div className={`p-4 rounded-[25px] flex flex-col items-center border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                                            <FaChartLine className="w-8 h-8 mb-2 text-indigo-500" />
                                            <span className="text-2xl font-black text-indigo-500">{Math.round(accuracy * 100)}%</span>
                                            <span className="text-[9px] font-black uppercase opacity-40">{isArabic ? 'النسبة' : 'PERCENT'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full mt-2">
                                        <Button radius="full" size="lg" onPress={startQuiz} className="flex-1 h-16 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-lg shadow-xl shadow-rose-500/20">
                                            {isArabic ? 'مرة أخرى' : 'Play Again'}
                                        </Button>
                                        <Button radius="full" size="lg" variant="bordered" onPress={() => setIsQuizMode(false)} className={`flex-1 h-16 font-black text-lg border-2 ${isDark ? 'border-white/10' : 'border-indigo-100'}`}>
                                            {isArabic ? 'خروج' : 'Exit'}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Previous Results shown below the card */}
                            {historyEntries.length > 0 && (
                                <HistorySection entries={historyEntries} />
                            )}
                        </div>
                    ) : isQuizMode ? (
                        <div className="space-y-10">
                            <div className="flex justify-between items-center px-4">
                                <div className="flex flex-col text-start">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{isArabic ? 'السؤال' : 'QUESTION'}</span>
                                    <h3 className="text-2xl font-black">{currentQuestionIdx + 1} <span className="text-indigo-500 text-sm">/ {quizQuestions.length}</span></h3>
                                </div>
                                <div className="flex gap-3">
                                    <Chip variant="flat" className="h-10 px-4 bg-emerald-500/10 text-emerald-500 font-bold flex items-center gap-2">
                                        <FaCheckCircle className="w-4 h-4" /> {correctAnswers}
                                    </Chip>
                                    <Chip variant="flat" className="h-10 px-4 bg-rose-500/10 text-rose-500 font-bold flex items-center gap-2">
                                        <FaTimesCircle className="w-4 h-4" /> {totalAttempts - correctAnswers}
                                    </Chip>
                                </div>
                            </div>

                            <Card className={`rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-50 shadow-2xl shadow-indigo-500/5'}`}>
                                <CardBody className="p-12 text-center flex flex-col items-center gap-6">
                                    <div className="w-[200px] h-[200px] transition-all duration-500 hover:scale-110 flex items-center justify-center overflow-hidden mx-auto">
                                        <img src={`/icons/emotion_${quizQuestions[currentQuestionIdx].answer.id}.png`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                        <span style={{ display: 'none' }} className="text-[120px]">{quizQuestions[currentQuestionIdx].answer.emoji}</span>
                                    </div>
                                    <h2 className="text-3xl font-black">{isArabic ? 'ماذا يعبر هذا الوجه؟' : 'What is this feeling?'}</h2>
                                </CardBody>
                            </Card>

                            <div className="space-y-4">
                                {quizQuestions[currentQuestionIdx].options.map((option) => {
                                    const isCorrect = option.id === quizQuestions[currentQuestionIdx].answer.id;
                                    const isSelected = selectedOptionId === option.id;

                                    let cardStyle = isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white shadow-sm border-indigo-50';
                                    if (lastAnswerCorrect !== null) {
                                        if (isCorrect) cardStyle = 'bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/10';
                                        else if (isSelected && !isCorrect) cardStyle = 'bg-rose-500/20 border-rose-500/50 shadow-rose-500/10';
                                        else cardStyle = 'opacity-40';
                                    }

                                    return (
                                        <Card
                                            key={option.id + Math.random()}
                                            isPressable={lastAnswerCorrect === null}
                                            onPress={() => answerQuiz(option.id)}
                                            className={`rounded-[35px] border transition-all duration-500 backdrop-blur-md w-full ${cardStyle} ${lastAnswerCorrect === null ? 'hover:scale-[1.01] hover:border-indigo-500/30' : 'cursor-default'}`}>
                                            <CardBody className="p-6 flex flex-row items-center gap-8 px-12">
                                                <span className="flex-1 text-2xl font-black text-center">{isArabic ? option.nameAr : option.name}</span>
                                                {lastAnswerCorrect !== null && isCorrect && <FaCheckCircle className="w-8 h-8 absolute right-10 animate-appearance-in text-emerald-500" />}
                                                {lastAnswerCorrect === false && isSelected && !isCorrect && <FaTimesCircle className="w-8 h-8 absolute right-10 animate-appearance-in text-rose-500" />}
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>

                            {lastAnswerCorrect !== null && (
                                <div className="text-center mt-6 animate-pulse text-indigo-500 font-bold uppercase tracking-widest text-xs">
                                    {isArabic ? 'جاري الانتقال...' : 'MOVING TO NEXT...'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-12 animate-appearance-in">
                            <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
                                {[1, 2, 3].map(level => (
                                    <Button key={level} radius="full" size="lg" onPress={() => { setCurrentLevel(level); setCurrentIndex(0); }}
                                        variant={currentLevel === level ? "solid" : "bordered"}
                                        className={`px-10 h-14 font-black text-xs uppercase tracking-widest transition-all ${currentLevel === level ? 'bg-rose-500 text-white shadow-xl' : `opacity-40 ${isDark ? 'border-white/10' : 'border-indigo-100'}`
                                            }`}>
                                        {[isArabic ? 'نجم واحد' : 'Level 1', isArabic ? 'نجمتان' : 'Level 2', isArabic ? 'ثلاثة نجوم' : 'Level 3'][level - 1]}
                                    </Button>
                                ))}
                                <Button radius="full" size="lg" onPress={startQuiz} className="h-14 px-10 bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-xl ml-auto flex items-center gap-2">
                                    <div className="w-6 h-6 overflow-hidden rounded-md flex items-center justify-center">
                                        <img src="/icons/games.png" alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                                    </div> {isArabic ? 'ابدأ الاختبار' : 'Start Quiz'}
                                </Button>
                            </div>

                            <div className="relative group">
                                <Card isPressable onPress={() => speak(isArabic ? currentEmotion.nameAr : currentEmotion.name)}
                                    className={`rounded-[60px] border transition-all duration-700 backdrop-blur-3xl p-12 overflow-hidden w-full ${isDark ? 'bg-white/[0.03] border-white/10 shadow-2xl' : 'bg-white border-indigo-100 shadow-xl'}`}>
                                    <CardBody className="items-center text-center gap-8 relative z-10">
                                        <div className="w-[300px] h-[300px] text-[180px] animate-float transition-all duration-700 group-hover:scale-110 overflow-hidden flex items-center justify-center">
                                            <img src={`/icons/emotion_${currentEmotion.id}.png`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                            <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{currentEmotion.emoji}</span>
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-6xl font-black tracking-tighter">{isArabic ? currentEmotion.nameAr : currentEmotion.name}</h2>
                                            <p className="text-xl font-bold opacity-60 max-w-[600px] leading-relaxed mx-auto">
                                                {isArabic ? currentEmotion.descriptionAr : currentEmotion.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-indigo-500/10 text-indigo-500 font-black text-sm uppercase tracking-widest mt-4">
                                            🔊 {isArabic ? 'اضغط للاستماع' : 'TAP TO LISTEN'}
                                        </div>
                                    </CardBody>
                                </Card>

                                <div className="absolute top-1/2 -translate-y-1/2 -left-10 z-20">
                                    <Button isIconOnly radius="full" size="lg" onPress={prevEmotion} className="w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 text-3xl shadow-2xl">←</Button>
                                </div>
                                <div className="absolute top-1/2 -translate-y-1/2 -right-10 z-20">
                                    <Button isIconOnly radius="full" size="lg" onPress={nextEmotion} className="w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 text-3xl shadow-2xl">→</Button>
                                </div>
                            </div>

                            {historyEntries.length > 0 && (
                                <HistorySection entries={historyEntries} />
                            )}
                        </div>
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
