import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useState, useMemo } from 'react';
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
            btnGrad: 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-[0_6px_20px_rgba(139,92,246,.28)] hover:shadow-[0_10px_28_rgba(139,92,246,.38)]',
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

    const resetModal = () => { 
        setActiveModal(null); setModalMode('signup'); 
        setQuickForm({ email: '', password: '', name: '', childId: '', phone: '' }); 
        setQuickError(''); setQuickLoading(false); setQuickSuccess(null); 
        setGoogleStep(0); setGoogleEmail(''); setGooglePassword(''); setGoogleError(''); 
        setGoogleLoading(false); setGoogleChildId(''); onClose(); onGoogleClose(); 
    };

    const openModal = (roleId) => { 
        setQuickForm({ email: '', password: '', name: '', childId: '', phone: '' }); 
        setQuickError(''); setQuickSuccess(null); setModalMode('signup'); 
        setActiveModal(roleId); onOpen(); 
    };

    const handleQuickSubmit = () => {
        setQuickError(''); setQuickLoading(true);
        const { email, password, name, childId, phone } = quickForm;
        if (!email.trim() || !email.includes('@')) { setQuickError(isArabic ? 'أدخل إيميل صحيح' : 'Enter a valid email'); setQuickLoading(false); return; }
        if (!password || password.length < 6) { setQuickError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); setQuickLoading(false); return; }
        
        if (modalMode === 'login') {
            let result;
            if (activeModal === 'child') result = loginChild(email.trim(), password);
            else if (activeModal === 'parent') result = loginParent(email.trim(), password);
            else if (activeModal === 'doctor') result = loginDoctor(email.trim(), password);

            if (result?.success) {
                resetModal();
                navigate(activeModal === 'child' ? '/child-home' : activeModal === 'parent' ? '/dashboard' : '/doctor-dashboard');
                return;
            } else {
                if (result?.error === 'not_found') setQuickError(isArabic ? 'الإيميل غير مسجل' : 'Email not found');
                else if (result?.error === 'wrong_password') setQuickError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
                setQuickLoading(false);
                return;
            }
        }

        // SignUp Flow
        if (!name.trim()) { setQuickError(isArabic ? 'أدخل الاسم' : 'Enter your name'); setQuickLoading(false); return; }
        
        let result;
        if (activeModal === 'child') {
            result = registerChild({ name: name.trim(), age: 8, email: email.trim(), password, gender: 'Male', avatar: '👦' });
        } else if (activeModal === 'parent') {
            if (!childId.trim()) { setQuickError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)'); setQuickLoading(false); return; }
            const childObj = getChildById(childId.trim());
            if (!childObj) { setQuickError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found'); setQuickLoading(false); return; }
            result = registerParent({ name: name.trim(), email: email.trim(), password, phone: phone.trim(), childId: childId.trim() });
        } else if (activeModal === 'doctor') {
            result = registerDoctor({ name: name.trim(), email: email.trim(), password, phone: phone.trim(), age: '', gender: 'Male' });
        }

        if (result?.success) {
            setQuickSuccess({ childId: result.childId, role: activeModal });
        } else if (result?.error === 'email_exists') {
            setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        }
        setQuickLoading(false);
    };

    const handleGoogleAuth = () => {
        setGoogleError('');
        setGoogleEmail('');
        setGooglePassword('');
        setGoogleChildId('');
        setGoogleStep(1);
        onGoogleOpen();
    };

    const handleGoogleSubmit = () => {
        setGoogleError('');
        setGoogleLoading(true);

        setTimeout(() => {
            if (googleStep === 1) {
                if (!googleEmail.trim() || !googleEmail.includes('@')) {
                    setGoogleError(isArabic ? 'أدخل إيميل جوجل صحيح' : 'Enter a valid Google email');
                    setGoogleLoading(false);
                    return;
                }
                setGoogleStep(2);
                setGoogleLoading(false);
                return;
            }

            if (googleStep === 2) {
                if (!googlePassword || googlePassword.length < 6) {
                    setGoogleError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
                    setGoogleLoading(false);
                    return;
                }

                const nameFromEmail = googleEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                
                if (modalMode === 'login') {
                    const result = activeModal === 'child' ? loginChild(googleEmail.trim(), googlePassword) :
                                 activeModal === 'parent' ? loginParent(googleEmail.trim(), googlePassword) :
                                 loginDoctor(googleEmail.trim(), googlePassword);

                    if (result?.success) {
                        resetModal();
                        navigate(activeModal === 'child' ? '/child-home' : activeModal === 'parent' ? '/dashboard' : '/doctor-dashboard');
                    } else {
                        setGoogleError(isArabic ? 'بيانات الدخول غير صحيحة أو الحساب غير موجود' : 'Invalid credentials or account not found');
                    }
                    setGoogleLoading(false);
                    return;
                }

                // Signup mode
                let result;
                if (activeModal === 'child') {
                    result = registerChild({ name: nameFromEmail, age: 8, email: googleEmail.trim(), password: googlePassword, gender: 'Male', avatar: '👦' });
                } else if (activeModal === 'parent') {
                    if (!googleChildId.trim()) {
                        setGoogleError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)');
                        setGoogleLoading(false);
                        return;
                    }
                    const childObj = getChildById(googleChildId.trim());
                    if (!childObj) {
                        setGoogleError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found');
                        setGoogleLoading(false);
                        return;
                    }
                    result = registerParent({ name: nameFromEmail, email: googleEmail.trim(), password: googlePassword, phone: '', childId: googleChildId.trim() });
                } else if (activeModal === 'doctor') {
                    result = registerDoctor({ name: nameFromEmail, email: googleEmail.trim(), password: googlePassword, phone: '', age: '', gender: 'Male' });
                }

                if (result?.success) {
                    setQuickSuccess({ childId: result.childId, role: activeModal });
                    setGoogleStep(0);
                    onGoogleClose();
                } else {
                    setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
                }
                setGoogleLoading(false);
            }
        }, 800);
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
            <Navbar maxWidth="full" isBordered classNames={{ base: `sticky top-0 z-[99] backdrop-blur-[16px] ${isDark ? 'bg-[rgba(8,14,28,.90)]' : 'bg-[rgba(255,255,255,.85)]'}`, wrapper: 'px-5 md:px-12' }}>
                <NavbarBrand className="gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-p600 to-a500 flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(37,99,235,.25)]">🧠</div>
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>
                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem><Button size="sm" variant="bordered" className={`font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`} onPress={toggleLanguage}>{T.langBtn}</Button></NavbarItem>
                    <NavbarItem><Button isIconOnly size="sm" variant="bordered" className={`text-[15px] ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`} onPress={toggleTheme}>{isDark ? '☀️' : '🌙'}</Button></NavbarItem>
                </NavbarContent>
            </Navbar>

            <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(59,130,246,.07)_0%,transparent_70%)]" />
                <div className="relative text-center mb-10 max-w-[520px]">
                    <Chip variant="bordered" className={`${tagBg} text-p600 font-bold mb-5`}>{T.eyebrow}</Chip>
                    <h1 className={`text-[clamp(28px,4vw,44px)] font-extrabold mb-3.5 ${darkTxt}`}>{T.pageTitle1}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">{T.pageTitleGrad}</span></h1>
                    <p className={`${darkTxt2} text-base`}>{T.pageDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[920px]">
                    {cards.map((card, idx) => (
                        <Card key={card.id} isPressable onPress={() => openModal(card.id)} className={`${darkSurf} border-2 ${card.borderCls} rounded-3xl p-8 text-center transition-all hover:-translate-y-2 group shadow-sm hover:shadow-xl`}>
                            <CardBody className="p-0 flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 ${card.bubbleCls}`}>{card.icon}</div>
                                <div className={`text-xl font-extrabold mb-2 ${darkTxt}`}>{card.title}</div>
                                <div className={`${darkTxt2} text-sm mb-6`}>{card.desc}</div>
                                <ul className="w-full space-y-2 mb-6 text-sm">
                                    {card.features.map((f, i) => (
                                        <li key={i} className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}><span className={card.dotCls}>{f.emoji}</span> {f.text}</li>
                                    ))}
                                </ul>
                                <Button fullWidth className={`font-bold text-white ${card.btnGrad}`} onPress={() => openModal(card.id)}>{card.btn}</Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </main>

            <Modal isOpen={isOpen && !!activeModal} onClose={resetModal} size="md" backdrop="blur" placement="center" classNames={{ base: `${darkSurf} border rounded-[30px]`, closeButton: 'hidden' }}>
                <ModalContent>
                    {config && !quickSuccess && (
                        <>
                            <ModalHeader className={`${config.gradient} text-white text-center py-8`}><h2 className="text-2xl font-bold w-full">{modalMode === 'login' ? config.loginTitle : config.title}</h2></ModalHeader>
                            <ModalBody className="p-7">
                                <div className={`flex gap-1 mb-6 p-1 rounded-xl ${isDark ? 'bg-lbg-dark' : 'bg-gray-100'}`}>
                                    {['signup', 'login'].map(m => (
                                        <Button key={m} fullWidth size="sm" radius="lg" className={`font-bold ${modalMode === m ? 'text-white' : 'text-gray-400 bg-transparent'}`} style={modalMode === m ? { background: config.accent } : undefined} onPress={() => { setModalMode(m); setQuickError(''); }}>{m === 'signup' ? (isArabic ? 'حساب جديد' : 'Sign Up') : (isArabic ? 'تسجيل دخول' : 'Log In')}</Button>
                                    ))}
                                </div>
                                {modalMode === 'signup' && <Input label={isArabic ? 'الاسم' : 'Name'} variant="bordered" value={quickForm.name} onChange={e => setQuickForm(p => ({ ...p, name: e.target.value }))} className="mb-4" />}
                                <Input label={isArabic ? 'البريد الإلكتروني' : 'Email'} type="email" variant="bordered" value={quickForm.email} onChange={e => setQuickForm(p => ({ ...p, email: e.target.value }))} className="mb-4" />
                                <Input label={isArabic ? 'كلمة المرور' : 'Password'} type="password" variant="bordered" value={quickForm.password} onChange={e => setQuickForm(p => ({ ...p, password: e.target.value }))} className="mb-4" />
                                {modalMode === 'signup' && config.showChildId && <Input label={isArabic ? 'كود الطفل' : 'Child Code'} variant="bordered" value={quickForm.childId} onChange={e => setQuickForm(p => ({ ...p, childId: e.target.value.toUpperCase() }))} className="mb-4" />}
                                {quickError && <div className="p-3 mb-4 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold border border-red-500/20">⚠️ {quickError}</div>}
                                <Button fullWidth radius="lg" isLoading={quickLoading} onPress={handleQuickSubmit} className={`${config.gradient} text-white font-bold h-12`}>{modalMode === 'login' ? (isArabic ? 'تسجيل الدخول' : 'Log In') : (isArabic ? 'إنشاء حساب' : 'Sign Up')}</Button>
                                <Divider className="my-6" />
                                <Button fullWidth variant="bordered" isLoading={googleLoading} startContent={!googleLoading && <GoogleIcon />} onPress={handleGoogleAuth} className="h-12 border-gray-200 font-bold">{isArabic ? 'الدخول بجوجل' : 'Sign in with Google'}</Button>
                            </ModalBody>
                        </>
                    )}
                    {config && quickSuccess && (
                        <ModalBody className="p-10 text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-2xl font-bold mb-4">{isArabic ? 'تم بنجاح!' : 'Successful!'}</h2>
                            {quickSuccess.childId && <div className={`${config.gradient} p-6 rounded-2xl text-white mb-6`}><p className="text-sm opacity-80 mb-1">{isArabic ? 'كود الطفل' : 'CHILD CODE'}</p><p className="text-4xl font-black tracking-widest">{quickSuccess.childId}</p></div>}
                            <Button fullWidth className={`${config.gradient} text-white font-bold h-12`} onPress={() => { setQuickSuccess(null); setModalMode('login'); }}>{isArabic ? 'حسناً، ادخل الآن' : 'Done, Log In Now'}</Button>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isGoogleOpen} onClose={() => { setGoogleStep(0); onGoogleClose(); }} size="sm" placement="center" backdrop="blur">
                <ModalContent>
                    <ModalHeader className="border-b flex flex-col items-center py-8"><GoogleIcon /><h2 className="mt-4 text-xl font-bold">{googleStep === 1 ? (isArabic ? 'جوجل' : 'Google') : (isArabic ? 'مرحباً' : 'Welcome')}</h2></ModalHeader>
                    <ModalBody className="p-8">
                        {googleStep === 1 ? <Input autoFocus label="Email" variant="bordered" value={googleEmail} onChange={e => setGoogleEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGoogleSubmit()} /> : 
                        <div className="space-y-4"><div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"><GoogleIcon /><div><p className="font-bold text-sm">{googleEmail.split('@')[0]}</p><p className="text-xs text-gray-500">{googleEmail}</p></div></div><Input autoFocus label="Password" type="password" variant="bordered" value={googlePassword} onChange={e => setGooglePassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGoogleSubmit()} />
                        {modalMode === 'signup' && activeModal === 'parent' && <Input label="Child Code" variant="bordered" value={googleChildId} onChange={e => setGoogleChildId(e.target.value.toUpperCase())} />} </div>}
                        {googleError && <p className="text-red-500 text-xs mt-3">⚠️ {googleError}</p>}
                        <Button fullWidth isLoading={googleLoading} className="mt-6 bg-[#4285F4] text-white font-bold h-12" onPress={handleGoogleSubmit}>{googleStep === 1 ? 'Next' : 'Sign In'}</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
