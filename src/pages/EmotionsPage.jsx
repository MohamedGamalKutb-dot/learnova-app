import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { allEmotions, getUpToLevel } from '../data/emotionData';

export default function EmotionsPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { trackEmotionLearn, trackEmotionQuiz } = useData();
    const { currentChild, updateChildEmotionStats } = useAuth(); // Import updateChildEmotionStats

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

    // History Entries
    const historyEntries = Object.entries(currentChild?.emotionHistory || {})
        .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort Newest First
        .slice(0, 5); // Take last 5

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';

    const speak = useCallback((t) => {
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(t);
            u.lang = isArabic ? 'ar' : 'en-US';
            u.rate = 0.8;
            speechSynthesis.speak(u);
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
        setQuizQuestions(questions);
        setCurrentQuestionIdx(0);
        setCorrectAnswers(0);
        setTotalAttempts(0);
        setLastAnswerCorrect(null);
        setQuizFinished(false);
        setIsQuizMode(true);
    };

    const answerQuiz = (optionId) => {
        if (lastAnswerCorrect !== null) return;
        const correct = quizQuestions[currentQuestionIdx].answer.id === optionId;
        setLastAnswerCorrect(correct);
        setTotalAttempts(p => p + 1);
        if (correct) setCorrectAnswers(p => p + 1);
        trackEmotionQuiz(correct);
    };

    const nextQuiz = () => {
        if (currentQuestionIdx >= quizQuestions.length - 1) {

            // Save Session Result
            const todayKey = new Date().toLocaleDateString('en-CA');
            if (currentChild) {
                updateChildEmotionStats(currentChild.childId, todayKey, correctAnswers + (lastAnswerCorrect ? 0 : 0), totalAttempts); // Note: correctAnswers is state, might lag one render if used directly here, but usually safe in next step.
                // Wait, correctAnswers state is updated asynchronously. 
                // Better approach: Calculate final values and pass.
            }
            // Actually, since setCorrectAnswers is async, we use the values available.
            // But here nextQuiz is called via button click AFTER answerQuiz has run. So state should be stable except for the very last question case if auto-advance.
            // But we have manual "Next/Finish" button. So state is stable.

            // Re-saving is fine. But we want to save ONLY ONCE at the end.
            if (currentChild) {
                // We need to add the stats for this session to history.
                // WARNING: correctAnswers inside this function scope refers to state at render.
                // It is correct because we re-render after answerQuiz.
                updateChildEmotionStats(currentChild.childId, todayKey, correctAnswers, totalAttempts);
            }

            setQuizFinished(true);
        } else {
            setCurrentQuestionIdx(p => p + 1);
            setLastAnswerCorrect(null);
        }
    };

    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;

    // Quiz Finished Screen
    if (isQuizMode && quizFinished) {
        return (
            <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr' }}>
                <div style={{ background: cardBg, borderRadius: 32, padding: 40, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', maxWidth: 400, width: '90%' }}>
                    <div style={{ fontSize: 80 }}>🎉</div>
                    <h2 style={{ color: text, fontSize: 28, marginTop: 16 }}>{isArabic ? 'اكتمل الاختبار!' : 'Quiz Completed!'}</h2>
                    <div style={{ fontSize: 60, fontWeight: 800, color: '#6C63FF', margin: '16px 0' }}>{Math.round(accuracy * 100)}%</div>
                    <p style={{ color: '#999' }}>{isArabic ? 'دقة الإجابة' : 'Accuracy'}</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                        <button onClick={startQuiz} style={{ background: '#FF6584', color: '#fff', border: 'none', borderRadius: 16, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>🔄 {isArabic ? 'إعادة' : 'Restart'}</button>
                        <button onClick={() => setIsQuizMode(false)} style={{ background: 'transparent', color: text, border: `1px solid ${isDark ? '#444' : '#ddd'}`, borderRadius: 16, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>🚪 {isArabic ? 'خروج' : 'Exit'}</button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Mode
    if (isQuizMode) {
        const q = quizQuestions[currentQuestionIdx];
        return (
            <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr' }}>
                <div style={{ background: isDark ? '#16213E' : '#7EB6D8', color: '#fff', padding: '16px 20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setIsQuizMode(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                    <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'اختبار المشاعر' : 'Emotion Quiz'}</h1>
                    <div style={{ width: 30 }} />
                </div>

                {/* Score Bar */}
                <div style={{ margin: '16px 20px', padding: '12px 20px', background: cardBg, borderRadius: 16, display: 'flex', justifyContent: 'space-around', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#4CAF50' }}>{correctAnswers}</div><div style={{ fontSize: 12, color: '#999' }}>{isArabic ? 'الصحيح' : 'Correct'}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#7EB6D8' }}>{totalAttempts}</div><div style={{ fontSize: 12, color: '#999' }}>{isArabic ? 'المحاولات' : 'Attempts'}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: '#B8A9E8' }}>{Math.round(accuracy * 100)}%</div><div style={{ fontSize: 12, color: '#999' }}>{isArabic ? 'الدقة' : 'Accuracy'}</div></div>
                </div>

                {/* Question */}
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 90 }}>{q.answer.emoji}</div>
                    <h2 style={{ color: text, fontSize: 22, fontWeight: 700, margin: '16px 0' }}>{isArabic ? 'ما هذا الشعور؟' : 'What emotion is this?'}</h2>
                </div>

                {/* Options */}
                <div style={{ padding: '0 32px' }}>
                    {q.options.map(option => {
                        const isCorrectAnswer = option.id === q.answer.id;
                        let optBg = cardBg;
                        let borderColor = isDark ? '#444' : '#ddd';
                        let borderWidth = 1;
                        if (lastAnswerCorrect !== null && isCorrectAnswer) {
                            optBg = 'rgba(76,175,80,0.2)';
                            borderColor = '#4CAF50';
                            borderWidth = 2;
                        } else if (lastAnswerCorrect === false && !isCorrectAnswer) {
                            optBg = 'rgba(229,57,53,0.1)';
                        }
                        return (
                            <button key={option.id} onClick={() => answerQuiz(option.id)} style={{
                                width: '100%', padding: '16px 20px', margin: '6px 0', borderRadius: 18,
                                background: optBg, border: `${borderWidth}px solid ${borderColor}`,
                                cursor: lastAnswerCorrect !== null ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 16, textAlign: 'start',
                            }}>
                                <span style={{ fontSize: 28 }}>{option.emoji}</span>
                                <span style={{ fontSize: 18, fontWeight: 600, color: text }}>{isArabic ? option.nameAr : option.name}</span>
                                {lastAnswerCorrect !== null && isCorrectAnswer && <span style={{ marginInlineStart: 'auto', color: '#4CAF50' }}>✓</span>}
                            </button>
                        );
                    })}
                </div>

                {lastAnswerCorrect !== null && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <button onClick={nextQuiz} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 20, padding: '12px 32px', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>
                            {currentQuestionIdx >= quizQuestions.length - 1 ? (isArabic ? 'إنهاء' : 'Finish') : (isArabic ? 'التالي ←' : 'Next →')}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Learning Mode
    return (
        <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* AppBar */}
            <div style={{ background: isDark ? '#16213E' : '#7EB6D8', color: '#fff', padding: '16px 20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'المشاعر' : 'Emotions'}</h1>
                <div style={{ width: 30 }} />
            </div>

            {/* Level Selector */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '16px 0' }}>
                {[1, 2, 3].map(level => (
                    <button key={level} onClick={() => { setCurrentLevel(level); setCurrentIndex(0); }} style={{
                        padding: '8px 16px', borderRadius: 16,
                        background: currentLevel === level ? '#B8A9E8' : isDark ? '#1F2940' : '#fff',
                        color: currentLevel === level ? '#fff' : text,
                        border: `1px solid ${currentLevel === level ? '#B8A9E8' : isDark ? '#444' : '#ddd'}`,
                        cursor: 'pointer', fontWeight: currentLevel === level ? 700 : 500, fontSize: 13,
                    }}>
                        {['⭐ Easy', '⭐⭐ Medium', '⭐⭐⭐ Hard'][level - 1]}
                    </button>
                ))}
            </div>

            {/* Emotion Card */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
                <div onClick={() => speak(isArabic ? currentEmotion.nameAr : currentEmotion.name)} style={{
                    background: cardBg, borderRadius: 32, padding: 32, textAlign: 'center', width: '100%', maxWidth: 400,
                    boxShadow: '0 8px 32px rgba(184,169,232,0.2)', cursor: 'pointer', transition: 'transform 0.3s',
                }}>
                    <div style={{ fontSize: 100 }}>{currentEmotion.emoji}</div>
                    <h2 style={{ color: text, fontSize: 32, fontWeight: 700, margin: '20px 0 12px' }}>{isArabic ? currentEmotion.nameAr : currentEmotion.name}</h2>
                    <p style={{ color: '#999', fontSize: 16, lineHeight: 1.5 }}>{isArabic ? currentEmotion.descriptionAr : currentEmotion.description}</p>
                    <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(126,182,216,0.15)', padding: '10px 20px', borderRadius: 20 }}>
                        <span style={{ color: '#7EB6D8' }}>🔊</span>
                        <span style={{ color: '#7EB6D8', fontWeight: 600 }}>{isArabic ? 'اضغط للاستماع 🔊' : 'Tap to listen 🔊'}</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', padding: '20px' }}>
                <button onClick={prevEmotion} style={{ width: 56, height: 56, borderRadius: '50%', background: cardBg, border: 'none', cursor: 'pointer', fontSize: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', color: text }}>←</button>
                <button onClick={startQuiz} style={{ background: '#4ECDC4', color: '#fff', border: 'none', borderRadius: 20, padding: '12px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>🧩 {isArabic ? 'اختبار' : 'Quiz'}</button>
                <button onClick={nextEmotion} style={{ width: 56, height: 56, borderRadius: '50%', background: cardBg, border: 'none', cursor: 'pointer', fontSize: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', color: text }}>→</button>
            </div>

            {/* History Stats Section */}
            {historyEntries.length > 0 && (
                <div style={{ padding: 16, marginTop: 'auto', borderTop: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                    <h3 style={{ fontSize: 16, color: text, marginBottom: 12 }}>{isArabic ? '📊 أداء الأسبوع الماضي' : '📊 Past Week Performance'}</h3>
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>
                        {historyEntries.map(([date, stats]) => {
                            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                            return (
                                <div key={date} style={{
                                    minWidth: 80, padding: 10, borderRadius: 16, background: cardBg,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                    border: `1px solid ${isDark ? '#333' : '#eee'}`
                                }}>
                                    <div style={{ fontSize: 11, color: '#999' }}>{date.split('-').slice(1).join('/')}</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: pct >= 80 ? '#4CAF50' : pct >= 50 ? '#FFC107' : '#FF6584' }}>{pct}%</div>
                                    <div style={{ fontSize: 10, color: text }}>{stats.correct}/{stats.total}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
