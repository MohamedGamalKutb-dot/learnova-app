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
    const { currentChild, logoutParent } = useAuth();
    const { data, emotionAccuracy, routineCompletion, mostUsedWords, addDailyNote, removeDailyNote, resetAllData } = useData();

    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [activeReportTab, setActiveReportTab] = useState('general');
    const [viewingAssessment, setViewingAssessment] = useState(null);

    const accent = '#4ECDC4';
    const colors = { chart1: '#6C63FF', chart2: '#FF6584', chart3: '#4ECDC4', chart4: '#F59E0B' };
    const totalUsage = Object.values(data.moduleUsage).reduce((a, b) => a + b, 0);
    const maxWeekly = Math.max(...Object.values(data.weeklyUsage), 1);
    const handleAddNote = () => { if (!noteText.trim()) return; addDailyNote(noteText); setNoteText(''); setShowNoteInput(false); };

    const moduleNames = isArabic ? { pecs: 'التواصل', emotions: 'المشاعر', routine: 'الروتين', calming: 'الهدوء' } : { pecs: 'PECS', emotions: 'Emotions', routine: 'Routine', calming: 'Calming' };
    const moduleEmojis = { pecs: '🗣️', emotions: '😊', routine: '📅', calming: '🧘' };

    const todayKey = new Date().toLocaleDateString('en-CA');
    const routineHistory = currentChild?.routineHistory || {};
    const todayTasks = routineHistory[todayKey] || {};
    const todayCompletedCount = Object.values(todayTasks).filter(v => v === true).length;
    const totalRoutineTasks = defaultRoutine.length;
    const todayRoutinePct = Math.round((todayCompletedCount / totalRoutineTasks) * 100);
    const routineHistoryEntries = Object.entries(routineHistory).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 7);

    const emotionHistory = currentChild?.emotionHistory || {};
    const todayEmotionStats = emotionHistory[todayKey] || { correct: 0, total: 0 };
    const todayEmotionPct = todayEmotionStats.total > 0 ? Math.round((todayEmotionStats.correct / todayEmotionStats.total) * 100) : 0;
    const emotionHistoryEntries = Object.entries(emotionHistory).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 7);

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
    if (recommendations.length === 0) recommendations.push(isArabic ? '✨ استمر في استخدام التطبيق لرؤية توصيات مخصصة' : '✨ Keep using the app to see personalized recommendations');

    const behaviorTypes = [
        { key: 'meltdown', label: 'Meltdown', labelAr: 'نوبة انفعالية', emoji: '😤', color: '#FF6584' },
        { key: 'stimming', label: 'Stimming', labelAr: 'حركات تحفيزية', emoji: '🔄', color: '#F59E0B' },
        { key: 'aggression', label: 'Aggression', labelAr: 'عدوانية', emoji: '💢', color: '#E57373' },
        { key: 'withdrawal', label: 'Withdrawal', labelAr: 'انسحاب', emoji: '🫥', color: '#B8A9E8' },
        { key: 'sensory_overload', label: 'Sensory Overload', labelAr: 'حمل حسي زائد', emoji: '🤯', color: '#7EB6D8' },
        { key: 'positive', label: 'Positive Behavior', labelAr: 'سلوك إيجابي', emoji: '⭐', color: '#10B981' },
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

    const cardCls = (hk) => `rounded-[20px] p-6 mb-5 border transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'} ${hoveredCard === hk ? 'border-[#4ECDC4]/40 shadow-[0_8px_30px_rgba(78,205,196,0.06)]' : `${isDark ? 'border-border-dark' : 'border-border'} ${isDark ? '' : 'shadow-[0_2px_12px_rgba(0,0,0,0.04)]'}`}`;
    const navBtnCls = `w-9 h-9 rounded-[10px] border flex items-center justify-center cursor-pointer text-base ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`;
    const subBg = isDark ? 'bg-bg-dark' : 'bg-[#F9FAFB]';
    const histDay = `min-w-[64px] py-2.5 px-1.5 rounded-xl text-center shrink-0 border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`;

    const SectionTitle = ({ emoji, title, badge, badgeColor }) => (
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-[17px] font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}><span>{emoji}</span> {title}</h3>
            {badge && <span className="text-xs font-bold py-1 px-3 rounded-[10px]" style={{ background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}25` }}>{badge}</span>}
        </div>
    );

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* NAVBAR */}
            <nav className={`border-b py-3 px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl ${isDark ? 'bg-card-dark/95 border-border-dark' : 'bg-white/95 border-border'}`}>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/choice')} className={navBtnCls}>←</button>
                    <div>
                        <h1 className={`m-0 text-[17px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'لوحة التحكم' : 'Dashboard'}</h1>
                        <p className={`m-0 text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'متابعة تقدم طفلك' : "Tracking your child's progress"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={resetAllData} title={isArabic ? 'إعادة تعيين' : 'Reset Data'} className={navBtnCls}>🔄</button>
                    {logoutParent && <button onClick={() => { logoutParent(); navigate('/choice'); }} className={navBtnCls}>🚪</button>}
                </div>
            </nav>

            <div className="py-5 px-4 max-w-[700px] mx-auto">
                {/* CHILD HEADER */}
                {currentChild && (
                    <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44B09E] rounded-[20px] py-6 px-5 mb-5 relative overflow-hidden">
                        <div className="absolute -top-5 -right-5 w-[100px] h-[100px] rounded-full bg-white/[0.08]" />
                        <div className="absolute -bottom-[30px] -left-[30px] w-[120px] h-[120px] rounded-full bg-white/[0.05]" />
                        <div className="flex items-center gap-3.5 relative z-[1]">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-[32px] backdrop-blur-lg border-2 border-white/30">{currentChild.avatar}</div>
                            <div className="flex-1">
                                <h2 className="m-0 text-white text-xl font-bold">{currentChild.name}</h2>
                                <p className="mt-0.5 text-white/80 text-[13px]">{currentChild.age} {isArabic ? 'سنوات' : 'years'} • {currentChild.gender} • {currentChild.childId}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SUMMARY STATS */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { title: isArabic ? 'التفاعلات' : 'Interactions', value: data.totalInteractions, emoji: '📊', color: colors.chart1 },
                        { title: isArabic ? 'دقة المشاعر' : 'Emotion Accuracy', value: `${Math.round(emotionAccuracy * 100)}%`, emoji: '🎯', color: colors.chart2 },
                        { title: isArabic ? 'الروتين' : 'Routine', value: `${todayRoutinePct}%`, emoji: '✅', color: colors.chart3 },
                    ].map((stat, i) => (
                        <div key={stat.title} className={`rounded-2xl p-4 text-center border transition-all duration-300 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_2px_10px_rgba(0,0,0,0.04)]'}`}
                            style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}>
                            <div className="text-[28px]">{stat.emoji}</div>
                            <div className="text-2xl font-extrabold my-1.5" style={{ color: stat.color }}>{stat.value}</div>
                            <div className={`text-[11px] font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{stat.title}</div>
                        </div>
                    ))}
                </div>

                {/* EXTRA STATS */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                        { label: isArabic ? 'كلمات PECS' : 'PECS Taps', value: data.pecsTotalTaps, color: '#6C63FF' },
                        { label: isArabic ? 'جمل' : 'Sentences', value: data.pecsSentencesBuilt, color: '#FF6584' },
                        { label: isArabic ? 'تمارين تنفس' : 'Breathing', value: data.breathingExercises, color: '#B8A9E8' },
                        { label: isArabic ? 'جلسات هدوء' : 'Sessions', value: data.calmingSessionsCompleted, color: '#4ECDC4' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-[14px] p-3 text-center border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_1px_6px_rgba(0,0,0,0.03)]'}`}>
                            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                            <div className={`text-[10px] mt-0.5 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* MEDICAL REPORT */}
                {currentChild && (currentChild.diagnosisLevel !== 'Not Set' || currentChild.treatmentPlan || (currentChild.assessments && currentChild.assessments.length > 0)) && (
                    <div className={cardCls('medical')} onMouseEnter={() => setHoveredCard('medical')} onMouseLeave={() => setHoveredCard(null)}>
                        <div className={`flex items-center gap-3 mb-4 pb-3.5 border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                            <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-2xl" style={{ background: `linear-gradient(135deg, ${colors.chart1}20, ${colors.chart3}20)` }}>🩺</div>
                            <div>
                                <h3 className={`m-0 text-[17px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'التقرير الطبي' : 'Medical Report'}</h3>
                                <p className={`m-0 text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'بوابة الطبيب المختص' : 'Specialist Portal Data'}</p>
                            </div>
                        </div>
                        {/* Tabs */}
                        <div className={`flex gap-1 mb-4 p-1 rounded-xl ${isDark ? 'bg-bg-dark' : 'bg-gray-100'}`}>
                            {[{ key: 'general', label: isArabic ? 'عام' : 'General' }, { key: 'assessments', label: isArabic ? 'التقييمات' : 'Assessments' }, { key: 'behavior', label: isArabic ? 'السلوك' : 'Behavior' }].map(tab => (
                                <button key={tab.key} onClick={() => { setActiveReportTab(tab.key); setViewingAssessment(null); }}
                                    className={`flex-1 py-2.5 px-3 rounded-[10px] border-none text-[13px] cursor-pointer transition-all duration-200 ${activeReportTab === tab.key ? `font-bold ${isDark ? 'bg-card-dark text-[#4ECDC4]' : 'bg-white text-[#4ECDC4] shadow-[0_1px_4px_rgba(0,0,0,0.06)]'}` : `font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'} bg-transparent`}`}>{tab.label}</button>
                            ))}
                        </div>

                        {activeReportTab === 'general' && (
                            <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                                <div className={`flex justify-between items-center mb-4 p-3 px-4 rounded-[14px] ${subBg}`}>
                                    <span className={`text-[13px] font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</span>
                                    <span className="bg-gradient-to-br from-accent to-[#8B5CF6] text-white py-1 px-3.5 rounded-[10px] font-bold text-[13px]">{currentChild.diagnosisLevel}</span>
                                </div>
                                <h4 className={`mb-2 text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'خطة العلاج والملاحظات' : 'Treatment Plan & Notes'}</h4>
                                <div className={`${subBg} p-4 rounded-[14px] text-sm leading-relaxed border min-h-[60px] ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>{currentChild.treatmentPlan || (isArabic ? 'لا توجد ملاحظات مسجلة بعد.' : 'No notes recorded yet.')}</div>
                            </div>
                        )}

                        {activeReportTab === 'assessments' && (
                            <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                                {viewingAssessment ? (
                                    <div>
                                        <button onClick={() => setViewingAssessment(null)} className="bg-transparent border-none text-[#4ECDC4] cursor-pointer mb-2.5 font-semibold text-[13px] font-[inherit]">← {isArabic ? 'عودة' : 'Back'}</button>
                                        <div className="text-center mb-4">
                                            <div className="text-4xl font-extrabold text-[#4ECDC4]">{viewingAssessment.score}%</div>
                                            <div className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(viewingAssessment.date).toLocaleDateString()}</div>
                                        </div>
                                        {assessmentQuestions.map((q, i) => (
                                            <div key={q.id} className={`mb-2 py-3 px-3.5 rounded-xl border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                                <div className={`text-[13px] font-semibold mb-1 ${isDark ? 'text-text-dark' : 'text-text'}`}>{i + 1}. {isArabic ? q.qAr : q.q}</div>
                                                <div className="text-[13px] font-bold" style={{ color: viewingAssessment.answers[q.id] === 'yes' ? '#10B981' : viewingAssessment.answers[q.id] === 'no' ? '#EF4444' : '#F59E0B' }}>
                                                    {viewingAssessment.answers[q.id] === 'yes' ? (isArabic ? 'نعم ✓' : 'Yes ✓') : viewingAssessment.answers[q.id] === 'no' ? (isArabic ? 'لا ✗' : 'No ✗') : (isArabic ? 'أحياناً ~' : 'Sometimes ~')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        {(!currentChild.assessments || currentChild.assessments.length === 0) ? (
                                            <p className={`text-center p-5 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد تقييمات مسجلة.' : 'No assessments recorded.'}</p>
                                        ) : ([...(currentChild.assessments || [])].reverse().map((ass, idx) => (
                                            <div key={idx} onClick={() => setViewingAssessment(ass)}
                                                className={`flex items-center gap-3 py-3 px-3.5 mb-2 border rounded-[14px] cursor-pointer transition-all duration-200 hover:border-[#4ECDC4]/50 ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                                <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center font-extrabold text-sm" style={{ background: `${colors.chart4}15`, color: colors.chart4, border: `1px solid ${colors.chart4}25` }}>{ass.score}%</div>
                                                <div className="flex-1">
                                                    <div className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تقييم شامل' : 'Comprehensive Assessment'}</div>
                                                    <div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(ass.date).toLocaleDateString()}</div>
                                                </div>
                                                <span className={`text-lg ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>›</span>
                                            </div>
                                        )))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeReportTab === 'behavior' && (
                            <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                                {(!currentChild.behaviorLogs || currentChild.behaviorLogs.length === 0) ? (
                                    <p className={`text-center p-5 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد سجلات سلوكية.' : 'No behavior logs recorded.'}</p>
                                ) : ([...(currentChild.behaviorLogs || [])].reverse().map((log, idx) => {
                                    const bt = behaviorTypes.find(b => b.key === log.type);
                                    return (
                                        <div key={idx} className={`flex gap-3 py-3 px-3.5 mb-2 border rounded-[14px] ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                            <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[22px]" style={{ background: `${bt?.color || '#999'}15` }}>{bt?.emoji || '📝'}</div>
                                            <div className="flex-1">
                                                <div className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? bt?.labelAr : bt?.label}<span className={`text-[11px] font-normal ms-1.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>({log.intensity}/5)</span></div>
                                                <div className={`text-[13px] mt-1 opacity-90 ${isDark ? 'text-text-dark' : 'text-text'}`}>{log.note}</div>
                                                <div className={`text-[10px] mt-1 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(log.date).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    );
                                }))}
                            </div>
                        )}
                    </div>
                )}

                {/* ROUTINE TRACKER */}
                <div className={cardCls('routine')} onMouseEnter={() => setHoveredCard('routine')} onMouseLeave={() => setHoveredCard(null)}>
                    <SectionTitle emoji="📅" title={isArabic ? 'متابعة الروتين' : 'Routine Tracker'} badge={`${isArabic ? 'اليوم' : 'Today'}: ${todayRoutinePct}%`} badgeColor="#10B981" />
                    <div className={`h-2 rounded overflow-hidden mb-4 ${isDark ? 'bg-border-dark' : 'bg-gray-200'}`}>
                        <div className="h-full rounded bg-gradient-to-r from-emerald-500 to-[#4ECDC4] transition-[width] duration-600" style={{ width: `${todayRoutinePct}%` }} />
                    </div>
                    {routineHistoryEntries.length > 0 ? (
                        <div>
                            <p className={`text-xs mb-2.5 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'آخر 7 أيام' : 'Last 7 Days'}</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {routineHistoryEntries.map(([date, tasks]) => {
                                    const count = Object.values(tasks).filter(Boolean).length;
                                    const pct = Math.round((count / totalRoutineTasks) * 100);
                                    return (<div key={date} className={histDay}><div className={`text-[10px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{date.split('-').slice(1).join('/')}</div><div className="text-base font-bold my-1" style={{ color: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }}>{pct}%</div></div>);
                                })}
                            </div>
                        </div>
                    ) : (<p className={`text-[13px] text-center p-2 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد بيانات سابقة' : 'No history data yet'}</p>)}
                </div>

                {/* EMOTION PROGRESS */}
                <div className={cardCls('emotion')} onMouseEnter={() => setHoveredCard('emotion')} onMouseLeave={() => setHoveredCard(null)}>
                    <SectionTitle emoji="😊" title={isArabic ? 'تطور المشاعر' : 'Emotion Progress'} badge={`${isArabic ? 'اليوم' : 'Today'}: ${todayEmotionStats.correct}/${todayEmotionStats.total} (${todayEmotionPct}%)`} badgeColor="#FF6584" />
                    <div className={`h-2 rounded overflow-hidden mb-4 ${isDark ? 'bg-border-dark' : 'bg-gray-200'}`}>
                        <div className="h-full rounded bg-gradient-to-r from-[#FF6584] to-pink-500 transition-[width] duration-600" style={{ width: `${todayEmotionPct}%` }} />
                    </div>
                    {emotionHistoryEntries.length > 0 ? (
                        <div>
                            <p className={`text-xs mb-2.5 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'آخر 7 أيام' : 'Last 7 Days'}</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {emotionHistoryEntries.map(([date, stats]) => {
                                    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                                    return (<div key={date} className={histDay}><div className={`text-[10px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{date.split('-').slice(1).join('/')}</div><div className="text-base font-bold my-1" style={{ color: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }}>{pct}%</div><div className={`text-[9px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{stats.correct}/{stats.total}</div></div>);
                                })}
                            </div>
                        </div>
                    ) : (<p className={`text-[13px] text-center p-2 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد بيانات سابقة' : 'No history data yet'}</p>)}
                </div>

                {/* MODULE USAGE */}
                <div className={cardCls('module')} onMouseEnter={() => setHoveredCard('module')} onMouseLeave={() => setHoveredCard(null)}>
                    <SectionTitle emoji="📊" title={isArabic ? 'استخدام الأقسام' : 'Module Usage'} />
                    {totalUsage === 0 ? (<p className={`text-center p-4 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد بيانات بعد - ابدأ بالتفاعل مع الأقسام' : 'No data yet - start interacting with modules'}</p>) : (
                        Object.entries(data.moduleUsage).map(([key, value], i) => {
                            const pct = totalUsage > 0 ? value / totalUsage : 0;
                            const c = Object.values(colors)[i];
                            return (
                                <div key={key} className="flex items-center gap-2.5 my-2.5">
                                    <span className="text-xl">{moduleEmojis[key]}</span>
                                    <span className={`w-[70px] text-[13px] font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{moduleNames[key]}</span>
                                    <div className={`flex-1 h-2 rounded overflow-hidden ${isDark ? 'bg-border-dark' : 'bg-gray-200'}`}><div className="h-full rounded transition-[width] duration-500" style={{ width: `${pct * 100}%`, background: c }} /></div>
                                    <span className="w-9 text-end text-[13px] font-bold" style={{ color: c }}>{value}</span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* WEEKLY ACTIVITY */}
                <div className={cardCls('weekly')} onMouseEnter={() => setHoveredCard('weekly')} onMouseLeave={() => setHoveredCard(null)}>
                    <SectionTitle emoji="📈" title={isArabic ? 'النشاط الأسبوعي' : 'Weekly Activity'} />
                    <div className="flex items-end h-[140px] gap-1.5 mt-3">
                        {Object.entries(data.weeklyUsage).map(([day, val]) => {
                            const h = maxWeekly > 0 ? (val / maxWeekly) * 100 : 0;
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center justify-end">
                                    <span className={`text-[11px] font-bold mb-1 ${isDark ? 'text-text-dark' : 'text-text'}`}>{val}</span>
                                    <div className="w-[70%] rounded-md transition-[height] duration-500" style={{ height: Math.max(h, 4), background: val > 0 ? `linear-gradient(to top, ${accent}, #6C63FF)` : (isDark ? '#21262D' : '#E5E7EB') }} />
                                    <span className={`text-[10px] mt-1.5 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MOST USED WORDS */}
                <div className={cardCls('words')} onMouseEnter={() => setHoveredCard('words')} onMouseLeave={() => setHoveredCard(null)}>
                    <SectionTitle emoji="💬" title={isArabic ? 'الكلمات الأكثر استخداماً' : 'Most Used Words'} />
                    {mostUsedWords.length === 0 ? (<p className={`text-center p-4 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'استخدم قسم PECS لرؤية الكلمات هنا' : 'Use the PECS section to see words here'}</p>) : (
                        mostUsedWords.map(([word, count], i) => (
                            <div key={word} className={`flex items-center gap-3 py-2 ${i < mostUsedWords.length - 1 ? `border-b ${isDark ? 'border-border-dark' : 'border-border'}` : ''}`}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${colors.chart1}15`, border: `1px solid ${colors.chart1}20` }}><span className="text-xs font-bold" style={{ color: colors.chart1 }}>{i + 1}</span></div>
                                <span className={`flex-1 text-sm font-medium ${isDark ? 'text-text-dark' : 'text-text'}`}>{word}</span>
                                <span className="py-1 px-2.5 rounded-lg text-xs font-bold" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}20` }}>{count}x</span>
                            </div>
                        ))
                    )}
                </div>

                {/* EMOTION QUIZ DETAILS */}
                {data.emotionQuizAttempts > 0 && (
                    <div className={cardCls('emotionDetail')} onMouseEnter={() => setHoveredCard('emotionDetail')} onMouseLeave={() => setHoveredCard(null)}>
                        <SectionTitle emoji="🧠" title={isArabic ? 'تفاصيل اختبار المشاعر' : 'Emotion Quiz Details'} />
                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { value: data.emotionQuizCorrect, label: isArabic ? 'إجابات صحيحة' : 'Correct', color: '#10B981' },
                                { value: data.emotionQuizAttempts - data.emotionQuizCorrect, label: isArabic ? 'إجابات خاطئة' : 'Wrong', color: '#EF4444' },
                                { value: data.emotionLearningViews, label: isArabic ? 'مشاهدات التعلم' : 'Learning Views', color: '#7EB6D8' },
                            ].map(item => (
                                <div key={item.label} className={`text-center p-3.5 rounded-[14px] border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                    <div className="text-2xl font-extrabold" style={{ color: item.color }}>{item.value}</div>
                                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CALMING DETAILS */}
                {(data.breathingExercises > 0 || data.calmingSessionsCompleted > 0) && (
                    <div className={cardCls('calming')} onMouseEnter={() => setHoveredCard('calming')} onMouseLeave={() => setHoveredCard(null)}>
                        <SectionTitle emoji="🧘" title={isArabic ? 'تفاصيل الهدوء' : 'Calming Details'} />
                        <div className="grid grid-cols-3 gap-2.5">
                            {[
                                { value: data.breathingExercises, label: isArabic ? 'تمارين تنفس' : 'Breathing', color: '#B8A9E8' },
                                { value: data.calmingSessionsCompleted, label: isArabic ? 'جلسات' : 'Sessions', color: '#4ECDC4' },
                                { value: `${data.calmingTotalMinutes}m`, label: isArabic ? 'إجمالي الدقائق' : 'Total Minutes', color: '#F59E0B' },
                            ].map(item => (
                                <div key={item.label} className={`text-center p-3.5 rounded-[14px] border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                    <div className="text-2xl font-extrabold" style={{ color: item.color }}>{item.value}</div>
                                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DAILY NOTES */}
                <div className={cardCls('notes')} onMouseEnter={() => setHoveredCard('notes')} onMouseLeave={() => setHoveredCard(null)}>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`text-[17px] font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}><span>📝</span> {isArabic ? 'ملاحظات يومية' : 'Daily Notes'}</h3>
                        <button onClick={() => setShowNoteInput(true)} className="w-[34px] h-[34px] rounded-[10px] cursor-pointer text-xl flex items-center justify-center transition-all duration-200" style={{ background: `${colors.chart1}12`, border: `1px solid ${colors.chart1}25`, color: colors.chart1 }}>+</button>
                    </div>
                    {data.dailyNotes.length === 0 && <p className={`text-center py-4 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد ملاحظات بعد' : 'No notes yet. Tap + to add.'}</p>}
                    {data.dailyNotes.map((note, i) => (
                        <div key={i} className={`rounded-xl py-3 px-3.5 my-1.5 flex justify-between items-start border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                            <div><div className={`text-sm ${isDark ? 'text-text-dark' : 'text-text'}`}>{note.note}</div><div className={`text-[11px] mt-1 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{note.date}</div></div>
                            <button onClick={() => removeDailyNote(i)} className={`bg-transparent border-none cursor-pointer text-sm p-1 transition-colors duration-200 hover:text-red-500 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>✕</button>
                        </div>
                    ))}
                    {showNoteInput && (
                        <div className="mt-3 flex gap-2">
                            <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder={isArabic ? 'اكتب ملاحظاتك هنا...' : 'Write your notes here...'} onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                                className={`flex-1 py-3 px-3.5 rounded-xl text-sm border outline-none font-[inherit] focus:border-[#4ECDC4] ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`} />
                            <button onClick={handleAddNote} className="bg-gradient-to-br from-[#4ECDC4] to-[#44B09E] text-white border-none rounded-xl py-3 px-5 cursor-pointer font-bold text-sm transition-all duration-200 font-[inherit]">{isArabic ? 'حفظ' : 'Save'}</button>
                        </div>
                    )}
                </div>

                <ClinicsMap />
                <AutismSupportBot />

                {/* SMART RECOMMENDATIONS */}
                <div className={`p-6 rounded-[20px] mb-5 border ${isDark ? 'bg-gradient-to-br from-accent/[0.08] to-[#4ECDC4]/[0.08] border-accent/[0.15]' : 'bg-gradient-to-br from-accent/[0.04] to-[#4ECDC4]/[0.04] border-accent/[0.1]'}`}>
                    <SectionTitle emoji="🤖" title={isArabic ? 'توصيات ذكية' : 'Smart Recommendations'} />
                    {recommendations.map((rec, i) => (
                        <div key={i} className={`py-2.5 px-3.5 mb-1.5 rounded-xl text-sm leading-relaxed border ${isDark ? 'bg-white/[0.03] border-white/[0.05] text-text-dark' : 'bg-white/60 border-black/[0.04] text-text'}`}>{rec}</div>
                    ))}
                </div>

                <div className="h-10" />
            </div>

            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </div>
    );
}
