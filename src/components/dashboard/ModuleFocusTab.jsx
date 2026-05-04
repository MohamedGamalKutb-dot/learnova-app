import { Card, CardBody, Progress } from '@heroui/react';

export default function ModuleFocusTab({
    isArabic, isDark, auraCard, auraAccent, SectionTitle,
    todayKey, todayRoutinePct, todayCompletedCount, totalRoutineTasks,
    todayEmotionPct, todayEmotionStats,
    data, moduleNames, moduleEmojis, recommendations
}) {
    return (
        <div className="space-y-10">
            {/* PROGRESS GRID (Luminescent Rings) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`rounded-[45px] border ${auraCard}`}>
                    <CardBody className="p-8">
                        <SectionTitle icon="/icons/daily_rhythm.png" title={isArabic ? 'الروتين اليومي' : 'Daily Rhythm'} badge={todayKey} badgeColor="#4ECDC4" />
                        <div className="flex items-center gap-7">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(78,205,196,0.2)]">
                                    <circle cx="56" cy="56" r="48" fill="transparent" stroke={isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'} strokeWidth="10" />
                                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="#4ECDC4" strokeWidth="10"
                                        strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * todayRoutinePct) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                </svg>
                                <span className={`absolute text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{todayRoutinePct}%</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className={`text-[12px] font-black uppercase tracking-widest m-0 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{isArabic ? 'المهام اليومية' : 'Daily Tasks'}</p>
                                <p className={`text-4xl font-black m-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>{todayCompletedCount}<span className="text-lg opacity-30 mx-1">/</span>{totalRoutineTasks}</p>
                                <Progress value={todayRoutinePct} size="sm" color="success" className="mt-2" classNames={{ indicator: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]' }} />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className={`rounded-[45px] border ${auraCard}`}>
                    <CardBody className="p-8">
                        <SectionTitle icon="/icons/emotion_mastery.png" title={isArabic ? 'نمو المشاعر' : 'Emotion Mastery'} badge={isArabic ? 'أسبوعي' : 'Weekly'} badgeColor="#FF6584" />
                        <div className="flex items-center gap-7">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(255,101,132,0.2)]">
                                    <circle cx="56" cy="56" r="48" fill="transparent" stroke={isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'} strokeWidth="10" />
                                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="#FF6584" strokeWidth="10"
                                        strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * todayEmotionPct) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                </svg>
                                <span className={`absolute text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{todayEmotionPct}%</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className={`text-[12px] font-black uppercase tracking-widest m-0 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{isArabic ? 'نسبة الدقة' : 'Recognition'}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-emerald-400 font-black text-xl">✓ {todayEmotionStats.correct}</span>
                                    <span className="text-rose-500 font-black text-xl">✕ {todayEmotionStats.total - todayEmotionStats.correct}</span>
                                </div>
                                <p className={`text-[10px] mt-2 font-black ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{isArabic ? 'مجموع الجلسات' : 'Total Sessions'} : {todayEmotionStats.total}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* MODULE USAGE (Aura Mosaic) */}
            <div className="space-y-6">
                <SectionTitle icon="/icons/quiz_stats.png" title={isArabic ? 'تحليل الأداء' : 'Module Focus'} badge={isArabic ? 'شامل' : 'Overall'} badgeColor={auraAccent} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(data?.moduleUsage || {}).map(([mod, count]) => (
                        <Card key={mod} className={`group rounded-[38px] border ${auraCard} hover:border-[#A8B4FF]/40 transition-all duration-500`}>
                            <CardBody className="p-7 text-center">
                                <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/5 mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-inner">
                                    {moduleEmojis[mod].includes('.png') ? <img src={moduleEmojis[mod]} alt="" className="w-full h-full object-cover" /> : moduleEmojis[mod]}
                                </div>
                                <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{moduleNames[mod]}</div>
                                <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{count}</div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {/* SMART RECOMMENDATIONS (Aura Floating Tips) */}
            <Card className={`rounded-[50px] border shadow-2xl relative overflow-hidden ${isDark ? 'bg-indigo-500/5 border-indigo-400/20' : 'bg-indigo-50 border-indigo-100'}`}>
                <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 rounded-full blur-[50px] -mr-12 -mt-12" />
                <CardBody className="p-10">
                    <SectionTitle icon="/icons/brain_logo.png" title={isArabic ? 'توصيات ذكية' : 'Assistant Insights'} />
                    <div className="space-y-4">
                        {recommendations.map((rec, i) => (
                            <div key={i} className={`flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-indigo-100 shadow-sm'}`}>
                                <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_12px_#A8B4FF]" />
                                <p className={`text-base font-black m-0 leading-relaxed ${isDark ? 'text-indigo-100/90' : 'text-indigo-900'}`}>{rec}</p>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
