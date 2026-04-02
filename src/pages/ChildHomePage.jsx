import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AutismSupportBot from '../components/AutismSupportBot';
import {
    Button, Card, CardBody, Navbar, NavbarBrand, NavbarContent, NavbarItem,
    Modal, ModalContent, ModalBody, useDisclosure
} from '@heroui/react';

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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [hoveredModule, setHoveredModule] = useState(null);

    const hour = new Date().getHours();
    const getGreeting = () => { if (hour < 12) return isArabic ? 'صباح الخير' : 'Good Morning'; if (hour < 17) return isArabic ? 'مساء الخير' : 'Good Afternoon'; return isArabic ? 'مساء الخير' : 'Good Evening'; };
    const getGreetingEmoji = () => { if (hour < 12) return '🌅'; if (hour < 17) return '☀️'; return '🌙'; };

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <Card className={`max-w-[400px] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)]'} border`}>
                    <CardBody className="p-10 text-center">
                        <div className="text-[64px] mb-4">🔒</div>
                        <h2 className={`text-[22px] font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                        <p className={`text-sm mb-5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'سجل دخولك عشان تلعب وتتعلم!' : 'Log in to play and learn!'}</p>
                        <Button radius="lg" className="bg-gradient-to-br from-accent to-accent2 text-white font-bold shadow-[0_6px_20px_rgba(108,99,255,0.3)]"
                            onPress={() => navigate('/child-login')}>{isArabic ? '🚀 تسجيل الدخول' : '🚀 Log In'}</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Nav */}
            <Navbar maxWidth="lg" className={`py-1 ${isDark ? 'bg-bg-dark' : 'bg-bg'}`} classNames={{ wrapper: 'px-6' }}>
                <NavbarBrand className="gap-2 cursor-pointer" onClick={() => navigate('/choice')}>
                    <span className="text-2xl">🧩</span>
                    <span className="text-lg font-extrabold bg-gradient-to-br from-accent to-accent2 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>
                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="bordered" className={`${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}
                            onPress={toggleTheme}>{isDark ? '☀️' : '🌙'}</Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="bordered" className={`font-bold text-[13px] ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-[#F9FAFB] border-border text-text'}`}
                            onPress={toggleLanguage}>{isArabic ? 'EN' : 'ع'}</Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button size="sm" variant="bordered" className={`text-xs font-semibold text-accent2 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`}
                            onPress={logoutChild}>🚪 {isArabic ? 'خروج' : 'Exit'}</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <div className="max-w-[1000px] mx-auto px-6 pb-10">
                {/* Welcome */}
                <Card className={`mb-6 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-accent/[0.12] to-accent2/[0.08] border-accent/[0.15]' : 'bg-gradient-to-br from-accent/[0.06] to-accent2/[0.04] border-accent/10'} border`}>
                    <CardBody className="py-8 px-7">
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
                    </CardBody>
                </Card>

                {/* Calming Banner */}
                <Card isPressable onPress={() => navigate('/calming')}
                    className={`mb-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(167,139,250,0.15)] ${isDark ? 'bg-gradient-to-br from-violet-400/[0.12] to-violet-700/[0.08] border-violet-400/20' : 'bg-gradient-to-br from-violet-400/[0.08] to-violet-700/[0.04] border-violet-400/[0.15]'} border`}>
                    <CardBody className="py-4 px-5 flex flex-row items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center text-[22px] shadow-[0_4px_12px_rgba(167,139,250,0.3)] shrink-0">🧘</div>
                        <div className="flex-1">
                            <div className={`text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'محتاج تهدى شوية؟ 💜' : 'Need to calm down? 💜'}</div>
                            <div className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'اضغط هنا عشان تسترخي وتاخد نفس عميق' : 'Tap here to relax and take deep breaths'}</div>
                        </div>
                        <span className="text-violet-400 text-xl shrink-0">→</span>
                    </CardBody>
                </Card>

                {/* Module Grid */}
                <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    🎯 {isArabic ? 'اختر نشاطك' : 'Choose Your Activity'}
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-6">
                    {modules.map((mod, i) => {
                        const isHovered = hoveredModule === mod.key;
                        return (
                            <Card key={mod.key} isPressable
                                onPress={() => mod.path === 'modal' ? onOpen() : navigate(mod.path)}
                                onMouseEnter={() => setHoveredModule(mod.key)}
                                onMouseLeave={() => setHoveredModule(null)}
                                className={`transition-all duration-300 ${isDark ? 'bg-card-dark' : 'bg-card'} border`}
                                style={{
                                    borderColor: isHovered ? `${mod.color}50` : (isDark ? '#21262D' : '#E5E7EB'),
                                    boxShadow: isHovered ? `0 12px 40px ${mod.color}25` : (isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'),
                                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                    animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
                                }}>
                                <CardBody className="p-6 flex flex-row items-center gap-4">
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
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>

                {/* Tip */}
                <Card className={`${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="py-5 px-6 flex flex-row items-center gap-3.5">
                        <span className="text-[32px] shrink-0">💡</span>
                        <div>
                            <div className={`text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'هل تعلم؟' : 'Did you know?'}</div>
                            <div className={`text-[13px] leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                                {isArabic ? 'لما بتلعب وبتتعلم كل يوم، دماغك بيبقى أقوى وأذكى! 🧠✨ حاول تستخدم كل الأنشطة!' : 'When you play and learn every day, your brain gets stronger and smarter! 🧠✨ Try all activities!'}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Bot Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur" classNames={{ base: 'max-w-[520px]' }}>
                <ModalContent>
                    <ModalBody className="p-0">
                        <AutismSupportBot mode="child" />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
