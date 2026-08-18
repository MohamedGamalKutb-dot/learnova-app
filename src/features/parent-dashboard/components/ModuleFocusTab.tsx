import { useState, useEffect } from 'react';
import { Card, CardBody, Progress } from '@heroui/react';
import { FaChartLine, FaCheck, FaTimes } from 'react-icons/fa';
import { getGameStats, subscribeToGameStats } from '../../../shared/services/gamesService';

interface ModuleFocusTabProps {
    isArabic: boolean;
    isDark: boolean;
    auraCard: string;
    auraAccent: string;
    SectionTitle: React.ElementType;
    todayKey: string;
    todayRoutinePct: number;
    todayCompletedCount: number;
    totalRoutineTasks: number;
    todayEmotionPct: number;
    todayEmotionStats: any;
    data: any;
    moduleNames: Record<string, string>;
    moduleEmojis: Record<string, string>;
    recommendations: string[];
    childId: string;
}

export default function ModuleFocusTab({
    isArabic, isDark, auraCard, auraAccent, SectionTitle,
    todayKey, todayRoutinePct, todayCompletedCount, totalRoutineTasks,
    todayEmotionPct, todayEmotionStats,
    data, moduleNames, moduleEmojis, recommendations,
    childId
}: ModuleFocusTabProps) {
    const [gameStats, setGameStats] = useState<any>(() => getGameStats(childId));

    useEffect(() => {
        setGameStats(getGameStats(childId));

        if (!childId) return;

        const unsub = subscribeToGameStats(childId, (freshStats: any) => {
            if (freshStats) {
                setGameStats(freshStats);
            }
        });

        const handleStorage = (e: StorageEvent) => {
            if (e.key === `learnova_games_${childId}`) {
                try {
                    const stats = JSON.parse(e.newValue || '{}');
                    if (stats) setGameStats(stats);
                } catch {}
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => {
            try {
                if (unsub) unsub();
            } catch (e) {
                console.warn('Firestore unsub error:', e);
            }
            window.removeEventListener('storage', handleStorage);
        };
    }, [childId]);

    return (
        <div className="space-y-10">
            {/* PROGRESS GRID (Luminescent Rings) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`rounded-[45px] border ${auraCard}`}>
                    <CardBody className="p-5 sm:p-8">
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
                    <CardBody className="p-5 sm:p-8">
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
                                    <span className="text-emerald-400 font-black text-xl flex items-center gap-1"><FaCheck /> {todayEmotionStats?.correct || 0}</span>
                                    <span className="text-rose-500 font-black text-xl flex items-center gap-1"><FaTimes /> {(todayEmotionStats?.total || 0) - (todayEmotionStats?.correct || 0)}</span>
                                </div>
                                <p className={`text-[10px] mt-2 font-black ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{isArabic ? 'مجموع الجلسات' : 'Total Sessions'} : {todayEmotionStats?.total || 0}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* GAME STATISTICS GRID */}
            <div className="space-y-6">
                <SectionTitle emoji="🎮" title={isArabic ? 'إحصائيات الألعاب' : 'Game Statistics'} badge={isArabic ? 'تحديث مباشر' : 'Live Update'} badgeColor="#A8B4FF" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className={`rounded-[38px] border ${auraCard}`}>
                        <CardBody className="p-5 text-center flex flex-col items-center justify-center">
                            <span className="text-3xl mb-2">🧩</span>
                            <div className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                {isArabic ? 'البازل المكتملة' : 'Puzzles Done'}
                            </div>
                            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {gameStats?.puzzleCompleted || 0}
                            </div>
                        </CardBody>
                    </Card>

                    <Card className={`rounded-[38px] border ${auraCard}`}>
                        <CardBody className="p-5 text-center flex flex-col items-center justify-center">
                            <span className="text-3xl mb-2">✅</span>
                            <div className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                {isArabic ? 'الكلمات الصحيحة' : 'Words Correct'}
                            </div>
                            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {gameStats?.wordCorrect || 0}
                            </div>
                        </CardBody>
                    </Card>

                    <Card className={`rounded-[38px] border ${auraCard}`}>
                        <CardBody className="p-5 text-center flex flex-col items-center justify-center">
                            <span className="text-3xl mb-2">🖼️</span>
                            <div className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                {isArabic ? 'الرسومات المحفوظة' : 'Drawings'}
                            </div>
                            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {gameStats?.drawingSaved || 0}
                            </div>
                        </CardBody>
                    </Card>

                    <Card className={`rounded-[38px] border ${auraCard}`}>
                        <CardBody className="p-5 text-center flex flex-col items-center justify-center">
                            <span className="text-3xl mb-2">🎵</span>
                            <div className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                {isArabic ? 'النغمات المعزوفة' : 'Notes Played'}
                            </div>
                            <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {gameStats?.pianoTotalNotes || 0}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* MODULE USAGE (Aura Mosaic) */}
            <div className="space-y-6">
                <SectionTitle emoji={<FaChartLine />} title={isArabic ? 'تحليل الأداء' : 'Module Focus'} badge={isArabic ? 'شامل' : 'Overall'} badgeColor={auraAccent} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['pecs', 'emotions', 'routine'].map((mod) => {
                        const count = data?.moduleUsage?.[mod] || 0;
                        return (
                        <Card key={mod} className={`group rounded-[38px] border ${auraCard} hover:border-[#A8B4FF]/40 transition-all duration-500`}>
                            <CardBody className="p-4 sm:p-7 text-center">
                                <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/5 mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-inner">
                                    {moduleEmojis[mod].includes('.png') ? <img src={moduleEmojis[mod]} alt="" className="w-full h-full object-cover"  loading="lazy" decoding="async"/> : moduleEmojis[mod]}
                                </div>
                                <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{moduleNames[mod]}</div>
                                <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{count}</div>
                            </CardBody>
                        </Card>
                        );
                    })}
                </div>
            </div>

            {/* SMART RECOMMENDATIONS (Aura Floating Tips) */}
            <Card className={`rounded-[50px] border shadow-2xl relative overflow-hidden ${isDark ? 'bg-indigo-500/5 border-indigo-400/20' : 'bg-indigo-50 border-indigo-100'}`}>
                <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 rounded-full blur-[50px] -mr-12 -mt-12" />
                <CardBody className="p-5 sm:p-10">
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
