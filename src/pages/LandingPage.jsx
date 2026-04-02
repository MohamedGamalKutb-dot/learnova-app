import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import {
    Button, Card, CardBody, Chip, Divider, Navbar, NavbarBrand, NavbarContent, NavbarItem
} from '@heroui/react';

export default function LandingPage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    const T = {
        heroPill: isArabic ? '🌟 منصة متخصصة في طيف التوحد' : '🌟 Specialized Autism Support Platform',
        heroH1a: isArabic ? 'رحلة التعلم تبدأ' : "Every child's journey",
        heroH1b: isArabic ? 'من ' : 'starts with ',
        heroSub: isArabic
            ? 'منصة رقمية شاملة تربط بين الطفل وولي الأمر والطبيب لدعم أطفال طيف التوحد بأدوات علمية وتقنية متكاملة.'
            : 'A comprehensive digital platform connecting children, parents, and medical specialists to support families navigating autism spectrum disorder — with science-backed tools, real-time tracking, and compassionate care.',
        heroBtn1: isArabic ? 'ابدأ الآن ←' : 'Get Started →',
        heroBtn2: isArabic ? '🎓 اعرف أكثر عن التوحد' : '🎓 Learn About Autism',
        hc1t: isArabic ? 'لوحة الطفل' : 'Child Dashboard', hc1s: isArabic ? 'ألعاب تعليمية تفاعلية' : 'Interactive learning games',
        hc2t: isArabic ? 'بوابة ولي الأمر' : 'Parent Portal', hc2s: isArabic ? 'تتبع التقدم والإحصائيات' : 'Progress tracking & insights',
        hc3t: isArabic ? 'لوحة الطبيب' : 'Doctor Console', hc3s: isArabic ? 'التقارير الطبية والإدارة' : 'Clinical reports & management',
        ltag: isArabic ? 'تسجيل الدخول' : 'Log In',
        lh2: isArabic ? 'من أنت في منظومة LearnNeur؟' : 'Who are you in LearnNeur?',
        lsub: isArabic ? 'اختر نوع حسابك للوصول إلى لوحة التحكم المخصصة لك' : 'Choose your account type to access your personalised dashboard',
        lc1h: isArabic ? 'الطفل' : 'Child',
        lc1p: isArabic ? 'ادخل إلى عالمك الممتع! ألعاب تعليمية وتحديات ونشاطات مصممة خصيصاً لك.' : 'Enter your fun world! Educational games, challenges and activities designed especially for you.',
        lc1btn: isArabic ? 'دخول كطفل' : 'Login as Child',
        lc2h: isArabic ? 'ولي الأمر' : 'Parent / Guardian',
        lc2p: isArabic ? 'تابع تقدم طفلك، تواصل مع الطبيب، واطّلع على أحدث التقارير والنصائح.' : "Track your child's progress, communicate with the specialist, and access the latest reports and tips.",
        lc2btn: isArabic ? 'دخول كولي أمر' : 'Login as Parent',
        lc3h: isArabic ? 'الطبيب / المختص' : 'Doctor / Specialist',
        lc3p: isArabic ? 'إدارة الحالات، متابعة التقدم العلاجي، وإصدار التقارير التفصيلية.' : 'Manage cases, monitor therapeutic progress and generate detailed clinical reports.',
        lc3btn: isArabic ? 'دخول كطبيب' : 'Login as Doctor',
        aitag: isArabic ? 'دليل المعرفة' : 'Knowledge Guide',
        aih2: isArabic ? 'ما هو اضطراب طيف التوحد؟' : 'What is Autism Spectrum Disorder?',
        aiTitle: isArabic ? 'فهم التوحد' : 'Understanding Autism',
        aip1: isArabic ? 'اضطراب طيف التوحد (ASD) هو حالة عصبية تؤثر على التواصل والتفاعل الاجتماعي وأنماط السلوك. يُسمى "طيفاً" لأن كل طفل مصاب به فريد ومختلف.' : 'Autism Spectrum Disorder (ASD) is a neurodevelopmental condition affecting communication, social interaction, and behaviour patterns. It\'s called a "spectrum" because it encompasses a wide range of characteristics — every autistic person is unique.',
        aip2: isArabic ? 'يُشخَّص التوحد عادةً في السنوات الأولى. التدخل المبكر والدعم المناسب يحدثان فرقاً هائلاً في حياة الطفل.' : 'ASD is typically diagnosed in the early years of life. Early intervention and the right support can make an enormous difference to a child\'s development and future independence.',
        stats: [
            { n: '1:36', l: isArabic ? 'طفل مشخص بالتوحد عالمياً' : 'Children diagnosed with ASD worldwide' },
            { n: '4×', l: isArabic ? 'أكثر شيوعاً لدى الذكور' : 'More common in males than females' },
            { n: 'Age 3', l: isArabic ? 'أنسب سن للتشخيص المبكر' : 'Ideal window for early diagnosis' },
            { n: '80%', l: isArabic ? 'تحسن مع التدخل المبكر' : 'Improvement with early intervention' },
        ],
        types: [
            { h: isArabic ? 'متلازمة أسبرجر' : 'Asperger Syndrome', p: isArabic ? 'ذكاء عالٍ وقدرات لغوية جيدة مع صعوبات في التفاعل الاجتماعي.' : 'High intelligence and good language skills with social interaction difficulties. Often diagnosed later.', dot: '#2563EB' },
            { h: isArabic ? 'التوحد الكلاسيكي' : "Classic Autism (Kanner's)", p: isArabic ? 'تأخر في اللغة والتواصل مع سلوكيات متكررة.' : 'Language and communication delays with repetitive behaviours. Ranges from mild to severe.', dot: '#06B6D4' },
            { h: isArabic ? 'اضطراب النمو الشامل' : 'Pervasive Developmental Disorder', p: isArabic ? 'نمط أوسع يشمل أعراضاً متنوعة دون تصنيف محدد.' : "A broader pattern including varied symptoms that don't fit neatly into other categories.", dot: '#8B5CF6' },
            { h: isArabic ? 'متلازمة ريت' : 'Rett Syndrome', p: isArabic ? 'نادرة وتصيب الإناث غالباً، تتميز بفقدان المهارات الحركية تدريجياً.' : 'Rare; predominantly affects females. Characterised by gradual loss of motor and hand skills.', dot: '#10B981' },
            { h: isArabic ? 'اضطراب الطفولة التفككي' : 'Childhood Disintegrative Disorder', p: isArabic ? 'فقدان مفاجئ للمهارات اللغوية والاجتماعية بعد نمو طبيعي مبكر.' : 'Sudden loss of language and social skills after a period of normal early development.', dot: '#F59E0B' },
        ],
        titag: isArabic ? 'دليل الأهل' : "Parent's Guide",
        tih2: isArabic ? 'كيف نتعامل مع طفل التوحد؟' : 'How to Support a Child with Autism',
        tisub: isArabic ? 'نصائح عملية مبنية على أحدث الأبحاث لدعم طفلك في رحلته' : 'Evidence-based tips to help your child thrive every day',
        tips: [
            { h: isArabic ? 'الروتين الثابت' : 'Consistent Routines', p: isArabic ? 'الأطفال المصابون بالتوحد يحتاجون إلى جداول يومية واضحة. استخدم الجداول البصرية.' : 'Children with autism thrive on predictable daily schedules. Use visual timetables and picture cards to clarify daily activities.' },
            { h: isArabic ? 'التواصل البصري' : 'Visual Communication', p: isArabic ? 'استخدم الصور والرموز والبطاقات. تطبيقات AAC يمكنها أن تكون أداة ذهبية.' : 'Use images, symbols and communication cards to ease interaction. AAC apps can be transformative tools for non-verbal children.' },
            { h: isArabic ? 'التعزيز الإيجابي' : 'Positive Reinforcement', p: isArabic ? 'كافئ السلوكيات الجيدة فوراً. استخدم مبادئ التحليل السلوكي التطبيقي ABA.' : 'Reward desirable behaviours immediately in a way your child loves. ABA principles can effectively guide your approach.' },
            { h: isArabic ? 'تقليل الحمل الحسي' : 'Sensory-Friendly Environment', p: isArabic ? 'لاحظ ما يُثير الطفل حسياً واخلق بيئة مريحة تحترم حساسيته.' : "Identify sensory triggers — sounds, lights, textures — and create a comfortable space that respects your child's sensitivities." },
            { h: isArabic ? 'التدخل المبكر' : 'Early Intervention', p: isArabic ? 'كلما بدأ التدخل مبكراً كلما كانت النتائج أفضل. لا تتردد في طلب التقييم.' : 'The earlier support begins, the better the outcomes. Seek professional assessment at any early warning sign.' },
            { h: isArabic ? 'اعتنِ بنفسك' : 'Take Care of Yourself', p: isArabic ? 'صحة الوالدين النفسية أساس لدعم الطفل. انضم لمجموعات الدعم ولا تتردد.' : "A parent's mental health is the foundation for supporting their child. Join support groups and ask for help freely." },
        ],
        tltag: isArabic ? 'أدوات المنصة' : 'Platform Features',
        tlh2: isArabic ? 'كل ما تحتاجه في مكان واحد' : 'Everything you need, in one place',
        tlsub: isArabic ? 'أدوات متكاملة مصممة لكل طرف في رحلة التوحد' : 'Integrated tools designed for every stakeholder in the autism journey',
        tools: [
            { emoji: '🎮', h: isArabic ? 'ألعاب تعليمية تفاعلية' : 'Interactive Learning Games', p: isArabic ? 'أنشطة وألعاب مصممة بأساليب ABA وDIR/Floortime لتطوير مهارات الطفل.' : "Activities designed using ABA and DIR/Floortime methods to develop your child's skills enjoyably.", badge: isArabic ? 'للأطفال' : 'For Children' },
            { emoji: '📊', h: isArabic ? 'لوحة تتبع التقدم' : 'Progress Tracking Dashboard', p: isArabic ? 'رسوم بيانية واضحة تُظهر مسيرة تطور الطفل في جميع مجالات النمو.' : "Clear charts showing your child's developmental journey over time across all growth domains.", badge: isArabic ? 'للآباء والأطباء' : 'Parents & Doctors' },
            { emoji: '💬', h: isArabic ? 'نظام التواصل المعزز' : 'Augmentative Communication', p: isArabic ? 'مكتبة غنية من البطاقات المصورة وأدوات AAC لدعم التواصل اللفظي وغير اللفظي.' : 'Rich library of picture cards and AAC tools to support verbal and non-verbal communication.', badge: isArabic ? 'أدوات AAC' : 'AAC Tools' },
            { emoji: '📅', h: isArabic ? 'الجدول البصري اليومي' : 'Visual Daily Schedule', p: isArabic ? 'أداة لبناء روتين يومي مرئي يساعد الطفل على التكيف والشعور بالأمان.' : 'Build a clear visual routine that helps your child adapt and manage daily transitions with ease.', badge: isArabic ? 'للأطفال' : 'For Children' },
            { emoji: '🩺', h: isArabic ? 'استشارة الطبيب أونلاين' : 'Online Specialist Consultation', p: isArabic ? 'جلسات استشارية افتراضية مع أفضل متخصصي التوحد من منزلك.' : 'Virtual sessions with leading autism specialists — from the comfort of your home.', badge: isArabic ? 'للآباء' : 'For Parents' },
            { emoji: '📚', h: isArabic ? 'مكتبة الموارد' : 'Resource Library', p: isArabic ? 'مئات المقالات والدراسات المحدثة باستمرار عن التوحد وأساليب التدخل.' : 'Hundreds of articles, videos and research papers on autism and intervention strategies, updated continuously.', badge: isArabic ? 'للجميع' : 'For Everyone' },
        ],
        ctah2: isArabic ? 'مستعد تبدأ الرحلة؟' : 'Ready to start the journey?',
        ctap: isArabic ? 'انضم لآلاف الأسر التي تستخدم LearnNeur لدعم أطفالها كل يوم.' : 'Join thousands of families already using LearnNeur to support their children every day.',
        ctabtn: isArabic ? 'أنشئ حسابك المجاني ←' : 'Create your free account →',
        footdesc: isArabic ? 'منصة رقمية متكاملة تدعم أطفال طيف التوحد وأسرهم بأحدث الأدوات العلمية والتكنولوجية.' : 'A comprehensive digital platform supporting autism spectrum children and their families with the latest scientific and technological tools.',
        fc1h: isArabic ? 'المنصة' : 'Platform',
        fc1: [isArabic ? 'الرئيسية' : 'Home', isArabic ? 'عن التوحد' : 'About Autism', isArabic ? 'الأدوات' : 'Tools', isArabic ? 'الأسعار' : 'Pricing'],
        fc2h: isArabic ? 'الحسابات' : 'Accounts',
        fc2: [
            { t: isArabic ? 'دخول الطفل' : 'Child Login', p: '/child-login' },
            { t: isArabic ? 'دخول ولي الأمر' : 'Parent Login', p: '/login' },
            { t: isArabic ? 'دخول الطبيب' : 'Doctor Login', p: '/doctor-auth' },
            { t: isArabic ? 'إنشاء حساب' : 'Create Account', p: '/choice' },
        ],
        fc3h: isArabic ? 'تواصل' : 'Contact',
        fc3: [isArabic ? 'سياسة الخصوصية' : 'Privacy Policy', isArabic ? 'شروط الاستخدام' : 'Terms of Use', isArabic ? 'الدعم الفني' : 'Support'],
        footcopy: isArabic ? '© 2025 LearnNeur. جميع الحقوق محفوظة.' : '© 2025 LearnNeur. All rights reserved.',
        nl: [isArabic ? 'الرئيسية' : 'Home', isArabic ? 'عن التوحد' : 'About Autism', isArabic ? 'تسجيل الدخول' : 'Log In', isArabic ? 'الأدوات' : 'Tools', isArabic ? 'تواصل' : 'Contact'],
        langBtn: isArabic ? 'English' : 'عربي',
        regBtn: isArabic ? 'سجّل الآن' : 'Register Now',
    };

    const navIds = ['hero', 'about', 'login', 'tools', 'footer'];
    const loginCards = [
        { icon: '🧒', h: T.lc1h, p: T.lc1p, btn: T.lc1btn, topC: 'from-p500 to-a500', iconBg: 'bg-gradient-to-br from-p100 to-p200', btnBg: 'bg-gradient-to-br from-p500 to-a500', path: '/child-login' },
        { icon: '👨‍👩‍👦', h: T.lc2h, p: T.lc2p, btn: T.lc2btn, topC: 'from-emerald-500 to-p500', iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-200', btnBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', path: '/login' },
        { icon: '👨‍⚕️', h: T.lc3h, p: T.lc3p, btn: T.lc3btn, topC: 'from-violet-500 to-p500', iconBg: 'bg-gradient-to-br from-violet-100 to-violet-200', btnBg: 'bg-gradient-to-br from-violet-500 to-violet-600', path: '/doctor-auth' },
    ];
    const heroCards = [
        { icon: '🧒', bg: 'bg-gradient-to-br from-p100 to-p200', t: T.hc1t, s: T.hc1s, cls: 'hcard-1' },
        { icon: '👨‍👩‍👦', bg: 'bg-gradient-to-br from-cyan-100 to-cyan-200', t: T.hc2t, s: T.hc2s, cls: 'hcard-2' },
        { icon: '👨‍⚕️', bg: 'bg-gradient-to-br from-emerald-100 to-emerald-200', t: T.hc3t, s: T.hc3s, cls: 'hcard-3' },
    ];

    const darkBg = isDark ? 'bg-lbg-dark' : 'bg-lbg';
    const darkBg2 = isDark ? 'bg-lbg2-dark' : 'bg-lbg2';
    const darkSurf = isDark ? 'bg-lsurf-dark' : 'bg-lsurf';
    const darkTxt = isDark ? 'text-ltxt-dark' : 'text-ltxt';
    const darkTxt2 = isDark ? 'text-ltxt2-dark' : 'text-ltxt2';
    const darkTxt3 = isDark ? 'text-ltxt3-dark' : 'text-ltxt3';
    const darkBdr = isDark ? 'border-lbdr-dark' : 'border-lbdr';
    const darkShad = isDark ? 'shadow-[0_4px_20px_rgba(6,182,212,.12)]' : 'shadow-[0_4px_20px_rgba(37,99,235,.10)]';
    const tagBg = isDark ? 'bg-lbg2-dark border-lbdr-dark' : 'bg-p50 border-p200';
    const navBtnCls = `font-jakarta text-[13px] font-semibold ${isDark ? 'bg-lbg2-dark text-ltxt2-dark border-lbdr-dark' : 'bg-lbg2 text-ltxt2 border-lbdr'}`;

    return (
        <div className={`font-jakarta ${darkBg} ${darkTxt} overflow-x-hidden transition-colors duration-300 min-h-screen`} dir={isArabic ? 'rtl' : 'ltr'}>

            {/* ===== NAVBAR (HeroUI) ===== */}
            <Navbar
                maxWidth="full"
                isBordered
                className={`fixed top-0 inset-x-0 h-[72px] z-[999] backdrop-blur-[18px] transition-colors duration-300 ${isDark ? 'bg-[rgba(8,14,28,.92)]' : 'bg-[rgba(255,255,255,.88)]'}`}
                classNames={{ wrapper: 'px-5 md:px-14 gap-3' }}
            >
                <NavbarBrand className="gap-2.5 shrink-0 cursor-pointer" onClick={() => scrollTo('hero')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-p600 to-a500 flex items-center justify-center text-xl shadow-[0_4px_12px_rgba(37,99,235,.25)]">🧠</div>
                    <span className="text-[21px] font-extrabold tracking-tight bg-gradient-to-r from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                </NavbarBrand>

                {/* Desktop Nav Links */}
                <NavbarContent className="hidden md:flex gap-0.5 mx-auto" justify="center">
                    {navIds.map((id, i) => (
                        <NavbarItem key={id}>
                            <Button variant="light" size="sm" radius="lg"
                                className={`${darkTxt2} text-sm font-semibold hover:bg-p50 hover:text-p600 ${isDark ? 'hover:bg-lbg2-dark' : ''}`}
                                onPress={() => scrollTo(id)}>{T.nl[i]}</Button>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                {/* Nav Controls */}
                <NavbarContent justify="end" className="gap-2">
                    <NavbarItem>
                        <Button size="sm" variant="bordered" className={navBtnCls} onPress={toggleLanguage}>{T.langBtn}</Button>
                    </NavbarItem>
                    <NavbarItem>
                        <Button isIconOnly size="sm" variant="bordered" className={`text-base ${navBtnCls}`} onPress={toggleTheme}>{isDark ? '☀️' : '🌙'}</Button>
                    </NavbarItem>
                    <NavbarItem className="hidden sm:flex">
                        <Button size="sm" className="font-jakarta text-sm font-semibold bg-gradient-to-br from-p600 to-p700 text-white shadow-[0_4px_14px_rgba(37,99,235,.28)] hover:-translate-y-px hover:shadow-[0_7px_20px_rgba(37,99,235,.35)]"
                            onPress={() => navigate('/choice')}>{T.regBtn}</Button>
                    </NavbarItem>
                    <NavbarItem className="md:hidden">
                        <Button isIconOnly size="sm" variant="light" className="text-xl" onPress={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={`fixed top-[72px] inset-x-0 z-[998] ${isDark ? 'bg-lbg-dark' : 'bg-lsurf'} border-b ${darkBdr} p-4 flex flex-col gap-2 md:hidden shadow-lg`}>
                    {navIds.map((id, i) => (
                        <Button key={id} variant="light" radius="lg" className={`${darkTxt2} text-base font-semibold justify-start hover:bg-p50 hover:text-p600 ${isDark ? 'hover:bg-lbg2-dark' : ''}`}
                            onPress={() => scrollTo(id)}>{T.nl[i]}</Button>
                    ))}
                    <Button className="font-jakarta text-sm font-semibold bg-gradient-to-br from-p600 to-p700 text-white shadow-[0_4px_14px_rgba(37,99,235,.28)] mt-2 sm:hidden"
                        onPress={() => { navigate('/choice'); setMenuOpen(false); }}>{T.regBtn}</Button>
                </div>
            )}

            {/* ===== HERO ===== */}
            <section id="hero" className="min-h-screen flex items-center pt-[132px] pb-20 px-5 md:px-14 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_35%,rgba(59,130,246,.09)_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_15%_75%,rgba(6,182,212,.07)_0%,transparent_60%)]" />
                <div className="absolute inset-0 dot-grid opacity-45" />
                <div className="relative max-w-[600px]">
                    <Chip variant="bordered" className={`${tagBg} text-p600 font-semibold mb-7 border`}>{T.heroPill}</Chip>
                    <h1 className={`text-[clamp(28px,4.5vw,60px)] font-extrabold leading-[1.12] tracking-tight mb-5 ${darkTxt}`}>
                        {T.heroH1a}<br />{T.heroH1b}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">LearnNeur</span>
                    </h1>
                    <p className={`text-[15px] md:text-[17px] ${darkTxt2} leading-[1.8] mb-10 max-w-[520px]`}>{T.heroSub}</p>
                    <div className="flex gap-3 flex-wrap">
                        <Button radius="lg" className="bg-gradient-to-br from-p600 to-p700 text-white font-jakarta py-3.5 px-7 text-[15px] font-bold shadow-[0_6px_24px_rgba(37,99,235,.30)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(37,99,235,.40)]"
                            onPress={() => scrollTo('login')}>{T.heroBtn1}</Button>
                        <Button variant="bordered" radius="lg" className={`${darkSurf} ${darkTxt} ${darkBdr} font-jakarta py-3.5 px-7 text-[15px] font-semibold hover:bg-lbg2`}
                            onPress={() => scrollTo('about')}>{T.heroBtn2}</Button>
                    </div>
                </div>
                {/* Hero Cards */}
                <div className={`hidden lg:flex absolute ${isArabic ? 'left-14' : 'right-14'} top-1/2 -translate-y-1/2 flex-col gap-3.5 w-[260px]`}>
                    {heroCards.map((c, i) => (
                        <Card key={i} className={`${darkSurf} border ${darkBdr} ${darkShad} ${c.cls}`}>
                            <CardBody className="py-4 px-[18px] flex flex-row items-center gap-3.5">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0 ${c.bg}`}>{c.icon}</div>
                                <div className="flex-1">
                                    <div className={`text-[13px] font-bold ${darkTxt}`}>{c.t}</div>
                                    <div className={`text-[11px] ${darkTxt3} mt-0.5`}>{c.s}</div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== LOGIN SECTION ===== */}
            <section id="login" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg2}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.ltag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.lh2}</h2>
                    <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.lsub}</p>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
                    {loginCards.map((c, i) => (
                        <Card key={i} isPressable onPress={() => navigate(c.path)}
                            className={`${darkSurf} border ${darkBdr} rounded-2xl pt-10 px-7 pb-8 text-center transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(37,99,235,.10)]`}>
                            <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${c.topC}`} />
                            <CardBody className="p-0 flex flex-col items-center">
                                <div className={`w-[76px] h-[76px] rounded-[22px] flex items-center justify-center text-[34px] mb-5 ${c.iconBg}`}>{c.icon}</div>
                                <h3 className={`text-xl font-bold mb-2 ${darkTxt}`}>{c.h}</h3>
                                <p className={`${darkTxt2} text-sm leading-[1.65] mb-6`}>{c.p}</p>
                                <Button size="sm" radius="lg" className={`${c.btnBg} text-white font-bold font-jakarta hover:scale-105`}>{c.btn}</Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== ABOUT AUTISM ===== */}
            <section id="about" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.aitag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.aih2}</h2>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    <div>
                        <h2 className={`text-[clamp(20px,2.5vw,34px)] font-extrabold tracking-tight mb-2 ${darkTxt}`}>{T.aiTitle}</h2>
                        <div className="w-12 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 my-3" />
                        <p className={`${darkTxt2} text-[15px] leading-[1.85] mb-3.5`}>{T.aip1}</p>
                        <p className={`${darkTxt2} text-[15px] leading-[1.85] mb-3.5`}>{T.aip2}</p>
                        <div className="grid grid-cols-2 gap-3.5 mt-7">
                            {T.stats.map((s, i) => (
                                <Card key={i} className={`${darkSurf} border ${darkBdr}`}>
                                    <CardBody className="p-5">
                                        <div className="text-[28px] font-black text-p600">{s.n}</div>
                                        <div className={`text-[13px] ${darkTxt2} mt-1 leading-[1.4]`}>{s.l}</div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3.5">
                        {T.types.map((t, i) => (
                            <Card key={i} className={`${darkSurf} border ${darkBdr} transition-all duration-200 hover:border-p300 hover:shadow-[0_6px_24px_rgba(37,99,235,.10)]`}>
                                <CardBody className="py-[18px] px-[22px] flex flex-row gap-3.5 items-start">
                                    <div className="w-2.5 h-2.5 rounded-full mt-[5px] shrink-0" style={{ background: t.dot }} />
                                    <div>
                                        <h4 className={`text-[15px] font-bold mb-1 ${darkTxt}`}>{t.h}</h4>
                                        <p className={`text-[13px] ${darkTxt2} leading-[1.6] m-0`}>{t.p}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TIPS ===== */}
            <section id="tips" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg2}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.titag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.tih2}</h2>
                    <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.tisub}</p>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
                    {T.tips.map((tip, i) => (
                        <Card key={i} className={`${darkSurf} border ${darkBdr} transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_32px_rgba(37,99,235,.10)]`}>
                            <CardBody className="p-6 flex flex-row gap-4">
                                <div className="w-[42px] h-[42px] rounded-xl shrink-0 bg-gradient-to-br from-p600 to-a500 text-white text-base font-extrabold flex items-center justify-center">{i + 1}</div>
                                <div>
                                    <h4 className={`text-[15px] font-bold mb-1.5 ${darkTxt}`}>{tip.h}</h4>
                                    <p className={`text-[13px] ${darkTxt2} leading-[1.65] m-0`}>{tip.p}</p>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== TOOLS ===== */}
            <section id="tools" className={`py-16 md:py-[88px] px-5 md:px-14 ${darkBg}`}>
                <div className="text-center mb-10 md:mb-14">
                    <Chip variant="bordered" size="sm" className={`${tagBg} text-p600 text-[11px] font-bold tracking-[1.2px] uppercase mb-3.5 border`}>{T.tltag}</Chip>
                    <h2 className={`text-[clamp(24px,3vw,40px)] font-extrabold tracking-tight leading-[1.2] ${darkTxt}`}>{T.tlh2}</h2>
                    <p className={`${darkTxt2} text-base mt-2.5 leading-[1.7] max-w-[540px] mx-auto`}>{T.tlsub}</p>
                    <div className="w-14 h-1 rounded-sm bg-gradient-to-r from-p600 to-a500 mx-auto mt-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {T.tools.map((tool, i) => (
                        <Card key={i} className={`group ${darkSurf} border ${darkBdr} transition-all duration-300 relative overflow-hidden hover:-translate-y-[5px] hover:shadow-[0_18px_44px_rgba(37,99,235,.10)]`}>
                            <div className="toolcard-bar absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-p500 to-a500" />
                            <CardBody className="py-8 px-[26px]">
                                <div className="text-4xl mb-4">{tool.emoji}</div>
                                <h3 className={`text-[17px] font-bold mb-2 ${darkTxt}`}>{tool.h}</h3>
                                <p className={`${darkTxt2} text-sm leading-[1.7] m-0`}>{tool.p}</p>
                                <Chip size="sm" variant="bordered" className={`mt-4 ${tagBg} text-p600 text-[11px] font-bold tracking-[.5px] border`}>{tool.badge}</Chip>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <div className="bg-gradient-to-br from-p600 via-p700 to-[#1e3a8a] py-16 md:py-20 px-5 md:px-14 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(255,255,255,.05)_0%,transparent_70%)]" />
                <h2 className="text-[clamp(24px,3vw,40px)] font-extrabold text-white mb-3 relative">{T.ctah2}</h2>
                <p className="text-white/75 text-base mb-8 relative">{T.ctap}</p>
                <Button radius="lg" className="relative bg-white text-p700 py-3.5 px-[30px] text-[15px] font-bold font-jakarta shadow-[0_6px_24px_rgba(0,0,0,.18)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,0,0,.24)]"
                    onPress={() => navigate('/choice')}>{T.ctabtn}</Button>
            </div>

            {/* ===== FOOTER ===== */}
            <footer id="footer" className="bg-[#060D1C] text-[#94A3B8] py-14 md:py-[72px] px-5 md:px-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr] gap-10 mb-12">
                    <div>
                        <h3 className="text-[22px] font-extrabold bg-gradient-to-r from-p400 to-a400 bg-clip-text [-webkit-text-fill-color:transparent] mb-3">🧠 LearnNeur</h3>
                        <p className="text-sm leading-[1.8] text-[#64748B] max-w-[280px]">{T.footdesc}</p>
                    </div>
                    <div>
                        <h4 className="text-[#F1F5F9] text-[13px] font-bold mb-4 tracking-[.5px] uppercase">{T.fc1h}</h4>
                        <ul className="list-none p-0 m-0">
                            {T.fc1.map((t, i) => <li key={i} className="mb-2.5"><a href="#" className="text-[#64748B] no-underline text-[13px] transition-colors duration-200 hover:text-a400">{t}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#F1F5F9] text-[13px] font-bold mb-4 tracking-[.5px] uppercase">{T.fc2h}</h4>
                        <ul className="list-none p-0 m-0">
                            {T.fc2.map((item, i) => <li key={i} className="mb-2.5"><a href="#" onClick={e => { e.preventDefault(); navigate(item.p); }} className="text-[#64748B] no-underline text-[13px] transition-colors duration-200 hover:text-a400">{item.t}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#F1F5F9] text-[13px] font-bold mb-4 tracking-[.5px] uppercase">{T.fc3h}</h4>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2.5"><a href="#" className="text-[#64748B] no-underline text-[13px]">info@learnneur.com</a></li>
                            {T.fc3.map((t, i) => <li key={i} className="mb-2.5"><a href="#" className="text-[#64748B] no-underline text-[13px] transition-colors duration-200 hover:text-a400">{t}</a></li>)}
                        </ul>
                    </div>
                </div>
                <Divider className="bg-[#1E293B] mb-6" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[#475569]">
                    <span>{T.footcopy}</span>
                    <div className="flex gap-2.5">
                        {['𝕏', 'in', '▶', 'f'].map((s, i) => (
                            <a key={i} href="#" className="w-9 h-9 rounded-[10px] bg-[#1E293B] border border-[#334155] flex items-center justify-center text-sm cursor-pointer transition-all duration-200 no-underline text-[#94A3B8] hover:bg-p600 hover:border-p600 hover:text-white">{s}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
