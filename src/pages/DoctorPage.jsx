import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardBody, Input, Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Avatar } from '@heroui/react';
import { FaUsers, FaClipboardList, FaTheaterMasks, FaFileAlt, FaSearch, FaUserPlus } from 'react-icons/fa';
import MainNavbar from '../components/MainNavbar';
import { getDoctorData } from '../data/doctorData';
import PatientsTab from '../components/doctor/PatientsTab';
import AssessmentTab from '../components/doctor/AssessmentTab';
import BehaviorTab from '../components/doctor/BehaviorTab';
import ReportsTab from '../components/doctor/ReportsTab';

export default function DoctorPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentDoctor, childAccounts, findChildForDoctor, addPatientToDoctor, updateChildDiagnosis, isDoctorLoggedIn, logoutDoctor, updateDoctorProfile } = useAuth();
    useEffect(() => { if (!isDoctorLoggedIn) navigate('/doctor-auth'); }, [isDoctorLoggedIn, navigate]);

    const { behaviorTypes, assessmentQuestions, tabsList } = getDoctorData(isArabic);
    const tabIcons = {
        patients: <FaUsers />,
        assessment: <FaClipboardList />,
        behavior: <FaTheaterMasks />,
        reports: <FaFileAlt />
    };

    const myPatients = childAccounts.filter(c => currentDoctor?.patientIds?.some(id => id.toUpperCase() === c.childId.toUpperCase()));
    const { tab } = useParams();
    const activeSidebarTab = tab || 'patients';
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

    const accent = '#6C63FF';
    const updatePatientData = (pid, updates) => { updateChildDiagnosis(pid, updates); if (selectedPatient?.childId === pid) setSelectedPatient({ ...selectedPatient, ...updates }); };
    const handleSearch = () => { setSearchError(''); setSearchResult(null); if (!searchQuery.trim()) return; const child = findChildForDoctor(searchQuery.trim()); child ? setSearchResult(child) : setSearchError(isArabic ? 'لم يتم العثور على طفل' : 'No child found'); };
    const handleAddPatient = () => { if (!searchResult) return; const res = addPatientToDoctor(searchResult.childId); if (res.success) { setShowAddModal(false); setSearchQuery(''); setSearchResult(null); } else setSearchError(isArabic ? 'المريض موجود بالفعل' : 'Patient already added'); };
    const submitAssessment = () => { if (!selectedPatient) return; const yesCount = Object.values(assessmentAnswers).filter(v => v === 'yes').length; const score = Math.round((yesCount / assessmentQuestions.length) * 100); const r = { date: new Date().toISOString(), score, answers: assessmentAnswers, totalQuestions: assessmentQuestions.length }; updatePatientData(selectedPatient.childId, { assessments: [...(selectedPatient.assessments || []), r] }); setAssessmentDone(true); };
    const addBehaviorLog = () => { if (!selectedPatient || !behaviorNote) return; const log = { type: behaviorType, note: behaviorNote, intensity: behaviorIntensity, date: new Date().toISOString(), emoji: behaviorTypes.find(b => b.key === behaviorType)?.emoji || '📝' }; updatePatientData(selectedPatient.childId, { behaviorLogs: [...(selectedPatient.behaviorLogs || []), log] }); setBehaviorNote(''); };
    


    const cardCls = (hk) => `rounded-[18px] mb-4 border transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'} ${hoveredCard === hk ? 'border-accent/40 shadow-[0_8px_28px_rgba(108,99,255,0.06)]' : `${isDark ? 'border-border-dark' : 'border-border'} ${isDark ? '' : 'shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}`;
    const navBtnCls = `text-base ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'} border`;
    const inputCls = `w-full py-3 px-3.5 rounded-xl text-sm border-[1.5px] outline-none font-[Inter,sans-serif] transition-all duration-300 box-border focus:border-accent ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;
    const subBg = isDark ? 'bg-bg-dark' : 'bg-[#F9FAFB]';
    const patientBanner = `mb-4 p-4 rounded-[14px] flex items-center gap-2.5 border border-accent/[0.07] ${isDark ? 'bg-accent/[0.03]' : 'bg-accent/[0.04]'}`;

    return (
        <div className={`min-h-screen ${isArabic ? 'font-[Cairo,sans-serif]' : "font-[Inter,'Segoe_UI',sans-serif]"} ${isDark ? 'bg-bg-dark' : 'bg-bg'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <MainNavbar userType="doctor" />

            <div className="flex relative pt-[72px]">
                <main className={`flex-1 relative z-10 max-w-[1000px] mx-auto pl-[250px] md:pl-[270px] pr-6 py-8 pb-32 space-y-10`}>
                    {activeSidebarTab === 'patients' && (
                        <PatientsTab
                            isArabic={isArabic} isDark={isDark} accent={accent}
                            myPatients={myPatients} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient}
                            setShowAddModal={setShowAddModal} updatePatientData={updatePatientData}
                            hoveredCard={hoveredCard} setHoveredCard={setHoveredCard}
                            cardCls={cardCls} inputCls={inputCls}
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
                </main>

                <aside className={`fixed left-0 top-[72px] bottom-0 w-[250px] md:w-[270px] flex flex-col py-6 z-40 border-r ${isDark ? 'bg-[#080912]/95 border-white/10' : 'bg-white/95 border-slate-200'} backdrop-blur-2xl overflow-y-auto scrollbar-hide shadow-[10px_0_30px_rgba(0,0,0,0.02)]`}>
                    <div 
                        onClick={() => navigate('/doctor-dashboard/profile')}
                        className={`px-8 mb-8 pb-8 border-b cursor-pointer group transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm shrink-0 bg-white group-hover:scale-105 transition-transform">
                                {currentDoctor?.avatar && currentDoctor.avatar.length > 10 ? (
                                    <img src={currentDoctor.avatar} className="w-full h-full object-cover" alt=""  loading="lazy" decoding="async"/>
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
                                        setViewingAssessment(null); setAssessmentDone(false);
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
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} size="md" backdrop="blur" classNames={{ base: isDark ? 'bg-card-dark border border-border-dark' : 'bg-card border border-border', closeButton: 'hidden' }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`flex flex-col gap-1 text-center mt-2 pb-0 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                <h3 className={`m-0 text-lg font-bold flex items-center justify-center gap-2`}>
                                    <FaUserPlus className="text-accent" />
                                    {isArabic ? 'إضافة مريض جديد' : 'Add New Patient'}
                                </h3>
                            </ModalHeader>
                            <ModalBody className="pb-6">
                                <div className={`p-4 rounded-[14px] mb-4 border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                    <label className={`block text-xs mb-2 font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'كود الطفل أو رقم هاتف الوالد' : 'Child Code OR Parent Phone'}</label>
                                    <div className="flex gap-2">
                                        <Input variant="bordered" radius="lg"
                                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                            placeholder="LN-XXXXXX or 01xxxxxxx" className="flex-1"
                                            classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-accent` }} />
                                        <Button isIconOnly radius="lg" className="bg-gradient-to-br from-accent to-[#4834D4] text-white shadow-[0_2px_8px_rgba(108,99,255,0.2)] text-base flex items-center justify-center" onPress={handleSearch}>
                                            <FaSearch className="text-sm" />
                                        </Button>
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

            <style>{`@keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
        </div>
    );
}
