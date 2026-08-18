import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/shared/context/AppContext';
import { useAuth } from '@/shared/context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUsers, FaClipboardList, FaTheaterMasks, FaFileAlt, FaRobot } from 'react-icons/fa';
import MainNavbar from '@/shared/components/MainNavbar';
import { useGlobalData } from '@/shared/context/GlobalDataContext';
import PatientsTab from './components/PatientsTab';
import AssessmentTab from './components/AssessmentTab';
import BehaviorTab from './components/BehaviorTab';
import ReportsTab from './components/ReportsTab';
import AutismSupportBot from '@/shared/components/AutismSupportBot';
import DoctorSidebar from './components/DoctorSidebar';
import AddPatientModal from './components/AddPatientModal';
import LoadingState from '@/components/common/LoadingState';

export default function DoctorDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { 
        currentDoctor, 
        childAccounts, 
        findChildForDoctor, 
        addPatientToDoctor, 
        updateChildDiagnosis, 
        isDoctorLoggedIn, 
        removePatientFromDoctor 
    } = useAuth();
    
    const { isLoading, appData } = useGlobalData();
    
    useEffect(() => { 
        if (!isDoctorLoggedIn) navigate('/doctor-login'); 
    }, [isDoctorLoggedIn, navigate]);

    const myPatients = childAccounts.filter((c: any) => 
        currentDoctor?.patientIds?.some((id: string) => id.toUpperCase() === c.childId.toUpperCase())
    );
    const { tab } = useParams();
    const activeSidebarTab = tab || 'patients';
    
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);
    const [searchError, setSearchError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [assessmentAnswers, setAssessmentAnswers] = useState<any>({});
    const [assessmentDone, setAssessmentDone] = useState(false);
    const [behaviorNote, setBehaviorNote] = useState('');
    const [behaviorType, setBehaviorType] = useState('meltdown');
    const [behaviorIntensity, setBehaviorIntensity] = useState(3);
    const [viewingAssessment, setViewingAssessment] = useState<any>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    if (!appData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingState label="Loading Data..." />
            </div>
        );
    }

    const { behaviorTypes, assessmentQuestions, tabsList: apiTabsList } = appData[isArabic ? 'ar' : 'en'].doctorData;
    
    const tabsList = [...apiTabsList];
    if (!tabsList.find((t: any) => t.key === 'ai_assistant')) {
        tabsList.push({
            key: 'ai_assistant',
            label: 'AI Assistant',
            labelAr: 'المساعد الذكي',
            emoji: '🤖'
        });
    }

    const accent = '#6C63FF';
    const subBg = isDark ? 'bg-bg-dark' : 'bg-[#F9FAFB]';
    const patientBanner = `mb-4 p-4 rounded-[14px] flex items-center gap-2.5 border border-accent/[0.07] ${isDark ? 'bg-accent/[0.03]' : 'bg-accent/[0.04]'}`;

    const updatePatientData = (pid: string, updates: any) => { 
        updateChildDiagnosis(pid, updates); 
        if (selectedPatient?.childId === pid) {
            setSelectedPatient({ ...selectedPatient, ...updates }); 
        }
    };

    const handleSearch = async () => { 
        setSearchError(''); 
        setSearchResult(null); 
        if (!searchQuery.trim()) return; 
        
        setIsSearching(true); 
        const child = await findChildForDoctor(searchQuery.trim()); 
        setIsSearching(false); 
        
        if (child) {
            setSearchResult(child);
        } else {
            setSearchError(isArabic ? 'لم يتم العثور على طفل' : 'No child found');
        }
    };

    const handleAddPatient = async () => { 
        if (!searchResult) return; 
        setIsAdding(true); 
        const promise = addPatientToDoctor(searchResult.childId);
        toast.promise(promise, {
            loading: isArabic ? 'جاري إضافة المريض...' : 'Adding patient...',
            success: (res: any) => {
                setIsAdding(false);
                if (res.success) { 
                    setShowAddModal(false); 
                    setSearchQuery(''); 
                    setSearchResult(null);
                    return isArabic ? 'تم إضافة المريض بنجاح' : 'Patient added successfully';
                } else {
                    setSearchError(isArabic ? 'المريض موجود بالفعل' : 'Patient already added');
                    throw new Error(isArabic ? 'المريض موجود بالفعل' : 'Patient already added');
                }
            },
            error: (err) => err.message
        });
    };

    const submitAssessment = () => { 
        if (!selectedPatient) return; 
        const yesCount = Object.values(assessmentAnswers).filter(v => v === 'yes').length; 
        const score = Math.round((yesCount / assessmentQuestions.length) * 100); 
        const r = { 
            date: new Date().toISOString(), 
            score, 
            answers: assessmentAnswers, 
            totalQuestions: assessmentQuestions.length 
        }; 
        updatePatientData(selectedPatient.childId, { 
            assessments: [...(selectedPatient.assessments || []), r] 
        }); 
        setAssessmentDone(true); 
    };

    const addBehaviorLog = () => { 
        if (!selectedPatient || !behaviorNote) return; 
        const log = { 
            type: behaviorType, 
            note: behaviorNote, 
            intensity: behaviorIntensity, 
            date: new Date().toISOString(), 
            emoji: behaviorTypes.find((b: any) => b.key === behaviorType)?.emoji || '📝' 
        }; 
        updatePatientData(selectedPatient.childId, { 
            behaviorLogs: [...(selectedPatient.behaviorLogs || []), log] 
        }); 
        setBehaviorNote(''); 
    };

    const cardCls = (hk: string | null) => `rounded-[18px] mb-4 border transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'} ${hoveredCard === hk ? 'border-accent/40 shadow-[0_8px_28px_rgba(108,99,255,0.06)]' : `${isDark ? 'border-border-dark' : 'border-border'} ${isDark ? '' : 'shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}`;
    const inputCls = `w-full py-3 px-3.5 rounded-xl text-sm border-[1.5px] outline-none font-[Inter,sans-serif] transition-all duration-300 box-border focus:border-accent ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;

    if (isLoading) {
        return (
            <div className={`min-h-screen relative flex items-center justify-center ${isArabic ? 'font-[Cairo,sans-serif]' : "font-[Inter,'Segoe_UI',sans-serif]"} ${isDark ? 'bg-bg-dark' : 'bg-bg'} transition-colors duration-1000`} dir={isArabic ? 'rtl' : 'ltr'}>
                {isDark && (
                    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-accent/10 blur-[130px] animate-pulse" />
                        <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#4834D4]/10 blur-[110px]" />
                    </div>
                )}
                <MainNavbar userType="doctor" />
                <div className="flex flex-col items-center z-10 pt-[72px]">
                    <LoadingState label={isArabic ? 'جاري تحميل بيانات مرضاك...' : 'Loading Patients Data...'} />
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isArabic ? 'font-[Cairo,sans-serif]' : "font-[Inter,'Segoe_UI',sans-serif]"} ${isDark ? 'bg-bg-dark' : 'bg-bg'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <MainNavbar userType="doctor" />

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
                className={`fixed top-[84px] left-3 z-[45] md:hidden w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isDark ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-accent text-white'}`}
            >
                {sidebarOpen ? <span className="text-base">✕</span> : <span className="text-base">☰</span>}
            </button>

            <div className="flex relative pt-[72px]">
                <main className={`flex-1 relative z-10 w-full md:pl-[250px] lg:pl-[270px] px-4 sm:px-6 py-8 pb-32 max-w-full overflow-x-hidden`}>
                    <div className="space-y-6 sm:space-y-10 mx-2 sm:mx-4 md:mx-6">
                        {activeSidebarTab === 'patients' && (
                            <PatientsTab
                                isArabic={isArabic} isDark={isDark} accent={accent}
                                myPatients={myPatients} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient}
                                setShowAddModal={setShowAddModal} updatePatientData={updatePatientData} removePatientFromDoctor={removePatientFromDoctor}
                                hoveredCard={hoveredCard} setHoveredCard={setHoveredCard}
                                cardCls={cardCls} inputCls={inputCls} isAdding={isAdding}
                            />
                        )}
                        {activeSidebarTab === 'assessment' && (
                            <AssessmentTab
                                isArabic={isArabic} isDark={isDark} accent={accent}
                                selectedPatient={selectedPatient}
                                viewingAssessment={viewingAssessment} setViewingAssessment={setViewingAssessment}
                                assessmentDone={assessmentDone} setAssessmentDone={setAssessmentDone}
                                assessmentQuestions={assessmentQuestions} assessmentAnswers={assessmentAnswers} setAssessmentAnswers={setAssessmentAnswers}
                                submitAssessment={submitAssessment}
                                hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} cardCls={cardCls} patientBanner={patientBanner}
                            />
                        )}
                        {activeSidebarTab === 'behavior' && (
                            <BehaviorTab
                                isArabic={isArabic} isDark={isDark} accent={accent}
                                selectedPatient={selectedPatient} behaviorTypes={behaviorTypes}
                                behaviorType={behaviorType} setBehaviorType={setBehaviorType}
                                behaviorIntensity={behaviorIntensity} setBehaviorIntensity={setBehaviorIntensity}
                                behaviorNote={behaviorNote} setBehaviorNote={setBehaviorNote}
                                addBehaviorLog={addBehaviorLog}
                                hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} cardCls={cardCls} inputCls={inputCls} patientBanner={patientBanner}
                            />
                        )}
                        {activeSidebarTab === 'reports' && (
                            <ReportsTab
                                isArabic={isArabic} isDark={isDark} accent={accent}
                                selectedPatient={selectedPatient}
                                hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} cardCls={cardCls} subBg={subBg} patientBanner={patientBanner}
                            />
                        )}
                        {activeSidebarTab === 'ai_assistant' && (
                            <div className="h-[75vh] md:h-[80vh] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/10">
                                <AutismSupportBot mode="doctor" />
                            </div>
                        )}
                    </div>
                </main>

                <DoctorSidebar 
                    sidebarOpen={sidebarOpen}
                    isDark={isDark}
                    isArabic={isArabic}
                    activeSidebarTab={activeSidebarTab}
                    tabsList={tabsList}
                    currentDoctor={currentDoctor}
                    setViewingAssessment={setViewingAssessment}
                    setAssessmentDone={setAssessmentDone}
                />
            </div>

            <AddPatientModal 
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                isArabic={isArabic}
                isDark={isDark}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                searchError={searchError}
                searchResult={searchResult}
                isAdding={isAdding}
                handleAddPatient={handleAddPatient}
                subBg={subBg}
            />

            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
        </div>
    );
}
