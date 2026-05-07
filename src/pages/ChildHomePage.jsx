import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AutismSupportBot from '../components/AutismSupportBot';
import MainNavbar from '../components/MainNavbar';
import {
    Button, Modal, ModalContent, ModalBody, useDisclosure, Card, CardBody
} from '@heroui/react';

const modules = [
    { key: 'pecs', icon: '/icons/pecs.png', color: '#A8B4FF', gradient: 'from-indigo-500/20 to-purple-500/10', glow: 'shadow-indigo-500/30', path: '/pecs' },
    { key: 'routine', icon: '/icons/routine.png', color: '#818CF8', gradient: 'from-blue-500/20 to-indigo-500/10', glow: 'shadow-blue-500/30', path: '/routine' },
    { key: 'emotions', icon: '/icons/emotions.png', color: '#C084FC', gradient: 'from-purple-500/20 to-pink-500/10', glow: 'shadow-purple-500/30', path: '/emotions' },
    { key: 'bot', icon: '/icons/bot.png', color: '#F472B6', gradient: 'from-pink-500/20 to-rose-500/10', glow: 'shadow-pink-500/30', path: 'modal' },
];

const labels = {
    pecs: { en: 'Communication', ar: 'لوحة التواصل' },
    routine: { en: 'Daily Schedule', ar: 'الجدول اليومي' },
    emotions: { en: 'Mood Explorer', ar: 'مستكشف المشاعر' },
    bot: { en: 'AI Companion', ar: 'الرفيق الذكي' },
};

export default function ChildHomePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { currentChild, logoutChild } = useAuth();
    const { routineCompletion } = useData();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [hoveredModule, setHoveredModule] = useState(null);

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0C0D17]' : 'bg-[#F0F4FF]'}`}>
                <div className={`w-full max-w-[400px] p-8 rounded-[40px] border text-center space-y-6 shadow-2xl backdrop-blur-3xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                    <div className="text-7xl animate-pulse">🌌</div>
                    <h2 className={`text-2xl font-black ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'سجل دخولك يا بطل' : 'Welcome Back, Hero'}</h2>
                    <Button radius="full" size="lg" className="w-full bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-500/20" onPress={() => navigate('/child-login')}>
                        {isArabic ? 'دخول الطفل' : 'Log In'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            <MainNavbar userType="child" />

            <main className="relative max-w-[1300px] mx-auto px-8 pt-32 pb-20">
                
                {/* HERO GREETING */}
                <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-3">
                        <div className={`flex items-center gap-3 font-black tracking-[0.3em] uppercase text-[10px] transition-colors duration-1000 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            <span className={`w-12 h-[1px] transition-colors duration-1000 ${isDark ? 'bg-indigo-500/50' : 'bg-indigo-300'}`} />
                            {isArabic ? 'تم تفعيل النظام' : 'System Online'}
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                            {isArabic ? `أهلاً، ${currentChild.name}` : `Hey, ${currentChild.name}`} 
                            <span className="text-indigo-500 animate-pulse">.</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                       
                        <div className={`px-8 py-5 rounded-[32px] backdrop-blur-2xl border flex flex-col items-center min-w-[140px] shadow-2xl transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-indigo-100'}`}>
                            <span className={`text-3xl font-black ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{routineCompletion}%</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">{isArabic ? 'الروتين اليومي' : 'Daily Routine'}</span>
                        </div>
                    </div>
                </header>

                {/* ZEN BANNER (CALMING ZONE) */}
                <div 
                    onClick={() => navigate('/calming')}
                    className={`group relative mb-16 cursor-pointer overflow-hidden rounded-[50px] border h-56 md:h-72 flex items-center transition-all duration-700 shadow-2xl ${isDark ? 'border-white/10 hover:border-indigo-500/40' : 'border-indigo-100 hover:border-indigo-300'}`}
                >
                    <div className={`absolute inset-0 z-10 transition-all duration-1000 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-transparent' : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent'}`} />
                    {/* Animated aura */}
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                        <div className={`absolute top-0 right-0 w-[70%] h-full rounded-full blur-[100px] animate-pulse transition-colors duration-1000 ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-400/30'}`} />
                    </div>

                    <div className="relative z-20 px-12 md:px-20 flex items-center gap-10 w-full">
                        <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full border flex items-center justify-center text-7xl shadow-2xl animate-float backdrop-blur-3xl transition-all duration-500 overflow-hidden ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-indigo-200 shadow-indigo-500/10'}`}>
                            {currentChild.avatar && (currentChild.avatar.startsWith('data:image') || currentChild.avatar.startsWith('http')) ? (
                                <img src={currentChild.avatar} alt="Avatar" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                            ) : (
                                <img src="/icons/emotion_emo_calm.png" alt="Zen" className="w-[70%] h-[70%] object-contain opacity-80"  loading="lazy" decoding="async"/>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className={`text-3xl md:text-5xl font-black mb-3 tracking-tighter ${isDark ? 'text-white' : 'text-indigo-900'}`}>{isArabic ? 'مساحة الهدوء' : 'The Zen Sanctuary'}</h2>
                            <p className={`font-bold text-lg max-w-[500px] leading-relaxed transition-colors duration-1000 ${isDark ? 'text-indigo-200/60' : 'text-indigo-600/60'}`}>
                                {isArabic ? 'استرخِ في عالم من السكينة والتمارين المصممة خصيصاً لمساعدتك على التركيز.' : 'Reconnect with your inner peace in a world designed for ultimate calm and focus.'}
                            </p>
                        </div>
                        <div className={`hidden lg:flex w-20 h-20 rounded-full border items-center justify-center text-3xl group-hover:scale-110 transition-all duration-500 backdrop-blur-3xl ${isDark ? 'bg-white/10 border-white/20 text-white group-hover:bg-indigo-500' : 'bg-white/90 border-indigo-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                            {isArabic ? '←' : '→'}
                        </div>
                    </div>
                </div>

                {/* EDITORIAL MODULE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {modules.map((mod) => {
                        const isHovered = hoveredModule === mod.key;
                        return (
                            <Card 
                                key={mod.key} 
                                isPressable
                                onPress={() => mod.path === 'modal' ? onOpen() : navigate(mod.path)}
                                onMouseEnter={() => setHoveredModule(mod.key)}
                                onMouseLeave={() => setHoveredModule(null)}
                                className={`group relative h-[320px] rounded-[60px] border overflow-hidden transition-all duration-700 hover:translate-y-[-12px] shadow-2xl backdrop-blur-3xl ${isDark ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20' : 'bg-white/80 border-indigo-100 hover:bg-white hover:border-indigo-300'}`}
                            >
                                {/* Glow layer */}
                                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                                
                                <CardBody className="relative z-10 p-12 flex flex-col justify-between h-full">
                                    <div className={`w-24 h-24 rounded-[32px] border flex items-center justify-center transition-all duration-700 backdrop-blur-2xl overflow-hidden ${isDark ? 'bg-white/10 border-white/10' : 'bg-white/90 border-indigo-100'} ${isHovered ? 'scale-110 rotate-6 shadow-xl' : ''}`}>
                                        <div className={`absolute inset-0 rounded-[32px] opacity-20 blur-2xl transition-opacity duration-700 ${isHovered ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: mod.color }} />
                                        <img src={mod.icon} alt={mod.key} className="relative z-10 w-full h-full object-cover"  loading="lazy" decoding="async"/>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className={`text-[10px] uppercase tracking-[0.4em] font-black transition-colors duration-1000 ${isDark ? 'opacity-30 text-white' : 'opacity-50 text-indigo-900'}`}>{mod.key}</div>
                                        <h3 className={`text-3xl font-black tracking-tight group-hover:translate-x-2 transition-transform duration-500 ${isDark ? 'text-white/90 group-hover:text-white' : 'text-indigo-900'}`}>{isArabic ? labels[mod.key].ar : labels[mod.key].en}</h3>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>


            </main>

            {/* AI BOT MODAL - GLASS STYLE */}
            <Modal 
                isOpen={isOpen} 
                onClose={onClose} 
                size="2xl" 
                backdrop="blur" 
                classNames={{ 
                    base: `backdrop-blur-3xl border rounded-[50px] overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-indigo-100'}`,
                    backdrop: 'bg-indigo-950/70 backdrop-blur-sm'
                }}
            >
                <ModalContent>
                    <ModalBody className="p-0">
                        <AutismSupportBot mode="child" />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(2deg); } }
                .animate-float { animation: float 7s ease-in-out infinite; }
                
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: ${isDark ? '#0C0D17' : '#F5F8FF'}; }
                ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}; }
            `}</style>
        </div>
    );
}
