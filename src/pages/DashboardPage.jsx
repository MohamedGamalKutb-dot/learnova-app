import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import ClinicsMap from '../components/ClinicsMap';
import AutismSupportBot from '../components/AutismSupportBot';
import MainNavbar from '../components/MainNavbar';
import SanctuaryJournalTab from '../components/dashboard/SanctuaryJournalTab';
import ModuleFocusTab from '../components/dashboard/ModuleFocusTab';
import ClinicalOverviewTab from '../components/dashboard/ClinicalOverviewTab';
import AssistantAuraTab from '../components/dashboard/AssistantAuraTab';
import SupportCirclesTab from '../components/dashboard/SupportCirclesTab';
import { defaultRoutine } from '../data/routineData';
import { getDashboardData } from '../data/dashboardData';
import { Button, Card, CardBody, Input, Chip, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Progress } from '@heroui/react';
import { FaChartLine, FaBookOpen, FaRobot, FaStethoscope, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    
    const { 
        currentChild, 
        linkedChild, 
        currentParent, 
        childAccounts, 
        parentActiveChildId, 
        setParentActiveChildId, 
        addChildToParent, 
        removeChildFromParent,
        logoutParent 
    } = useAuth();

    const [showAddChildModal, setShowAddChildModal] = useState(false);
    const [newChildId, setNewChildId] = useState('');

    const normalizeId = (id) => id ? id.toUpperCase().trim() : '';

    const parentChildren = useMemo(() => {
        return childAccounts.filter(c => 
            (currentParent?.childIds || []).includes(c.childId) || 
            normalizeId(c.childId) === normalizeId(currentParent?.childId)
        );
    }, [childAccounts, currentParent]);

    const handleLinkChild = () => {
        if (!newChildId.trim()) return;
        const res = addChildToParent(newChildId.trim());
        if (res.success) {
            toast.success(isArabic ? `تم ربط الطفل ${res.childName} بنجاح!` : `Successfully linked child ${res.childName}!`);
            setNewChildId('');
            setShowAddChildModal(false);
        } else {
            if (res.error === 'child_not_found') {
                toast.error(isArabic ? 'كود الطفل غير صحيح أو غير موجود' : 'Child code not found');
            } else if (res.error === 'already_exists') {
                toast.error(isArabic ? 'هذا الطفل مرتبط بالفعل بحسابك' : 'This child is already linked to your account');
            } else {
                toast.error(isArabic ? 'حدث خطأ ما' : 'An error occurred');
            }
        }
    };

    // Ensure hero object is always defined to avoid repeated null checks
    const hero = linkedChild || currentChild || { name: '', age: 0, gender: '', childId: '', routineHistory: {}, emotionHistory: {} };

    const { data, emotionAccuracy, routineCompletion, mostUsedWords, addDailyNote, removeDailyNote, resetAllData } = useData();

    const accent = '#6C63FF';
    const colors = { chart1: '#6C63FF', chart2: '#FF6584', chart3: '#4ECDC4', chart4: '#F59E0B' };
    const totalUsage = useMemo(() => Object.values(data?.moduleUsage || {}).reduce((a, b) => a + (Number(b) || 0), 0), [data]);
    const maxWeekly = useMemo(() => Math.max(...Object.values(data?.weeklyUsage || { Sat: 0, Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 }), 1), [data]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);
    const [activeReportTab, setActiveReportTab] = useState('general');
    const [viewingAssessment, setViewingAssessment] = useState(null);

    const { tab } = useParams();
    const activeSidebarTab = (tab || 'sanctuary-journal').replace('-', '_');

    const sidebarTabs = [
        { key: 'sanctuary_journal', label: isArabic ? 'اليوميات' : 'Sanctuary Journal', icon: <FaBookOpen /> },
        { key: 'module_focus', label: isArabic ? 'تحليل الأداء' : 'Module Focus', icon: <FaChartLine /> },
        { key: 'assistant_aura', label: isArabic ? 'المساعد الذكي' : 'Assistant Aura', icon: <FaRobot /> },
        { key: 'clinical_overview', label: isArabic ? 'النظرة الطبية' : 'Clinical Overview', icon: <FaStethoscope /> },
        { key: 'support_circles', label: isArabic ? 'دوائر الدعم' : 'Support Circles', icon: <FaMapMarkerAlt className="text-blue-600" /> }
    ];

    const handleAddNote = () => { if (!noteText.trim()) return; addDailyNote(noteText); setNoteText(''); setShowNoteInput(false); };

    const { moduleNames, moduleEmojis, behaviorTypes } = getDashboardData(isArabic);

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

    // Aura Lumina Theme Tokens
    const auraBg = isDark ? 'bg-[#0E101F]' : 'bg-[#F8F9FF]';
    const auraCard = isDark ? 'bg-white/[0.04] border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'bg-white border-slate-200 shadow-xl';
    const auraAccent = '#A8B4FF';

    const SectionTitle = ({ icon, emoji, title, badge, badgeColor }) => (
        <div className="flex justify-between items-center mb-6">
            <h3 className={`text-[18px] font-black m-0 flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                <span className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-xl shadow-inner overflow-hidden">
                    {icon ? (typeof icon === 'string' ? <img src={icon} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/> : icon) : emoji}
                </span>
                {title}
            </h3>
            {badge && (
                <Chip size="sm" variant="flat" className="font-bold border border-white/10 px-3 py-1 h-7" style={{ background: `${badgeColor}20`, color: badgeColor }}>
                    {badge}
                </Chip>
            )}
        </div>
    );

    // If the parent has no children yet, show the premium fallback screen
    if (parentChildren.length === 0) {
        return (
            <div className={`min-h-screen relative ${isArabic ? 'font-[Cairo,sans-serif]' : "font-['Plus_Jakarta_Sans',sans-serif]"} ${auraBg} transition-colors duration-1000`} dir={isArabic ? 'rtl' : 'ltr'}>
                {isDark && (
                    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-500/15 blur-[130px] animate-pulse" />
                        <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[110px]" />
                    </div>
                )}
                <MainNavbar userType="parent" />
                <div className="flex relative pt-[72px] justify-center items-center h-[calc(100vh-72px)] px-4">
                    <div className={`w-full max-w-[480px] p-8 rounded-3xl border text-center ${auraCard}`} style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                        <div className="text-6xl mb-4">👶</div>
                        <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                            {isArabic ? 'أهلاً بك في لوحة تحكم ولي الأمر!' : 'Welcome to the Parent Dashboard!'}
                        </h2>
                        <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isArabic ? 'للبدء في متابعة طفلك وتحليل أدائه، يرجى ربط حسابه عن طريق إدخال كود الطفل المتاح في الملف الشخصي للطفل.' : "To start monitoring your child's progress and reports, please link their account by entering their unique child code found in their profile."}
                        </p>
                        
                        <div className={`p-4 rounded-2xl mb-4 border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                            <label className={`block text-xs mb-2 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isArabic ? 'كود الطفل (LN-XXXXXX)' : 'Child Code (LN-XXXXXX)'}
                            </label>
                            <div className="flex gap-2">
                                <Input variant="bordered" radius="lg"
                                    value={newChildId} onChange={e => setNewChildId(e.target.value.toUpperCase())}
                                    placeholder="LN-XXXXXX" className="flex-1"
                                    classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-white border-slate-200'} focus-within:!border-indigo-500` }} />
                                <Button className="bg-indigo-600 text-white font-bold radius-lg" onPress={handleLinkChild}>
                                    {isArabic ? 'ربط' : 'Link'}
                                </Button>
                            </div>
                        </div>
                        
                        <Button fullWidth variant="bordered" className={`mt-2 ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-700'}`} onPress={logoutParent}>
                            {isArabic ? 'تسجيل الخروج' : 'Logout'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen relative ${isArabic ? 'font-[Cairo,sans-serif]' : "font-['Plus_Jakarta_Sans',sans-serif]"} ${auraBg} transition-colors duration-1000`} dir={isArabic ? 'rtl' : 'ltr'}>

            {/* AMBIENT AURA GLOWS */}
            {isDark && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-500/15 blur-[130px] animate-pulse" />
                    <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[110px]" />
                </div>
            )}

            <MainNavbar userType="parent" />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[39] bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`fixed top-[84px] left-3 z-[45] md:hidden w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-600 text-white'}`}
            >
                {sidebarOpen ? <span className="text-base">✕</span> : <span className="text-base">☰</span>}
            </button>

            {/* MAIN CONTENT WITH SIDEBAR */}
            <div className="flex relative pt-[72px]">
                <main className={`flex-1 relative z-10 w-full md:pl-[250px] lg:pl-[270px] px-4 sm:px-6 py-8 pb-32 max-w-full overflow-x-hidden`}>
                    <div className="space-y-6 sm:space-y-10 mx-2 sm:mx-4 md:mx-6">

                    {activeSidebarTab === 'sanctuary_journal' && (
                        <SanctuaryJournalTab
                            isArabic={isArabic} isDark={isDark} auraCard={auraCard} SectionTitle={SectionTitle}
                            hero={hero} todayRoutinePct={todayRoutinePct} todayEmotionPct={todayEmotionPct}
                            showNoteInput={showNoteInput} setShowNoteInput={setShowNoteInput}
                            noteText={noteText} setNoteText={setNoteText}
                            handleAddNote={handleAddNote} removeDailyNote={removeDailyNote} data={data}
                        />
                    )}

                    {activeSidebarTab === 'clinical_overview' && (
                        <ClinicalOverviewTab
                            isArabic={isArabic} isDark={isDark} auraCard={auraCard} SectionTitle={SectionTitle}
                            activeReportTab={activeReportTab} setActiveReportTab={setActiveReportTab}
                            viewingAssessment={viewingAssessment} setViewingAssessment={setViewingAssessment}
                            hero={hero} currentChild={currentChild} behaviorTypes={behaviorTypes}
                        />
                    )}

                    {activeSidebarTab === 'module_focus' && (
                        <ModuleFocusTab
                            isArabic={isArabic} isDark={isDark} auraCard={auraCard} auraAccent={auraAccent} SectionTitle={SectionTitle}
                            todayKey={todayKey} todayRoutinePct={todayRoutinePct} todayCompletedCount={todayCompletedCount} totalRoutineTasks={totalRoutineTasks}
                            todayEmotionPct={todayEmotionPct} todayEmotionStats={todayEmotionStats}
                            data={data} moduleNames={moduleNames} moduleEmojis={moduleEmojis} recommendations={recommendations}
                        />
                    )}

                    {activeSidebarTab === 'assistant_aura' && (
                        <AssistantAuraTab
                            isArabic={isArabic} auraCard={auraCard} SectionTitle={SectionTitle}
                        />
                    )}

                    {activeSidebarTab === 'support_circles' && (
                        <SupportCirclesTab
                            isArabic={isArabic} auraCard={auraCard} SectionTitle={SectionTitle}
                        />
                    )}

                    </div>
                </main>

                <aside className={`fixed left-0 top-[72px] bottom-0 w-[270px] flex flex-col py-6 z-40 border-r transition-transform duration-300 ${isDark ? 'bg-[#080912]/98 border-white/10' : 'bg-white/98 border-slate-200'} backdrop-blur-2xl overflow-y-auto scrollbar-hide shadow-[10px_0_30px_rgba(0,0,0,0.08)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

                    {/* Profile Header in Sidebar (matching the image) - Made Clickable to open settings/profile */}
                    <div 
                        onClick={() => navigate('/parent-dashboard/profile')}
                        className={`px-8 mb-6 pb-6 border-b cursor-pointer group transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform">
                                {currentParent?.avatar && currentParent.avatar.length > 10 ? (
                                    <img src={currentParent.avatar} className="w-full h-full object-cover" alt=""  loading="lazy" decoding="async"/>
                                ) : (
                                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-xl">👨</div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h3 className={`font-bold text-[15px] leading-tight mb-0.5 ${isDark ? 'text-indigo-400' : 'text-[#2B52D0]'}`}>
                                    {currentParent?.name || (isArabic ? 'ولي الأمر' : 'Parent')}
                                </h3>
                                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {isArabic ? 'تعديل البيانات' : 'Edit Profile'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Children List & Add Button */}
                    <div className="px-6 mb-6 pb-6 border-b">
                        <div className="flex justify-between items-center mb-3.5">
                            <span className={`text-[12px] font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isArabic ? 'أطفالي المتابعون' : 'My Children'}
                            </span>
                            <Button size="sm" isIconOnly variant="light" radius="full" 
                                className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 w-7 h-7 min-w-0"
                                onPress={() => setShowAddChildModal(true)}>
                                +
                            </Button>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {parentChildren.map(c => {
                                const isActive = c.childId === hero.childId;
                                return (
                                    <div 
                                        key={c.childId}
                                        onClick={() => setParentActiveChildId(c.childId)}
                                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-all duration-300 ${isActive ? (isDark ? 'bg-indigo-500/10 border-indigo-500/35 text-white' : 'bg-indigo-50 border-indigo-200 text-[#2B52D0]') : (isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-400' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600')}`}
                                    >
                                        <div className="text-2xl">{c.avatar || '👶'}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[13px] truncate">{c.name}</div>
                                            <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{c.childId}</div>
                                        </div>
                                        {isActive && <div className="text-emerald-500 text-sm">●</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-1 w-full">
                        {sidebarTabs.map(tab => {
                            const isActive = activeSidebarTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => navigate(`/parent-dashboard/${tab.key.replace('_', '-')}`)}
                                    className={`flex items-center gap-4 px-8 py-4 w-full transition-all duration-300 relative ${isActive ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[#F2F6FE] text-[#2B52D0]') : (isDark ? 'text-slate-400 hover:bg-white/5' : 'text-[#6B7280] hover:bg-slate-50')} group`}
                                >
                                    {/* Active Right Border (like the image) */}
                                    {isActive && (
                                        <div className={`absolute right-0 top-0 bottom-0 w-1.5 rounded-l-lg ${isDark ? 'bg-indigo-500' : 'bg-[#2B52D0]'}`} />
                                    )}

                                    <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'scale-110 drop-shadow-md' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                                        {typeof tab.icon === 'string' ? <img src={tab.icon} alt="" className="w-full h-full object-contain"  loading="lazy" decoding="async"/> : <span className="text-xl">{tab.icon}</span>}
                                    </div>
                                    <span className={`text-[14px] font-semibold tracking-wide ${isArabic ? 'text-right flex-1' : 'text-left flex-1'}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>

            {/* Modal for linking a new child */}
            <Modal isOpen={showAddChildModal} onClose={() => setShowAddChildModal(false)} size="md" backdrop="blur" classNames={{ base: isDark ? 'bg-[#0E101F] border border-white/10' : 'bg-white border border-slate-200', closeButton: 'hidden' }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`flex flex-col gap-1 text-center mt-2 pb-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <h3 className="m-0 text-lg font-bold">
                                    {isArabic ? 'ربط طفل جديد' : 'Link a New Child'}
                                </h3>
                            </ModalHeader>
                            <ModalBody className="pb-6">
                                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {isArabic ? 'أدخل كود الطفل المتاح في ملف الطفل الشخصي لربطه بحسابك ومتابعة تقدمه.' : "Enter the child code from the child's profile to link them and start monitoring."}
                                </p>
                                <div className={`p-4 rounded-[14px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                    <label className={`block text-xs mb-2 font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{isArabic ? 'كود الطفل' : 'Child Code'}</label>
                                    <div className="flex gap-2">
                                        <Input variant="bordered" radius="lg"
                                            value={newChildId} onChange={e => setNewChildId(e.target.value.toUpperCase())}
                                            placeholder="LN-XXXXXX" className="flex-1"
                                            classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-indigo-500` }} />
                                        <Button className="bg-indigo-600 text-white font-bold" radius="lg" onPress={handleLinkChild}>
                                            {isArabic ? 'ربط' : 'Link'}
                                        </Button>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="pt-0">
                                <Button fullWidth variant="bordered" radius="lg" className={`${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'}`} onPress={onClose}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                .shadow-glow { box-shadow: 0 4px 20px rgba(168, 180, 255, 0.4); }
                .rotate-hover:hover { transform: rotate(8deg); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
