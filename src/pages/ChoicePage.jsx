import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
    Button, Card, CardBody, CardFooter, Chip, Divider, Input,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Navbar, NavbarBrand, NavbarContent, NavbarItem,
    useDisclosure
} from '@heroui/react';

export default function ChoicePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { registerChild, loginChild, registerParent, loginParent, registerDoctor, loginDoctor, getChildById } = useAuth();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isGoogleOpen, onOpen: onGoogleOpen, onClose: onGoogleClose } = useDisclosure();

    const [activeModal, setActiveModal] = useState(null);
    const [modalMode, setModalMode] = useState('signup');
    const [quickForm, setQuickForm] = useState({ email: '', password: '', name: '', childId: '', phone: '' });
    const [quickError, setQuickError] = useState('');
    const [quickLoading, setQuickLoading] = useState(false);
    const [quickSuccess, setQuickSuccess] = useState(null);

    const [googleStep, setGoogleStep] = useState(0);
    const [googleEmail, setGoogleEmail] = useState('');
    const [googlePassword, setGooglePassword] = useState('');
    const [googleError, setGoogleError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleChildId, setGoogleChildId] = useState('');

    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';

    const T = {
        langBtn: isArabic ? 'English' : 'عربي',
        backBtn: isArabic ? 'العودة للرئيسية →' : '← Back to Home',
        eyebrow: isArabic ? '👋 مرحباً بك في LearnNeur' : '👋 Welcome to LearnNeur',
        pageTitle1: isArabic ? 'اختر ' : 'Choose your ',
        pageTitleGrad: isArabic ? 'طريقة الدخول' : 'login method',
        pageDesc: isArabic ? 'اضغط على الدور المناسب وسجّل بالإيميل فوراً' : 'Click on the right role and sign in with your email instantly',
        noteText: isArabic ? 'ليس لديك حساب؟' : "Don't have an account?",
        noteLink: isArabic ? ' أنشئ حساباً مجاناً' : ' Create one for free',
    };

    const cards = [
        {
            id: 'child', icon: '🧒',
            title: isArabic ? 'طفل' : 'Child',
            desc: isArabic ? 'مغامرة التعلم الممتعة تنتظرك! العب الألعاب، اكسب النجوم، وتطور كل يوم.' : 'Your fun learning adventure awaits! Play games, earn stars, and grow every day.',
            features: [
                { emoji: '🎮', text: isArabic ? 'ألعاب تعليمية تفاعلية' : 'Interactive learning games' },
                { emoji: '⭐', text: isArabic ? 'اكسب مكافآت وشارات' : 'Earn rewards & badges' },
                { emoji: '📅', text: isArabic ? 'جدولي البصري اليومي' : 'My visual daily schedule' },
            ],
            btn: isArabic ? 'دخول كطفل ←' : 'Enter as Child →',
            borderCls: 'border-p200 hover:border-p400',
            hoverShadow: 'hover:shadow-[0_28px_64px_rgba(37,99,235,.16)]',
            stripeCls: 'from-p500 to-a500',
            bubbleCls: 'bg-gradient-to-br from-p100 to-p200 shadow-[0_8px_24px_rgba(37,99,235,.15)]',
            dotCls: 'bg-p100 text-p600',
            btnGrad: 'bg-gradient-to-br from-p500 to-a500 shadow-[0_6px_20px_rgba(37,99,235,.28)] hover:shadow-[0_10px_28px_rgba(37,99,235,.40)]',
            loginPath: '/child-login',
        },
        {
            id: 'parent', icon: '👨‍👩‍👦', popular: true,
            title: isArabic ? 'ولي الأمر' : 'Parent / Guardian',
            desc: isArabic ? 'ابقَ على تواصل مع تقدم طفلك وتقاريره وفريق المتخصصين في مكان واحد.' : "Stay connected with your child's progress, reports, and specialist team in one place.",
            features: [
                { emoji: '📊', text: isArabic ? 'لوحة تتبع التقدم' : 'Progress tracking dashboard' },
                { emoji: '💬', text: isArabic ? 'مراسلة المختص' : 'Message the specialist' },
                { emoji: '📋', text: isArabic ? 'عرض التقارير وتنزيلها' : 'View & download reports' },
            ],
            btn: isArabic ? 'دخول كولي أمر ←' : 'Enter as Parent →',
            borderCls: 'border-emerald-200 hover:border-emerald-400',
            hoverShadow: 'hover:shadow-[0_28px_64px_rgba(16,185,129,.14)]',
            stripeCls: 'from-emerald-500 to-p500',
            bubbleCls: 'bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-[0_8px_24px_rgba(16,185,129,.15)]',
            dotCls: 'bg-emerald-100 text-emerald-600',
            btnGrad: 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_6px_20px_rgba(16,185,129,.28)] hover:shadow-[0_10px_28px_rgba(16,185,129,.38)]',
            loginPath: '/login',
            badgeText: isArabic ? 'الأكثر استخداماً' : 'Most Used',
        },
        {
            id: 'doctor', icon: '👨‍⚕️',
            title: isArabic ? 'الطبيب / المختص' : 'Doctor / Specialist',
            desc: isArabic ? 'إدارة حالاتك، إصدار التقارير السريرية، ومتابعة التقدم العلاجي.' : 'Manage your cases, generate clinical reports, and monitor therapeutic progress.',
            features: [
                { emoji: '🩺', text: isArabic ? 'نظام إدارة الحالات' : 'Case management system' },
                { emoji: '📈', text: isArabic ? 'تحليلات التقدم السريري' : 'Clinical progress analytics' },
                { emoji: '📝', text: isArabic ? 'إنشاء تقارير العلاج' : 'Generate therapy reports' },
            ],
            btn: isArabic ? 'دخول كطبيب ←' : 'Enter as Doctor →',
            borderCls: 'border-violet-200 hover:border-violet-400',
            hoverShadow: 'hover:shadow-[0_28px_64px_rgba(139,92,246,.14)]',
            stripeCls: 'from-violet-500 to-p500',
            bubbleCls: 'bg-gradient-to-br from-violet-100 to-violet-200 shadow-[0_8px_24px_rgba(139,92,246,.15)]',
            dotCls: 'bg-violet-100 text-violet-600',
            btnGrad: 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-[0_6px_20px_rgba(139,92,246,.28)] hover:shadow-[0_10px_28px_rgba(139,92,246,.38)]',
            loginPath: '/doctor-auth',
        },
    ];

    const GoogleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    );

    const resetModal = () => { setActiveModal(null); setModalMode('signup'); setQuickForm({ email: '', password: '', name: '', childId: '', phone: '' }); setQuickError(''); setQuickLoading(false); setQuickSuccess(null); setGoogleStep(0); setGoogleEmail(''); setGooglePassword(''); setGoogleError(''); setGoogleLoading(false); setGoogleChildId(''); onClose(); onGoogleClose(); };
    const openModal = (roleId) => { setQuickForm({ email: '', password: '', name: '', childId: '', phone: '' }); setQuickError(''); setQuickSuccess(null); setModalMode('signup'); setActiveModal(roleId); onOpen(); };

    const handleQuickSubmit = () => {
        setQuickError(''); setQuickLoading(true);
        const { email, password, name, childId, phone } = quickForm;
        if (!email.trim() || !email.includes('@')) { setQuickError(isArabic ? 'أدخل إيميل صحيح' : 'Enter a valid email'); setQuickLoading(false); return; }
        if (!password || password.length < 6) { setQuickError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); setQuickLoading(false); return; }
        if (modalMode === 'login') {
            let result;
            if (activeModal === 'child') { result = loginChild(email.trim(), password); if (result.success) { resetModal(); navigate('/child-home'); return; } }
            else if (activeModal === 'parent') { result = loginParent(email.trim(), password); if (result.success) { resetModal(); navigate('/dashboard'); return; } }
            else if (activeModal === 'doctor') { result = loginDoctor(email.trim(), password); if (result.success) { resetModal(); navigate('/doctor-dashboard'); return; } }
            if (result) { if (result.error === 'not_found') setQuickError(isArabic ? 'الإيميل غير مسجل' : 'Email not found'); else if (result.error === 'wrong_password') setQuickError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password'); }
            setQuickLoading(false); return;
        }
        if (!name.trim()) { setQuickError(isArabic ? 'أدخل الاسم' : 'Enter your name'); setQuickLoading(false); return; }
        if (activeModal === 'child') {
            const result = registerChild({ name: name.trim(), age: 8, email: email.trim(), password, gender: 'Male', avatar: '👦' });
            if (result.success) setQuickSuccess({ childId: result.childId });
            else if (result.error === 'email_exists') setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        } else if (activeModal === 'parent') {
            if (!childId.trim()) { setQuickError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)'); setQuickLoading(false); return; }
            const child = getChildById(childId.trim());
            if (!child) { setQuickError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found'); setQuickLoading(false); return; }
            const result = registerParent({ name: name.trim(), email: email.trim(), password, phone: phone.trim(), childId: childId.trim() });
            if (result.success) { resetModal(); navigate('/dashboard'); return; }
            else if (result.error === 'email_exists') setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        } else if (activeModal === 'doctor') {
            const result = registerDoctor({ name: name.trim(), email: email.trim(), password, phone: phone.trim(), age: '', gender: 'Male' });
            if (result.success) { resetModal(); navigate('/doctor-dashboard'); return; }
            else if (result.error === 'email_exists') setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        }
        setQuickLoading(false);
    };

    const handleGoogleSubmit = () => {
        setGoogleError(''); setGoogleLoading(true);
        if (googleStep === 1) {
            if (!googleEmail.trim() || !googleEmail.includes('@')) { setGoogleError(isArabic ? 'أدخل إيميل جوجل صحيح' : 'Enter a valid Google email'); setGoogleLoading(false); return; }
            setTimeout(() => { setGoogleStep(2); setGoogleLoading(false); }, 600); return;
        }
        if (googleStep === 2) {
            if (!googlePassword || googlePassword.length < 6) { setGoogleError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); setGoogleLoading(false); return; }
            const nameFromEmail = googleEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            if (modalMode === 'login') {
                let result;
                if (activeModal === 'child') { result = loginChild(googleEmail.trim(), googlePassword); if (result.success) { resetModal(); navigate('/child-home'); return; } }
                else if (activeModal === 'parent') { result = loginParent(googleEmail.trim(), googlePassword); if (result.success) { resetModal(); navigate('/dashboard'); return; } }
                else if (activeModal === 'doctor') { result = loginDoctor(googleEmail.trim(), googlePassword); if (result.success) { resetModal(); navigate('/doctor-dashboard'); return; } }
                if (result) { if (result.error === 'not_found') setGoogleError(isArabic ? 'الإيميل غير مسجل' : 'Email not found'); else if (result.error === 'wrong_password') setGoogleError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password'); }
                setGoogleLoading(false); return;
            }
            if (activeModal === 'child') { const result = registerChild({ name: nameFromEmail, age: 8, email: googleEmail.trim(), password: googlePassword, gender: 'Male', avatar: '👦' }); if (result.success) { setQuickSuccess({ childId: result.childId }); setGoogleStep(0); onGoogleClose(); } else if (result.error === 'email_exists') setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered'); }
            else if (activeModal === 'parent') {
                if (!googleChildId.trim()) { setGoogleError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)'); setGoogleLoading(false); return; }
                const child = getChildById(googleChildId.trim()); if (!child) { setGoogleError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found'); setGoogleLoading(false); return; }
                const result = registerParent({ name: nameFromEmail, email: googleEmail.trim(), password: googlePassword, phone: '', childId: googleChildId.trim() });
                if (result.success) { resetModal(); navigate('/dashboard'); return; } else if (result.error === 'email_exists') setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
            } else if (activeModal === 'doctor') { const result = registerDoctor({ name: nameFromEmail, email: googleEmail.trim(), password: googlePassword, phone: '', age: '', gender: 'Male' }); if (result.success) { resetModal(); navigate('/doctor-dashboard'); return; } else if (result.error === 'email_exists') setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered'); }
            setGoogleLoading(false);
        }
    };

    const getModalConfig = () => {
        switch (activeModal) {
            case 'child': return { title: isArabic ? '🎮 تسجيل الطفل' : '🎮 Child Sign Up', loginTitle: isArabic ? '🎮 دخول الطفل' : '🎮 Child Log In', gradient: 'bg-gradient-to-br from-p500 to-a500', accent: '#3B82F6', shadowColor: 'rgba(37,99,235,0.35)', namePlaceholder: isArabic ? 'اسم الطفل' : "Child's name", showChildId: false, showPhone: false };
            case 'parent': return { title: isArabic ? '👨‍👩‍👧 تسجيل ولي الأمر' : '👨‍👩‍👧 Parent Sign Up', loginTitle: isArabic ? '👨‍👩‍👧 دخول ولي الأمر' : '👨‍👩‍👧 Parent Log In', gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600', accent: '#10B981', shadowColor: 'rgba(16,185,129,0.35)', namePlaceholder: isArabic ? 'اسم ولي الأمر' : 'Parent name', showChildId: true, showPhone: true };
            case 'doctor': return { title: isArabic ? '🩺 تسجيل الطبيب' : '🩺 Doctor Sign Up', loginTitle: isArabic ? '🩺 دخول الطبيب' : '🩺 Doctor Log In', gradient: 'bg-gradient-to-br from-violet-500 to-violet-600', accent: '#8B5CF6', shadowColor: 'rgba(139,92,246,0.35)', namePlaceholder: isArabic ? 'اسم الطبيب' : 'Doctor name', showChildId: false, showPhone: true };
            default: return null;
        }
    };

    const config = getModalConfig();

    return (
        <div className={`font-jakarta min-h-screen flex flex-col ${darkBg} ${darkTxt} transition-colors duration-300`} dir={isArabic ? 'rtl' : 'ltr'}>

            {/* ===== NAVBAR (HeroUI) ===== */}
            <Navbar
                maxWidth="full"
                isBordered
                classNames={{
                    base: `sticky top-0 z-[99] backdrop-blur-[16px] ${isDark ? 'bg-[rgba(8,14,28,.90)]' : 'bg-[rgba(255,255,255,.85)]'}`,
                    wrapper: 'px-5 md:px-12',
                }}
            >
                <NavbarBrand className="gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-p600 to-a500 flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(37,99,235,.25)]">🧠</div>
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>
                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem>
                        <Button size="sm" variant="bordered" className={`font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`} onPress={toggleLanguage}>{T.langBtn}</Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="bordered" className={`text-[15px] ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`} onPress={toggleTheme}>{isDark ? '☀️' : '🌙'}</Button>
                    </NavbarItem>
                    <NavbarItem className="hidden sm:flex">
                        <Button size="sm" variant="bordered" className={`font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'} hover:text-p600 hover:border-p300 hover:bg-p50`} onPress={() => navigate('/')}>{T.backBtn}</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {/* ===== MAIN ===== */}
            <main className="flex-1 flex flex-col items-center justify-center py-10 md:py-[60px] px-4 md:px-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(59,130,246,.07)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_15%_80%,rgba(6,182,212,.05)_0%,transparent_60%),radial-gradient(ellipse_35%_35%_at_85%_75%,rgba(139,92,246,.05)_0%,transparent_60%)]" />
                <div className="absolute inset-0 pointer-events-none dot-grid opacity-40" />

                {/* Header */}
                <div className="relative text-center mb-10 md:mb-14 max-w-[520px]">
                    <Chip variant="bordered" className={`${tagBg} text-p600 font-bold tracking-[.4px] mb-5 border`}>{T.eyebrow}</Chip>
                    <h1 className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-3.5 ${darkTxt}`}>
                        {T.pageTitle1}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">{T.pageTitleGrad}</span>
                    </h1>
                    <p className={`${darkTxt2} text-base leading-[1.75]`}>{T.pageDesc}</p>
                </div>

                {/* Cards (HeroUI Card) */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[920px]">
                    {cards.map((card, idx) => (
                        <Card
                            key={card.id}
                            isPressable
                            onPress={() => openModal(card.id)}
                            className={`${darkSurf} border-2 ${card.borderCls} rounded-3xl pt-11 px-5 sm:px-8 pb-9 text-center cursor-pointer transition-all duration-[350ms] ease-[cubic-bezier(.22,.68,0,1.2)] relative overflow-hidden flex flex-col items-center hover:-translate-y-2.5 ${card.hoverShadow} group`}
                            style={{ animation: `cardIn .6s ease ${0.05 + idx * 0.1}s forwards`, opacity: 0 }}
                        >
                            <div className={`absolute top-0 inset-x-0 h-[5px] rounded-t-[22px] bg-gradient-to-r ${card.stripeCls}`} />
                            {card.popular && (
                                <Chip size="sm" className={`absolute -top-3.5 ${isArabic ? 'left-5' : 'right-5'} bg-gradient-to-br from-p600 to-a500 text-white text-[11px] font-bold shadow-[0_4px_12px_rgba(37,99,235,.3)] tracking-[.5px] uppercase`}>{card.badgeText}</Chip>
                            )}
                            <CardBody className="p-0 flex flex-col items-center">
                                <div className={`w-[88px] h-[88px] rounded-[28px] flex items-center justify-center text-[40px] mb-6 relative z-[1] transition-transform duration-[350ms] ease-[cubic-bezier(.22,.68,0,1.2)] group-hover:scale-[1.12] ${card.bubbleCls}`}>{card.icon}</div>
                                <div className={`text-[22px] font-extrabold mb-2.5 relative z-[1] ${darkTxt}`}>{card.title}</div>
                                <div className={`${darkTxt2} text-sm leading-[1.7] mb-8 relative z-[1]`}>{card.desc}</div>
                                <ul className={`list-none w-full mb-8 flex flex-col gap-2 relative z-[1] ${isArabic ? 'text-right' : 'text-left'}`}>
                                    {card.features.map((f, i) => (
                                        <li key={i} className={`flex items-center gap-[9px] text-[13px] ${darkTxt2} font-medium ${isArabic ? 'flex-row-reverse' : ''}`}>
                                            <span className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-[11px] ${card.dotCls}`}>{f.emoji}</span>
                                            <span>{f.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardBody>
                            <CardFooter className="p-0 w-full">
                                <Button fullWidth radius="lg" className={`py-[13px] font-jakarta text-[15px] font-bold text-white ${card.btnGrad}`}>{card.btn}</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className={`relative mt-10 text-center text-[13px] ${isDark ? 'text-ltxt3-dark' : 'text-ltxt3'}`}>
                    <span>{T.noteText}</span>
                    <Button variant="light" size="sm" className="text-p600 font-semibold p-0 min-w-0 h-auto" onPress={() => openModal('child')}>{T.noteLink}</Button>
                </div>
            </main>

            {/* ===== MODAL (HeroUI Modal) ===== */}
            <Modal isOpen={isOpen && !!activeModal} onClose={resetModal} size="md" backdrop="blur" placement="center"
                classNames={{ base: `${darkSurf} ${darkBdr} border rounded-[28px]`, backdrop: 'bg-black/60', closeButton: 'hidden' }}>
                <ModalContent>
                    {config && !quickSuccess && (
                        <>
                            <ModalHeader className={`${config.gradient} text-white text-center flex flex-col items-center py-7 px-7`}>
                                <Button isIconOnly size="sm" className="absolute top-3.5 end-3.5 bg-white/20 text-white backdrop-blur-lg min-w-8 h-8" onPress={resetModal}>✕</Button>
                                <h2 className="text-[22px] font-extrabold">{modalMode === 'login' ? config.loginTitle : config.title}</h2>
                                <p className="text-white/80 text-[13px] mt-1.5 font-normal">{modalMode === 'login' ? (isArabic ? 'سجل دخولك بالإيميل وكلمة المرور' : 'Log in with your email and password') : (isArabic ? 'سجل بسرعة بالإيميل بتاعك' : 'Quick sign up with your email')}</p>
                            </ModalHeader>
                            <ModalBody className="py-6 px-7">
                                {/* Toggle Tabs */}
                                <div className={`flex gap-1 mb-5 p-1 rounded-[14px] ${isDark ? 'bg-lbg-dark' : 'bg-gray-100'}`}>
                                    {['signup', 'login'].map(m => (
                                        <Button key={m} fullWidth size="sm" radius="lg"
                                            className={`font-bold text-[13px] font-jakarta ${modalMode === m ? 'text-white' : `${darkTxt2} bg-transparent`}`}
                                            style={modalMode === m ? { background: config.accent } : undefined}
                                            onPress={() => { setModalMode(m); setQuickError(''); }}>
                                            {m === 'signup' ? (isArabic ? 'حساب جديد' : 'Sign Up') : (isArabic ? 'تسجيل دخول' : 'Log In')}
                                        </Button>
                                    ))}
                                </div>

                                {/* Form Fields (HeroUI Input) */}
                                {modalMode === 'signup' && (
                                    <Input label={`👤 ${isArabic ? 'الاسم' : 'Name'} *`} variant="bordered" size="sm" radius="lg"
                                        value={quickForm.name} onChange={e => setQuickForm(p => ({ ...p, name: e.target.value }))}
                                        placeholder={config.namePlaceholder} className="mb-3 font-jakarta"
                                        classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }} />
                                )}
                                <Input label={`📧 ${isArabic ? 'البريد الإلكتروني' : 'Email'} *`} type="email" variant="bordered" size="sm" radius="lg"
                                    value={quickForm.email} onChange={e => setQuickForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="your@email.com" className="mb-3 font-jakarta"
                                    classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }} />
                                <Input label={`🔒 ${isArabic ? 'كلمة المرور' : 'Password'} *`} type="password" variant="bordered" size="sm" radius="lg"
                                    value={quickForm.password} onChange={e => setQuickForm(p => ({ ...p, password: e.target.value }))}
                                    placeholder={isArabic ? '6 أحرف على الأقل' : 'At least 6 characters'} className="mb-3 font-jakarta"
                                    classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }}
                                    onKeyDown={e => e.key === 'Enter' && handleQuickSubmit()} />
                                {modalMode === 'signup' && config.showChildId && (
                                    <Input label={`🆔 ${isArabic ? 'كود الطفل' : 'Child Code'} *`} variant="bordered" size="sm" radius="lg"
                                        value={quickForm.childId} onChange={e => setQuickForm(p => ({ ...p, childId: e.target.value.toUpperCase() }))}
                                        placeholder="LN-XXXXXX" maxLength={9} className="mb-3 font-mono tracking-[2px] font-jakarta"
                                        classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }} />
                                )}
                                {modalMode === 'signup' && config.showPhone && (
                                    <Input label={`📱 ${isArabic ? 'رقم الهاتف' : 'Phone'} (${isArabic ? 'اختياري' : 'Optional'})`} type="tel" variant="bordered" size="sm" radius="lg"
                                        value={quickForm.phone} onChange={e => setQuickForm(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="01xxxxxxxxx" className="mb-3 font-jakarta"
                                        classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }} />
                                )}

                                {quickError && (<div className={`rounded-[10px] py-2.5 px-3.5 mb-3 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}><span className="text-red-500 text-[13px] font-semibold">⚠️ {quickError}</span></div>)}

                                <Button fullWidth radius="lg" isLoading={quickLoading} onPress={handleQuickSubmit}
                                    className={`${config.gradient} text-white font-bold text-[15px] font-jakarta mt-1 py-3.5`}
                                    style={{ boxShadow: `0 6px 20px ${config.shadowColor}` }}>
                                    {quickLoading ? '' : modalMode === 'login' ? (isArabic ? '🚀 تسجيل الدخول' : '🚀 Log In') : (isArabic ? '✨ إنشاء حساب' : '✨ Create Account')}
                                </Button>

                                <div className="flex items-center gap-3 my-4">
                                    <Divider className="flex-1" />
                                    <span className={`text-xs font-medium ${darkTxt2}`}>{isArabic ? 'أو' : 'OR'}</span>
                                    <Divider className="flex-1" />
                                </div>

                                <Button fullWidth variant="bordered" radius="lg"
                                    className={`font-semibold text-sm font-jakarta ${isDark ? 'bg-lbdr-dark text-ltxt-dark border-lbdr-dark' : 'bg-white text-ltxt border-lbdr'}`}
                                    startContent={<GoogleIcon />}
                                    onPress={() => { setGoogleStep(1); setGoogleError(''); setGoogleEmail(''); setGooglePassword(''); setGoogleChildId(''); onGoogleOpen(); }}>
                                    {modalMode === 'login' ? (isArabic ? 'تسجيل الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'التسجيل بجوجل' : 'Sign up with Google')}
                                </Button>

                                <div className="text-center mt-4">
                                    <Button variant="light" size="sm" className={`text-xs font-jakarta underline ${darkTxt2} hover:text-p600`}
                                        onPress={() => { const card = cards.find(c => c.id === activeModal); resetModal(); if (card) navigate(card.loginPath); }}>
                                        {isArabic ? '← التسجيل بالطريقة الكاملة' : '← Full registration form'}
                                    </Button>
                                </div>
                            </ModalBody>
                        </>
                    )}
                    {config && quickSuccess && (
                        <ModalBody className="py-9 px-8 text-center">
                            <div className="text-[64px] mb-3">🎉</div>
                            <h2 className={`text-2xl font-extrabold mb-2 ${darkTxt}`}>{isArabic ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}</h2>
                            <p className={`text-sm mb-5 ${darkTxt2}`}>{isArabic ? 'ده كود الطفل الخاص بيك. احتفظ بيه!' : 'This is your unique child code. Keep it safe!'}</p>
                            <div className={`py-4 px-7 rounded-2xl inline-block mb-5 ${config.gradient}`}>
                                <div className="text-[10px] text-white/70 mb-1 font-bold uppercase tracking-wider">{isArabic ? 'كود الطفل' : 'CHILD CODE'}</div>
                                <div className="text-[32px] font-black text-white tracking-[4px] font-mono">{quickSuccess.childId}</div>
                            </div>
                            <div className={`rounded-xl p-3 mb-4 border text-start ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                                <p className={`text-xs font-semibold m-0 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>⚠️ {isArabic ? 'مهم: شارك الكود مع ولي أمرك!' : 'Important: Share this code with your parent!'}</p>
                            </div>
                            <Button fullWidth variant="bordered" radius="lg" className={`mb-2.5 font-jakarta ${darkTxt} ${darkBdr}`} onPress={() => navigator.clipboard?.writeText(quickSuccess.childId)}>📋 {isArabic ? 'نسخ الكود' : 'Copy Code'}</Button>
                            <Button fullWidth radius="lg" className={`${config.gradient} text-white font-bold font-jakarta`} style={{ boxShadow: `0 4px 16px ${config.shadowColor}` }}
                                onPress={() => { resetModal(); navigate('/child-home'); }}>🚀 {isArabic ? 'ابدأ التعلم!' : 'Start Learning!'}</Button>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>

            {/* ===== GOOGLE MODAL (HeroUI Modal) ===== */}
            <Modal isOpen={isGoogleOpen && googleStep > 0} onClose={() => { setGoogleStep(0); onGoogleClose(); }} size="sm" backdrop="blur" placement="center"
                classNames={{ base: `${darkSurf} rounded-3xl`, backdrop: 'bg-black/70', closeButton: 'hidden' }}>
                <ModalContent>
                    {config && (
                        <>
                            <ModalHeader className={`py-8 px-8 text-center flex flex-col items-center border-b ${darkBdr}`}>
                                <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${isDark ? 'bg-lbdr-dark' : 'bg-gray-100'}`}><GoogleIcon /></div>
                                <h2 className={`text-xl font-extrabold ${darkTxt}`}>{googleStep === 1 ? (isArabic ? 'تسجيل الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'إنشاء كلمة مرور' : 'Set Your Password')}</h2>
                                <p className={`text-[13px] font-normal mt-1.5 ${darkTxt2}`}>{googleStep === 1 ? (isArabic ? 'أدخل إيميل جوجل بتاعك' : 'Enter your Google email to continue') : (isArabic ? `مرحباً بك ${googleEmail}` : `Welcome ${googleEmail}`)}</p>
                            </ModalHeader>
                            <ModalBody className="py-6 px-8">
                                {googleStep === 1 && (
                                    <Input label={isArabic ? 'إيميل جوجل' : 'Google Email'} type="email" variant="bordered" size="sm" radius="lg" autoFocus
                                        value={googleEmail} onChange={e => setGoogleEmail(e.target.value)}
                                        placeholder="example@gmail.com" className="font-jakarta"
                                        classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }}
                                        onKeyDown={e => e.key === 'Enter' && handleGoogleSubmit()} />
                                )}
                                {googleStep === 2 && (<>
                                    <div className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl mb-4 border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                                        <GoogleIcon />
                                        <div className="flex-1"><div className={`text-[13px] font-bold ${darkTxt}`}>{googleEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div><div className={`text-[11px] ${darkTxt2}`}>{googleEmail}</div></div>
                                        <span className="text-blue-500 text-base">✓</span>
                                    </div>
                                    <Input label={`🔒 ${isArabic ? 'كلمة المرور للحساب' : 'Account Password'}`} type="password" variant="bordered" size="sm" radius="lg" autoFocus
                                        value={googlePassword} onChange={e => setGooglePassword(e.target.value)}
                                        placeholder={isArabic ? '6 أحرف على الأقل' : 'At least 6 characters'} className="font-jakarta"
                                        classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }}
                                        onKeyDown={e => e.key === 'Enter' && handleGoogleSubmit()} />
                                    {modalMode === 'signup' && activeModal === 'parent' && (
                                        <Input label={`🆔 ${isArabic ? 'كود الطفل' : 'Child Code'} *`} variant="bordered" size="sm" radius="lg"
                                            value={googleChildId} onChange={e => setGoogleChildId(e.target.value.toUpperCase())}
                                            placeholder="LN-XXXXXX" maxLength={9} className="mt-3 font-mono tracking-[2px] font-jakarta"
                                            classNames={{ inputWrapper: `${isDark ? 'bg-lbg-dark border-lbdr-dark' : 'bg-[#F9FAFB] border-lbdr'}` }} />
                                    )}
                                </>)}
                                {googleError && (<div className={`rounded-[10px] py-2.5 px-3.5 mt-3 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}><span className="text-red-500 text-[13px] font-semibold">⚠️ {googleError}</span></div>)}
                            </ModalBody>
                            <ModalFooter className="px-8 pb-6 pt-0 flex gap-2.5">
                                <Button variant="bordered" radius="lg" className={`flex-1 font-semibold font-jakarta ${isDark ? 'border-lbdr-dark text-ltxt-dark' : 'border-gray-300 text-ltxt'}`}
                                    onPress={() => { if (googleStep === 2) { setGoogleStep(1); setGoogleError(''); } else { setGoogleStep(0); onGoogleClose(); } }}>
                                    {isArabic ? 'رجوع' : 'Back'}
                                </Button>
                                <Button radius="lg" isLoading={googleLoading} className="flex-[1.5] bg-[#4285F4] text-white font-bold font-jakarta shadow-[0_4px_14px_rgba(66,133,244,0.4)]"
                                    onPress={handleGoogleSubmit}>
                                    {googleLoading ? '' : googleStep === 1 ? (isArabic ? 'التالي →' : 'Next →') : modalMode === 'login' ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء الحساب' : 'Create Account')}
                                </Button>
                            </ModalFooter>
                            <p className={`text-center text-[11px] pb-6 ${isDark ? 'text-ltxt3-dark' : 'text-ltxt3'}`}>{isArabic ? 'سيتم استخدام إيميل جوجل لإنشاء حسابك تلقائياً' : 'Your Google email will be used to auto-create your account'}</p>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <style>{`
                @keyframes cardIn { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
        </div>
    );
}
