export default function ChildHomeGreeting({ isDark, isArabic, currentChild, routineCompletion }) {
    return (
        <header className="mb-10 sm:mb-14 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
            <div className="space-y-3">
                <div className={`flex items-center gap-3 font-black tracking-[0.3em] uppercase text-[10px] transition-colors duration-1000 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    <span className={`w-12 h-[1px] transition-colors duration-1000 ${isDark ? 'bg-indigo-500/50' : 'bg-indigo-300'}`} />
                    {isArabic ? 'تم تفعيل النظام' : 'System Online'}
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
                    {isArabic ? `أهلاً، ${currentChild.name}` : `Hey, ${currentChild.name}`} 
                    <span className="text-indigo-500 animate-pulse">.</span>
                </h1>
            </div>
            <div className="flex gap-4 shrink-0">
                <div className={`px-5 sm:px-8 py-4 sm:py-5 rounded-[24px] sm:rounded-[32px] backdrop-blur-2xl border flex flex-col items-center min-w-[110px] sm:min-w-[140px] shadow-2xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <span className={`text-3xl font-black ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{routineCompletion}%</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">{isArabic ? 'الروتين اليومي' : 'Daily Routine'}</span>
                </div>
            </div>
        </header>
    );
}
