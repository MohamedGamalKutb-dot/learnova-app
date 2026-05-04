import { Button, Card, CardBody, Avatar } from '@heroui/react';

export default function AssessmentTab({
    isArabic, isDark, accent,
    selectedPatient,
    viewingAssessment, setViewingAssessment,
    assessmentDone, setAssessmentDone,
    assessmentQuestions, assessmentAnswers, setAssessmentAnswers,
    submitAssessment,
    hoveredCard, setHoveredCard, cardCls, patientBanner
}) {
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
}
