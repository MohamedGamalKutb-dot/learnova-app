import { Card, CardBody, Chip, Button } from '@heroui/react';

export default function BreathingExercise({ 
    isDark, 
    isArabic, 
    isBreathing, 
    setIsBreathing, 
    trackBreathingExercise, 
    breathPhase 
}) {
    const breathLabel = () => {
        if (breathPhase === 'start') return isArabic ? 'جاهز؟' : 'Ready?';
        if (breathPhase === 'in') return isArabic ? 'شهيق ببطء...' : 'Breathe In...';
        if (breathPhase === 'out') return isArabic ? 'زفير هادئ...' : 'Breathe Out...';
        return isArabic ? 'توقف قليلاً' : 'Hold...';
    };

    const breathScale = breathPhase === 'in' || (breathPhase === 'hold' && isBreathing) ? 1.4 : 0.8;
    const breathColor = breathPhase === 'in' ? '#8B5CF6' : breathPhase === 'out' ? '#10B981' : '#F59E0B';

    return (
        <Card className={`w-full rounded-[35px] sm:rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl p-4 sm:p-8 ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-50 shadow-indigo-500/5'}`}>
            <CardBody className="items-center text-center gap-10">
                <header className="w-full flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] opacity-40">{isArabic ? 'تمرين التنفس' : 'BREATHING'}</h3>
                    <Chip variant="flat" color="secondary" className="font-bold">{isBreathing ? (isArabic ? 'نشط' : 'ACTIVE') : (isArabic ? 'جاهز' : 'READY')}</Chip>
                </header>

                <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full blur-[40px] transition-all duration-[4000ms]" 
                        style={{ 
                            background: `radial-gradient(circle, ${breathColor}40, transparent)`,
                            transform: `scale(${isBreathing ? breathScale * 1.5 : 1})` 
                        }} 
                    />
                    
                    <div className={`relative w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-[4000ms] shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-indigo-100'}`}
                        style={{ transform: `scale(${breathScale})`, borderColor: isBreathing ? breathColor : 'transparent' }}>
                        <div className="text-4xl animate-float">{isBreathing ? (breathPhase === 'in' ? '☁️' : breathPhase === 'out' ? '🍃' : '✨') : '🧘'}</div>
                    </div>

                    <div className="absolute -bottom-4 bg-indigo-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
                        {breathLabel()}
                    </div>
                </div>

                <Button size="lg" radius="full" onPress={() => { setIsBreathing(!isBreathing); if (!isBreathing) trackBreathingExercise(); }}
                    className={`h-16 px-12 font-black text-lg transition-all shadow-xl ${isBreathing ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-indigo-500 text-white shadow-indigo-500/20'}`}>
                    {isBreathing ? (isArabic ? 'إيقاف التمرين' : 'Stop Exercise') : (isArabic ? 'ابدأ التنفس الآن' : 'Start Breathing')}
                </Button>
            </CardBody>
        </Card>
    );
}
