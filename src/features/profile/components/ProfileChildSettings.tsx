import { Card, CardBody, Button } from '@heroui/react';

interface ProfileChildSettingsProps {
    isDark: boolean;
    isArabic: boolean;
    userRole: string;
    activeUser: any;
    sensoryOptions: any[];
    togglePref: (key: string) => void;
    updateChildProfile: (updates: any) => void;
}

export default function ProfileChildSettings({ isDark, isArabic, userRole, activeUser, sensoryOptions, togglePref, updateChildProfile }: ProfileChildSettingsProps) {
    if (userRole !== 'child') return null;

    return (
        <div className="space-y-12">
            {/* Diagnosis Level */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-4">
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</h3>
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500/50">{isArabic ? 'بإشراف الطبيب' : 'Managed by Doctor'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { val: 'Level 1', label: isArabic ? '1' : '1', color: '#10B981', glow: 'shadow-emerald-500/20' },
                        { val: 'Level 2', label: isArabic ? '2' : '2', color: '#F59E0B', glow: 'shadow-amber-500/20' },
                        { val: 'Level 3', label: isArabic ? '3' : '3', color: '#EF4444', glow: 'shadow-red-500/20' },
                    ].map(lv => {
                        const isActive = activeUser.diagnosisLevel === lv.val;
                        return (
                            <div key={lv.val} className={`p-6 rounded-[32px] text-center border transition-all duration-500 backdrop-blur-3xl ${isActive ? `opacity-100 border-opacity-100 ${lv.glow} scale-105 bg-white/5` : 'border-opacity-10 opacity-20 pointer-events-none shadow-none'}`}
                                style={{ borderColor: isActive ? lv.color : 'transparent' }}>
                                <div className="text-3xl font-black mb-1" style={{ color: lv.color }}>{lv.label}</div>
                                <div className="text-[9px] uppercase tracking-[0.2em] font-black opacity-60">{isArabic ? 'مستوى' : 'Level'}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sensory Preferences */}
            <div className="space-y-5">
                <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'تفضيلات الحواس' : 'Sensory Vibes'}</h3>
                <div className={`flex flex-wrap gap-3 p-10 rounded-[50px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-indigo-100'}`}>
                    {sensoryOptions.map(opt => {
                        const active = (activeUser.sensoryPreferences || []).includes(opt.key);
                        return (
                            <Button key={opt.key} radius="full" variant={active ? 'flat' : 'bordered'} color={active ? 'primary' : 'default'}
                                className={`font-black text-[12px] tracking-tight h-12 px-6 transition-all duration-500 ${active ? 'scale-105 shadow-indigo-500/10' : `opacity-40 ${isDark ? 'border-white/10' : 'border-indigo-100'}`}`}
                                onPress={() => togglePref(opt.key)}>
                                <div className="w-5 h-5 me-2 overflow-hidden rounded-md"><img src={opt.emoji} className="w-full h-full object-cover" alt=""  loading="lazy" decoding="async"/></div> {isArabic ? opt.labelAr : opt.labelEn}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-5">
                <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'مذكرات' : 'Hero Notes'}</h3>
                <Card className={`rounded-[40px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                    <CardBody className="p-8">
                        <textarea
                            className={`w-full min-h-[140px] bg-transparent border-none outline-none font-bold text-lg leading-relaxed ${isDark ? 'text-white/80 placeholder:text-white/10' : 'text-indigo-900 placeholder:text-indigo-200'}`}
                            placeholder={isArabic ? 'اكتب ملاحظاتك هنا...' : 'Add some notes...'}
                            value={activeUser.notes || ''}
                            onChange={(e) => updateChildProfile({ notes: e.target.value })}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
