export const getChoiceData = (isArabic) => {
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
            id: 'child', icon: '/icons/child.png',
            title: isArabic ? 'طفل' : 'Child',
            desc: isArabic ? 'مغامرة التعلم الممتعة تنتظرك! العب الألعاب، اكسب النجوم، وتطور كل يوم.' : 'Your fun learning adventure awaits! Play games, earn stars, and grow every day.',
            features: [
                { icon: '/icons/games.png', text: isArabic ? 'ألعاب تعليمية تفاعلية' : 'Interactive learning games' },
                { icon: '/icons/rewards.png', text: isArabic ? 'اكسب مكافآت وشارات' : 'Earn rewards & badges' },
                { icon: '/icons/routine.png', text: isArabic ? 'جدولي البصري اليومي' : 'My visual daily schedule' },
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
            id: 'parent', icon: '/icons/parent_icon.png', popular: true,
            title: isArabic ? 'ولي الأمر' : 'Parent / Guardian',
            desc: isArabic ? 'ابقَ على تواصل مع تقدم طفلك وتقاريره وفريق المتخصصين في مكان واحد.' : "Stay connected with your child's progress, reports, and specialist team in one place.",
            features: [
                { icon: '/icons/rewards.png', text: isArabic ? 'لوحة تتبع التقدم' : 'Progress tracking dashboard' },
                { icon: '/icons/bot.png', text: isArabic ? 'مراسلة المختص' : 'Message the specialist' },
                { icon: '/icons/routine.png', text: isArabic ? 'عرض التقارير وتنزيلها' : 'View & download reports' },
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
            id: 'doctor', icon: '/icons/doctor_icon.png',
            title: isArabic ? 'الطبيب / المختص' : 'Doctor / Specialist',
            desc: isArabic ? 'إدارة حالاتك، إصدار التقارير السريرية، ومتابعة التقدم العلاجي.' : 'Manage your cases, generate clinical reports, and monitor therapeutic progress.',
            features: [
                { icon: '/icons/people_cat.png', text: isArabic ? 'نظام إدارة الحالات' : 'Case management system' },
                { icon: '/icons/rewards.png', text: isArabic ? 'تحليلات التقدم السريري' : 'Clinical progress analytics' },
                { icon: '/icons/routine.png', text: isArabic ? 'إنشاء تقارير العلاج' : 'Generate therapy reports' },
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

    return { T, cards };
};
