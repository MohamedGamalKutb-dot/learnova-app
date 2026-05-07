import { Card, CardBody, Avatar } from '@heroui/react';
import { FaFileAlt, FaChartBar, FaClipboardList, FaStethoscope } from 'react-icons/fa';

export default function ReportsTab({
    isArabic, isDark, accent,
    selectedPatient,
    hoveredCard, setHoveredCard, cardCls, subBg, patientBanner
}) {
    if (!selectedPatient) return <Card className={cardCls(null)}><CardBody className={`text-center p-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}><div className="text-5xl mb-4 opacity-20 flex justify-center"><FaFileAlt /></div>{isArabic ? 'اختر مريضاً أولاً' : 'Select a patient first'}</CardBody></Card>;
    const logs = selectedPatient.behaviorLogs || []; const assessments = selectedPatient.assessments || [];
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
                <span className={`font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? `تقرير ${selectedPatient.name}` : `Report for ${selectedPatient.name}`}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
                {[{ icon: <FaChartBar />, value: logs.length, label: isArabic ? 'سجلات سلوكية' : 'Behavior Logs', color: '#FF6584' }, { icon: <FaClipboardList />, value: assessments.length, label: isArabic ? 'تقييمات مكتملة' : 'Assessments', color: accent }].map(s => (
                    <Card key={s.label} className={cardCls(null)}><CardBody className="text-center p-5 items-center justify-center"><div className="text-3xl" style={{ color: s.color }}>{s.icon}</div><div className="text-[28px] font-extrabold my-1.5" style={{ color: s.color }}>{s.value}</div><div className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{s.label}</div></CardBody></Card>
                ))}
            </div>
            <Card className={cardCls('diagnosis')} onMouseEnter={() => setHoveredCard('diagnosis')} onMouseLeave={() => setHoveredCard(null)}>
                <CardBody className="p-[22px]">
                    <h4 className={`mb-4 text-[15px] font-bold flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        <FaStethoscope className="text-accent" />
                        {isArabic ? 'آخر التشخيصات' : 'Latest Diagnosis'}
                    </h4>
                    <div className={`flex justify-between items-center p-3 px-4 rounded-xl mb-2.5 border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                        <span className={`text-[13px] font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'المستوى' : 'Level'}</span>
                        <span className="bg-gradient-to-br from-accent to-[#4834D4] text-white py-1 px-3.5 rounded-lg font-bold text-xs">{selectedPatient.diagnosisLevel}</span>
                    </div>
                    <div className={`p-4 rounded-xl text-sm leading-relaxed min-h-[50px] border ${subBg} ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>
                        <strong className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'ملاحظات الطبيب:' : 'Doctor Notes:'}</strong><br />{selectedPatient.treatmentPlan || (isArabic ? 'لا توجد ملاحظات' : 'No notes')}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
