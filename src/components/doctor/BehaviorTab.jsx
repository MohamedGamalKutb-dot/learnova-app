import { Button, Card, CardBody, Avatar } from '@heroui/react';

export default function BehaviorTab({
    isArabic, isDark, accent,
    selectedPatient, behaviorTypes,
    behaviorType, setBehaviorType,
    behaviorIntensity, setBehaviorIntensity,
    behaviorNote, setBehaviorNote,
    addBehaviorLog,
    hoveredCard, setHoveredCard, cardCls, inputCls, patientBanner
}) {
    if (!selectedPatient) return <Card className={cardCls(null)}><CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}><div className="text-[40px] mb-2">📊</div>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</CardBody></Card>;
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
                <span className={`font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? `سلوك ${selectedPatient.name}` : `Behavior Log for ${selectedPatient.name}`}</span>
            </div>
            <Card className={cardCls('newBehavior')} onMouseEnter={() => setHoveredCard('newBehavior')} onMouseLeave={() => setHoveredCard(null)}>
                <CardBody className="p-[22px]">
                    <h4 className={`mb-3.5 text-[15px] font-bold flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        <div className="w-6 h-6 overflow-hidden rounded-md flex items-center justify-center bg-indigo-500/10">
                            <img src="/icons/journal_entry.png" alt="" className="w-full h-full object-cover" />
                        </div> 
                        {isArabic ? 'تسجيل سلوك جديد' : 'Log New Behavior'}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {behaviorTypes.map(bt => (
                            <Button key={bt.key} size="sm" radius="md" onPress={() => setBehaviorType(bt.key)}
                                className={`font-bold text-xs border-[1.5px] h-10 px-3 transition-all duration-300 ${behaviorType === bt.key ? 'shadow-md scale-[1.02]' : 'opacity-80'}`}
                                style={{ 
                                    borderColor: behaviorType === bt.key ? bt.color : (isDark ? '#333' : '#eee'), 
                                    background: behaviorType === bt.key ? `${bt.color}15` : 'transparent',
                                    color: behaviorType === bt.key ? bt.color : (isDark ? '#999' : '#666')
                                }}>
                                <div className="w-5 h-5 flex items-center justify-center overflow-hidden rounded-md me-1.5">
                                    <img src={bt.emoji} alt="" className="w-full h-full object-cover" />
                                </div>
                                {isArabic ? bt.labelAr : bt.label}
                            </Button>
                        ))}
                    </div>
                    <div className="mb-3.5">
                        <div className={`text-xs mb-2 font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'الشدة' : 'Intensity'}: <span className="text-accent font-bold">{behaviorIntensity}/5</span></div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(n => (
                                <Button key={n} radius="md" size="sm" onPress={() => setBehaviorIntensity(n)}
                                    className={`flex-1 font-bold text-[13px] border-[1.5px] transition-all duration-200 ${n <= behaviorIntensity ? 'border-accent bg-accent/[0.09] text-accent' : `${isDark ? 'border-border-dark text-subtext-dark' : 'border-border text-subtext'} bg-transparent`}`}>{n}</Button>
                            ))}
                        </div>
                    </div>
                    <textarea value={behaviorNote} onChange={e => setBehaviorNote(e.target.value)} placeholder={isArabic ? 'ملاحظات تفصيلية...' : 'Detailed notes...'} className={`${inputCls} min-h-[80px] resize-y mb-3`} />
                    <Button fullWidth radius="xl" size="lg" onPress={addBehaviorLog} className="bg-gradient-to-br from-[#FF6584] to-pink-500 text-white font-bold text-sm shadow-[0_4px_12px_rgba(255,101,132,0.25)] transition-all duration-200 hover:-translate-y-px mt-2">
                        {isArabic ? '📊 تسجيل السلوك' : '📊 Log Entry'}
                    </Button>
                </CardBody>
            </Card>
            <h4 className={`mb-3 text-[15px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'السجل السابق' : 'History'}</h4>
            {(!selectedPatient.behaviorLogs || selectedPatient.behaviorLogs.length === 0) ? <p className={`text-[13px] text-center p-4 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'لا توجد سجلات بعد' : 'No logs yet'}</p> : (
                [...(selectedPatient.behaviorLogs || [])].reverse().map((log, i) => {
                    const bt = behaviorTypes.find(b => b.key === log.type); return (
                        <Card key={i} className={`mb-2 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                            <CardBody className="p-3.5 flex flex-row gap-3">
                                <Avatar 
                                    radius="xl"
                                    className="w-[42px] h-[42px] shrink-0 text-xl"
                                    src={selectedPatient.avatar?.length > 10 ? selectedPatient.avatar : undefined}
                                    icon={<div className="w-full h-full overflow-hidden flex items-center justify-center"><img src={bt?.emoji || log.emoji} alt="" className="w-full h-full object-cover" /></div>}
                                    style={{ background: `${bt?.color || '#999'}12` }}
                                />
                                <div className="flex-1">
                                    <div className={`font-bold text-sm ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? bt?.labelAr : bt?.label} <span className={`font-normal text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>({log.intensity}/5)</span></div>
                                    <div className={`text-[13px] mt-0.5 opacity-85 ${isDark ? 'text-text-dark' : 'text-text'}`}>{log.note}</div>
                                    <div className={`text-[11px] mt-1 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{new Date(log.date).toLocaleString()}</div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                })
            )}
        </div>
    );
}
