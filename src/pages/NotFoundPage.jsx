import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Card, CardBody, Chip } from '@heroui/react';

export default function NotFoundPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const particlesRef = useRef(null);

    /* ── spawn particles inside card ── */
    useEffect(() => {
        const container = particlesRef.current;
        if (!container) return;
        const colors = ['#BFDBFE', '#A5F3FC', '#DDD6FE', '#FDE68A', '#A7F3D0', '#FBCFE8'];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = 4 + Math.random() * 8;
            p.style.cssText = `
                position:absolute; border-radius:50%;
                width:${size}px; height:${size}px;
                background:${colors[Math.floor(Math.random() * colors.length)]};
                left:${Math.random() * 100}%;
                animation: particleFloat ${4 + Math.random() * 6}s linear infinite;
                animation-delay:${Math.random() * 6}s;
                opacity:0;
            `;
            container.appendChild(p);
        }
        return () => { container.innerHTML = ''; };
    }, []);

    const sugLinks = [
        { emoji: '🏠', label: isArabic ? 'الرئيسية' : 'Home', path: '/', bg: '#DBEAFE' },
        { emoji: '🚪', label: isArabic ? 'تسجيل الدخول' : 'Log In', path: '/choice', bg: '#EDE9FE' },
        { emoji: '🧒', label: isArabic ? 'صفحة الطفل' : "Child's Page", path: '/child-home', bg: '#D1FAE5' },
        { emoji: '📞', label: isArabic ? 'تواصل معنا' : 'Contact Us', path: '/', bg: '#FEF3C7' },
    ];

    return (
        <div className="min-h-screen flex flex-col overflow-hidden font-[Cairo,'Plus_Jakarta_Sans',sans-serif] transition-colors duration-300"
            style={{ background: isDark ? '#080E1C' : '#F4F6FF', color: isDark ? '#F1F5F9' : '#0F172A' }}>

            {/* ── Background Layers ── */}
            <div className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 70% 55% at 50% 0%, rgba(37,99,235,0.07) 0%, transparent 65%),
                        radial-gradient(ellipse 45% 40% at 10% 90%, rgba(6,182,212,0.05) 0%, transparent 55%),
                        radial-gradient(ellipse 40% 35% at 90% 80%, rgba(139,92,246,0.05) 0%, transparent 55%)
                    `,
                }} />
            <div className="fixed inset-0 pointer-events-none z-0 opacity-45"
                style={{
                    backgroundImage: `radial-gradient(circle, ${isDark ? '#1E293B' : '#E2E8F0'} 1px, transparent 1px)`,
                    backgroundSize: '34px 34px',
                }} />

            {/* ── Top Nav ── */}
            <nav className={`relative z-10 flex items-center justify-between py-3.5 px-6 sm:px-10 backdrop-blur-[18px] border-b transition-colors duration-300 ${isDark ? 'bg-[rgba(8,14,28,0.90)] border-[#1E293B]' : 'bg-[rgba(255,255,255,0.80)] border-[#E2E8F0]'}`}>
                <a onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer no-underline">
                    <span className="text-[19px] font-black tracking-tight bg-clip-text [-webkit-text-fill-color:transparent]"
                        style={{ background: 'linear-gradient(90deg, #2563EB, #8B5CF6)', WebkitBackgroundClip: 'text' }}>LearnNeur</span>
                    <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.25)] overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    </div>
                </a>
            </nav>

            {/* ── Main Area ── */}
            <main className="flex-1 relative z-[1] flex items-center justify-center px-6 py-10 overflow-hidden">
                {/* Blobs */}
                <div className="absolute w-[380px] h-[380px] rounded-full pointer-events-none -top-20 -right-20 blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.10), transparent 70%)', animation: 'blobMove 12s ease-in-out infinite' }} />
                <div className="absolute w-[280px] h-[280px] rounded-full pointer-events-none -bottom-[60px] -left-[60px] blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)', animation: 'blobMove 12s ease-in-out infinite 4s' }} />
                <div className="absolute w-[220px] h-[220px] rounded-full pointer-events-none top-[40%] left-[5%] blur-[60px]"
                    style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)', animation: 'blobMove 12s ease-in-out infinite 8s' }} />

                {/* ── Card ── */}
                <Card className={`relative overflow-hidden max-w-[540px] w-full border shadow-[0_24px_80px_rgba(37,99,235,0.10)] ${isDark ? 'bg-[#111827] border-[#1E293B]' : 'bg-white border-[#E2E8F0]'}`}
                    style={{ animation: 'cardIn 0.7s cubic-bezier(0.22,0.68,0,1.2) both', borderRadius: 28 }}>

                    {/* Top gradient stripe */}
                    <div className="absolute top-0 left-0 right-0 h-[5px] z-[2]"
                        style={{ background: 'linear-gradient(90deg, #2563EB, #06B6D4, #8B5CF6)' }} />

                    {/* Particles container */}
                    <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden z-[1]" style={{ borderRadius: 27 }} />

                    <CardBody className="relative z-[3] px-7 sm:px-12 pt-14 pb-12 text-center items-center flex flex-col">
                        {/* 404 Number */}
                        <div className="relative inline-flex items-center justify-center mb-1">
                            <span className="font-black leading-none tracking-[-6px] select-none bg-clip-text [-webkit-text-fill-color:transparent] text-[clamp(100px,18vw,140px)]"
                                style={{
                                    background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 50%, #8B5CF6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    animation: 'numPulse 3s ease-in-out infinite',
                                }}>404</span>
                        </div>

                        {/* Oops Tag */}
                        <Chip variant="bordered" radius="full" size="sm"
                            className={`mb-[18px] font-bold text-xs tracking-wide uppercase ${isDark ? 'bg-[#1E293B] text-blue-400 border-blue-400/30' : 'bg-blue-50 text-blue-600 border-blue-200'}`}
                            style={{ animation: 'tagIn 0.6s 0.2s ease both' }}>
                            {isArabic ? '🤔 صفحة غير موجودة' : '🤔 Page Not Found'}
                        </Chip>

                        {/* Heading */}
                        <h1 className={`font-black text-[clamp(20px,3vw,28px)] leading-tight tracking-tight mb-3.5 ${isDark ? 'text-[#F1F5F9]' : 'text-[#0F172A]'}`}>
                            {isArabic ? 'آسفين! هذه الصفحة اتضيّعت' : 'Oops! This page got lost'}
                        </h1>

                        {/* Description */}
                        <p className={`text-[15px] leading-[1.75] mb-9 max-w-[380px] ${isDark ? 'text-[#94A3B8]' : 'text-[#475569]'}`}>
                            {isArabic
                                ? 'يبدو إن الصفحة اللي بتدوّر عليها اتنقلت أو اتمسحت أو مكانتش موجودة أصلاً. مش قلق، هنوصلك للمكان الصح!'
                                : "The page you're looking for has been moved, deleted, or never existed. Don't worry — we'll get you back on track!"}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-center flex-wrap w-full">
                            <Button radius="lg" size="lg" onPress={() => navigate('/')}
                                className="font-bold text-[15px] text-white shadow-[0_6px_22px_rgba(37,99,235,0.30)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,99,235,0.40)] transition-all duration-200"
                                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
                                startContent={<span>🏠</span>}>
                                {isArabic ? 'الرئيسية' : 'Go Home'}
                            </Button>
                            <Button radius="lg" size="lg" variant="bordered" onPress={() => navigate(-1)}
                                className={`font-semibold text-[15px] hover:-translate-y-0.5 transition-all duration-200 ${isDark ? 'bg-[#0F172A] text-[#F1F5F9] border-[#1E293B]' : 'bg-[#EEF2FF] text-[#0F172A] border-[#E2E8F0]'}`}
                                startContent={<span>{isArabic ? '←' : '→'}</span>}>
                                {isArabic ? 'ارجع للخلف' : 'Go Back'}
                            </Button>
                        </div>

                        {/* ── Suggestions ── */}
                        <div className={`mt-10 pt-8 w-full border-t ${isDark ? 'border-[#1E293B]' : 'border-[#E2E8F0]'}`}>
                            <p className={`text-xs font-bold tracking-[1px] uppercase mb-3.5 ${isDark ? 'text-[#475569]' : 'text-[#94A3B8]'}`}>
                                {isArabic ? 'ربما تقصد' : 'Maybe you meant'}
                            </p>
                            <div className="flex gap-2.5 justify-center flex-wrap">
                                {sugLinks.map((link, i) => (
                                    <Button key={i} variant="bordered" radius="md" size="md" onPress={() => navigate(link.path)}
                                        className={`font-semibold text-[13px] hover:-translate-y-0.5 transition-all duration-200 gap-2 ${isDark ? 'bg-[#1a2235] text-[#94A3B8] border-[#1E293B] hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5' : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'}`}
                                        startContent={
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                                                style={{ background: isDark ? `${link.bg}20` : link.bg }}>{link.emoji}</div>
                                        }>
                                        {link.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </main>

            {/* ── Keyframes ── */}
            <style>{`
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(32px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes numPulse {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.75; }
                }
                @keyframes tagIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes blobMove {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(20px, -20px) scale(1.05); }
                    66%      { transform: translate(-15px, 15px) scale(0.95); }
                }
                @keyframes particleFloat {
                    0%   { opacity: 0; transform: translateY(100%) scale(0); }
                    10%  { opacity: 0.6; }
                    90%  { opacity: 0.2; }
                    100% { opacity: 0; transform: translateY(-120%) scale(1.2); }
                }
            `}</style>
        </div>
    );
}
