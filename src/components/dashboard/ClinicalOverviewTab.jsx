import { Card, CardBody, Button, Chip } from '@heroui/react';

export default function ClinicalOverviewTab({
    isArabic, isDark, auraCard, SectionTitle,
    activeReportTab, setActiveReportTab,
    viewingAssessment, setViewingAssessment,
    hero, currentChild, behaviorTypes
}) {
    return (
        <Card className={`rounded-[50px] border relative overflow-hidden group ${auraCard}`}>
            <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-[40px] -ml-12 -mt-12" />
            <CardBody className="p-10">
                <SectionTitle icon="/icons/doctor_consultation.png" title={isArabic ? 'التقرير الطبي' : 'Clinical Overview'} />

                {/* Aura Tabs */}
                <div className="flex gap-2 mb-8 p-1.5 rounded-[28px] bg-white/5 border border-white/5">
                    {[
                        { key: 'general', label: isArabic ? 'نظرة عامة' : 'General', icon: '/icons/tab_general.png' },
                        { key: 'assessments', label: isArabic ? 'التقييمات' : 'Assessments', icon: '/icons/quiz_stats.png' },
                        { key: 'behavior', label: isArabic ? 'السلوك' : 'Behavior', icon: '/icons/emotion_mastery.png' }
                    ].map(tab => (
                        <Button
                            key={tab.key}
                            onPress={() => { setActiveReportTab(tab.key); setViewingAssessment(null); }}
                            className={`flex-1 h-12 rounded-[22px] font-black text-[13px] transition-all duration-500 ${activeReportTab === tab.key ? 'bg-indigo-500 text-white shadow-lg' : isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <div className="w-5 h-5 me-2 overflow-hidden flex items-center justify-center">
                                <img src={tab.icon} alt="" className="w-full h-full object-contain" />
                            </div>
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
                                <div key={idx} className={`p-6 rounded-[40px] border transition-colors flex gap-6 ${isDark ? 'border-white/5 bg-white/5 group-hover:bg-white/10' : 'border-slate-200 bg-white group-hover:bg-slate-50'}`}>
                                    <div className="w-14 h-14 rounded-[22px] flex items-center justify-center overflow-hidden shadow-inner" style={{ background: `${bt?.color || '#999'}20` }}>
                                        <img src={bt?.emoji || log.emoji || '/icons/emotion_mastery.png'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className={`text-base font-black m-0 ${isDark ? 'text-white' : 'text-slate-800'}`}>{bt ? (isArabic ? bt.labelAr : bt.label) : (log.type || 'Unknown')}</p>
                                            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest">{log.intensity}/5 Intensity</span>
                                        </div>
                                        <p className={`text-base font-medium m-0 leading-relaxed ${isDark ? 'text-indigo-100/60' : 'text-slate-600'}`}>{log.note}</p>
                                        <p className={`text-[10px] font-black mt-2 uppercase tracking-widest ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{new Date(log.date).toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        }) : null)}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
