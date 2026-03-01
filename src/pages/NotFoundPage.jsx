import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function NotFoundPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [glitchActive, setGlitchActive] = useState(false);
    const [floatingEmojis] = useState(['🧩', '🎮', '📚', '🩺', '👨‍👩‍👧', '⭐', '🎈', '🚀', '💡', '🔍']);
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timer); navigate('/'); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    const quickLinks = [
        { icon: '🏠', label: isArabic ? 'الصفحة الرئيسية' : 'Home Page', path: '/' },
        { icon: '🎮', label: isArabic ? 'منطقة الطفل' : 'Child Zone', path: '/choice' },
        { icon: '👨‍👩‍👧', label: isArabic ? 'ولي الأمر' : 'Parent Portal', path: '/login' },
        { icon: '🩺', label: isArabic ? 'بوابة الطبيب' : 'Doctor Portal', path: '/doctor-auth' },
    ];

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-[Inter,'Segoe_UI',sans-serif]"
            style={{
                background: isDark
                    ? `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(108,99,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(255,101,132,0.08) 0%, transparent 50%), #0D1117`
                    : `radial-gradient(ellipse at ${mousePos.x}% ${mousePos.y}%, rgba(108,99,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(255,101,132,0.05) 0%, transparent 50%), #FAFBFF`,
            }}
        >
            {/* Floating Background Emojis */}
            {floatingEmojis.map((emoji, i) => (
                <div key={i} className="absolute pointer-events-none transition-transform duration-300 ease-out"
                    style={{
                        top: `${10 + (i * 8) % 80}%`, left: `${5 + (i * 11) % 90}%`,
                        fontSize: 20 + (i % 3) * 10, opacity: isDark ? 0.06 : 0.08,
                        animation: `floatEmoji ${6 + i % 4}s ease-in-out infinite ${i * 0.5}s`,
                        transform: `translateX(${(mousePos.x - 50) * (0.05 + i * 0.01)}px) translateY(${(mousePos.y - 50) * (0.05 + i * 0.01)}px)`,
                    }}>{emoji}</div>
            ))}

            {/* Decorative Circles */}
            <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${isDark ? 'rgba(108,99,255,0.06)' : 'rgba(108,99,255,0.04)'}, transparent 70%)` }} />
            <div className="absolute -bottom-[15%] -left-[8%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${isDark ? 'rgba(255,101,132,0.05)' : 'rgba(255,101,132,0.03)'}, transparent 70%)` }} />

            {/* Main Content */}
            <div className="relative z-[1] text-center max-w-[600px] px-6 py-10" style={{ animation: 'pageSlideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>

                {/* 404 Number */}
                <div className="relative mb-2">
                    <h1 className="text-[clamp(120px,20vw,200px)] font-black m-0 leading-none bg-clip-text [-webkit-text-fill-color:transparent] tracking-[-4px]"
                        style={{
                            background: glitchActive ? 'linear-gradient(135deg, #FF6584, #FF8E9E)' : 'linear-gradient(135deg, #6C63FF, #8B5CF6, #FF6584)',
                            WebkitBackgroundClip: 'text', transition: 'all 0.1s',
                            transform: glitchActive ? 'translateX(3px) skewX(-2deg)' : 'translateX(0)',
                            animation: 'pulse404 4s ease-in-out infinite',
                        }}>404</h1>
                    <div className="absolute top-[10%] right-[5%] text-5xl opacity-30"
                        style={{ animation: 'puzzleSpin 8s linear infinite', transform: `translate(${(mousePos.x - 50) * 0.2}px, ${(mousePos.y - 50) * 0.2}px)` }}>🧩</div>
                    <div className="absolute bottom-[10%] left-[8%] text-4xl opacity-25"
                        style={{ animation: 'puzzleSpin 10s linear infinite reverse', transform: `translate(${(mousePos.x - 50) * -0.15}px, ${(mousePos.y - 50) * -0.15}px)` }}>🔍</div>
                </div>

                {/* Robot */}
                <div className="text-7xl mb-4" style={{ animation: 'robotBounce 2s ease-in-out infinite' }}>🤖</div>

                {/* Title */}
                <h2 className={`text-[clamp(24px,4vw,32px)] font-extrabold mb-3 ${isDark ? 'text-text-dark' : 'text-text'}`}
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                    {isArabic ? 'أوبس! الصفحة مش موجودة' : 'Oops! Page Not Found'}
                </h2>

                {/* Description */}
                <p className={`text-base leading-relaxed max-w-[460px] mx-auto mb-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                    {isArabic
                        ? 'يبدو إن الصفحة اللي بتدور عليها اتنقلت أو مش موجودة. ممكن تكون كتبت العنوان غلط 🤔'
                        : "The page you're looking for might have been moved, deleted, or maybe you just mistyped the URL 🤔"}
                </p>

                {/* Countdown */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-3xl mb-7 border ${isDark ? 'bg-[rgba(108,99,255,0.08)] border-[rgba(108,99,255,0.15)]' : 'bg-[rgba(108,99,255,0.05)] border-[rgba(108,99,255,0.1)]'}`}
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-1000"
                        style={{ background: `conic-gradient(#6C63FF ${(countdown / 15) * 360}deg, ${isDark ? '#21262D' : '#E5E7EB'} 0deg)` }}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-accent ${isDark ? 'bg-card-dark' : 'bg-[#FAFBFF]'}`}>{countdown}</div>
                    </div>
                    <span className={`text-[13px] font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? 'هيتم تحويلك للصفحة الرئيسية تلقائياً' : 'Redirecting to home automatically'}
                    </span>
                </div>

                {/* CTA Button */}
                <div style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
                    <button onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl border-none cursor-pointer bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold text-[17px] shadow-[0_8px_30px_rgba(108,99,255,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_14px_40px_rgba(108,99,255,0.45)]">
                        <span className="text-xl">🏠</span>
                        {isArabic ? 'ارجع للصفحة الرئيسية' : 'Back to Home'}
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-10" style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
                    <p className={`text-[13px] font-semibold mb-3.5 uppercase tracking-wider ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? '🔗 روابط سريعة' : '🔗 Quick Links'}
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 max-w-[400px] mx-auto">
                        {quickLinks.map((link, i) => (
                            <button key={i} onClick={() => navigate(link.path)}
                                className={`flex items-center gap-2.5 py-3.5 px-4 rounded-[14px] cursor-pointer transition-all duration-300 border hover:-translate-y-1 hover:border-accent hover:shadow-[0_8px_24px_rgba(108,99,255,0.12)] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}
                                style={{ animation: `fadeInUp 0.4s ease-out ${0.7 + i * 0.08}s both` }}>
                                <span className="text-[22px]">{link.icon}</span>
                                <span className={`text-[13px] font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{link.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* URL display */}
                <div className={`mt-9 py-3 px-5 rounded-xl inline-flex items-center gap-2 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.9s both' }}>
                    <span className="text-sm">🔗</span>
                    <code className={`text-xs font-medium font-mono ${isDark ? 'text-accent2' : 'text-red-600'}`}>{window.location.pathname}</code>
                    <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>← {isArabic ? 'العنوان ده مش موجود' : "doesn't exist"}</span>
                </div>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 inset-x-0 h-[120px] pointer-events-none"
                style={{ background: isDark ? 'linear-gradient(to top, rgba(108,99,255,0.03), transparent)' : 'linear-gradient(to top, rgba(108,99,255,0.02), transparent)' }} />

            {/* Footer */}
            <div className="absolute bottom-5 text-center z-[1]">
                <p className={`text-xs m-0 ${isDark ? 'text-border-dark' : 'text-gray-300'}`}>
                    © 2026 LearnNeur • {isArabic ? 'منصة دعم أطفال التوحد' : 'Autism Support Platform'}
                </p>
            </div>

            <style>{`
                @keyframes pageSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse404 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
                @keyframes robotBounce { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-8px) rotate(-5deg); } 75% { transform: translateY(-4px) rotate(5deg); } }
                @keyframes floatEmoji { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-20px) rotate(5deg); } 66% { transform: translateY(-10px) rotate(-3deg); } }
                @keyframes puzzleSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
