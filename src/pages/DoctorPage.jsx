import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

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
    { id: 1, q: 'Does the child respond to their name?', qAr: 'هل يستجيب الطفل عند مناداته باسمه؟', category: 'social' },
    { id: 2, q: 'Does the child make eye contact?', qAr: 'هل يقوم الطفل بالتواصل البصري؟', category: 'social' },
    { id: 3, q: 'Does the child point to objects?', qAr: 'هل يشير الطفل إلى الأشياء؟', category: 'communication' },
    { id: 4, q: 'Does the child use gestures?', qAr: 'هل يستخدم الطفل الإيماءات؟', category: 'communication' },
    { id: 5, q: 'Does the child engage in pretend play?', qAr: 'هل يشارك الطفل في اللعب التخيلي؟', category: 'behavior' },
    { id: 6, q: 'Does the child follow simple instructions?', qAr: 'هل يتبع الطفل التعليمات البسيطة؟', category: 'communication' },
    { id: 7, q: 'Does the child show interest in other children?', qAr: 'هل يظهر الطفل اهتماماً بالأطفال الآخرين؟', category: 'social' },
    { id: 8, q: 'Does the child have repetitive behaviors?', qAr: 'هل لدى الطفل سلوكيات متكررة؟', category: 'behavior' },
    { id: 9, q: 'Is the child sensitive to sounds?', qAr: 'هل الطفل حساس للأصوات؟', category: 'sensory' },
    { id: 10, q: 'Does the child have difficulty with transitions?', qAr: 'هل يواجه الطفل صعوبة في الانتقال بين الأنشطة؟', category: 'behavior' },
];

const tabs = [
    { key: 'patients', label: 'Patients', labelAr: 'المرضى', emoji: '👥' },
    { key: 'assessment', label: 'Assessment', labelAr: 'التقييم', emoji: '📋' },
    { key: 'behavior', label: 'Behavior', labelAr: 'السلوك', emoji: '📊' },
    { key: 'reports', label: 'Reports', labelAr: 'التقارير', emoji: '📈' },
];

export default function DoctorPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const {
        currentDoctor,
        childAccounts,
        findChildForDoctor,
        addPatientToDoctor,
        updateChildDiagnosis,
        isDoctorLoggedIn
    } = useAuth();

    // Redirect if not logged in
    useEffect(() => {
        if (!isDoctorLoggedIn) {
            navigate('/doctor-auth');
        }
    }, [isDoctorLoggedIn, navigate]);

    // Derive My Patients from Context
    const myPatients = childAccounts.filter(c =>
        currentDoctor?.patientIds?.some(id => id.toUpperCase() === c.childId.toUpperCase())
    );

    const [activeTab, setActiveTab] = useState('patients');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');

    // Assessment State
    const [assessmentAnswers, setAssessmentAnswers] = useState({});
    const [assessmentDone, setAssessmentDone] = useState(false);

    // Behavior State
    const [behaviorNote, setBehaviorNote] = useState('');
    const [behaviorType, setBehaviorType] = useState('meltdown');
    const [behaviorIntensity, setBehaviorIntensity] = useState(3);

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = '#6C63FF';

    // Helpers
    // Removed local persistence logic as it's handled by AuthContext now

    const updatePatientData = (pid, updates) => {
        // Update in DB directly
        updateChildDiagnosis(pid, updates);

        // Update local selection if needed
        if (selectedPatient && selectedPatient.childId === pid) {
            setSelectedPatient({ ...selectedPatient, ...updates });
        }
    };

    // ============ ACTIONS ============

    // 1. Search Logic
    const handleSearch = () => {
        setSearchError('');
        setSearchResult(null);
        if (!searchQuery.trim()) return;

        const child = findChildForDoctor(searchQuery.trim());
        if (child) {
            setSearchResult(child);
        } else {
            setSearchError(isArabic ? 'لم يتم العثور على طفل بهذا الكود أو الرقم' : 'No child found with this Code/Phone');
        }
    };

    // 2. Add to List
    const handleAddPatient = () => {
        if (!searchResult) return;

        const res = addPatientToDoctor(searchResult.childId);

        if (res.success) {
            setShowAddModal(false);
            setSearchQuery('');
            setSearchResult(null);
        } else {
            setSearchError(isArabic ? 'هذا المريض موجود بالفعل أو حدث خطأ' : 'Patient already added or error occurred');
        }
    };

    // 3. Update Diagnosis
    const handleUpdateDiagnosis = (level) => {
        if (!selectedPatient) return;
        updatePatientData(selectedPatient.childId, { diagnosisLevel: level });
    };

    // 4. Update Treatment Plan
    const handleUpdatePlan = (plan) => {
        if (!selectedPatient) return;
        updatePatientData(selectedPatient.childId, { treatmentPlan: plan });
    };

    // 5. Submit Assessment
    const submitAssessment = () => {
        if (!selectedPatient) return;
        const total = assessmentQuestions.length;
        const yesCount = Object.values(assessmentAnswers).filter(v => v === 'yes').length;
        const score = Math.round((yesCount / total) * 100);

        const rDetails = {
            date: new Date().toISOString(),
            score,
            answers: assessmentAnswers,
            totalQuestions: total
        };

        const currentAssessments = selectedPatient.assessments || [];
        updatePatientData(selectedPatient.childId, {
            assessments: [...currentAssessments, rDetails]
        });
        setAssessmentDone(true);
    };

    // 6. Add Behavior Log
    const addBehaviorLog = () => {
        if (!selectedPatient || !behaviorNote) return;
        const log = {
            type: behaviorType,
            note: behaviorNote,
            intensity: behaviorIntensity,
            date: new Date().toISOString(),
            emoji: behaviorTypes.find(b => b.key === behaviorType)?.emoji || '📝'
        };
        const currentLogs = selectedPatient.behaviorLogs || [];
        updatePatientData(selectedPatient.childId, {
            behaviorLogs: [...currentLogs, log]
        });
        setBehaviorNote('');
    };

    // ============ RENDERERS ============

    const renderPatients = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: text, margin: 0 }}>{isArabic ? 'ملفاتي' : 'My Patients'}</h3>
                <button onClick={() => setShowAddModal(true)} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>+ {isArabic ? 'إضافة' : 'Add'}</button>
            </div>

            {myPatients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
                    {isArabic ? 'لا يوجد مرضى حالياً. أضف مريضاً باستخدام الكود أو الرقم.' : 'No patients yet. Add one using Code or Phone.'}
                </div>
            ) : (
                myPatients.map(p => (
                    <div key={p.childId} onClick={() => setSelectedPatient(p)} style={{
                        background: selectedPatient?.childId === p.childId ? `${accent}15` : cardBg,
                        border: `2px solid ${selectedPatient?.childId === p.childId ? accent : 'transparent'}`,
                        borderRadius: 16, padding: 16, marginBottom: 10, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s'
                    }}>
                        <div style={{ fontSize: 32 }}>{p.avatar}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: text }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: '#999' }}>ID: {p.childId} • {p.diagnosisLevel}</div>
                        </div>
                        {p.parentPhone && <div style={{ fontSize: 12, color: '#4CAF50' }}>📞</div>}
                    </div>
                ))
            )}

            {/* Selected Patient Details Panel */}
            {selectedPatient && (
                <div style={{ marginTop: 20, background: cardBg, padding: 20, borderRadius: 20, border: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                        <div style={{ fontSize: 40 }}>{selectedPatient.avatar}</div>
                        <div>
                            <h2 style={{ margin: 0, color: text }}>{selectedPatient.name}</h2>
                            <p style={{ margin: 0, color: '#999', fontSize: 13 }}>{isArabic ? 'كود الطفل' : 'Child Code'}: <span style={{ fontFamily: 'monospace', background: '#eee', padding: '2px 6px', borderRadius: 4, color: '#333' }}>{selectedPatient.childId}</span></p>
                        </div>
                    </div>

                    {/* DIAGNOSIS CONTROL */}
                    <h4 style={{ color: text, marginBottom: 10 }}>{isArabic ? 'تشخيص الطبيب (يظهر لولي الأمر)' : 'Doctor Diagnosis (Visible to Parent)'}</h4>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {['Level 1', 'Level 2', 'Level 3'].map(lvl => (
                            <button key={lvl} onClick={() => handleUpdateDiagnosis(lvl)} style={{
                                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                                background: selectedPatient.diagnosisLevel === lvl ? accent : 'transparent',
                                color: selectedPatient.diagnosisLevel === lvl ? '#fff' : text,
                                border: `1px solid ${selectedPatient.diagnosisLevel === lvl ? accent : isDark ? '#444' : '#ddd'}`,
                                fontWeight: 700
                            }}>
                                {lvl}
                            </button>
                        ))}
                    </div>

                    {/* TREATMENT PLAN */}
                    <h4 style={{ color: text, marginBottom: 10 }}>{isArabic ? 'خطة العلاج & ملاحظات' : 'Medical Notes & Treatment Plan'}</h4>
                    <textarea
                        value={selectedPatient.treatmentPlan || ''}
                        onChange={e => handleUpdatePlan(e.target.value)}
                        placeholder={isArabic ? 'اكتب التقرير الطبي هنا...' : 'Write medical report here...'}
                        style={{
                            width: '100%', minHeight: 120, padding: 12, borderRadius: 12, outline: 'none',
                            background: isDark ? '#16213E' : '#f9f9f9', border: 'none', color: text, resize: 'vertical'
                        }}
                    />
                    <div style={{ fontSize: 12, color: '#4CAF50', marginTop: 8 }}>
                        {isArabic ? '✅ يتم الحفظ تلقائياً ويظهر لولي الأمر' : '✅ Saved automatically & visible to parent'}
                    </div>
                </div>
            )}
        </div>
    );

    // Assessment Detail View State
    const [viewingAssessment, setViewingAssessment] = useState(null);

    const renderAssessment = () => {
        if (!selectedPatient) return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</div>;

        // 1. Detailed View of a Past Assessment
        if (viewingAssessment) {
            return (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <button onClick={() => setViewingAssessment(null)} style={{ background: cardBg, border: 'none', borderRadius: 12, width: 40, height: 40, cursor: 'pointer', fontSize: 20 }}>←</button>
                        <h3 style={{ margin: 0, color: text }}>{isArabic ? 'تفاصيل التقييم' : 'Assessment Details'}</h3>
                        <span style={{ fontSize: 13, color: '#999', marginInlineStart: 'auto' }}>{new Date(viewingAssessment.date).toLocaleDateString()}</span>
                    </div>

                    <div style={{ textAlign: 'center', padding: 20, background: cardBg, borderRadius: 20, marginBottom: 20 }}>
                        <div style={{ fontSize: 40, fontWeight: 800, color: accent }}>{viewingAssessment.score}%</div>
                        <div style={{ fontSize: 13, color: '#999' }}>{isArabic ? 'نتيجة التقييم' : 'Assessment Score'}</div>
                    </div>

                    {assessmentQuestions.map((q, i) => {
                        const ans = viewingAssessment.answers[q.id];
                        return (
                            <div key={q.id} style={{ background: cardBg, borderRadius: 16, padding: 16, marginBottom: 10, opacity: 0.9 }}>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <span style={{ fontWeight: 700, color: accent }}>{i + 1}.</span>
                                    <p style={{ margin: 0, color: text, fontSize: 15 }}>{isArabic ? q.qAr : q.q}</p>
                                </div>
                                <div style={{ marginTop: 8, paddingInlineStart: 24, fontWeight: 700, color: ans === 'yes' ? '#4CAF50' : ans === 'no' ? '#FF5252' : '#FFC107' }}>
                                    {ans === 'yes' ? (isArabic ? 'نعم' : 'Yes') : ans === 'no' ? (isArabic ? 'لا' : 'No') : (isArabic ? 'أحياناً' : 'Sometimes')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // 2. Success View after submission
        if (assessmentDone) {
            const lastAssessment = (selectedPatient.assessments && selectedPatient.assessments.length > 0)
                ? selectedPatient.assessments[selectedPatient.assessments.length - 1]
                : { score: 0 };

            return (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <div style={{ fontSize: 60, marginBottom: 10 }}>✅</div>
                    <h2 style={{ color: text }}>{isArabic ? 'تم حفظ التقييم!' : 'Assessment Saved!'}</h2>
                    <div style={{ fontSize: 40, fontWeight: 800, color: accent }}>{lastAssessment.score}%</div>
                    <button onClick={() => { setAssessmentDone(false); setAssessmentAnswers({}); }} style={{ marginTop: 20, padding: '12px 24px', borderRadius: 12, background: accent, color: '#fff', border: 'none', cursor: 'pointer' }}>
                        {isArabic ? 'تقييم جديد' : 'New Assessment'}
                    </button>
                    <button onClick={() => setAssessmentDone(false)} style={{ marginTop: 12, display: 'block', marginInline: 'auto', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>
                        {isArabic ? 'العودة للقائمة' : 'Back to list'}
                    </button>
                </div>
            );
        }

        // 3. Main View: New Form + History List
        return (
            <div>
                <div style={{ marginBottom: 20, padding: 16, background: `${accent}15`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{selectedPatient.avatar}</span>
                    <span style={{ fontWeight: 700, color: text }}>{isArabic ? `تقييم ${selectedPatient.name}` : `Assessment for ${selectedPatient.name}`}</span>
                </div>

                {assessmentQuestions.map((q, i) => (
                    <div key={q.id} style={{ background: cardBg, borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <span style={{ fontWeight: 700, color: accent }}>{i + 1}.</span>
                            <p style={{ margin: 0, color: text, fontSize: 15 }}>{isArabic ? q.qAr : q.q}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingInlineStart: 24 }}>
                            {['yes', 'sometimes', 'no'].map(opt => (
                                <button key={opt} onClick={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: opt }))} style={{
                                    flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer',
                                    background: assessmentAnswers[q.id] === opt ? accent : 'transparent',
                                    color: assessmentAnswers[q.id] === opt ? '#fff' : text,
                                    border: `1px solid ${assessmentAnswers[q.id] === opt ? accent : '#ddd'}`
                                }}>
                                    {opt === 'yes' ? (isArabic ? 'نعم' : 'Yes') : opt === 'no' ? (isArabic ? 'لا' : 'No') : (isArabic ? 'أحياناً' : 'Sometimes')}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={submitAssessment}
                    disabled={Object.keys(assessmentAnswers).length < assessmentQuestions.length}
                    style={{ width: '100%', padding: 16, borderRadius: 16, background: accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, opacity: Object.keys(assessmentAnswers).length < assessmentQuestions.length ? 0.5 : 1 }}
                >
                    {isArabic ? 'حفظ التقييم' : 'Submit Assessment'}
                </button>

                {/* HISTORY LIST */}
                {selectedPatient.assessments && selectedPatient.assessments.length > 0 && (
                    <div style={{ marginTop: 30 }}>
                        <h4 style={{ color: text, marginBottom: 12, borderTop: `1px solid ${isDark ? '#333' : '#eee'}`, paddingTop: 20 }}>
                            {isArabic ? 'سجل التقييمات السابقة' : 'Previous Assessments'}
                        </h4>

                        {(selectedPatient.assessments || []).slice().reverse().map((ass, idx) => (
                            <div key={idx} onClick={() => setViewingAssessment(ass)} style={{
                                background: cardBg, padding: 14, borderRadius: 14, marginBottom: 10, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 14, border: `1px solid ${isDark ? '#333' : '#f0f0f0'}`,
                                transition: 'transform 0.2s'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12, background: `${accent}20`, color: accent,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
                                }}>
                                    {ass.score}%
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: text }}>{new Date(ass.date).toLocaleDateString()}</div>
                                    <div style={{ fontSize: 12, color: '#999' }}>{new Date(ass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div style={{ fontSize: 20, color: '#999' }}>›</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderBehavior = () => {
        if (!selectedPatient) return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</div>;

        return (
            <div>
                <div style={{ marginBottom: 20, padding: 16, background: `${accent}15`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{selectedPatient.avatar}</span>
                    <span style={{ fontWeight: 700, color: text }}>{isArabic ? `سلوك ${selectedPatient.name}` : `Behavior Log for ${selectedPatient.name}`}</span>
                </div>

                <div style={{ background: cardBg, padding: 20, borderRadius: 20, marginBottom: 20 }}>
                    <h4 style={{ margin: '0 0 10px', color: text }}>{isArabic ? 'تسجيل سلوك جديد' : 'Log New Behavior'}</h4>

                    {/* Types */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                        {behaviorTypes.map(bt => (
                            <button key={bt.key} onClick={() => setBehaviorType(bt.key)} style={{
                                padding: '8px 12px', borderRadius: 12, border: `1px solid ${behaviorType === bt.key ? bt.color : '#ddd'}`,
                                background: behaviorType === bt.key ? `${bt.color}20` : 'transparent',
                                color: text, cursor: 'pointer', fontSize: 13
                            }}>
                                {bt.emoji} {isArabic ? bt.labelAr : bt.label}
                            </button>
                        ))}
                    </div>

                    {/* Intensity */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{isArabic ? 'الشدة' : 'Intensity'}: {behaviorIntensity}/5</div>
                        <input
                            type="range" min="1" max="5" value={behaviorIntensity}
                            onChange={e => setBehaviorIntensity(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <textarea
                        value={behaviorNote}
                        onChange={e => setBehaviorNote(e.target.value)}
                        placeholder={isArabic ? 'ملاحظات...' : 'Notes...'}
                        style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ddd', minHeight: 80, marginBottom: 10, outline: 'none' }}
                    />

                    <button onClick={addBehaviorLog} style={{ width: '100%', padding: 12, borderRadius: 12, background: '#FF6584', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                        {isArabic ? 'تسجيل' : 'Log Entry'}
                    </button>
                </div>

                {/* History */}
                <h4 style={{ color: text, margin: '0 0 10px' }}>{isArabic ? 'السجل' : 'History'}</h4>
                <div>
                    {(selectedPatient.behaviorLogs || []).slice().reverse().map((log, i) => {
                        const bt = behaviorTypes.find(b => b.key === log.type);
                        return (
                            <div key={i} style={{ background: cardBg, padding: 12, borderRadius: 12, marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ fontSize: 24 }}>{log.emoji}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: text, fontSize: 14 }}>{isArabic ? bt?.labelAr : bt?.label} <span style={{ color: '#999', fontWeight: 400 }}>({log.intensity}/5)</span></div>
                                    <div style={{ fontSize: 13, color: text }}>{log.note}</div>
                                    <div style={{ fontSize: 11, color: '#999' }}>{new Date(log.date).toLocaleString()}</div>
                                </div>
                            </div>
                        );
                    })}
                    {(!selectedPatient.behaviorLogs || selectedPatient.behaviorLogs.length === 0) && (
                        <div style={{ color: '#999', fontSize: 13, textAlign: 'center' }}>{isArabic ? 'لا توجد سجلات بعد' : 'No logs yet'}</div>
                    )}
                </div>
            </div>
        );
    };

    const renderReports = () => {
        if (!selectedPatient) return <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</div>;

        const logs = selectedPatient.behaviorLogs || [];
        const assessments = selectedPatient.assessments || [];

        return (
            <div>
                <div style={{ marginBottom: 20, padding: 16, background: `${accent}15`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{selectedPatient.avatar}</span>
                    <span style={{ fontWeight: 700, color: text }}>{isArabic ? `تقرير ${selectedPatient.name}` : `Report for ${selectedPatient.name}`}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                    <div style={{ background: cardBg, padding: 16, borderRadius: 16, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 24 }}>📊</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#FF6584' }}>{logs.length}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'سجلات سلوكية' : 'Behavior Logs'}</div>
                    </div>
                    <div style={{ background: cardBg, padding: 16, borderRadius: 16, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 24 }}>📋</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: accent }}>{assessments.length}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{isArabic ? 'تقييمات مكتملة' : 'Assessments'}</div>
                    </div>
                </div>

                {/* Latest Checkup */}
                <div style={{ background: cardBg, padding: 20, borderRadius: 16 }}>
                    <h4 style={{ margin: '0 0 10px', color: text }}>{isArabic ? 'آخر التشخيصات' : 'Latest Diagnosis'}</h4>
                    <p style={{ color: text, margin: 0 }}><strong>{isArabic ? 'المستوى' : 'Level'}:</strong> {selectedPatient.diagnosisLevel}</p>
                    <p style={{ color: text, margin: '4px 0 0', whiteSpace: 'pre-wrap' }}><strong>{isArabic ? 'ملاحظات الطبيب' : 'Doctor Notes'}:</strong> {selectedPatient.treatmentPlan || 'No notes'}</p>
                </div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${accent}, #4ECDC4)`, padding: '20px', borderRadius: '0 0 24px 24px', color: '#fff', boxShadow: '0 4px 20px rgba(108,99,255,0.3)' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, float: isArabic ? 'right' : 'left', cursor: 'pointer' }}>←</button>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: 20 }}>{isArabic ? 'بوابة الطبيب' : 'Doctor Portal'}</h1>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: 13 }}>LearnNeur Medical</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 10, padding: '20px 20px 0', overflowX: 'auto' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                        padding: '10px 16px', borderRadius: '14px 14px 0 0', border: 'none',
                        background: activeTab === t.key ? cardBg : 'transparent',
                        color: activeTab === t.key ? accent : '#999',
                        fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
                    }}>
                        {t.emoji} {isArabic ? t.labelAr : t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
                {activeTab === 'patients' && renderPatients()}
                {activeTab === 'assessment' && renderAssessment()}
                {activeTab === 'behavior' && renderBehavior()}
                {activeTab === 'reports' && renderReports()}
            </div>

            {/* ADD PATIENT MODAL */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowAddModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: cardBg, padding: 24, borderRadius: 24, width: '90%', maxWidth: 400 }}>
                        <h3 style={{ color: text, textAlign: 'center', marginTop: 0 }}>{isArabic ? 'إضافة مريض جديد' : 'Add New Patient'}</h3>

                        <div style={{ background: isDark ? '#16213E' : '#f5f7fa', padding: 16, borderRadius: 16, marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, color: '#999', marginBottom: 6 }}>
                                {isArabic ? 'كود الطفل أو رقم هاتف الوالد' : 'Child Code OR Parent Phone'}
                            </label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Ex: LN-X8K92L or 010xxxx"
                                    style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd', outline: 'none' }}
                                />
                                <button onClick={handleSearch} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', cursor: 'pointer' }}>🔍</button>
                            </div>
                            {searchError && <div style={{ color: '#FF6584', fontSize: 12, marginTop: 8 }}>{searchError}</div>}
                        </div>

                        {searchResult && (
                            <div style={{ textAlign: 'center', marginBottom: 20, animation: 'fadeIn 0.3s' }}>
                                <div style={{ fontSize: 40 }}>{searchResult.avatar}</div>
                                <div style={{ fontWeight: 700, color: text, fontSize: 18 }}>{searchResult.name}</div>
                                <div style={{ color: '#999', fontSize: 13 }}>{searchResult.age} Years • {searchResult.gender}</div>
                                <button onClick={handleAddPatient} style={{ marginTop: 16, width: '100%', padding: 12, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                                    {isArabic ? '✅ إضافة للقائمة' : '✅ Add to My List'}
                                </button>
                            </div>
                        )}

                        <button onClick={() => setShowAddModal(false)} style={{ width: '100%', padding: 12, background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}>
                            {isArabic ? 'إلغاء' : 'Cancel'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
