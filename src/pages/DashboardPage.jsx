import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ClinicsMap from '../components/ClinicsMap';
import AutismSupportBot from '../components/AutismSupportBot';
import { defaultRoutine } from '../data/routineData';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild } = useAuth();
    const {
        data,
        emotionAccuracy,
        routineCompletion,
        mostUsedWords,
        addDailyNote,
        removeDailyNote,
        resetAllData,
    } = useData();

    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState('');

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const colors = { chart1: '#6C63FF', chart2: '#FF6584', chart3: '#4ECDC4', chart4: '#F9E4A7' };

    const totalUsage = Object.values(data.moduleUsage).reduce((a, b) => a + b, 0);
    const maxWeekly = Math.max(...Object.values(data.weeklyUsage), 1);

    const handleAddNote = () => {
        if (!noteText.trim()) return;
        addDailyNote(noteText);
        setNoteText('');
        setShowNoteInput(false);
    };

    const moduleNames = isArabic
        ? { pecs: 'التواصل', emotions: 'المشاعر', routine: 'الروتين', calming: 'الهدوء' }
        : { pecs: 'PECS', emotions: 'Emotions', routine: 'Routine', calming: 'Calming' };
    const moduleEmojis = { pecs: '🗣️', emotions: '😊', routine: '📅', calming: '🧘' };

    // Calculate Routine Stats for Dashboard
    const todayKey = new Date().toLocaleDateString('en-CA');

    // 1. Routine History
    const routineHistory = currentChild?.routineHistory || {};
    const todayTasks = routineHistory[todayKey] || {};
    const todayCompletedCount = Object.values(todayTasks).filter(v => v === true).length;
    const totalRoutineTasks = defaultRoutine.length;
    const todayRoutinePct = Math.round((todayCompletedCount / totalRoutineTasks) * 100);

    const routineHistoryEntries = Object.entries(routineHistory)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .slice(0, 7); // Show last 7 days

    // 2. Emotion History (NEW)
    const emotionHistory = currentChild?.emotionHistory || {};
    const todayEmotionStats = emotionHistory[todayKey] || { correct: 0, total: 0 };
    const todayEmotionPct = todayEmotionStats.total > 0 ? Math.round((todayEmotionStats.correct / todayEmotionStats.total) * 100) : 0;

    const emotionHistoryEntries = Object.entries(emotionHistory)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .slice(0, 7); // Show last 7 days

    // Smart recommendations based on real data
    const recommendations = [];
    if (isArabic) {
        if (data.moduleUsage.emotions < data.moduleUsage.pecs) recommendations.push('💡 حاول زيادة استخدام قسم المشاعر لتحسين التعرف على المشاعر');
        if (todayRoutinePct > 50) recommendations.push('🌟 الروتين اليومي منتظم - استمر بذلك!');
        if (data.pecsTotalTaps > 10) recommendations.push('🎯 أداء ممتاز في التواصل! جرب كلمات جديدة');
        if (data.breathingExercises > 0) recommendations.push('🧘 رائع أنك تمارس تمارين التنفس بانتظام');
        if (data.totalInteractions === 0) recommendations.push('👋 ابدأ باستخدام الأقسام المختلفة لرؤية التقدم هنا');
    } else {
        if (data.moduleUsage.emotions < data.moduleUsage.pecs) recommendations.push('💡 Try using the Emotions module more to improve recognition skills');
        if (todayRoutinePct > 50) recommendations.push('🌟 Daily routine is consistent - keep it up!');
        if (data.pecsTotalTaps > 10) recommendations.push('🎯 Great communication progress! Try new words');
        if (data.breathingExercises > 0) recommendations.push('🧘 Great that you practice breathing exercises regularly');
        if (data.totalInteractions === 0) recommendations.push('👋 Start using the modules to see real progress data here');
    }
    if (recommendations.length === 0) {
        recommendations.push(isArabic ? '✨ استمر في استخدام التطبيق لرؤية توصيات مخصصة' : '✨ Keep using the app to see personalized recommendations');
    }

    // --- CONSTANTS ---
    const behaviorTypes = [
        { key: 'meltdown', label: 'Meltdown', labelAr: 'نوبة انفعالية', emoji: '😤', color: '#FF6584' },
        { key: 'stimming', label: 'Stimming', labelAr: 'حركات تحفيزية', emoji: '🔄', color: '#F9E4A7' },
        { key: 'aggression', label: 'Aggression', labelAr: 'عدوانية', emoji: '💢', color: '#E57373' },
        { key: 'withdrawal', label: 'Withdrawal', labelAr: 'انسحاب', emoji: '🫥', color: '#B8A9E8' },
        { key: 'sensory_overload', label: 'Sensory Overload', labelAr: 'حمل حسي زائد', emoji: '🤯', color: '#7EB6D8' },
        { key: 'positive', label: 'Positive Behavior', labelAr: 'سلوك إيجابي', emoji: '⭐', color: '#8BC99A' },
        { key: 'communication', label: 'Communication Attempt', labelAr: 'محاولة تواصل', emoji: '💬', color: '#4ECDC4' },
        { key: 'social', label: 'Social Interaction', labelAr: 'تفاعل اجتماعي', emoji: '🤝', color: '#6C63FF' },
    ];

    const assessmentQuestions = [
        { id: 1, q: 'Does the child respond to their name?', qAr: 'هل يستجيب الطفل عند مناداته باسمه؟' },
        { id: 2, q: 'Does the child make eye contact?', qAr: 'هل يقوم الطفل بالتواصل البصري؟' },
        { id: 3, q: 'Does the child point to objects?', qAr: 'هل يشير الطفل إلى الأشياء؟' },
        { id: 4, q: 'Does the child use gestures?', qAr: 'هل يستخدم الطفل الإيماءات؟' },
        { id: 5, q: 'Does the child engage in pretend play?', qAr: 'هل يشارك الطفل في اللعب التخيلي؟' },
        { id: 6, q: 'Does the child follow simple instructions?', qAr: 'هل يتبع الطفل التعليمات البسيطة؟' },
        { id: 7, q: 'Does the child show interest in other children?', qAr: 'هل يظهر الطفل اهتماماً بالأطفال الآخرين؟' },
        { id: 8, q: 'Does the child have repetitive behaviors?', qAr: 'هل لدى الطفل سلوكيات متكررة؟' },
        { id: 9, q: 'Is the child sensitive to sounds?', qAr: 'هل الطفل حساس للأصوات؟' },
        { id: 10, q: 'Does the child have difficulty with transitions?', qAr: 'هل يواجه الطفل صعوبة في الانتقال بين الأنشطة؟' },
    ];

    const [activeReportTab, setActiveReportTab] = useState('general');
    const [viewingAssessment, setViewingAssessment] = useState(null);

    return (
        <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* AppBar */}
            <div style={{ background: isDark ? '#16213E' : '#6C63FF', color: '#fff', padding: '16px 20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'لوحة التحكم' : 'Dashboard'}</h1>
                <button onClick={resetAllData} title={isArabic ? 'إعادة تعيين' : 'Reset Data'} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>🔄</button>
            </div>

            <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>

                {/* --- FULL DOCTOR REPORT SECTION --- */}
                {currentChild && (currentChild.diagnosisLevel !== 'Not Set' || currentChild.treatmentPlan || (currentChild.assessments && currentChild.assessments.length > 0)) && (
                    <div style={{ background: cardBg, borderRadius: 24, overflow: 'hidden', marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: `1px solid ${isDark ? '#333' : '#eee'}` }}>

                        {/* Header */}
                        <div style={{ background: `linear-gradient(135deg, ${colors.chart1}20, ${colors.chart3}20)`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                            <div style={{ fontSize: 28 }}>🩺</div>
                            <div>
                                <h3 style={{ margin: 0, color: text, fontSize: 18, fontWeight: 700 }}>{isArabic ? 'التقرير الطبي' : 'Medical Report'}</h3>
                                <p style={{ margin: 0, color: '#999', fontSize: 12 }}>{isArabic ? 'بوابة الطبيب المختص' : 'Specialist Portal Data'}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                            {[
                                { key: 'general', label: isArabic ? 'عام' : 'General' },
                                { key: 'assessments', label: isArabic ? 'التقييمات' : 'Assessments' },
                                { key: 'behavior', label: isArabic ? 'السلوك' : 'Behavior' },
                            ].map(tab => (
                                <button key={tab.key} onClick={() => { setActiveReportTab(tab.key); setViewingAssessment(null); }} style={{
                                    flex: 1, padding: '12px', background: activeReportTab === tab.key ? (isDark ? '#252a41' : '#f8f9fa') : 'transparent',
                                    border: 'none', borderBottom: activeReportTab === tab.key ? `2px solid ${colors.chart1}` : 'none',
                                    color: activeReportTab === tab.key ? colors.chart1 : '#999', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                }}>{tab.label}</button>
                            ))}
                        </div>

                        {/* Content */}
                        <div style={{ padding: 20 }}>

                            {/* 1. GENERAL TAB */}
                            {activeReportTab === 'general' && (
                                <div style={{ animation: 'fadeIn 0.3s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <span style={{ color: '#999', fontSize: 13, fontWeight: 600 }}>{isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</span>
                                        <span style={{ background: colors.chart1, color: '#fff', padding: '4px 12px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}>{currentChild.diagnosisLevel}</span>
                                    </div>
                                    <h4 style={{ margin: '0 0 10px', color: text, fontSize: 15 }}>{isArabic ? 'خطة العلاج والملاحظات' : 'Treatment Plan & Notes'}</h4>
                                    <div style={{ background: isDark ? '#16213E' : '#f9f9f9', padding: 16, borderRadius: 16, fontSize: 14, color: text, lineHeight: 1.6, minHeight: 80 }}>
                                        {currentChild.treatmentPlan || (isArabic ? 'لا توجد ملاحظات مسجلة بعد.' : 'No notes recorded yet.')}
                                    </div>
                                </div>
                            )}

                            {/* 2. ASSESSMENTS TAB */}
                            {activeReportTab === 'assessments' && (
                                <div style={{ animation: 'fadeIn 0.3s' }}>
                                    {viewingAssessment ? (
                                        /* Assessment Detail View */
                                        <div>
                                            <button onClick={() => setViewingAssessment(null)} style={{ background: 'none', border: 'none', color: colors.chart1, cursor: 'pointer', marginBottom: 10, fontWeight: 600 }}>← {isArabic ? 'عودة' : 'Back'}</button>
                                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                                <div style={{ fontSize: 32, fontWeight: 800, color: colors.chart1 }}>{viewingAssessment.score}%</div>
                                                <div style={{ fontSize: 12, color: '#999' }}>{new Date(viewingAssessment.date).toLocaleDateString()}</div>
                                            </div>
                                            {assessmentQuestions.map((q, i) => (
                                                <div key={q.id} style={{ marginBottom: 10, padding: 12, background: isDark ? '#16213E' : '#f5f5f5', borderRadius: 12 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 4 }}>{i + 1}. {isArabic ? q.qAr : q.q}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: viewingAssessment.answers[q.id] === 'yes' ? '#4CAF50' : viewingAssessment.answers[q.id] === 'no' ? '#FF5252' : '#FFC107' }}>
                                                        {viewingAssessment.answers[q.id] === 'yes' ? (isArabic ? 'نعم' : 'Yes') : viewingAssessment.answers[q.id] === 'no' ? (isArabic ? 'لا' : 'No') : (isArabic ? 'أحياناً' : 'Sometimes')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Assessments List */
                                        <div>
                                            {(!currentChild.assessments || currentChild.assessments.length === 0) ? (
                                                <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>{isArabic ? 'لا توجد تقييمات مسجلة.' : 'No assessments recorded.'}</div>
                                            ) : (
                                                [...(currentChild.assessments || [])].reverse().map((ass, idx) => (
                                                    <div key={idx} onClick={() => setViewingAssessment(ass)} style={{
                                                        display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 8,
                                                        background: isDark ? '#16213E' : '#fff', border: `1px solid ${isDark ? '#333' : '#eee'}`,
                                                        borderRadius: 14, cursor: 'pointer', transition: 'transform 0.2s'
                                                    }}>
                                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors.chart4}30`, color: '#F9A825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{ass.score}%</div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: 14, fontWeight: 600, color: text }}>{isArabic ? 'تقييم شامل' : 'Comprehensive Assessment'}</div>
                                                            <div style={{ fontSize: 11, color: '#999' }}>{new Date(ass.date).toLocaleDateString()}</div>
                                                        </div>
                                                        <div style={{ color: '#999' }}>›</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 3. BEHAVIOR TAB */}
                            {activeReportTab === 'behavior' && (
                                <div style={{ animation: 'fadeIn 0.3s' }}>
                                    {(!currentChild.behaviorLogs || currentChild.behaviorLogs.length === 0) ? (
                                        <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>{isArabic ? 'لا توجد سجلات سلوكية.' : 'No behavior logs recorded.'}</div>
                                    ) : (
                                        [...(currentChild.behaviorLogs || [])].reverse().map((log, idx) => {
                                            const bt = behaviorTypes.find(b => b.key === log.type);
                                            return (
                                                <div key={idx} style={{
                                                    display: 'flex', gap: 12, padding: 12, marginBottom: 8,
                                                    background: isDark ? '#16213E' : '#fff', border: `1px solid ${isDark ? '#333' : '#eee'}`, borderRadius: 14
                                                }}>
                                                    <div style={{ fontSize: 24 }}>{bt?.emoji || '📝'}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 14, fontWeight: 600, color: text }}>
                                                            {isArabic ? bt?.labelAr : bt?.label}
                                                            <span style={{ fontSize: 12, color: '#999', fontWeight: 400, marginInlineStart: 6 }}>({log.intensity}/5)</span>
                                                        </div>
                                                        <div style={{ fontSize: 13, color: text, marginTop: 4 }}>{log.note}</div>
                                                        <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>{new Date(log.date).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* --- ROUTINE TRACKER SECTION --- */}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ color: text, fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? '📅 متابعة الروتين' : '📅 Routine Tracker'}</h3>
                        <span style={{ fontSize: 13, color: '#8BC99A', fontWeight: 700, background: 'rgba(139,201,154,0.15)', padding: '4px 10px', borderRadius: 10 }}>
                            {isArabic ? 'اليوم' : 'Today'}: {todayRoutinePct}%
                        </span>
                    </div>

                    {/* Today's Bar */}
                    <div style={{ height: 12, background: isDark ? '#333' : '#eee', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                        <div style={{ height: '100%', width: `${todayRoutinePct}%`, background: '#8BC99A', borderRadius: 10, transition: 'width 0.5s ease' }} />
                    </div>

                    {/* History */}
                    {routineHistoryEntries.length > 0 ? (
                        <div>
                            <p style={{ fontSize: 13, color: '#999', marginBottom: 10 }}>{isArabic ? 'آخر 7 أيام' : 'Last 7 Days'}</p>
                            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                                {routineHistoryEntries.map(([date, tasks]) => {
                                    const count = Object.values(tasks).filter(Boolean).length;
                                    const pct = Math.round((count / totalRoutineTasks) * 100);
                                    return (
                                        <div key={date} style={{
                                            minWidth: 70, padding: 10, borderRadius: 12, background: isDark ? '#16213E' : '#F7F9FC',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            border: `1px solid ${isDark ? '#333' : '#eee'}`
                                        }}>
                                            <div style={{ fontSize: 10, color: '#999' }}>{date.split('-').slice(1).join('/')}</div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: pct >= 80 ? '#8BC99A' : pct >= 50 ? '#F9E4A7' : '#FF6584' }}>{pct}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#999', fontStyle: 'italic', fontSize: 13, textAlign: 'center' }}>{isArabic ? 'لا توجد بيانات سابقة' : 'No history data yet'}</p>
                    )}
                </div>

                {/* Summary Cards - REAL DATA */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                    {[
                        { title: isArabic ? 'التفاعلات' : 'Interactions', value: data.totalInteractions, emoji: '📊', color: colors.chart1 },
                        { title: isArabic ? 'دقة المشاعر' : 'Emotion Accuracy', value: `${Math.round(emotionAccuracy * 100)}%`, emoji: '🎯', color: colors.chart2 },
                        { title: isArabic ? 'الروتين' : 'Routine', value: `${todayRoutinePct}%`, emoji: '✅', color: colors.chart3 },
                    ].map((stat) => (
                        <div key={stat.title} style={{ background: cardBg, borderRadius: 18, padding: 14, textAlign: 'center', boxShadow: `0 4px 12px ${stat.color}26` }}>
                            <div style={{ fontSize: 28 }}>{stat.emoji}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, margin: '6px 0' }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: '#999' }}>{stat.title}</div>
                        </div>
                    ))}
                </div>

                {/* Extra Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
                    {[
                        { label: isArabic ? 'كلمات PECS' : 'PECS Taps', value: data.pecsTotalTaps, color: '#6C63FF' },
                        { label: isArabic ? 'جمل' : 'Sentences', value: data.pecsSentencesBuilt, color: '#FF6584' },
                        { label: isArabic ? 'تمارين تنفس' : 'Breathing', value: data.breathingExercises, color: '#B8A9E8' },
                        { label: isArabic ? 'جلسات هدوء' : 'Sessions', value: data.calmingSessionsCompleted, color: '#4ECDC4' },
                    ].map(s => (
                        <div key={s.label} style={{ background: cardBg, borderRadius: 14, padding: 10, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* --- EMOTION PROGRESS SECTION --- */}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ color: text, fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? '😊 تطور المشاعر' : '😊 Emotion Progress'}</h3>
                        <span style={{ fontSize: 13, color: '#FF6584', fontWeight: 700, background: 'rgba(255,101,132,0.15)', padding: '4px 10px', borderRadius: 10 }}>
                            {isArabic ? 'اليوم' : 'Today'}: {todayEmotionStats.correct}/{todayEmotionStats.total} ({todayEmotionPct}%)
                        </span>
                    </div>

                    {/* Today's Bar */}
                    <div style={{ height: 12, background: isDark ? '#333' : '#eee', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                        <div style={{ height: '100%', width: `${todayEmotionPct}%`, background: '#FF6584', borderRadius: 10, transition: 'width 0.5s ease' }} />
                    </div>

                    {/* History */}
                    {emotionHistoryEntries.length > 0 ? (
                        <div>
                            <p style={{ fontSize: 13, color: '#999', marginBottom: 10 }}>{isArabic ? 'آخر 7 أيام' : 'Last 7 Days'}</p>
                            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                                {emotionHistoryEntries.map(([date, stats]) => {
                                    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                                    return (
                                        <div key={date} style={{
                                            minWidth: 70, padding: 10, borderRadius: 12, background: isDark ? '#16213E' : '#F7F9FC',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                            border: `1px solid ${isDark ? '#333' : '#eee'}`
                                        }}>
                                            <div style={{ fontSize: 10, color: '#999' }}>{date.split('-').slice(1).join('/')}</div>
                                            <div style={{ fontSize: 16, fontWeight: 700, color: pct >= 80 ? '#4CAF50' : pct >= 50 ? '#FFC107' : '#FF6584' }}>{pct}%</div>
                                            <div style={{ fontSize: 9, color: text }}>{stats.correct}/{stats.total}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#999', fontStyle: 'italic', fontSize: 13, textAlign: 'center' }}>{isArabic ? 'لا توجد بيانات سابقة' : 'No history data yet'}</p>
                    )}
                </div>

                {/* Module Usage - REAL DATA */}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{isArabic ? '📊 استخدام الأقسام' : '📊 Module Usage'}</h3>
                    {totalUsage === 0 ? (
                        <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 16 }}>{isArabic ? 'لا توجد بيانات بعد - ابدأ بالتفاعل مع الأقسام' : 'No data yet - start interacting with modules'}</p>
                    ) : (
                        Object.entries(data.moduleUsage).map(([key, value], i) => {
                            const pct = totalUsage > 0 ? value / totalUsage : 0;
                            const c = Object.values(colors)[i];
                            return (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
                                    <span style={{ fontSize: 20 }}>{moduleEmojis[key]}</span>
                                    <span style={{ width: 70, fontSize: 13, fontWeight: 500, color: text }}>{moduleNames[key]}</span>
                                    <div style={{ flex: 1, height: 10, background: isDark ? '#333' : '#eee', borderRadius: 6, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct * 100}%`, background: c, borderRadius: 6, transition: 'width 0.5s' }} />
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: c, width: 40, textAlign: 'end' }}>{value}</span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Weekly Activity - REAL DATA */}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{isArabic ? '📈 النشاط الأسبوعي' : '📈 Weekly Activity'}</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: 140, gap: 4 }}>
                        {Object.entries(data.weeklyUsage).map(([day, val]) => {
                            const h = maxWeekly > 0 ? (val / maxWeekly) * 100 : 0;
                            return (
                                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: text, marginBottom: 4 }}>{val}</span>
                                    <div style={{ width: '70%', height: Math.max(h, 4), borderRadius: 8, background: val > 0 ? 'linear-gradient(to top, #6C63FF, #4ECDC4)' : isDark ? '#333' : '#eee', transition: 'height 0.5s' }} />
                                    <span style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Most Used Words - REAL DATA */}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{isArabic ? '💬 الكلمات الأكثر استخداماً' : '💬 Most Used Words'}</h3>
                    {mostUsedWords.length === 0 ? (
                        <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 16 }}>{isArabic ? 'استخدم قسم PECS لرؤية الكلمات هنا' : 'Use the PECS section to see words here'}</p>
                    ) : (
                        mostUsedWords.map(([word, count], i) => (
                            <div key={word} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(184,169,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#6C63FF' }}>{i + 1}</span>
                                </div>
                                <span style={{ flex: 1, fontSize: 14, color: text }}>{word}</span>
                                <span style={{ background: 'rgba(78,205,196,0.15)', padding: '4px 10px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#4ECDC4' }}>{count}x</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Emotion Details */}
                {data.emotionQuizAttempts > 0 && (
                    <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{isArabic ? '🧠 تفاصيل اختبار المشاعر' : '🧠 Emotion Quiz Details'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            <div style={{ textAlign: 'center', padding: 12, background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 14 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#4CAF50' }}>{data.emotionQuizCorrect}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'إجابات صحيحة' : 'Correct'}</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: 12, background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 14 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#FF6584' }}>{data.emotionQuizAttempts - data.emotionQuizCorrect}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'إجابات خاطئة' : 'Wrong'}</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: 12, background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 14 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#7EB6D8' }}>{data.emotionLearningViews}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'مشاهدات التعلم' : 'Learning Views'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calming Details */}
                {(data.breathingExercises > 0 || data.calmingSessionsCompleted > 0) && (
                    <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{isArabic ? '🧘 تفاصيل الهدوء' : '🧘 Calming Details'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            <div style={{ textAlign: 'center', padding: 12, background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 14 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#B8A9E8' }}>{data.breathingExercises}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'تمارين تنفس' : 'Breathing'}</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: 12, background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 14 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#4ECDC4' }}>{data.calmingSessionsCompleted}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'جلسات' : 'Sessions'}</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: 12, background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 14 }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#F9E4A7' }}>{data.calmingTotalMinutes}m</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'إجمالي الدقائق' : 'Total Minutes'}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Daily Notes */}
                <div style={{ background: cardBg, borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ color: text, fontSize: 18, fontWeight: 700 }}>{isArabic ? '📝 ملاحظات يومية' : '📝 Daily Notes'}</h3>
                        <button onClick={() => setShowNoteInput(true)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(108,99,255,0.1)', border: 'none', cursor: 'pointer', color: '#6C63FF', fontSize: 18 }}>+</button>
                    </div>
                    {data.dailyNotes.length === 0 && <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>{isArabic ? 'لا توجد ملاحظات بعد' : 'No notes yet. Tap + to add.'}</p>}
                    {data.dailyNotes.map((note, i) => (
                        <div key={i} style={{ background: isDark ? 'rgba(26,26,46,0.5)' : '#F7F9FC', borderRadius: 12, padding: 12, margin: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 14, color: text }}>{note.note}</div>
                                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{note.date}</div>
                            </div>
                            <button onClick={() => removeDailyNote(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 14 }}>✕</button>
                        </div>
                    ))}
                    {showNoteInput && (
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder={isArabic ? 'اكتب ملاحظاتك هنا...' : 'Write your notes here...'} style={{ flex: 1, padding: '10px 14px', borderRadius: 14, border: `1px solid ${isDark ? '#444' : '#ddd'}`, background: isDark ? '#2a3654' : '#fff', color: text, fontSize: 14 }} />
                            <button onClick={handleAddNote} style={{ background: '#6C63FF', color: '#fff', border: 'none', borderRadius: 14, padding: '10px 16px', cursor: 'pointer', fontWeight: 600 }}>{isArabic ? 'حفظ' : 'Save'}</button>
                        </div>
                    )}
                </div>

                {/* Support & Clinics Section */}
                <ClinicsMap />

                <AutismSupportBot />

                {/* Smart Recommendations - Based on REAL DATA */}
                <div style={{ padding: 20, borderRadius: 20, background: isDark ? 'linear-gradient(135deg, #1F2940, #16213E)' : 'linear-gradient(135deg, rgba(184,169,232,0.1), rgba(126,182,216,0.1))', border: '1px solid rgba(184,169,232,0.3)', marginBottom: 20 }}>
                    <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{isArabic ? '🤖 توصيات ذكية' : '🤖 Smart Recommendations'}</h3>
                    {recommendations.map((rec, i) => <p key={i} style={{ color: isDark ? '#ccc' : '#555', fontSize: 14, lineHeight: 1.5, margin: '4px 0' }}>{rec}</p>)}
                </div>
            </div>
        </div>
    );
}
