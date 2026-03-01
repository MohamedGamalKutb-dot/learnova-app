import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

export default function CalmingPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { trackBreathingExercise, trackCalmingSession } = useData();

    const [sessionMinutes, setSessionMinutes] = useState(5);
    const [remainingSeconds, setRemainingSeconds] = useState(300);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState('start');
    const intervalRef = useRef(null);
    const breathRef = useRef(null);
    const [visualPhase, setVisualPhase] = useState(0);

    const accent = '#8B5CF6';

    useEffect(() => {
        if (!isBreathing) { if (breathRef.current) clearInterval(breathRef.current); setBreathPhase('start'); return; }
        const phases = ['in', 'hold', 'out', 'hold'];
        let idx = 0;
        setBreathPhase('in');
        breathRef.current = setInterval(() => { idx = (idx + 1) % phases.length; setBreathPhase(phases[idx]); }, 4000);
        return () => { if (breathRef.current) clearInterval(breathRef.current); };
    }, [isBreathing]);

    useEffect(() => {
        if (!isSessionActive) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
        intervalRef.current = setInterval(() => {
            setRemainingSeconds(prev => { if (prev <= 1) { setIsSessionActive(false); return 0; } return prev - 1; });
        }, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isSessionActive]);

    useEffect(() => {
        const id = setInterval(() => setVisualPhase(p => (p + 0.01) % 1), 50);
        return () => clearInterval(id);
    }, []);

    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const breathLabel = () => {
        if (breathPhase === 'start') return isArabic ? 'ابدأ' : 'Start';
        if (breathPhase === 'in') return isArabic ? 'شهيق' : 'Breathe In';
        if (breathPhase === 'out') return isArabic ? 'زفير' : 'Breathe Out';
        return isArabic ? 'انتظر' : 'Hold';
    };

    const breathScale = breathPhase === 'in' || breathPhase === 'hold' ? 1 : 0.65;
    const breathColor = breathPhase === 'in' ? '#8B5CF6' : breathPhase === 'out' ? '#F59E0B' : '#6C63FF';

    return (
        <div className="min-h-screen font-[Inter,'Segoe_UI',sans-serif]"
            style={{ background: isDark ? 'linear-gradient(180deg, #0D1117 0%, #161B22 50%, #0D1117 100%)' : 'linear-gradient(180deg, #EDE9FE 0%, #FAFBFF 50%, #EDE9FE 100%)' }}>

            {/* Navbar */}
            <nav className={`flex items-center gap-3 py-3 px-6 max-w-[700px] mx-auto border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                <button onClick={() => navigate(-1)}
                    className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-base cursor-pointer ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>←</button>
                <h1 className={`flex-1 text-lg font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    🧘 {isArabic ? 'منطقة الهدوء' : 'Calming Zone'}
                </h1>
            </nav>

            <div className="max-w-[700px] mx-auto py-6 px-6 pb-10">
                {/* Breathing Section */}
                <div className={`rounded-[20px] p-8 text-center mb-5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(139,92,246,0.08)]'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        🫁 {isArabic ? 'تمرين التنفس' : 'Breathing Exercise'}
                    </h3>

                    {/* Breathing Circle */}
                    <div className="w-[180px] h-[180px] mx-auto rounded-full flex items-center justify-center relative"
                        style={{
                            background: `radial-gradient(circle, ${breathColor}30, ${breathColor}10, transparent)`,
                            transform: `scale(${breathScale})`, transition: 'transform 4s ease-in-out',
                            boxShadow: `0 0 40px ${breathColor}20`,
                        }}>
                        <div className="absolute inset-0 rounded-full"
                            style={{ border: `3px solid ${breathColor}30`, animation: isBreathing ? 'pulse 4s ease-in-out infinite' : 'none' }} />
                        <div className={`w-[120px] h-[120px] rounded-full flex flex-col items-center justify-center gap-1 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}>
                            <span className="text-sm font-bold" style={{ color: breathColor }}>{breathLabel()}</span>
                            <span className="text-2xl">{breathPhase === 'in' ? '🌬️' : breathPhase === 'out' ? '💨' : '😌'}</span>
                        </div>
                    </div>

                    <button onClick={() => { setIsBreathing(!isBreathing); if (!isBreathing) trackBreathingExercise(); }}
                        className="mt-6 py-3 px-8 rounded-xl border-none cursor-pointer font-bold text-[15px] transition-all duration-300"
                        style={{
                            background: isBreathing ? (isDark ? '#21262D' : '#FEF2F2') : `linear-gradient(135deg, ${accent}, #A78BFA)`,
                            color: isBreathing ? '#EF4444' : '#fff',
                            boxShadow: isBreathing ? 'none' : `0 4px 16px ${accent}40`,
                        }}>
                        {isBreathing ? (isArabic ? '⏹ إيقاف' : '⏹ Stop') : (isArabic ? '▶️ ابدأ التنفس' : '▶️ Start Breathing')}
                    </button>
                </div>

                {/* Timer Section */}
                <div className={`rounded-[20px] p-8 text-center mb-5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(245,158,11,0.08)]'}`}>
                    <h3 className={`text-lg font-bold mb-5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        ⏱️ {isArabic ? 'مؤقت الجلسة' : 'Session Timer'}
                    </h3>

                    {!isSessionActive && (
                        <div className="flex justify-center gap-2 mb-5">
                            {[3, 5, 10, 15].map(min => (
                                <button key={min} onClick={() => { setSessionMinutes(min); setRemainingSeconds(min * 60); }}
                                    className={`py-2.5 px-4 rounded-[10px] cursor-pointer text-sm border transition-all duration-200 ${sessionMinutes === min
                                            ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
                                            : `font-medium ${isDark ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-card text-text border-border'}`
                                        }`}>{min}m</button>
                            ))}
                        </div>
                    )}

                    <div className="text-[56px] font-extrabold text-amber-500 my-3 font-mono tracking-[4px]">
                        {formatTime(remainingSeconds)}
                    </div>

                    <button onClick={() => {
                        if (isSessionActive) { setIsSessionActive(false); trackCalmingSession(sessionMinutes); }
                        else { setRemainingSeconds(sessionMinutes * 60); setIsSessionActive(true); }
                    }}
                        className="py-3 px-8 rounded-xl border-none cursor-pointer font-bold text-[15px] transition-all duration-300"
                        style={{
                            background: isSessionActive ? (isDark ? '#21262D' : '#FEF2F2') : 'linear-gradient(135deg, #F59E0B, #F97316)',
                            color: isSessionActive ? '#EF4444' : '#fff',
                            boxShadow: isSessionActive ? 'none' : '0 4px 16px rgba(245,158,11,0.4)',
                        }}>
                        {isSessionActive ? (isArabic ? '⏹ إيقاف' : '⏹ Stop') : (isArabic ? '▶️ بدء الجلسة' : '▶️ Start Session')}
                    </button>
                </div>

                {/* Ambient Visual */}
                <div className={`rounded-[20px] p-6 text-center border overflow-hidden relative h-[120px] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <h3 className={`text-sm font-semibold mb-2 relative z-[1] ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        ✨ {isArabic ? 'تأمل بصري' : 'Visual Meditation'}
                    </h3>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const prog = (visualPhase + i / 12) % 1;
                        const colors = ['#8B5CF6', '#6C63FF', '#10B981', '#F59E0B', '#EC4899'];
                        return (
                            <div key={i} className="absolute rounded-full transition-opacity duration-300" style={{
                                left: `${(Math.sin(i * 2.1) * 0.5 + 0.5) * 85 + 5}%`,
                                top: `${Math.sin(prog * Math.PI * 2) * 25 + 55}px`,
                                width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6,
                                background: colors[i % 5],
                                opacity: 0.25 + 0.35 * Math.sin(prog * Math.PI),
                            }} />
                        );
                    })}
                </div>
            </div>

            <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.05); opacity: 0.6; } }`}</style>
        </div>
    );
}
