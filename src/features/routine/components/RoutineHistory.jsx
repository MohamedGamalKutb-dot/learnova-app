import { Card, CardBody } from '@heroui/react';

export default function RoutineHistory({ isDark, isArabic, historyEntries, defaultRoutineLength }) {
    if (historyEntries.length === 0) return null;

    return (
        <div className="mt-20 space-y-8 w-full">
            <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'سجل الأبطال' : 'HERO HISTORY'}</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar touch-pan-x px-2">
                {historyEntries.map(([date, tasks]) => {
                    const count = Object.keys(tasks || {}).length;
                    const pct = Math.round((count / defaultRoutineLength) * 100);
                    return (
                        <Card key={date} className={`min-w-[180px] rounded-[35px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white/40 border-indigo-50'}`}>
                            <CardBody className="p-8 flex flex-col items-center gap-3">
                                <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">{date.split('-').slice(1).reverse().join('/')}</span>
                                <span className={`text-3xl font-black ${pct >= 100 ? 'text-emerald-500' : 'text-indigo-500'}`}>{pct}%</span>
                                <span className="text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">{count} {isArabic ? 'تمت' : 'TASKS'}</span>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
