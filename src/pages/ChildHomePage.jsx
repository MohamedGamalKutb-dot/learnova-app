import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AutismSupportBot from '../components/AutismSupportBot';

const modules = [
    { key: 'pecs', emoji: '🗣️', color: '#6C63FF', gradient: ['#6C63FF', '#8B5CF6'], path: '/pecs' },
    { key: 'routine', emoji: '📅', color: '#4ECDC4', gradient: ['#4ECDC4', '#44B09E'], path: '/routine' },
    { key: 'emotions', emoji: '😊', color: '#F59E0B', gradient: ['#F59E0B', '#F97316'], path: '/emotions' },
    { key: 'calming', emoji: '🧘', color: '#A78BFA', gradient: ['#A78BFA', '#7C3AED'], path: '/calming' },
    { key: 'bot', emoji: '🤖', color: '#FF6584', gradient: ['#FF6584', '#EC4899'], path: 'modal' },
    { key: 'profile', emoji: '👤', color: '#06B6D4', gradient: ['#06B6D4', '#0891B2'], path: '/profile' },
];

const labels = {
    pecs: { en: 'PECS Communication', ar: 'التواصل بالصور' },
    routine: { en: 'Daily Routine', ar: 'الروتين اليومي' },
    emotions: { en: 'Emotions', ar: 'المشاعر' },
    calming: { en: 'Calming Zone', ar: 'منطقة الهدوء' },
    bot: { en: 'My Robot Friend', ar: 'صديقي الروبوت' },
    profile: { en: 'My Profile', ar: 'ملفي الشخصي' },
};

const descriptions = {
    pecs: { en: 'Talk with pictures!', ar: 'اتكلم بالصور!' },
    routine: { en: 'Plan your day', ar: 'نظم يومك' },
    emotions: { en: 'Learn feelings', ar: 'اتعلم المشاعر' },
    calming: { en: 'Relax & breathe', ar: 'استرخي وهدّي' },
    bot: { en: 'Chat with me!', ar: 'اتكلم معايا!' },
    profile: { en: 'About me', ar: 'معلوماتي' },
};

export default function ChildHomePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { currentChild, logoutChild } = useAuth();
    const [showBot, setShowBot] = useState(false);
    const [hoveredModule, setHoveredModule] = useState(null);

    const hour = new Date().getHours();
    const getGreeting = () => { if (hour < 12) return isArabic ? 'صباح الخير' : 'Good Morning'; if (hour < 17) return isArabic ? 'مساء الخير' : 'Good Afternoon'; return isArabic ? 'مساء الخير' : 'Good Evening'; };
    const getGreetingEmoji = () => { if (hour < 12) return '🌅'; if (hour < 17) return '☀️'; return '🌙'; };

    const btnCls = `w-[38px] h-[38px] rounded-[10px] border flex items-center justify-center cursor-pointer ${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`;

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <div className={`text-center p-10 rounded-3xl border max-w-[400px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <div className="text-[64px] mb-4">🔒</div>
                    <h2 className={`text-[22px] font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                    <p className={`text-sm mb-5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'سجل دخولك عشان تلعب وتتعلم!' : 'Log in to play and learn!'}</p>
                    <button onClick={() => navigate('/child-login')}
                        className="py-3.5 px-9 rounded-[14px] bg-gradient-to-br from-accent to-accent2 text-white border-none cursor-pointer font-bold text-base shadow-[0_6px_20px_rgba(108,99,255,0.3)]">
                        {isArabic ? '🚀 تسجيل الدخول' : '🚀 Log In'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Nav */}
            <nav className="flex justify-between items-center py-4 px-6 max-w-[1000px] mx-auto w-full">
                <div onClick={() => navigate('/choice')} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-2xl">🧩</span>
                    <span className="text-lg font-extrabold bg-gradient-to-br from-accent to-accent2 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </div>
                <div className="flex gap-2 items-center">
                    <button onClick={toggleTheme} className={`${btnCls} text-base`}>{isDark ? '☀️' : '🌙'}</button>
                    <button onClick={toggleLanguage} className={`${btnCls} text-[13px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'EN' : 'ع'}</button>
                    <button onClick={logoutChild} className={`${btnCls} !w-auto py-2 px-3.5 text-xs font-semibold text-accent2 gap-1`}>🚪 {isArabic ? 'خروج' : 'Exit'}</button>
                </div>
            </nav>

            <div className="max-w-[1000px] mx-auto px-6 pb-10">
                {/* Welcome */}
                <div className={`py-8 px-7 rounded-3xl mb-6 relative overflow-hidden border ${isDark ? 'bg-gradient-to-br from-accent/[0.12] to-accent2/[0.08] border-accent/[0.15]' : 'bg-gradient-to-br from-accent/[0.06] to-accent2/[0.04] border-accent/10'}`}>
                    <div className="absolute top-2.5 right-5 text-[40px] opacity-[0.12]" style={{ animation: 'float 6s ease-in-out infinite' }}>⭐</div>
                    <div className="absolute bottom-2.5 left-[30px] text-[35px] opacity-10" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>🎈</div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-[32px] shadow-[0_6px_20px_rgba(108,99,255,0.3)] shrink-0">🧒</div>
                        <div className="flex-1">
                            <div className={`text-sm font-medium mb-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{getGreetingEmoji()} {getGreeting()}</div>
                            <h1 className={`m-0 text-[clamp(22px,3vw,28px)] font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                {isArabic ? `أهلاً يا ${currentChild.name}! 🌟` : `Hey ${currentChild.name}! 🌟`}
                            </h1>
                            <p className={`mt-1 text-sm ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                                {isArabic ? 'يلا نلعب ونتعلم حاجات جديدة النهاردة!' : "Let's play and learn new things today!"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Calming Banner */}
                <div onClick={() => navigate('/calming')}
                    className={`py-4 px-5 rounded-2xl mb-7 flex items-center gap-3.5 cursor-pointer transition-all duration-300 border hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(167,139,250,0.15)] ${isDark ? 'bg-gradient-to-br from-violet-400/[0.12] to-violet-700/[0.08] border-violet-400/20' : 'bg-gradient-to-br from-violet-400/[0.08] to-violet-700/[0.04] border-violet-400/[0.15]'}`}>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center text-[22px] shadow-[0_4px_12px_rgba(167,139,250,0.3)] shrink-0">🧘</div>
                    <div className="flex-1">
                        <div className={`text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'محتاج تهدى شوية؟ 💜' : 'Need to calm down? 💜'}</div>
                        <div className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'اضغط هنا عشان تسترخي وتاخد نفس عميق' : 'Tap here to relax and take deep breaths'}</div>
                    </div>
                    <span className="text-violet-400 text-xl shrink-0">→</span>
                </div>

                {/* Module Grid */}
                <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    🎯 {isArabic ? 'اختر نشاطك' : 'Choose Your Activity'}
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-6">
                    {modules.map((mod, i) => {
                        const isHovered = hoveredModule === mod.key;
                        return (
                            <button key={mod.key}
                                onClick={() => mod.path === 'modal' ? setShowBot(true) : navigate(mod.path)}
                                onMouseEnter={() => setHoveredModule(mod.key)}
                                onMouseLeave={() => setHoveredModule(null)}
                                className={`p-6 rounded-[20px] cursor-pointer flex items-center gap-4 text-start transition-all duration-300 border ${isDark ? 'bg-card-dark' : 'bg-card'}`}
                                style={{
                                    borderColor: isHovered ? `${mod.color}50` : (isDark ? '#21262D' : '#E5E7EB'),
                                    boxShadow: isHovered ? `0 12px 40px ${mod.color}25` : (isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'),
                                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                    animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
                                }}>
                                <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${mod.gradient[0]}, ${mod.gradient[1]})`,
                                        boxShadow: `0 6px 18px ${mod.color}35`,
                                        transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
                                    }}>
                                    <span className="text-[28px]">{mod.emoji}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-base font-bold mb-0.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? labels[mod.key].ar : labels[mod.key].en}</div>
                                    <div className={`text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? descriptions[mod.key].ar : descriptions[mod.key].en}</div>
                                </div>
                                <span className="text-lg shrink-0 transition-all duration-300"
                                    style={{ color: isHovered ? mod.color : (isDark ? '#30363D' : '#D1D5DB'), transform: isHovered ? (isArabic ? 'translateX(-4px)' : 'translateX(4px)') : 'translateX(0)' }}>
                                    {isArabic ? '←' : '→'}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Tip */}
                <div className={`py-5 px-6 rounded-2xl flex items-center gap-3.5 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <span className="text-[32px] shrink-0">💡</span>
                    <div>
                        <div className={`text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'هل تعلم؟' : 'Did you know?'}</div>
                        <div className={`text-[13px] leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isArabic ? 'لما بتلعب وبتتعلم كل يوم، دماغك بيبقى أقوى وأذكى! 🧠✨ حاول تستخدم كل الأنشطة!' : 'When you play and learn every day, your brain gets stronger and smarter! 🧠✨ Try all activities!'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bot Modal */}
            {showBot && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-lg p-5"
                    style={{ animation: 'fadeIn 0.2s ease-out' }} onClick={() => setShowBot(false)}>
                    <div onClick={e => e.stopPropagation()} className="w-full max-w-[520px] relative" style={{ animation: 'slideUp 0.3s ease-out' }}>
                        <button onClick={() => setShowBot(false)}
                            className="absolute -top-3 -right-2 z-10 w-9 h-9 rounded-full bg-gradient-to-br from-accent2 to-pink-500 text-white border-[3px] border-white text-sm cursor-pointer shadow-[0_4px_15px_rgba(255,101,132,0.4)] flex items-center justify-center font-bold">✕</button>
                        <AutismSupportBot mode="child" />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            `}</style>
        </div>
    );
}
