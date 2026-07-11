import { Card, CardBody, Button } from '@heroui/react';

export default function SessionTimer({ 
    isDark, 
    isArabic, 
    isSessionActive, 
    setIsSessionActive, 
    sessionMinutes, 
    setSessionMinutes, 
    remainingSeconds, 
    setRemainingSeconds, 
    trackCalmingSession 
}) {
    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    return (
        <Card className={`w-full rounded-[35px] sm:rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-xl p-4 sm:p-8 ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-50 shadow-indigo-500/5'}`}>
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
    );
}
