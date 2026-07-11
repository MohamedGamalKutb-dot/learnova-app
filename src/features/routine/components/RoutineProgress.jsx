import { Card, CardBody } from '@heroui/react';

export default function RoutineProgress({ isDark, isArabic, progress, completedCount, totalCount }) {
    return (
        <div className="w-full mb-10">
            <Card className={`relative overflow-hidden rounded-[30px] sm:rounded-[40px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                <CardBody className="p-6 sm:p-10">
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{isArabic ? 'إنجازك اليوم' : "TODAY'S VIBE"}</span>
                            <h3 className="text-3xl font-black">{progress >= 1 ? (isArabic ? 'بطل خارق! ✨' : 'Hero Mode On! ✨') : (isArabic ? 'استمر يا بطل 🚀' : 'Keep Going! 🚀')}</h3>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-4xl font-black text-emerald-500">{Math.round(progress * 100)}%</span>
                            <span className="text-[10px] font-black opacity-30">{completedCount}/{totalCount} {isArabic ? 'مهام' : 'TASKS'}</span>
                        </div>
                    </div>
                    <div className={`h-5 rounded-full overflow-hidden p-1.5 ${isDark ? 'bg-white/5' : 'bg-indigo-50/50'}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-600 transition-all duration-1000 ease-out" style={{ width: `${progress * 100}%` }} />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
