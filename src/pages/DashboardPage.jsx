import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
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
        { key: 'sanctuary_journal', label: isArabic ? 'اليوميات' : 'Sanctuary Journal', icon: '/icons/sanctuary_journal.png' },
        { key: 'module_focus', label: isArabic ? 'تحليل الأداء' : 'Module Focus', icon: '/icons/quiz_stats.png' },
        { key: 'assistant_aura', label: isArabic ? 'المساعد الذكي' : 'Assistant Aura', icon: '/icons/assistant_aura.png' },
        { key: 'clinical_overview', label: isArabic ? 'النظرة الطبية' : 'Clinical Overview', icon: '/icons/doctor_consultation.png' },
        { key: 'support_circles', label: isArabic ? 'دوائر الدعم' : 'Support Circles', icon: '/icons/support_circles.png' }
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
                    {icon ? <img src={icon} alt="" className="w-full h-full object-cover" /> : emoji}
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

            {/* MAIN CONTENT WITH SIDEBAR */}
            <div className="flex relative pt-[72px]">
                <main className={`flex-1 relative z-10 max-w-[1000px] mx-auto pl-[250px] md:pl-[270px] pr-6 py-8 pb-32 space-y-10`}>

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

                </main>

                <aside className={`fixed left-0 top-[72px] bottom-0 w-[250px] md:w-[270px] flex flex-col py-6 z-40 border-r ${isDark ? 'bg-[#080912]/95 border-white/10' : 'bg-white/95 border-slate-200'} backdrop-blur-2xl overflow-y-auto scrollbar-hide shadow-[10px_0_30px_rgba(0,0,0,0.02)]`}>

                    {/* Profile Header in Sidebar (matching the image) - Made Clickable to open settings/profile */}
                    <div 
                        onClick={() => navigate('/parent-dashboard/profile')}
                        className={`px-8 mb-8 pb-8 border-b cursor-pointer group transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform">
                                {currentParent?.avatar && currentParent.avatar.length > 10 ? (
                                    <img src={currentParent.avatar} className="w-full h-full object-cover" alt="" />
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
                                        <img src={tab.icon} alt="" className="w-full h-full object-contain" />
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
