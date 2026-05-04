import { Button, Card, CardBody, Avatar } from '@heroui/react';

export default function PatientsTab({
    isArabic, isDark, accent,
    myPatients, selectedPatient, setSelectedPatient,
    setShowAddModal, updatePatientData,
    hoveredCard, setHoveredCard,
    cardCls, inputCls
}) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`m-0 text-lg font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'قائمة المرضى' : 'My Patients'}</h3>
                <Button radius="lg" className="bg-gradient-to-br from-accent to-[#4834D4] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(108,99,255,0.2)] transition-all duration-200 hover:-translate-y-px mt-2"
                    onPress={() => setShowAddModal(true)}>+ {isArabic ? 'إضافة مريض' : 'Add Patient'}</Button>
            </div>
            {myPatients.length === 0 ? (
                <Card className={cardCls('empty')} onMouseEnter={() => setHoveredCard('empty')} onMouseLeave={() => setHoveredCard(null)}>
                    <CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        <div className="w-20 h-20 mx-auto mb-4">
                            <img src="/icons/empty_state.png" alt="" className="w-full h-full object-contain" />
                        </div>
                        {isArabic ? 'لا يوجد مرضى. أضف مريضاً باستخدام الكود أو الرقم.' : 'No patients yet. Add one using Code or Phone.'}
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
                        <h4 className={`mb-2.5 text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            <div className="w-5 h-5 overflow-hidden rounded-md flex items-center justify-center">
                                <img src="/icons/doctor_consultation.png" alt="" className="w-full h-full object-cover" />
                            </div> 
                            {isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}
                        </h4>
                        <div className="flex gap-2 mb-5">
                            {['Level 1', 'Level 2', 'Level 3'].map(lvl => (
                                <Button key={lvl} radius="lg" size="lg" className={`flex-1 font-bold text-[13px] border-[1.5px] transition-all duration-200 ${selectedPatient.diagnosisLevel === lvl ? 'bg-gradient-to-br from-accent to-[#4834D4] text-white border-accent shadow-[0_4px_12px_rgba(108,99,255,0.15)]' : `bg-transparent ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}`}
                                    onPress={() => updatePatientData(selectedPatient.childId, { diagnosisLevel: lvl })}>{lvl}</Button>
                            ))}
                        </div>
                        <h4 className={`mb-2.5 text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            <div className="w-5 h-5 overflow-hidden rounded-md flex items-center justify-center">
                                <img src="/icons/journal_entry.png" alt="" className="w-full h-full object-cover" />
                            </div> 
                            {isArabic ? 'خطة العلاج والملاحظات' : 'Treatment Plan & Notes'}
                        </h4>
                        <textarea value={selectedPatient.treatmentPlan || ''} onChange={e => updatePatientData(selectedPatient.childId, { treatmentPlan: e.target.value })} placeholder={isArabic ? 'اكتب التقرير الطبي هنا...' : 'Write medical report here...'} className={`${inputCls} min-h-[100px] resize-y`} />
                        <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">✅ {isArabic ? 'يتم الحفظ تلقائياً ويظهر لولي الأمر' : 'Auto-saved & visible to parent'}</div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
