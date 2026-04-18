import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ClinicsMap from '../components/ClinicsMap';
import AutismSupportBot from '../components/AutismSupportBot';
import { defaultRoutine } from '../data/routineData';
import { Button, Card, CardBody, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem, Chip, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Progress } from '@heroui/react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild, linkedChild, currentParent, updateParentProfile, logoutParent } = useAuth();
    
    // Ensure hero object is always defined to avoid repeated null checks
    const hero = currentChild || linkedChild || { name: '', age: 0, gender: '', childId: '', routineHistory: {}, emotionHistory: {} };
    
    const { data, emotionAccuracy, routineCompletion, mostUsedWords, addDailyNote, removeDailyNote, resetAllData } = useData();

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const fileInputRef = useRef(null);

    const accent = '#6C63FF';
    const colors = { chart1: '#6C63FF', chart2: '#FF6584', chart3: '#4ECDC4', chart4: '#F59E0B' };
    const totalUsage = useMemo(() => Object.values(data?.moduleUsage || {}).reduce((a, b) => a + (Number(b) || 0), 0), [data]);
    const maxWeekly = useMemo(() => Math.max(...Object.values(data?.weeklyUsage || { Sat:0, Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0 }), 1), [data]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [editData, setEditData] = useState({ 
        name: currentParent?.name || '', 
        email: currentParent?.email || '', 
        phone: currentParent?.phone || '',
        avatar: currentParent?.avatar || '👤'
    });

    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [activeReportTab, setActiveReportTab] = useState('general');
    const [viewingAssessment, setViewingAssessment] = useState(null);

    const handleProfileUpdate = () => {
        updateParentProfile(editData);
        onClose();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddNote = () => { if (!noteText.trim()) return; addDailyNote(noteText); setNoteText(''); setShowNoteInput(false); };

    const moduleNames = isArabic ? { pecs: 'التواصل', emotions: 'المشاعر', routine: 'الروتين', calming: 'الهدوء' } : { pecs: 'PECS', emotions: 'Emotions', routine: 'Routine', calming: 'Calming' };
    const moduleEmojis = { pecs: '🗣️', emotions: '😊', routine: '📅', calming: '🧘' };

    const todayKey = new Date().toLocaleDateString('en-CA');
    const routineHistory = hero?.routineHistory || {};
    const todayTasks = routineHistory[todayKey] || {};
    const todayCompletedCount = Object.values(todayTasks).filter(v => v === true).length;
    const totalRoutineTasks = defaultRoutine?.length || 1;
    const todayRoutinePct = Math.round((todayCompletedCount / totalRoutineTasks) * 100);

    const emotionHistory = hero?.emotionHistory || {};
    const todayEmotionStats = emotionHistory[todayKey] || { correct: 0, total: 0 };
    const todayEmotionPct = todayEmotionStats.total > 0 ? Math.round((todayEmotionStats.correct / todayEmotionStats.total) * 100) : 0;

    const recommendations = [];
    if (isArabic) {
        if (data?.moduleUsage?.emotions < data?.moduleUsage?.pecs) recommendations.push('💡 حاول زيادة استخدام قسم المشاعر لتحسين التعرف على المشاعر');
        if (todayRoutinePct > 50) recommendations.push('🌟 الروتين اليومي منتظم - استمر بذلك!');
        if (data?.pecsTotalTaps > 10) recommendations.push('🎯 أداء ممتاز في التواصل! جرب كلمات جديدة');
    } else {
        if (data?.moduleUsage?.emotions < data?.moduleUsage?.pecs) recommendations.push('💡 Try using the Emotions module more to improve recognition skills');
        if (todayRoutinePct > 50) recommendations.push('🌟 Daily routine is consistent - keep it up!');
    }
    if (recommendations.length === 0) recommendations.push(isArabic ? '✨ استمر في استخدام التطبيق لرؤية توصيات مخصصة' : '✨ Keep using the app to see personalized recommendations');

    const behaviorTypes = [
        { key: 'meltdown', label: 'Meltdown', labelAr: 'نوبة انفعالية', emoji: '😤', color: '#FF6584' },
        { key: 'stimming', label: 'Stimming', labelAr: 'حركات تحفيزية', emoji: '🔄', color: '#F59E0B' },
        { key: 'aggression', label: 'Aggression', labelAr: 'عدوانية', emoji: '💢', color: '#E57373' },
        { key: 'withdrawal', label: 'Withdrawal', labelAr: 'انسحاب', emoji: '🫥', color: '#B8A9E8' },
        { key: 'sensory_overload', label: 'Sensory Overload', labelAr: 'حمل حسي زائد', emoji: '🤯', color: '#7EB6D8' },
        { key: 'positive', label: 'Positive Behavior', labelAr: 'سلوك إيجابي', emoji: '⭐', color: '#10B981' },
    ];

    const assessmentQuestions = [
        { id: 1, q: 'Does the child respond to their name?', qAr: 'هل يستجيب الطفل عند مناداته باسمه؟' },
        { id: 2, q: 'Does the child make eye contact?', qAr: 'هل يقوم الطفل بالتواصل البصري؟' },
        { id: 3, q: 'Does the child point to objects?', qAr: 'هل يشير الطفل إلى الأشياء؟' },
    ];

    // Aura Lumina Theme Tokens
    const auraBg = isDark ? 'bg-[#0E101F]' : 'bg-[#F8F9FF]';
    const auraCard = isDark ? 'bg-white/[0.04] border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'bg-white border-slate-200 shadow-xl';
    const auraAccent = '#A8B4FF';

    const SectionTitle = ({ emoji, title, badge, badgeColor }) => (
        <div className="flex justify-between items-center mb-6">
            <h3 className={`text-[18px] font-black m-0 flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                <span className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-xl shadow-inner">{emoji}</span> 
                {title}
            </h3>
            {badge && (
                <Chip size="sm" variant="flat" className="font-bold border border-white/10 px-3 py-1 h-7" style={{ background: `${badgeColor}20`, color: badgeColor }}>
                    {badge}
                </Chip>
            )}
        </div>
    );

    return (
        <div className={`min-h-screen relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] ${auraBg} transition-colors duration-1000`}>
            
            {/* AMBIENT AURA GLOWS */}
            {isDark && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-500/15 blur-[130px] animate-pulse" />
                    <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[110px]" />
                </div>
            )}

            {/* NAVBAR (Aura Glass) */}
            <Navbar maxWidth="lg" className={`py-1 border-b sticky top-0 z-50 backdrop-blur-3xl ${isDark ? 'bg-[#080912]/80 border-white/5' : 'bg-white/80 border-slate-200'}`} classNames={{ wrapper: 'px-6 max-w-[700px] flex justify-between' }}>
                <NavbarBrand className="gap-4">
                    <Button isIconOnly size="sm" variant="flat" className={`rounded-2xl ${isDark ? 'bg-white/5 text-white border border-white/10' : 'bg-slate-100 text-slate-800 border-slate-200'} border`} onPress={() => navigate('/choice')}>←</Button>
                    <div className="flex items-center gap-2">
                        <h1 className={`m-0 text-[18px] font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>{isArabic ? 'لوحة التحكم' : 'Dashboard'}</h1>
                        <Chip size="sm" variant="shadow" color="success" className="h-5 px-2 text-[10px] font-black tracking-widest uppercase shadow-emerald-500/20">{isArabic ? 'مباشر' : 'Live'}</Chip>
                    </div>
                </NavbarBrand>
                
                <NavbarContent justify="end" className="gap-2.5">
                    {currentParent && (
                        <NavbarItem>
                            <Avatar 
                                isBordered 
                                as="button"
                                color="primary"
                                className="transition-transform w-10 h-10 border-2 border-indigo-400 rotate-hover shadow-[0_0_15px_rgba(168,180,255,0.3)]"
                                src={currentParent?.avatar?.length > 10 ? currentParent.avatar : undefined}
                                icon={currentParent?.avatar?.length <= 2 ? <span className="text-xl font-bold">{currentParent?.avatar || '👤'}</span> : undefined}
                                onClick={onOpen}
                                radius="lg"
                            />
                        </NavbarItem>
                    )}
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="flat" className={`rounded-2xl ${isDark ? 'bg-white/5 text-white border-white/10' : 'bg-slate-100 text-slate-800'}`} onPress={resetAllData}>🔄</Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="flat" color="danger" className="rounded-2xl" onPress={() => { logoutParent(); navigate('/choice'); }}>🚪</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {/* PROFILE MODAL (Aura Lumina Edition) */}
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                backdrop="blur" 
                size="md"
                classNames={{
                    base: `border ${isDark ? 'bg-[#0C0D17]/90 border-white/10' : 'bg-white border-slate-200'} backdrop-blur-3xl rounded-[40px] shadow-2xl`,
                    header: "border-b border-white/5 pb-0",
                    body: "py-8",
                    footer: "border-t border-white/5 pt-4",
                    closeButton: "hover:bg-white/10 active:bg-white/20 transition-colors p-2 text-white",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 items-center">
                                <div className="relative group cursor-pointer mt-6" onClick={() => fileInputRef.current.click()}>
                                    <div className="w-28 h-28 rounded-[40px] border-4 border-indigo-500/30 overflow-hidden shadow-[0_0_30px_rgba(168,180,255,0.2)] group-hover:scale-105 transition-transform duration-500">
                                        <Avatar 
                                            className="w-full h-full text-4xl"
                                            src={editData.avatar?.length > 10 ? editData.avatar : undefined}
                                            icon={editData.avatar?.length <= 2 ? <span className="text-4xl font-black">{editData.avatar}</span> : undefined}
                                            radius="none"
                                        />
                                        <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-black text-xs tracking-widest uppercase">{isArabic ? 'تعديل' : 'Modify'}</span>
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>
                                <h2 className={`mt-6 text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>{isArabic ? 'بيانات ولي الأمر' : 'Parent Mastery'}</h2>
                                <p className={`text-[10px] items-center gap-2 mb-6 uppercase font-black tracking-[0.3em] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                    {isArabic ? 'إدارة الهوية الرقمية' : 'Identity Management'}
                                </p>
                            </ModalHeader>
                            <ModalBody className="space-y-6 px-10">
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-300/50' : 'text-slate-500'}`}>{isArabic ? 'الاسم الكامل' : 'Full Name'}</label>
                                    <Input 
                                        variant="flat" 
                                        radius="2xl" 
                                        size="lg"
                                        value={editData.name}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        classNames={{
                                            input: "font-bold text-base",
                                            inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5" : "bg-slate-100 border-slate-200"
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-300/50' : 'text-slate-500'}`}>{isArabic ? 'البريد الإلكتروني' : 'Email Protocol'}</label>
                                    <Input 
                                        variant="flat" 
                                        radius="2xl" 
                                        size="lg"
                                        value={editData.email}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                        classNames={{
                                            input: "font-bold text-base",
                                            inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5" : "bg-slate-100 border-slate-200"
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-300/50' : 'text-slate-500'}`}>{isArabic ? 'قناة التواصل' : 'Comms Channel'}</label>
                                    <Input 
                                        variant="flat" 
                                        radius="2xl" 
                                        size="lg"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                        classNames={{
                                            input: "font-bold text-base",
                                            inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5" : "bg-slate-100 border-slate-200"
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter className="flex gap-4 pb-10 px-10">
                                <Button variant="flat" radius="full" className={`font-black tracking-widest uppercase text-[12px] h-14 flex-1 ${isDark ? 'text-white/40 border border-white/5' : 'text-slate-500 bg-slate-100'}`} onPress={onClose}>
                                    {isArabic ? 'تجاهل' : 'Discard'}
                                </Button>
                                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black h-14 flex-[1.5] rounded-full shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:scale-[1.02] transition-transform" onPress={handleProfileUpdate}>
                                    {isArabic ? 'مزامنة التغييرات' : 'Sync Changes'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* MAIN CONTENT */}
            <main className="relative z-10 max-w-[700px] mx-auto px-6 py-8 pb-32 space-y-10">
                
                {/* CHILD SUMMARY HEADER (Aura Signature Hero) */}
                <div className={`relative px-8 py-10 rounded-[50px] border overflow-hidden transition-all duration-700 ${isDark ? 'bg-gradient-to-br from-indigo-950/40 via-[#080912] to-purple-950/40 border-white/10' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-200'} shadow-2xl group`}>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-7 relative z-[1]">
                        <div className="w-[110px] h-[110px] rounded-[42px] bg-white/10 flex items-center justify-center backdrop-blur-3xl border-2 border-white/20 overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                            {hero?.avatar && hero.avatar.length > 10 ? (
                                <img src={hero.avatar} className="w-full h-full object-cover" alt={hero?.name} />
                            ) : (
                                <span className="text-5xl leading-none select-none">{hero?.avatar || '👦'}</span>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        </div>
                        <div className="flex-1 text-center md:text-start space-y-3">
                             <div className="flex items-center justify-center md:justify-start gap-3">
                                <h2 className="m-0 text-white text-3xl font-black tracking-tighter leading-none">{hero?.name || (isArabic ? 'بطلنا الصغير' : 'Little Hero')}</h2>
                                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-black text-white/90 uppercase tracking-widest border border-white/5">{hero?.gender || '...'}</span>
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-black text-white/90 uppercase tracking-widest border border-white/5">{hero?.age || '0'} {isArabic ? 'سنوات' : 'Years'}</span>
                                <span className="px-4 py-1.5 rounded-full bg-indigo-500/30 backdrop-blur-md text-[11px] font-black text-white uppercase tracking-widest border border-indigo-400/20">#{hero?.childId || '000'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center px-8 py-5 rounded-[35px] bg-white/5 border border-white/10 backdrop-blur-xl group-hover:bg-white/10 transition-colors">
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 mb-1.5">{isArabic ? 'التقدم اليومي' : 'Daily Flow'}</span>
                            <span className="text-3xl font-black text-white">{(todayRoutinePct + todayEmotionPct) / 2}%</span>
                        </div>
                    </div>
                </div>

                {/* MEDICAL REPORT (Aura Professional Portal) */}
                <Card className={`rounded-[50px] border relative overflow-hidden group ${auraCard}`}>
                    <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-[40px] -ml-12 -mt-12" />
                    <CardBody className="p-10">
                        <SectionTitle emoji="🩺" title={isArabic ? 'التقرير الطبي' : 'Clinical Overview'} />
                        
                        {/* Aura Tabs */}
                        <div className="flex gap-2 mb-8 p-1.5 rounded-[28px] bg-white/5 border border-white/5">
                            {[
                                { key: 'general', label: isArabic ? 'نظرة عامة' : 'General', emoji: '📋' },
                                { key: 'assessments', label: isArabic ? 'التقييمات' : 'Assessments', emoji: '📝' },
                                { key: 'behavior', label: isArabic ? 'السلوك' : 'Behavior', emoji: '⚡' }
                            ].map(tab => (
                                <Button 
                                    key={tab.key} 
                                    onPress={() => { setActiveReportTab(tab.key); setViewingAssessment(null); }}
                                    className={`flex-1 h-12 rounded-[22px] font-black text-[13px] transition-all duration-500 ${activeReportTab === tab.key ? 'bg-indigo-500 text-white shadow-lg' : isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <span className="me-2">{tab.emoji}</span>
                                    {tab.label}
                                </Button>
                            ))}
                        </div>

                        {activeReportTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex justify-between items-center p-6 rounded-[32px] bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">{isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</p>
                                        <p className="text-xl font-black text-white m-0">{hero?.diagnosisLevel || '...'}</p>
                                    </div>
                                    <Chip className="bg-indigo-500 text-white font-black px-4 h-10 rounded-2xl shadow-lg">Level {(!hero?.diagnosisLevel || hero.diagnosisLevel === "Not Set") ? "1" : hero.diagnosisLevel.slice(-1)}</Chip>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2">{isArabic ? 'خطة العلاج' : 'Treatment Protocol'}</p>
                                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 min-h-[120px] text-lg font-bold leading-relaxed text-indigo-100/80 italic">
                                        " {hero?.treatmentPlan || (isArabic ? 'بانتظار ملاحظات الطبيب...' : 'Pending specialist notes...')} "
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeReportTab === 'assessments' && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                {viewingAssessment ? (
                                    <div className="space-y-6">
                                        <Button variant="flat" size="sm" radius="full" className="text-indigo-300 font-black p-0 min-w-10 h-10 text-xl" onPress={() => setViewingAssessment(null)}>←</Button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-8 rounded-[40px] bg-indigo-500/20 border border-indigo-400/20 text-center">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{isArabic ? 'النتيجة' : 'Score'}</p>
                                                <p className="text-5xl font-black text-white">{viewingAssessment.score}%</p>
                                            </div>
                                            <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 text-center flex flex-col justify-center">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{isArabic ? 'التاريخ' : 'Date'}</p>
                                                <p className="text-lg font-black text-white">{new Date(viewingAssessment.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {(!currentChild?.assessments || currentChild?.assessments?.length === 0) ? (
                                            <p className="text-center py-10 text-white/20 font-black italic">{isArabic ? 'لم يتم إجراء تقييمات' : 'No assessments logged'}</p>
                                        ) : ([...(currentChild?.assessments || [])].reverse().map((ass, idx) => (
                                            <div key={idx} onClick={() => setViewingAssessment(ass)} className="flex items-center gap-5 p-6 rounded-[35px] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-400/40 cursor-pointer transition-all duration-500">
                                                <div className="w-16 h-16 rounded-[24px] bg-indigo-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-xl font-black text-white">{ass.score}%</div>
                                                <div className="flex-1">
                                                    <p className="text-lg font-black text-white m-0">{isArabic ? 'تقييم شامل' : 'Clinical Assessment'}</p>
                                                    <p className="text-xs text-white/30 font-bold m-0">{new Date(ass.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-indigo-400 text-2xl font-black opacity-0 group-hover:opacity-100 transition-opacity">→</div>
                                            </div>
                                        )))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeReportTab === 'behavior' && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                {(!currentChild?.behaviorLogs || (currentChild?.behaviorLogs?.length || 0) === 0) ? (
                                    <p className="text-center py-10 text-white/20 font-black italic">{isArabic ? 'السجل نظيف' : 'Behavior logs are clear'}</p>
                                ) : (Array.isArray(currentChild?.behaviorLogs) ? [...currentChild.behaviorLogs].reverse().map((log, idx) => {
                                    const bt = behaviorTypes.find(b => b.key === log.type);
                                    return (
                                        <div key={idx} className="p-6 rounded-[40px] border border-white/5 bg-white/5 group-hover:bg-white/10 transition-colors flex gap-6">
                                            <div className="w-14 h-14 rounded-[22px] flex items-center justify-center text-3xl shadow-inner" style={{ background: `${bt?.color || '#999'}20` }}>{bt?.emoji || '📋'}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-base font-black text-white m-0">{isArabic ? bt?.labelAr : bt?.label}</p>
                                                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest">{log.intensity}/5 Intensity</span>
                                                </div>
                                                <p className="text-base text-indigo-100/60 font-medium m-0 leading-relaxed">{log.note}</p>
                                                <p className="text-[10px] text-white/20 font-black mt-2 uppercase tracking-widest">{new Date(log.date).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    );
                                }) : null)}
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* PROGRESS GRID (Luminescent Rings) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className={`rounded-[45px] border ${auraCard}`}>
                        <CardBody className="p-8">
                            <SectionTitle emoji="🕒" title={isArabic ? 'الروتين اليومي' : 'Daily Rhythm'} badge={todayKey} badgeColor="#4ECDC4" />
                            <div className="flex items-center gap-7">
                                <div className="relative w-28 h-28 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(78,205,196,0.2)]">
                                        <circle cx="56" cy="56" r="48" fill="transparent" stroke={isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'} strokeWidth="10" />
                                        <circle cx="56" cy="56" r="48" fill="transparent" stroke="#4ECDC4" strokeWidth="10" 
                                            strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * todayRoutinePct) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                    </svg>
                                    <span className={`absolute text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{todayRoutinePct}%</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className={`text-[12px] font-black uppercase tracking-widest m-0 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{isArabic ? 'المهام اليومية' : 'Daily Tasks'}</p>
                                    <p className={`text-4xl font-black m-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>{todayCompletedCount}<span className="text-lg opacity-30 mx-1">/</span>{totalRoutineTasks}</p>
                                    <Progress value={todayRoutinePct} size="sm" color="success" className="mt-2" classNames={{ indicator: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]' }} />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className={`rounded-[45px] border ${auraCard}`}>
                        <CardBody className="p-8">
                            <SectionTitle emoji="🎭" title={isArabic ? 'نمو المشاعر' : 'Emotion Mastery'} badge={isArabic ? 'أسبوعي' : 'Weekly'} badgeColor="#FF6584" />
                            <div className="flex items-center gap-7">
                                <div className="relative w-28 h-28 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(255,101,132,0.2)]">
                                        <circle cx="56" cy="56" r="48" fill="transparent" stroke={isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'} strokeWidth="10" />
                                        <circle cx="56" cy="56" r="48" fill="transparent" stroke="#FF6584" strokeWidth="10" 
                                            strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * todayEmotionPct) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                    </svg>
                                    <span className={`absolute text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{todayEmotionPct}%</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className={`text-[12px] font-black uppercase tracking-widest m-0 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{isArabic ? 'نسبة الدقة' : 'Recognition'}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-emerald-400 font-black text-xl">✓ {todayEmotionStats.correct}</span>
                                        <span className="text-rose-500 font-black text-xl">✕ {todayEmotionStats.total - todayEmotionStats.correct}</span>
                                    </div>
                                    <p className={`text-[10px] mt-2 font-black ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{isArabic ? 'مجموع الجلسات' : 'Total Sessions'} : {todayEmotionStats.total}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* MODULE USAGE (Aura Mosaic) */}
                <div className="space-y-6">
                    <SectionTitle emoji="📊" title={isArabic ? 'تحليل الأداء' : 'Module Focus'} badge={isArabic ? 'شامل' : 'Overall'} badgeColor={auraAccent} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(data?.moduleUsage || {}).map(([mod, count]) => (
                            <Card key={mod} className={`group rounded-[38px] border ${auraCard} hover:border-[#A8B4FF]/40 transition-all duration-500`}>
                                <CardBody className="p-7 text-center">
                                    <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/5 mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-inner">
                                        {moduleEmojis[mod]}
                                    </div>
                                    <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{moduleNames[mod]}</div>
                                    <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{count}</div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* SMART RECOMMENDATIONS (Aura Floating Tips) */}
                <Card className={`rounded-[50px] border shadow-2xl relative overflow-hidden ${isDark ? 'bg-indigo-500/5 border-indigo-400/20' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 rounded-full blur-[50px] -mr-12 -mt-12" />
                    <CardBody className="p-10">
                        <SectionTitle emoji="💡" title={isArabic ? 'توصيات ذكية' : 'Assistant Insights'} />
                        <div className="space-y-4">
                            {recommendations.map((rec, i) => (
                                <div key={i} className={`flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-indigo-100 shadow-sm'}`}>
                                    <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_12px_#A8B4FF]" />
                                    <p className={`text-base font-black m-0 leading-relaxed ${isDark ? 'text-indigo-100/90' : 'text-indigo-900'}`}>{rec}</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* DAILY NOTES (Sanctuary Journal) */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <SectionTitle emoji="📝" title={isArabic ? 'سجل السلوك' : 'Sanctuary Journal'} />
                        <Button size="md" radius="full" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-8 shadow-[0_10px_25px_rgba(99,102,241,0.4)]" onPress={() => setShowNoteInput(!showNoteInput)}>
                            {isArabic ? '+ تدوين ملاحظة' : '+ New Entry'}
                        </Button>
                    </div>

                    {showNoteInput && (
                        <Card className={`rounded-[45px] border animate-in slide-in-from-top-4 duration-500 ${auraCard}`}>
                            <CardBody className="p-8">
                                <Textarea variant="flat" placeholder={isArabic ? 'كيف كان يوم بطلك؟ شاركنا ملاحظاتك...' : 'Record today\'s observations or milestones...'}
                                    value={noteText} onChange={e => setNoteText(e.target.value)} size="lg" radius="3xl" 
                                    className="text-lg font-bold" classNames={{ input: isDark ? 'text-white' : 'text-slate-800', inputWrapper: 'bg-white/5 group-data-[focus=true]:bg-white/10 border-white/5' }} />
                                <div className="flex justify-end gap-4 mt-5">
                                    <Button variant="flat" radius="full" className={`font-black tracking-widest uppercase text-[12px] border border-white/10 ${isDark ? 'text-white/60' : 'text-slate-500'}`} onPress={() => setShowNoteInput(false)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                                    <Button className="bg-white text-[#080912] font-black px-10 rounded-full shadow-xl" onPress={handleAddNote}>{isArabic ? 'حفظ' : 'Save'}</Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    <div className="space-y-5">
                        {data?.dailyNotes && data.dailyNotes.length > 0 ? (
                            [...data.dailyNotes].reverse().map((note, idx) => (
                                <Card key={idx} className={`rounded-[40px] border group transition-all duration-500 hover:border-white/20 ${auraCard}`}>
                                    <CardBody className="p-8">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-lg">✍️</div>
                                                <span className={`text-[11px] uppercase font-black tracking-[0.2em] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                                    {note.date || new Date().toLocaleDateString()}
                                                </span>
                                            </div>
                                            <Button isIconOnly size="sm" variant="light" radius="full" className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500" onPress={() => removeDailyNote(data.dailyNotes.length - 1 - idx)}>🗑️</Button>
                                        </div>
                                        <p className={`text-[17px] font-black m-0 leading-relaxed ${isDark ? 'text-indigo-100/90' : 'text-slate-700'}`}>{note.note}</p>
                                    </CardBody>
                                </Card>
                            ))
                        ) : (
                                <div className={`text-center py-16 border-2 border-dashed rounded-[50px] ${isDark ? 'border-white/5 text-white/10' : 'border-slate-200 text-slate-300'}`}>
                                <div className="text-5xl mb-4 opacity-20">📭</div>
                                <p className="font-black text-xl tracking-tighter">{isArabic ? 'السجل فارغ اليوم' : 'The journal is quiet today'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI ASSISTANT Preview (Aura Bot) */}
                <div className="space-y-6">
                    <SectionTitle emoji="🤖" title={isArabic ? 'المساعد الذكي' : 'Assistant Aura'} badge="Online" badgeColor="#10B981" />
                    <Card className={`rounded-[50px] border overflow-hidden ${auraCard}`}>
                        <AutismSupportBot mode="parent" />
                    </Card>
                </div>

                {/* CLINICS MAP Preview */}
                <div className="space-y-6">
                    <SectionTitle emoji="📍" title={isArabic ? 'العيادات القريبة' : 'Support Circles'} />
                    <Card className={`rounded-[50px] border ${auraCard}`}>
                        <ClinicsMap />
                    </Card>
                </div>

            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                .shadow-glow { box-shadow: 0 4px 20px rgba(168, 180, 255, 0.4); }
                .rotate-hover:hover { transform: rotate(8deg); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
