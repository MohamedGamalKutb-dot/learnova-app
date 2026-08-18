import { Card, CardBody } from '@heroui/react';

interface EmotionsHistoryProps {
    entries: [string, any][];
    isDark: boolean;
    isArabic: boolean;
}

export default function EmotionsHistory({ entries, isDark, isArabic }: EmotionsHistoryProps) {
    if (!entries || entries.length === 0) return null;

    return (
        <div className="space-y-6 w-full max-w-[600px] mx-auto">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center">
                {isArabic ? 'سجل الأداء السابق' : 'PREVIOUS PERFORMANCE'}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2 justify-center">
                {entries.map(([date, stats]) => {
                    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                    return (
                        <Card key={date} className={`min-w-[140px] rounded-[30px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.02] border-white/5 shadow-xl' : 'bg-white shadow-md border-indigo-50'}`}>
                            <CardBody className="p-6 flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">{date.split('-').slice(1).reverse().join('/')}</span>
                                <span className={`text-2xl font-black ${pct >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{pct}%</span>
                                <span className="text-[8px] font-black tracking-widest opacity-40 uppercase">{stats.correct}/{stats.total}</span>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
