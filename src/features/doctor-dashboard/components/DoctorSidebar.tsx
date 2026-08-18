import { useNavigate } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaTheaterMasks, FaFileAlt, FaRobot } from 'react-icons/fa';

interface TabList {
    key: string;
    label: string;
    labelAr: string;
    emoji?: string;
}

interface DoctorSidebarProps {
    sidebarOpen: boolean;
    isDark: boolean;
    isArabic: boolean;
    activeSidebarTab: string;
    tabsList: TabList[];
    currentDoctor: any;
    setViewingAssessment: (val: any) => void;
    setAssessmentDone: (val: boolean) => void;
}

export default function DoctorSidebar({
    sidebarOpen,
    isDark,
    isArabic,
    activeSidebarTab,
    tabsList,
    currentDoctor,
    setViewingAssessment,
    setAssessmentDone
}: DoctorSidebarProps) {
    const navigate = useNavigate();

    const tabIcons: Record<string, React.ReactNode> = {
        patients: <FaUsers />,
        assessment: <FaClipboardList />,
        behavior: <FaTheaterMasks />,
        reports: <FaFileAlt />,
        ai_assistant: <FaRobot />
    };

    return (
        <aside className={`fixed left-0 top-[72px] bottom-0 w-[270px] flex flex-col py-6 z-40 border-r transition-transform duration-300 ${isDark ? 'bg-[#080912]/98 border-white/10' : 'bg-white/98 border-slate-200'} backdrop-blur-2xl overflow-y-auto scrollbar-hide shadow-[10px_0_30px_rgba(0,0,0,0.08)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div 
                onClick={() => navigate('/doctor-dashboard/profile')}
                className={`px-8 mb-8 pb-8 border-b cursor-pointer group transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform">
                        {currentDoctor?.avatar && currentDoctor.avatar.length > 10 ? (
                            <img src={currentDoctor.avatar} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async"/>
                        ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-xl">🩺</div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className={`font-bold text-[15px] leading-tight mb-0.5 ${isDark ? 'text-indigo-400' : 'text-[#2B52D0]'}`}>
                            {currentDoctor?.name || (isArabic ? 'الطبيب' : 'Doctor')}
                        </h3>
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isArabic ? 'تعديل البيانات' : 'Edit Profile'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
                {tabsList.map(tab => {
                    const isActive = activeSidebarTab === tab.key;
                    return (
                        <button 
                            key={tab.key}
                            onClick={() => {
                                navigate(`/doctor-dashboard/${tab.key}`);
                                setViewingAssessment(null);
                                setAssessmentDone(false);
                            }}
                            className={`flex items-center gap-4 px-8 py-4 w-full transition-all duration-300 relative ${isActive ? (isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-[#F2F6FE] text-[#2B52D0]') : (isDark ? 'text-slate-400 hover:bg-white/5' : 'text-[#6B7280] hover:bg-slate-50')} group`}
                        >
                            {isActive && (
                                <div className="absolute right-0 top-0 bottom-0 w-1.5 rounded-l-lg bg-indigo-500" />
                            )}
                            
                            <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'scale-110 drop-shadow-md' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                                <span className="text-xl">{tabIcons[tab.key] || tab.emoji}</span>
                            </div>
                            <span className={`text-[14px] font-semibold tracking-wide ${isArabic ? 'text-right flex-1' : 'text-left flex-1'}`}>
                                {isArabic ? tab.labelAr : tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
