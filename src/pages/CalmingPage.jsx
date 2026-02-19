import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';

export default function CalmingPage() {
    const navigate = useNavigate();
    const { isArabic } = useApp();
    const { trackBreathingExercise, trackCalmingSession } = useData();

    const [sessionMinutes, setSessionMinutes] = useState(5);
    const [remainingSeconds, setRemainingSeconds] = useState(300);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState('start'); // start, in, hold, out
    const intervalRef = useRef(null);
    const breathRef = useRef(null);
    const [visualPhase, setVisualPhase] = useState(0);

    // Breathing animation
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

    // Session timer
    useEffect(() => {
        if (!isSessionActive) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
        intervalRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) { setIsSessionActive(false); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isSessionActive]);

    // Visual animation
    useEffect(() => {
        const id = setInterval(() => setVisualPhase(p => (p + 0.01) % 1), 50);
        return () => clearInterval(id);
    }, []);

    const formatTime = (s) => {
        const min = String(Math.floor(s / 60)).padStart(2, '0');
        const sec = String(s % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    const breathLabel = () => {
        if (breathPhase === 'start') return isArabic ? 'ابدأ' : 'Start';
        if (breathPhase === 'in') return isArabic ? 'شهيق' : 'Breathe In';
        if (breathPhase === 'out') return isArabic ? 'زفير' : 'Breathe Out';
        return isArabic ? 'انتظر' : 'Hold';
    };

    const breathScale = breathPhase === 'in' || breathPhase === 'hold' ? 1 : 0.6;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1A1A2E 0%, rgba(184,169,232,0.3) 50%, #1A1A2E 100%)', direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* AppBar */}
            <div style={{ background: '#16213E', color: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'منطقة الهدوء' : 'Calming Zone'}</h1>
                <div style={{ width: 30 }} />
            </div>

            <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
                {/* Breathing Section */}
                <div style={{ background: 'rgba(31,41,64,0.6)', borderRadius: 28, padding: 24, border: '1px solid rgba(184,169,232,0.2)', textAlign: 'center', marginBottom: 24 }}>
                    <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>{isArabic ? '🫁 تمرين التنفس' : '🫁 Breathing Exercise'}</h3>
                    <div style={{
                        width: 160, height: 160, margin: '0 auto', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(184,169,232,0.6), rgba(126,182,216,0.3), transparent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: `scale(${breathScale})`, transition: 'transform 4s ease-in-out',
                        boxShadow: '0 0 30px rgba(184,169,232,0.3)',
                    }}>
                        <span style={{ color: '#fff', fontSize: 18, fontWeight: 600, textAlign: 'center' }}>{breathLabel()}</span>
                    </div>
                    <button onClick={() => { setIsBreathing(!isBreathing); if (!isBreathing) trackBreathingExercise(); }} style={{
                        marginTop: 16, padding: '12px 24px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        background: isBreathing ? 'rgba(248,180,180,0.3)' : 'rgba(184,169,232,0.3)',
                        color: '#fff', fontWeight: 600, fontSize: 15,
                    }}>
                        {isBreathing ? (isArabic ? '⬛ إيقاف' : '⬛ Stop') : (isArabic ? '▶ ابدأ التنفس' : '▶ Start Breathing')}
                    </button>
                </div>

                {/* Timer */}
                <div style={{ background: 'rgba(31,41,64,0.6)', borderRadius: 28, padding: 20, border: '1px solid rgba(249,228,167,0.2)', marginBottom: 24, textAlign: 'center' }}>
                    <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{isArabic ? '⏱️ مؤقت الجلسة' : '⏱️ Session Timer'}</h3>
                    {!isSessionActive && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                            {[3, 5, 10, 15].map(min => (
                                <button key={min} onClick={() => { setSessionMinutes(min); setRemainingSeconds(min * 60); }} style={{
                                    padding: '8px 16px', borderRadius: 12,
                                    background: sessionMinutes === min ? 'rgba(249,228,167,0.3)' : 'transparent',
                                    color: sessionMinutes === min ? '#F9E4A7' : '#E0E0E0',
                                    border: `1px solid ${sessionMinutes === min ? '#F9E4A7' : '#555'}`,
                                    cursor: 'pointer', fontWeight: sessionMinutes === min ? 700 : 400,
                                }}>{min}m</button>
                            ))}
                        </div>
                    )}
                    <div style={{ fontSize: 48, fontWeight: 700, color: '#F9E4A7', margin: '12px 0' }}>{formatTime(remainingSeconds)}</div>
                    <button onClick={() => {
                        if (isSessionActive) { setIsSessionActive(false); trackCalmingSession(sessionMinutes); }
                        else { setRemainingSeconds(sessionMinutes * 60); setIsSessionActive(true); }
                    }} style={{
                        padding: '12px 24px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        background: isSessionActive ? 'rgba(248,180,180,0.3)' : 'rgba(249,228,167,0.3)',
                        color: '#fff', fontWeight: 600, fontSize: 15,
                    }}>
                        {isSessionActive ? (isArabic ? '⬛ إيقاف' : '⬛ Stop') : (isArabic ? '▶ بدء الجلسة' : '▶ Start Session')}
                    </button>
                </div>

                {/* Visual Dots */}
                <div style={{ height: 120, position: 'relative' }}>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const prog = (visualPhase + i / 12) % 1;
                        const colors = ['#7EB6D8', '#B8A9E8', '#A8E6CF', '#F2A7B3', '#F9E4A7'];
                        return (
                            <div key={i} style={{
                                position: 'absolute',
                                left: `${(Math.sin(i * 2.1) * 0.5 + 0.5) * 80 + 5}%`,
                                top: `${Math.sin(prog * Math.PI * 2) * 30 + 50}px`,
                                width: 12 + (i % 3) * 8, height: 12 + (i % 3) * 8,
                                borderRadius: '50%', background: colors[i % 5],
                                opacity: 0.3 + 0.4 * Math.sin(prog * Math.PI),
                                transition: 'opacity 0.3s',
                            }} />
                        );
                    })}
                </div>
            </div>
        </div >
    );
}
