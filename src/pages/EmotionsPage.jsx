import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { allEmotions, getUpToLevel } from '../data/emotionData';

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
    const [quizFinished, setQuizFinished] = useState(false);

    const emotions = getUpToLevel(currentLevel);
    const currentEmotion = emotions[currentIndex] || emotions[0];
    const historyEntries = Object.entries(currentChild?.emotionHistory || {}).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 5);

    const accent = '#F59E0B';

    const speak = useCallback((t) => {
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(t); u.lang = isArabic ? 'ar' : 'en-US'; u.rate = 0.8; speechSynthesis.speak(u);
        }
    }, [isArabic]);

    const nextEmotion = () => { setCurrentIndex(i => (i + 1) % emotions.length); trackEmotionLearn(); };
    const prevEmotion = () => { setCurrentIndex(i => (i - 1 + emotions.length) % emotions.length); trackEmotionLearn(); };

    const startQuiz = () => {
        const shuffled = [...emotions].sort(() => Math.random() - 0.5);
        const questions = shuffled.slice(0, Math.min(6, shuffled.length)).map(answer => {
            const options = [answer, ...emotions.filter(e => e.id !== answer.id).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
            return { answer, options };
        });
        setQuizQuestions(questions); setCurrentQuestionIdx(0); setCorrectAnswers(0);
        setTotalAttempts(0); setLastAnswerCorrect(null); setQuizFinished(false); setIsQuizMode(true);
    };

    const answerQuiz = (optionId) => {
        if (lastAnswerCorrect !== null) return;
        const correct = quizQuestions[currentQuestionIdx].answer.id === optionId;
        setLastAnswerCorrect(correct); setTotalAttempts(p => p + 1);
        if (correct) setCorrectAnswers(p => p + 1);
        trackEmotionQuiz(correct);
    };

    const nextQuiz = () => {
        if (currentQuestionIdx >= quizQuestions.length - 1) {
            const todayKey = new Date().toLocaleDateString('en-CA');
            if (currentChild) updateChildEmotionStats(currentChild.childId, todayKey, correctAnswers, totalAttempts);
            setQuizFinished(true);
        } else { setCurrentQuestionIdx(p => p + 1); setLastAnswerCorrect(null); }
    };

    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;

    const Navbar = ({ title, onBack }) => (
        <nav className={`flex items-center gap-3 py-3 px-6 max-w-[800px] mx-auto border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
            <button onClick={onBack}
                className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-base cursor-pointer ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>←</button>
            <h1 className={`flex-1 text-lg font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>😊 {title}</h1>
        </nav>
    );

    // Quiz Finished
    if (isQuizMode && quizFinished) {
        const pct = Math.round(accuracy * 100);
        const pctColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <div className={`rounded-3xl p-12 text-center max-w-[420px] w-full border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}`}>
                    <div className="text-[72px]">{pct >= 80 ? '🎉' : pct >= 50 ? '👏' : '💪'}</div>
                    <h2 className={`text-[26px] mt-4 font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'اكتمل الاختبار!' : 'Quiz Completed!'}</h2>
                    <div className="w-[100px] h-[100px] rounded-full mx-auto my-5 flex items-center justify-center"
                        style={{ background: `conic-gradient(${pctColor} ${pct}%, ${isDark ? '#21262D' : '#F3F4F6'} 0%)` }}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-[22px] font-extrabold ${isDark ? 'bg-card-dark' : 'bg-card'}`} style={{ color: pctColor }}>{pct}%</div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{correctAnswers}/{totalAttempts} {isArabic ? 'إجابة صحيحة' : 'correct answers'}</p>
                    <div className="flex gap-2.5 mt-6">
                        <button onClick={startQuiz} className="flex-1 py-3.5 rounded-xl cursor-pointer font-bold bg-gradient-to-br from-amber-500 to-orange-500 text-white border-none shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
                            🔄 {isArabic ? 'إعادة' : 'Restart'}
                        </button>
                        <button onClick={() => setIsQuizMode(false)}
                            className={`flex-1 py-3.5 rounded-xl cursor-pointer font-semibold bg-transparent border ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>
                            🚪 {isArabic ? 'خروج' : 'Exit'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Mode
    if (isQuizMode) {
        const q = quizQuestions[currentQuestionIdx];
        return (
            <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <Navbar title={isArabic ? 'اختبار المشاعر' : 'Emotion Quiz'} onBack={() => setIsQuizMode(false)} />
                <div className="max-w-[600px] mx-auto py-5 px-6">
                    {/* Score */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { val: correctAnswers, label: isArabic ? 'صحيح' : 'Correct', color: '#10B981' },
                            { val: totalAttempts, label: isArabic ? 'المحاولات' : 'Attempts', color: '#6C63FF' },
                            { val: `${Math.round(accuracy * 100)}%`, label: isArabic ? 'الدقة' : 'Accuracy', color: accent },
                        ].map((s, i) => (
                            <div key={i} className={`rounded-[14px] py-4 px-3 text-center border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                                <div className="text-[22px] font-extrabold" style={{ color: s.color }}>{s.val}</div>
                                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Progress */}
                    <div className="flex gap-1 mb-6">
                        {quizQuestions.map((_, i) => (
                            <div key={i} className="flex-1 h-1 rounded-sm transition-colors duration-300"
                                style={{ background: i < currentQuestionIdx ? '#10B981' : i === currentQuestionIdx ? accent : (isDark ? '#21262D' : '#E5E7EB') }} />
                        ))}
                    </div>

                    {/* Question */}
                    <div className="text-center mb-6">
                        <div className="text-[90px]">{q.answer.emoji}</div>
                        <h2 className={`text-[22px] font-bold mt-4 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'ما هذا الشعور؟' : 'What emotion is this?'}</h2>
                    </div>

                    {/* Options */}
                    <div className="grid gap-2.5">
                        {q.options.map(option => {
                            const isCorrect = option.id === q.answer.id;
                            let optBg = isDark ? 'bg-card-dark' : 'bg-card';
                            let optBorder = isDark ? 'border-border-dark' : 'border-border';
                            if (lastAnswerCorrect !== null && isCorrect) { optBg = isDark ? 'bg-emerald-500/10' : 'bg-green-50'; optBorder = 'border-emerald-500'; }
                            else if (lastAnswerCorrect === false && !isCorrect) { optBg = isDark ? 'bg-red-500/5' : 'bg-red-50'; }
                            return (
                                <button key={option.id} onClick={() => answerQuiz(option.id)}
                                    className={`w-full py-4 px-5 rounded-[14px] border-[1.5px] flex items-center gap-3.5 text-start transition-all duration-200 ${optBg} ${optBorder} ${lastAnswerCorrect !== null ? 'cursor-default' : 'cursor-pointer'}`}>
                                    <span className="text-[28px]">{option.emoji}</span>
                                    <span className={`text-base font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? option.nameAr : option.name}</span>
                                    {lastAnswerCorrect !== null && isCorrect && <span className="ms-auto text-emerald-500 text-lg">✓</span>}
                                </button>
                            );
                        })}
                    </div>

                    {lastAnswerCorrect !== null && (
                        <div className="text-center mt-5">
                            <button onClick={nextQuiz}
                                className="py-3.5 px-10 rounded-xl border-none cursor-pointer bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold text-[15px] shadow-[0_4px_12px_rgba(108,99,255,0.3)]">
                                {currentQuestionIdx >= quizQuestions.length - 1 ? (isArabic ? '✨ إنهاء' : '✨ Finish') : (isArabic ? 'التالي →' : 'Next →')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Learning Mode
    return (
        <div className={`min-h-screen flex flex-col font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            <Navbar title={isArabic ? 'المشاعر' : 'Emotions'} onBack={() => navigate(-1)} />
            <div className="max-w-[800px] mx-auto py-5 px-6 flex-1 flex flex-col w-full box-border">
                {/* Level Selector */}
                <div className="flex justify-center gap-2.5 mb-6">
                    {[1, 2, 3].map(level => (
                        <button key={level} onClick={() => { setCurrentLevel(level); setCurrentIndex(0); }}
                            className={`py-2.5 px-5 rounded-xl cursor-pointer text-[13px] border transition-all duration-200 ${currentLevel === level
                                    ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.19)]'
                                    : `font-medium ${isDark ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-card text-text border-border'}`
                                }`}>
                            {[isArabic ? '⭐ سهل' : '⭐ Easy', isArabic ? '⭐⭐ متوسط' : '⭐⭐ Medium', isArabic ? '⭐⭐⭐ صعب' : '⭐⭐⭐ Hard'][level - 1]}
                        </button>
                    ))}
                </div>

                {/* Emotion Card */}
                <div className="flex-1 flex items-center justify-center px-4">
                    <div onClick={() => speak(isArabic ? currentEmotion.nameAr : currentEmotion.name)}
                        className={`rounded-3xl p-10 text-center w-full max-w-[440px] border cursor-pointer transition-all duration-300 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}`}>
                        <div className="text-[100px]">{currentEmotion.emoji}</div>
                        <h2 className={`text-[30px] font-extrabold my-5 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? currentEmotion.nameAr : currentEmotion.name}</h2>
                        <p className={`text-[15px] leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? currentEmotion.descriptionAr : currentEmotion.description}</p>
                        <div className={`mt-5 inline-flex items-center gap-2 py-2.5 px-5 rounded-xl ${isDark ? 'bg-border-dark' : 'bg-[#F0F0FF]'}`}>
                            <span className="text-accent">🔊</span>
                            <span className="text-accent font-semibold text-[13px]">{isArabic ? 'اضغط للاستماع' : 'Tap to listen'}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center items-center gap-4 py-6">
                    <button onClick={prevEmotion}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl cursor-pointer transition-all duration-200 ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>←</button>
                    <span className={`text-[13px] font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{currentIndex + 1} / {emotions.length}</span>
                    <button onClick={startQuiz}
                        className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-none rounded-xl py-3 px-7 cursor-pointer font-bold text-[15px] shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
                        🧩 {isArabic ? 'اختبار' : 'Quiz'}
                    </button>
                    <button onClick={nextEmotion}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl cursor-pointer transition-all duration-200 ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>→</button>
                </div>

                {/* History */}
                {historyEntries.length > 0 && (
                    <div className={`p-5 rounded-2xl border mt-2 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                        <h3 className={`text-[15px] font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>📊 {isArabic ? 'الأداء السابق' : 'Past Performance'}</h3>
                        <div className="flex gap-2.5 overflow-x-auto">
                            {historyEntries.map(([date, stats]) => {
                                const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                                return (
                                    <div key={date} className={`min-w-[80px] py-3 px-2.5 rounded-xl flex flex-col items-center gap-1 border ${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}>
                                        <div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{date.split('-').slice(1).join('/')}</div>
                                        <div className="text-lg font-bold" style={{ color: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }}>{pct}%</div>
                                        <div className={`text-[10px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{stats.correct}/{stats.total}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
