import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardBody, Chip } from '@heroui/react';

export default function CalmingPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { trackBreathingExercise, trackCalmingSession } = useData();
    const { currentChild } = useAuth();

    const [sessionMinutes, setSessionMinutes] = useState(5);
    const [remainingSeconds, setRemainingSeconds] = useState(300);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState('start');
    
    const intervalRef = useRef(null);
    const breathRef = useRef(null);

    // BREATHING LOGIC
    useEffect(() => {
        if (!isBreathing) {
            if (breathRef.current) clearInterval(breathRef.current);
            setBreathPhase('start');
            return;
        }
        const phases = ['in', 'hold', 'out', 'hold'];
        let idx = 0;
        setBreathPhase('in');
        breathRef.current = setInterval(() => {
            idx = (idx + 1) % phases.length;
            setBreathPhase(phases[idx]);
        }, 4000);
        return () => { if (breathRef.current) clearInterval(breathRef.current); };
    }, [isBreathing]);

    // SESSION TIMER LOGIC
    useEffect(() => {
        if (!isSessionActive) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    setIsSessionActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isSessionActive]);

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const breathLabel = () => {
        if (breathPhase === 'start') return isArabic ? 'جاهز؟' : 'Ready?';
        if (breathPhase === 'in') return isArabic ? 'شهيق ببطء...' : 'Breathe In...';
        if (breathPhase === 'out') return isArabic ? 'زفير هادئ...' : 'Breathe Out...';
        return isArabic ? 'توقف قليلاً' : 'Hold...';
    };

    const breathScale = breathPhase === 'in' || (breathPhase === 'hold' && isBreathing) ? 1.4 : 0.8;
    const breathColor = breathPhase === 'in' ? '#8B5CF6' : breathPhase === 'out' ? '#10B981' : '#F59E0B';

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#05060D] text-slate-200' : 'bg-[#F0F4FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ${isBreathing ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-indigo-600/10 animate-pulse" />
                    <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-emerald-600/10 animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
            </div>

            {/* NAVBAR */}
            <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#05060D]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="bordered" radius="full" size="sm" className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} onPress={() => navigate(-1)}>
                        {isArabic ? '→' : '←'}
                    </Button>
                    <div className="flex flex-col text-start">
                        <h1 className={`text-xl font-black leading-none ${isDark ? 'text-indigo-100' : 'text-indigo-900'} flex items-center gap-2`}>
                            <div className="w-8 h-8 rounded-full border overflow-hidden shrink-0">
                                {currentChild?.avatar && (currentChild.avatar.startsWith('data:image') || currentChild.avatar.startsWith('http')) ? (
                                    <img src={currentChild.avatar} alt="Avatar" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-500/20 text-xs">{currentChild?.avatar || '🧘'}</div>
                                )}
                            </div>
                            {isArabic ? 'مساحة السكينة' : 'Serenity Space'}
                        </h1>
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-40 mt-1">{isArabic ? 'تنفس، استرخِ، ركز' : 'BREATHE, RELAX, FOCUS'}</span>
                    </div>
                </div>
            </nav>

            <main className="relative max-w-[1300px] mx-auto px-8 pt-32 pb-20">
                <div className="flex flex-col items-center max-w-[700px] mx-auto space-y-10">
                    
                    {/* Breathing Card */}
                    <Card className={`w-full rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl p-8 ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-50 shadow-indigo-500/5'}`}>
                        <CardBody className="items-center text-center gap-10">
                            <header className="w-full flex justify-between items-center">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] opacity-40">{isArabic ? 'تمرين التنفس' : 'BREATHING'}</h3>
                                <Chip variant="flat" color="secondary" className="font-bold">{isBreathing ? (isArabic ? 'نشط' : 'ACTIVE') : (isArabic ? 'جاهز' : 'READY')}</Chip>
                            </header>

                            <div className="relative w-64 h-64 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full blur-[40px] transition-all duration-[4000ms]" 
                                    style={{ 
                                        background: `radial-gradient(circle, ${breathColor}40, transparent)`,
                                        transform: `scale(${isBreathing ? breathScale * 1.5 : 1})` 
                                    }} 
                                />
                                
                                <div className={`relative w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-[4000ms] shadow-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-indigo-100'}`}
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

                    {/* Session Timer Card */}
                    <Card className={`w-full rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-xl p-8 ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-50 shadow-indigo-500/5'}`}>
                        <CardBody className="items-center text-center gap-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] opacity-40">{isArabic ? 'مؤقت الجلسة' : 'SESSION TIMER'}</h3>
                            
                            {!isSessionActive && (
                                <div className="flex gap-3 justify-center">
                                    {[3, 5, 10].map(min => (
                                        <Button key={min} size="sm" radius="full" onPress={() => { setSessionMinutes(min); setRemainingSeconds(min * 60); }}
                                            className={`font-black h-10 px-6 ${sessionMinutes === min ? 'bg-amber-500 text-white shadow-lg' : isDark ? 'bg-white/5' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {min}m
                                        </Button>
                                    ))}
                                </div>
                            )}

                            <div className={`text-7xl font-black tracking-widest font-mono transition-colors ${isSessionActive ? 'text-amber-500 scale-110' : 'opacity-40'}`}>
                                {formatTime(remainingSeconds)}
                            </div>

                            <Button size="lg" radius="full" onPress={() => { if (isSessionActive) { setIsSessionActive(false); trackCalmingSession(sessionMinutes); } else { setRemainingSeconds(sessionMinutes * 60); setIsSessionActive(true); } }}
                                className={`h-14 px-10 font-black tracking-widest text-xs uppercase shadow-xl ${isSessionActive ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500 text-white shadow-amber-500/20'}`}>
                                {isSessionActive ? (isArabic ? 'إيقاف المؤقت' : 'STOP TIMER') : (isArabic ? 'ابدأ الجلسة' : 'START SESSION')}
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-15px) rotate(5deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
