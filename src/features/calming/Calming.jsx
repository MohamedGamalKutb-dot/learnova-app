import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../shared/context/AppContext';
import { useData } from '../../shared/context/DataContext';
import { useAuth } from '../../shared/context/AuthContext';

import CalmingNavbar from './components/CalmingNavbar';
import BreathingExercise from './components/BreathingExercise';
import SessionTimer from './components/SessionTimer';

export default function Calming() {
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

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#05060D] text-slate-200' : 'bg-[#F0F4FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ${isBreathing ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-indigo-600/10 animate-pulse" />
                    <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-emerald-600/10 animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
            </div>

            <CalmingNavbar isDark={isDark} isArabic={isArabic} currentChild={currentChild} />

            <main className="relative max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20">
                <div className="flex flex-col items-center max-w-[700px] mx-auto space-y-10">
                    <BreathingExercise 
                        isDark={isDark}
                        isArabic={isArabic}
                        isBreathing={isBreathing}
                        setIsBreathing={setIsBreathing}
                        trackBreathingExercise={trackBreathingExercise}
                        breathPhase={breathPhase}
                    />

                    <SessionTimer 
                        isDark={isDark}
                        isArabic={isArabic}
                        isSessionActive={isSessionActive}
                        setIsSessionActive={setIsSessionActive}
                        sessionMinutes={sessionMinutes}
                        setSessionMinutes={setSessionMinutes}
                        remainingSeconds={remainingSeconds}
                        setRemainingSeconds={setRemainingSeconds}
                        trackCalmingSession={trackCalmingSession}
                    />
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
