import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardBody, Input, Navbar, NavbarContent, NavbarItem, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Avatar } from '@heroui/react';

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
const tabsList = [
    { key: 'patients', label: 'Patients', labelAr: 'المرضى', emoji: '👥' },
    { key: 'assessment', label: 'Assessment', labelAr: 'التقييم', emoji: '📋' },
    { key: 'behavior', label: 'Behavior', labelAr: 'السلوك', emoji: '📊' },
    { key: 'reports', label: 'Reports', labelAr: 'التقارير', emoji: '📈' },
];

export default function DoctorPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentDoctor, childAccounts, findChildForDoctor, addPatientToDoctor, updateChildDiagnosis, isDoctorLoggedIn, logoutDoctor, updateDoctorProfile } = useAuth();
    useEffect(() => { if (!isDoctorLoggedIn) navigate('/doctor-auth'); }, [isDoctorLoggedIn, navigate]);

    const myPatients = childAccounts.filter(c => currentDoctor?.patientIds?.some(id => id.toUpperCase() === c.childId.toUpperCase()));
    const [activeTab, setActiveTab] = useState('patients');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [assessmentAnswers, setAssessmentAnswers] = useState({});
    const [assessmentDone, setAssessmentDone] = useState(false);
    const [behaviorNote, setBehaviorNote] = useState('');
    const [behaviorType, setBehaviorType] = useState('meltdown');
    const [behaviorIntensity, setBehaviorIntensity] = useState(3);
    const [viewingAssessment, setViewingAssessment] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [tempDoctorName, setTempDoctorName] = useState(currentDoctor?.name || '');
    const [tempDoctorAvatar, setTempDoctorAvatar] = useState(currentDoctor?.avatar || '🩺');

    const accent = '#6C63FF';
    const updatePatientData = (pid, updates) => { updateChildDiagnosis(pid, updates); if (selectedPatient?.childId === pid) setSelectedPatient({ ...selectedPatient, ...updates }); };
    const handleSearch = () => { setSearchError(''); setSearchResult(null); if (!searchQuery.trim()) return; const child = findChildForDoctor(searchQuery.trim()); child ? setSearchResult(child) : setSearchError(isArabic ? 'لم يتم العثور على طفل' : 'No child found'); };
    const handleAddPatient = () => { if (!searchResult) return; const res = addPatientToDoctor(searchResult.childId); if (res.success) { setShowAddModal(false); setSearchQuery(''); setSearchResult(null); } else setSearchError(isArabic ? 'المريض موجود بالفعل' : 'Patient already added'); };
    const submitAssessment = () => { if (!selectedPatient) return; const yesCount = Object.values(assessmentAnswers).filter(v => v === 'yes').length; const score = Math.round((yesCount / assessmentQuestions.length) * 100); const r = { date: new Date().toISOString(), score, answers: assessmentAnswers, totalQuestions: assessmentQuestions.length }; updatePatientData(selectedPatient.childId, { assessments: [...(selectedPatient.assessments || []), r] }); setAssessmentDone(true); };
    const addBehaviorLog = () => { if (!selectedPatient || !behaviorNote) return; const log = { type: behaviorType, note: behaviorNote, intensity: behaviorIntensity, date: new Date().toISOString(), emoji: behaviorTypes.find(b => b.key === behaviorType)?.emoji || '📝' }; updatePatientData(selectedPatient.childId, { behaviorLogs: [...(selectedPatient.behaviorLogs || []), log] }); setBehaviorNote(''); };
    
    const handleSaveProfile = () => {
        updateDoctorProfile({ name: tempDoctorName, avatar: tempDoctorAvatar });
        setShowProfileModal(false);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (re) => setTempDoctorAvatar(re.target.result);
            reader.readAsDataURL(file);
        }
    };

    const cardCls = (hk) => `rounded-[18px] mb-4 border transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'} ${hoveredCard === hk ? 'border-accent/40 shadow-[0_8px_28px_rgba(108,99,255,0.06)]' : `${isDark ? 'border-border-dark' : 'border-border'} ${isDark ? '' : 'shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}`;
    const navBtnCls = `text-base ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'} border`;
    const inputCls = `w-full py-3 px-3.5 rounded-xl text-sm border-[1.5px] outline-none font-[Inter,sans-serif] transition-all duration-300 box-border focus:border-accent ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;
    const subBg = isDark ? 'bg-bg-dark' : 'bg-[#F9FAFB]';
    const patientBanner = `mb-4 p-4 rounded-[14px] flex items-center gap-2.5 border border-accent/[0.07] ${isDark ? 'bg-accent/[0.03]' : 'bg-accent/[0.04]'}`;

    const renderPatients = () => (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`m-0 text-lg font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'قائمة المرضى' : 'My Patients'}</h3>
                <Button radius="lg" className="bg-gradient-to-br from-accent to-[#4834D4] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(108,99,255,0.2)] transition-all duration-200 hover:-translate-y-px mt-2"
                    onPress={() => setShowAddModal(true)}>+ {isArabic ? 'إضافة مريض' : 'Add Patient'}</Button>
            </div>
            {myPatients.length === 0 ? (
                <Card className={cardCls('empty')} onMouseEnter={() => setHoveredCard('empty')} onMouseLeave={() => setHoveredCard(null)}>
                    <CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        <div className="text-5xl mb-3">📂</div>{isArabic ? 'لا يوجد مرضى. أضف مريضاً باستخدام الكود أو الرقم.' : 'No patients yet. Add one using Code or Phone.'}
                    </CardBody>
                </Card>
            ) : (
                myPatients.map((p, i) => (
                    <Card key={p.childId} isPressable onPress={() => setSelectedPatient(p)}
                        className={`mb-2.5 transition-all duration-300 border-[1.5px] ${selectedPatient?.childId === p.childId ? `${isDark ? 'bg-accent/[0.07]' : 'bg-accent/[0.04]'} border-accent` : `${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} hover:border-accent/50`}`}
                        style={{ animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both` }}>
                        <CardBody className="p-4 flex flex-row items-center gap-3.5">
                            <Avatar 
                                radius="lg"
                                className="w-12 h-12 text-2xl shrink-0"
                                src={p.avatar?.length > 10 ? p.avatar : undefined}
                                name={p.avatar?.length <= 2 ? p.avatar : undefined}
                                icon={p.avatar?.length <= 2 && !p.avatar ? undefined : undefined}
                                style={{ background: `${accent}10`, border: `1px solid ${accent}15` }}
                            />
                            <div className="flex-1 text-left rtl:text-right">
                                <div className={`font-bold text-[15px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{p.name}</div>
                                <div className={`text-xs mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>ID: <span className={`font-mono px-1.5 py-px rounded ${isDark ? 'bg-border-dark' : 'bg-gray-100'}`}>{p.childId}</span> • {p.diagnosisLevel}</div>
                            </div>
                            {p.parentPhone && <span className="text-sm text-emerald-500 shrink-0">📞</span>}
                        </CardBody>
                    </Card>
                ))
            )}
            {selectedPatient && (
                <Card className={`${cardCls('details')} mt-5 !border-accent/20`} onMouseEnter={() => setHoveredCard('details')} onMouseLeave={() => setHoveredCard(null)}>
                    <CardBody className="p-[22px]">
                        <div className={`flex gap-3.5 mb-5 pb-4 border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                            <Avatar 
                                radius="2xl"
                                className="w-14 h-14 text-2xl shrink-0"
                                src={selectedPatient.avatar?.length > 10 ? selectedPatient.avatar : undefined}
                                name={selectedPatient.avatar?.length <= 2 ? selectedPatient.avatar : undefined}
                                style={{ background: `linear-gradient(135deg, ${accent}15, #4ECDC415)` }}
                            />
                            <div>
                                <h2 className={`m-0 text-xl font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{selectedPatient.name}</h2>
                                <p className={`mt-0.5 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'كود الطفل' : 'Child Code'}: <span className={`font-mono font-semibold py-0.5 px-2 rounded-md ${isDark ? 'bg-border-dark text-text-dark' : 'bg-gray-100 text-text'}`}>{selectedPatient.childId}</span></p>
                            </div>
                        </div>
                        <h4 className={`mb-2.5 text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}><span>🏥</span> {isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</h4>
                        <div className="flex gap-2 mb-5">
                            {['Level 1', 'Level 2', 'Level 3'].map(lvl => (
                                <Button key={lvl} radius="lg" size="lg" className={`flex-1 font-bold text-[13px] border-[1.5px] transition-all duration-200 ${selectedPatient.diagnosisLevel === lvl ? 'bg-gradient-to-br from-accent to-[#4834D4] text-white border-accent shadow-[0_4px_12px_rgba(108,99,255,0.15)]' : `bg-transparent ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}`}
                                    onPress={() => updatePatientData(selectedPatient.childId, { diagnosisLevel: lvl })}>{lvl}</Button>
                            ))}
                        </div>
                        <h4 className={`mb-2.5 text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}><span>📝</span> {isArabic ? 'خطة العلاج والملاحظات' : 'Treatment Plan & Notes'}</h4>
                        <textarea value={selectedPatient.treatmentPlan || ''} onChange={e => updatePatientData(selectedPatient.childId, { treatmentPlan: e.target.value })} placeholder={isArabic ? 'اكتب التقرير الطبي هنا...' : 'Write medical report here...'} className={`${inputCls} min-h-[100px] resize-y`} />
                        <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">✅ {isArabic ? 'يتم الحفظ تلقائياً ويظهر لولي الأمر' : 'Auto-saved & visible to parent'}</div>
                    </CardBody>
                </Card>
            )}
        </div>
    );

    const renderAssessment = () => {
        if (!selectedPatient) return <Card className={cardCls(null)}><CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}><div className="text-[40px] mb-2">📋</div>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</CardBody></Card>;
        if (viewingAssessment) return (
            <div>
                <Button variant="light" size="sm" className="text-accent font-bold text-[13px] mb-4 p-0 min-w-0 h-auto" onPress={() => setViewingAssessment(null)}>← {isArabic ? 'عودة' : 'Back'}</Button>
                <Card className={cardCls('score')} onMouseEnter={() => setHoveredCard('score')} onMouseLeave={() => setHoveredCard(null)}><CardBody className="text-center p-[22px]"><div className="text-[40px] font-extrabold text-accent">{viewingAssessment.score}%</div><div className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(viewingAssessment.date).toLocaleDateString()}</div></CardBody></Card>
                {assessmentQuestions.map((q, i) => {
                    const ans = viewingAssessment.answers[q.id]; return (
                        <Card key={q.id} className={cardCls(null)}><CardBody className="p-4"><div className="flex gap-2"><span className="font-bold text-accent">{i + 1}.</span><span className={`text-sm ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? q.qAr : q.q}</span></div><div className="mt-2 ps-5 font-bold text-[13px]" style={{ color: ans === 'yes' ? '#10B981' : ans === 'no' ? '#EF4444' : '#F59E0B' }}>{ans === 'yes' ? (isArabic ? 'نعم ✓' : 'Yes ✓') : ans === 'no' ? (isArabic ? 'لا ✗' : 'No ✗') : (isArabic ? 'أحياناً ~' : 'Sometimes ~')}</div></CardBody></Card>
                    );
                })}
            </div>
        );
        if (assessmentDone) {
            const last = selectedPatient.assessments?.length > 0 ? selectedPatient.assessments[selectedPatient.assessments.length - 1] : { score: 0 }; return (
                <Card className={cardCls(null)}><CardBody className="text-center p-5"><div className="text-[60px] mb-2.5">✅</div><h2 className={`mb-2 font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تم حفظ التقييم!' : 'Assessment Saved!'}</h2><div className="text-[40px] font-extrabold text-accent">{last.score}%</div>
                    <Button radius="xl" size="lg" className="mt-5 bg-gradient-to-br from-accent to-[#4834D4] text-white font-bold" onPress={() => { setAssessmentDone(false); setAssessmentAnswers({}); }}>{isArabic ? 'تقييم جديد' : 'New Assessment'}</Button>
                </CardBody></Card>
            );
        }
        return (
            <div>
                <div className={patientBanner}>
                    <Avatar 
                        size="sm"
                        radius="full"
                        src={selectedPatient.avatar?.length > 10 ? selectedPatient.avatar : undefined}
                        name={selectedPatient.avatar?.length <= 2 ? selectedPatient.avatar : undefined}
                        className="bg-accent/10 text-accent font-black"
                    />
                    <span className={`font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? `تقييم ${selectedPatient.name}` : `Assessment for ${selectedPatient.name}`}</span>
                </div>
                {assessmentQuestions.map((q, i) => (
                    <Card key={q.id} className={cardCls(`q${q.id}`)} onMouseEnter={() => setHoveredCard(`q${q.id}`)} onMouseLeave={() => setHoveredCard(null)}>
                        <CardBody className="p-4">
                            <div className="flex gap-2 mb-3"><span className="font-bold text-sm text-accent">{i + 1}.</span><span className={`text-sm ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? q.qAr : q.q}</span></div>
                            <div className="flex gap-2 ps-5">
                                {['yes', 'sometimes', 'no'].map(opt => (
                                    <Button key={opt} radius="md" size="md" onPress={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                        className={`flex-1 font-semibold text-[13px] border-[1.5px] transition-all duration-200 ${assessmentAnswers[q.id] === opt ? 'text-white border-transparent' : `${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'} bg-transparent`}`}
                                        style={assessmentAnswers[q.id] === opt ? { background: opt === 'yes' ? '#10B981' : opt === 'no' ? '#EF4444' : '#F59E0B' } : undefined}>
                                        {opt === 'yes' ? (isArabic ? 'نعم' : 'Yes') : opt === 'no' ? (isArabic ? 'لا' : 'No') : (isArabic ? 'أحياناً' : 'Sometimes')}
                                    </Button>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                ))}
                <Button fullWidth radius="xl" size="lg" onPress={submitAssessment} isDisabled={Object.keys(assessmentAnswers).length < assessmentQuestions.length}
                    className="bg-gradient-to-br from-accent to-[#4834D4] text-white font-bold text-[15px] shadow-[0_4px_16px_rgba(108,99,255,0.2)] transition-all duration-300 mb-6">
                    {isArabic ? '💾 حفظ التقييم' : '💾 Submit Assessment'}
                </Button>
                {selectedPatient.assessments?.length > 0 && (
                    <div><h4 className={`mb-3 pt-4 text-[15px] font-bold border-t ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>{isArabic ? 'التقييمات السابقة' : 'Previous Assessments'}</h4>
                        {[...(selectedPatient.assessments || [])].reverse().map((ass, idx) => (
                            <Card key={idx} isPressable onPress={() => setViewingAssessment(ass)} className={`mb-2 transition-all duration-200 hover:border-accent/50 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                                <CardBody className="p-3.5 flex flex-row items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-[13px] shrink-0" style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}20` }}>{ass.score}%</div>
                                    <div className="flex-1 text-left rtl:text-right"><div className={`font-semibold text-sm ${isDark ? 'text-text-dark' : 'text-text'}`}>{new Date(ass.date).toLocaleDateString()}</div><div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(ass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div>
                                    <span className={`text-lg shrink-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>›</span>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderBehavior = () => {
        if (!selectedPatient) return <Card className={cardCls(null)}><CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}><div className="text-[40px] mb-2">📊</div>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</CardBody></Card>;
        return (
            <div>
                <div className={patientBanner}>
                    <Avatar 
                        size="sm"
                        radius="full"
                        src={selectedPatient.avatar?.length > 10 ? selectedPatient.avatar : undefined}
                        name={selectedPatient.avatar?.length <= 2 ? selectedPatient.avatar : undefined}
                        className="bg-accent/10 text-accent font-black"
                    />
                    <span className={`font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? `سلوك ${selectedPatient.name}` : `Behavior Log for ${selectedPatient.name}`}</span>
                </div>
                <Card className={cardCls('newBehavior')} onMouseEnter={() => setHoveredCard('newBehavior')} onMouseLeave={() => setHoveredCard(null)}>
                    <CardBody className="p-[22px]">
                        <h4 className={`mb-3.5 text-[15px] font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}><span>📝</span> {isArabic ? 'تسجيل سلوك جديد' : 'Log New Behavior'}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {behaviorTypes.map(bt => (
                                <Button key={bt.key} size="sm" radius="sm" onPress={() => setBehaviorType(bt.key)}
                                    className={`font-semibold text-xs border-[1.5px] ${isDark ? 'text-text-dark' : 'text-text'}`}
                                    style={{ borderColor: behaviorType === bt.key ? bt.color : undefined, background: behaviorType === bt.key ? `${bt.color}15` : 'transparent' }}>
                                    {bt.emoji} {isArabic ? bt.labelAr : bt.label}
                                </Button>
                            ))}
                        </div>
                        <div className="mb-3.5">
                            <div className={`text-xs mb-2 font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'الشدة' : 'Intensity'}: <span className="text-accent font-bold">{behaviorIntensity}/5</span></div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <Button key={n} radius="md" size="sm" onPress={() => setBehaviorIntensity(n)}
                                        className={`flex-1 font-bold text-[13px] border-[1.5px] transition-all duration-200 ${n <= behaviorIntensity ? 'border-accent bg-accent/[0.09] text-accent' : `${isDark ? 'border-border-dark text-subtext-dark' : 'border-border text-subtext'} bg-transparent`}`}>{n}</Button>
                                ))}
                            </div>
                        </div>
                        <textarea value={behaviorNote} onChange={e => setBehaviorNote(e.target.value)} placeholder={isArabic ? 'ملاحظات تفصيلية...' : 'Detailed notes...'} className={`${inputCls} min-h-[80px] resize-y mb-3`} />
                        <Button fullWidth radius="xl" size="lg" onPress={addBehaviorLog} className="bg-gradient-to-br from-[#FF6584] to-pink-500 text-white font-bold text-sm shadow-[0_4px_12px_rgba(255,101,132,0.25)] transition-all duration-200 hover:-translate-y-px mt-2">
                            {isArabic ? '📊 تسجيل السلوك' : '📊 Log Entry'}
                        </Button>
                    </CardBody>
                </Card>
                <h4 className={`mb-3 text-[15px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'السجل السابق' : 'History'}</h4>
                {(!selectedPatient.behaviorLogs || selectedPatient.behaviorLogs.length === 0) ? <p className={`text-[13px] text-center p-4 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد سجلات بعد' : 'No logs yet'}</p> : (
                    [...(selectedPatient.behaviorLogs || [])].reverse().map((log, i) => {
                        const bt = behaviorTypes.find(b => b.key === log.type); return (
                            <Card key={i} className={`mb-2 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                                <CardBody className="p-3.5 flex flex-row gap-3">
                                    <Avatar 
                                        radius="xl"
                                        className="w-[42px] h-[42px] shrink-0 text-xl"
                                        src={selectedPatient.avatar?.length > 10 ? selectedPatient.avatar : undefined}
                                        icon={<span>{log.emoji}</span>}
                                        style={{ background: `${bt?.color || '#999'}12` }}
                                    />
                                    <div className="flex-1">
                                        <div className={`font-bold text-sm ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? bt?.labelAr : bt?.label} <span className={`font-normal text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>({log.intensity}/5)</span></div>
                                        <div className={`text-[13px] mt-0.5 opacity-85 ${isDark ? 'text-text-dark' : 'text-text'}`}>{log.note}</div>
                                        <div className={`text-[11px] mt-1 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(log.date).toLocaleString()}</div>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })
                )}
            </div>
        );
    };

    const renderReports = () => {
        if (!selectedPatient) return <Card className={cardCls(null)}><CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}><div className="text-[40px] mb-2">📈</div>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</CardBody></Card>;
        const logs = selectedPatient.behaviorLogs || []; const assessments = selectedPatient.assessments || [];
        return (
            <div>
                <div className={patientBanner}>
                    <Avatar 
                        size="sm"
                        radius="full"
                        src={selectedPatient.avatar?.length > 10 ? selectedPatient.avatar : undefined}
                        name={selectedPatient.avatar?.length <= 2 ? selectedPatient.avatar : undefined}
                        className="bg-accent/10 text-accent font-black"
                    />
                    <span className={`font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? `تقرير ${selectedPatient.name}` : `Report for ${selectedPatient.name}`}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[{ emoji: '📊', value: logs.length, label: isArabic ? 'سجلات سلوكية' : 'Behavior Logs', color: '#FF6584' }, { emoji: '📋', value: assessments.length, label: isArabic ? 'تقييمات مكتملة' : 'Assessments', color: accent }].map(s => (
                        <Card key={s.label} className={cardCls(null)}><CardBody className="text-center p-5 items-center justify-center"><div className="text-[28px]">{s.emoji}</div><div className="text-[28px] font-extrabold my-1.5" style={{ color: s.color }}>{s.value}</div><div className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{s.label}</div></CardBody></Card>
                    ))}
                </div>
                <Card className={cardCls('diagnosis')} onMouseEnter={() => setHoveredCard('diagnosis')} onMouseLeave={() => setHoveredCard(null)}>
                    <CardBody className="p-[22px]">
                        <h4 className={`mb-3 text-[15px] font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}><span>🏥</span> {isArabic ? 'آخر التشخيصات' : 'Latest Diagnosis'}</h4>
                        <div className={`flex justify-between items-center p-3 px-4 rounded-xl mb-2.5 border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                            <span className={`text-[13px] font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'المستوى' : 'Level'}</span>
                            <span className="bg-gradient-to-br from-accent to-[#4834D4] text-white py-1 px-3.5 rounded-lg font-bold text-xs">{selectedPatient.diagnosisLevel}</span>
                        </div>
                        <div className={`p-4 rounded-xl text-sm leading-relaxed min-h-[50px] border ${subBg} ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>
                            <strong className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'ملاحظات الطبيب:' : 'Doctor Notes:'}</strong><br />{selectedPatient.treatmentPlan || (isArabic ? 'لا توجد ملاحظات' : 'No notes')}
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    };

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            <Navbar maxWidth="lg" className={`py-1 border-b sticky top-0 z-50 backdrop-blur-xl ${isDark ? 'bg-card-dark/95 border-border-dark' : 'bg-white/95 border-border'}`} classNames={{ wrapper: 'px-6 max-w-[700px] flex justify-between' }}>
                <div className="flex items-center gap-3">
                    <Button isIconOnly size="sm" variant="bordered" className={navBtnCls} onPress={() => navigate('/choice')}>←</Button>
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => { setTempDoctorName(currentDoctor?.name || ''); setTempDoctorAvatar(currentDoctor?.avatar || '🩺'); setShowProfileModal(true); }}>
                        <Avatar 
                            size="sm"
                            src={currentDoctor?.avatar?.length > 10 ? currentDoctor?.avatar : undefined}
                            name={currentDoctor?.avatar?.length <= 2 ? currentDoctor?.avatar : undefined}
                            className="bg-accent/10 text-accent font-black border-2 border-transparent group-hover:border-accent/40 transition-all"
                        />
                        <div className="hidden sm:block">
                            <h1 className={`m-0 text-[15px] font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'بوابة الطبيب' : 'Doctor Portal'}</h1>
                            <p className={`m-0 text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{currentDoctor?.name || 'Doctor'}</p>
                        </div>
                    </div>
                </div>
                <NavbarContent justify="end" className="gap-2 shrink-0">
                    {logoutDoctor && (
                        <NavbarItem>
                            <Button isIconOnly size="sm" variant="bordered" className={navBtnCls} onPress={() => { logoutDoctor(); navigate('/choice'); }}>🚪</Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar>

            <div className={`flex gap-1 pt-4 px-6 overflow-x-auto scrollbar-hide max-w-[700px] mx-auto rounded-t-[14px] mt-4 ${isDark ? 'bg-bg-dark' : 'bg-gray-100'}`}>
                {tabsList.map(t => (
                    <button key={t.key} onClick={() => { setActiveTab(t.key); setViewingAssessment(null); setAssessmentDone(false); }}
                        className={`py-3 px-[18px] rounded-t-xl border-none whitespace-nowrap text-[13px] cursor-pointer font-[inherit] transition-all duration-200 ${activeTab === t.key ? `font-bold text-accent ${isDark ? 'bg-card-dark' : 'bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)]'}` : `font-medium bg-transparent ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}`}>
                        {t.emoji} {isArabic ? t.labelAr : t.label}
                    </button>
                ))}
            </div>

            <div className="py-5 px-4 max-w-[700px] mx-auto">
                {activeTab === 'patients' && renderPatients()}
                {activeTab === 'assessment' && renderAssessment()}
                {activeTab === 'behavior' && renderBehavior()}
                {activeTab === 'reports' && renderReports()}
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md" backdrop="blur" classNames={{ base: isDark ? 'bg-card-dark border border-border-dark' : 'bg-card border border-border', closeButton: 'hidden' }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`flex flex-col gap-1 text-center mt-2 pb-0 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                <h3 className={`m-0 text-lg font-bold`}>{isArabic ? '➕ إضافة مريض جديد' : '➕ Add New Patient'}</h3>
                            </ModalHeader>
                            <ModalBody className="pb-6">
                                <div className={`p-4 rounded-[14px] mb-4 border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                    <label className={`block text-xs mb-2 font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'كود الطفل أو رقم هاتف الوالد' : 'Child Code OR Parent Phone'}</label>
                                    <div className="flex gap-2">
                                        <Input variant="bordered" radius="lg"
                                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                            placeholder="LN-XXXXXX or 01xxxxxxx" className="flex-1"
                                            classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-accent` }} />
                                        <Button isIconOnly radius="lg" className="bg-gradient-to-br from-accent to-[#4834D4] text-white shadow-[0_2px_8px_rgba(108,99,255,0.2)] text-base" onPress={handleSearch}>🔍</Button>
                                    </div>
                                    {searchError && <div className="text-red-500 text-xs mt-2">⚠️ {searchError}</div>}
                                </div>
                                {searchResult && (
                                    <div className={`text-center mb-0 p-4 rounded-[14px] border border-accent/20 ${subBg}`} style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                                        <Avatar 
                                            radius="full"
                                            className="w-24 h-24 text-4xl mx-auto shadow-xl border-4 border-white/20"
                                            src={searchResult.avatar?.length > 10 ? searchResult.avatar : undefined}
                                            name={searchResult.avatar?.length <= 2 ? searchResult.avatar : undefined}
                                        />
                                        <div className={`font-bold text-lg mt-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>{searchResult.name}</div>
                                        <div className={`text-[13px] mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{searchResult.age} {isArabic ? 'سنوات' : 'Years'} • {searchResult.gender}</div>
                                        <Button fullWidth radius="lg" className="mt-3.5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold shadow-[0_4px_12px_rgba(16,185,129,0.25)]" onPress={handleAddPatient}>✅ {isArabic ? 'إضافة للقائمة' : 'Add to My List'}</Button>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="pt-0">
                                <Button fullWidth variant="bordered" radius="lg" className={`${isDark ? 'border-border-dark text-subtext-dark' : 'border-border text-subtext'}`} onPress={onClose}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} size="md" backdrop="blur" classNames={{ base: isDark ? 'bg-card-dark border border-border-dark' : 'bg-card border border-border' }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`flex flex-col gap-1 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                {isArabic ? 'تعديل الملف الشخصي' : 'Edit Doctor Profile'}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative group">
                                        <Avatar 
                                            className="w-24 h-24 text-4xl shadow-2xl border-4 border-white/20"
                                            src={tempDoctorAvatar?.length > 10 ? tempDoctorAvatar : undefined}
                                            name={tempDoctorAvatar?.length <= 2 ? tempDoctorAvatar : undefined}
                                        />
                                        <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                            📷
                                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                        </label>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        {['🩺', '👨‍⚕️', '👩‍⚕️', '🔬', '🏥'].map(e => (
                                            <button key={e} onClick={() => setTempDoctorAvatar(e)} className={`text-2xl p-2 rounded-xl border transition-all ${tempDoctorAvatar === e ? 'bg-accent/10 border-accent/40 scale-110' : 'border-transparent hover:bg-gray-100'}`}>
                                                {e}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-xs font-bold mb-1.5 opacity-60 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'الاسم' : 'Full Name'}</label>
                                        <Input 
                                            value={tempDoctorName}
                                            onChange={e => setTempDoctorName(e.target.value)}
                                            variant="bordered"
                                            radius="lg"
                                            classNames={{ inputWrapper: isDark ? 'bg-bg-dark border-border-dark' : 'bg-gray-50 border-gray-200' }}
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" radius="lg" onPress={onClose}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                                <Button className="bg-gradient-to-br from-accent to-indigo-600 text-white font-bold px-8 shadow-xl" radius="lg" onPress={handleSaveProfile}>
                                    {isArabic ? 'حفظ التعديلات' : 'Save Profile'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
        </div>
    );
}
