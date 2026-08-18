import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../shared/context/AppContext';
import { useData } from '../../shared/context/DataContext';
import { useAuth } from '../../shared/context/AuthContext';
import { toast } from 'react-hot-toast';
import MainNavbar from '../../shared/components/MainNavbar';
import { useGlobalData } from '../../shared/context/GlobalDataContext';
import { Chip, Spinner } from '@heroui/react';
import { FaChartLine, FaBookOpen, FaRobot, FaStethoscope, FaMapMarkerAlt } from 'react-icons/fa';

import SanctuaryJournalTab from './components/SanctuaryJournalTab';
import ModuleFocusTab from './components/ModuleFocusTab';
import ClinicalOverviewTab from './components/ClinicalOverviewTab';
import AssistantAuraTab from './components/AssistantAuraTab';
import SupportCirclesTab from './components/SupportCirclesTab';

import ParentSidebar from './components/ParentSidebar';
import AddChildModal from './components/AddChildModal';
import ParentFallback from './components/ParentFallback';

const normalizeId = (id: string | null | undefined) => id ? id.toUpperCase().trim() : '';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isDark, isArabic } = useApp();
    const { tab } = useParams();
    
    const { 
        currentChild, 
        linkedChild, 
        currentParent, 
        childAccounts, 
        setParentActiveChildId, 
        addChildToParent, 
        removeChildFromParent,
        logoutParent 
    } = useAuth();

    const [showAddChildModal, setShowAddChildModal] = useState(false);

    const parentChildren = useMemo(() => {
        return childAccounts.filter((c: any) => 
            (currentParent?.childIds || []).includes(c.childId) || 
            normalizeId(c.childId) === normalizeId(currentParent?.childId)
        );
    }, [childAccounts, currentParent]);

    const handleLinkChild = async (newChildId: string) => {
        const promise = addChildToParent(newChildId);
        toast.promise(promise, {
            loading: isArabic ? 'جاري إضافة الطفل...' : 'Adding child...',
            success: (res: any) => {
                if (res.success) {
                    setShowAddChildModal(false);
                    return isArabic ? `تم ربط الطفل ${res.childName} بنجاح!` : `Successfully linked child ${res.childName}!`;
                } else {
                    if (res.error === 'child_not_found') throw new Error(isArabic ? 'كود الطفل غير صحيح أو غير موجود' : 'Child code not found');
                    if (res.error === 'already_exists') throw new Error(isArabic ? 'هذا الطفل مرتبط بالفعل بحسابك' : 'This child is already linked to your account');
                    throw new Error(isArabic ? 'حدث خطأ ما' : 'An error occurred');
                }
            },
            error: (err: any) => err.message
        });
    };

    // Ensure hero object is always defined
    const hero = linkedChild || currentChild || { name: '', age: 0, gender: '', childId: '', routineHistory: {}, emotionHistory: {} };

    const { data, addDailyNote, removeDailyNote } = useData();
    const { routine: { defaultRoutine }, isLoading, appData } = useGlobalData();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [activeReportTab, setActiveReportTab] = useState('general');
    const [viewingAssessment, setViewingAssessment] = useState(null);

    const activeSidebarTab = (tab || 'sanctuary-journal').replace('-', '_');

    const sidebarTabs = [
        { key: 'sanctuary_journal', label: isArabic ? 'اليوميات' : 'Sanctuary Journal', icon: <FaBookOpen /> },
        { key: 'module_focus', label: isArabic ? 'تحليل الأداء' : 'Module Focus', icon: <FaChartLine /> },
        { key: 'assistant_aura', label: isArabic ? 'المساعد الذكي' : 'Assistant Aura', icon: <FaRobot /> },
        { key: 'clinical_overview', label: isArabic ? 'النظرة الطبية' : 'Clinical Overview', icon: <FaStethoscope /> },
        { key: 'support_circles', label: isArabic ? 'دوائر الدعم' : 'Support Circles', icon: <FaMapMarkerAlt className="text-blue-600" /> }
    ];

    const handleAddNote = () => { if (!noteText.trim()) return; addDailyNote(noteText); setNoteText(''); setShowNoteInput(false); };

    // Aura Lumina Theme Tokens
    const auraBg = isDark ? 'bg-[#0E101F]' : 'bg-[#F8F9FF]';
    const auraCard = isDark ? 'bg-white/[0.04] border-white/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'bg-white border-slate-200 shadow-xl';
    const auraAccent = '#A8B4FF';

    // Loading State
    if (isLoading || !appData) {
        return (
            <div className={`min-h-screen relative flex items-center justify-center ${isArabic ? 'font-[Cairo,sans-serif]' : "font-['Plus_Jakarta_Sans',sans-serif]"} ${auraBg} transition-colors duration-1000`} dir={isArabic ? 'rtl' : 'ltr'}>
                {isDark && (
                    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-500/15 blur-[130px] animate-pulse" />
                        <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[110px]" />
                    </div>
                )}
                <MainNavbar userType="parent" />
                <div className="flex flex-col items-center z-10 pt-[72px]">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                        {isArabic ? 'جاري تحميل البيانات...' : 'Loading Data...'}
                    </h2>
                    <p className={`text-sm mt-2 opacity-60 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                        {isArabic ? 'يرجى الانتظار قليلاً' : 'Please wait a moment'}
                    </p>
                </div>
            </div>
        );
    }

    // Empty State (No children linked)
    if (parentChildren.length === 0) {
        return (
            <ParentFallback 
                isDark={isDark} 
                isArabic={isArabic} 
                auraBg={auraBg} 
                auraCard={auraCard} 
                logoutParent={logoutParent} 
                addChildToParent={addChildToParent} 
            />
        );
    }

    const { moduleNames, moduleEmojis, behaviorTypes } = appData[isArabic ? 'ar' : 'en'].dashboardData;

    const todayKey = new Date().toLocaleDateString('en-CA');
    const routineHistory = hero?.routineHistory || {};
    const todayTasks = routineHistory[todayKey] || {};
    const todayCompletedCount = Object.values(todayTasks).filter(v => v === true).length;
    const customRoutineItems = hero?.customRoutineItems || [];
    let totalRoutineTasks = (defaultRoutine?.length || 0) + customRoutineItems.length;
    if (totalRoutineTasks === 0) totalRoutineTasks = 1;
    if (todayCompletedCount > totalRoutineTasks) totalRoutineTasks = todayCompletedCount;
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


    const SectionTitle = ({ icon, emoji, title, badge, badgeColor }: any) => (
        <div className="flex justify-between items-center mb-6">
            <h3 className={`text-[18px] font-black m-0 flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                <span className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-xl shadow-inner overflow-hidden">
                    {icon ? (typeof icon === 'string' ? <img src={icon} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async"/> : icon) : emoji}
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
                            hero={hero} behaviorTypes={behaviorTypes}
                        />
                    )}

                    {activeSidebarTab === 'module_focus' && (
                        <ModuleFocusTab
                            isArabic={isArabic} isDark={isDark} auraCard={auraCard} auraAccent={auraAccent} SectionTitle={SectionTitle}
                            todayKey={todayKey} todayRoutinePct={todayRoutinePct} todayCompletedCount={todayCompletedCount} totalRoutineTasks={totalRoutineTasks}
                            todayEmotionPct={todayEmotionPct} todayEmotionStats={todayEmotionStats}
                            data={data} moduleNames={moduleNames} moduleEmojis={moduleEmojis} recommendations={recommendations}
                            childId={hero.childId}
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

                <ParentSidebar 
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeSidebarTab={activeSidebarTab}
                    sidebarTabs={sidebarTabs}
                    isDark={isDark}
                    isArabic={isArabic}
                    currentParent={currentParent}
                    parentChildren={parentChildren}
                    activeChildId={hero.childId}
                    setParentActiveChildId={setParentActiveChildId}
                    removeChildFromParent={removeChildFromParent}
                    setShowAddChildModal={setShowAddChildModal}
                    onRemoveChildSuccess={(msg) => toast.success(msg)}
                    onRemoveChildError={(msg) => toast.error(msg)}
                />
            </div>

            <AddChildModal 
                isOpen={showAddChildModal}
                onClose={() => setShowAddChildModal(false)}
                onLinkChild={handleLinkChild}
                isDark={isDark}
                isArabic={isArabic}
            />

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
