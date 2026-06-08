import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button, Card, CardBody, Switch } from '@heroui/react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    useAuth(); // Auth context is mounted but no specific user data is needed

    const t = {
        title: isArabic ? 'الإعدادات' : 'Settings',
        appearance: isArabic ? 'المظهر' : 'Appearance',
        darkMode: isArabic ? 'الوضع المظلم' : 'Dark Mode',
        language: isArabic ? 'اللغة' : 'Language',
        themeDesc: isArabic ? 'تغيير مظهر التطبيق بين الوضع الفاتح والمظلم' : 'Toggle between light and dark themes',
        langDesc: isArabic ? 'اختر لغتك المفضلة لاستخدام التطبيق' : 'Select your preferred language for the application'
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#080912] text-white' : 'bg-slate-50 text-slate-900'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            {/* ── Lightweight Settings Navbar ── */}
            <nav className={`fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-6 backdrop-blur-xl border-b transition-colors duration-500 ${isDark ? 'bg-[#080912]/60 border-white/5' : 'bg-white/60 border-slate-100'}`}>
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-60 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                >
                    <span className={`text-lg ${isArabic ? 'rotate-180' : ''}`}>←</span>
                    {isArabic ? 'رجوع' : 'Back'}
                </button>

                {/* Page title */}
                <span className={`text-sm font-black tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {t.title}
                </span>
            </nav>

            <main className="max-w-2xl mx-auto px-6 pt-28 pb-16">
                <h1 className="text-3xl font-black tracking-tight mb-8">{t.title}</h1>

                <div className="space-y-4">
                    {/* Theme Setting */}
                    <Card className={`border shadow-lg rounded-[28px] overflow-hidden ${isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-100'}`}>
                        <CardBody className="p-7">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="text-base font-bold flex items-center gap-2.5">
                                        <span>{isDark ? '🌙' : '☀️'}</span>
                                        {t.appearance}
                                    </h3>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.themeDesc}</p>
                                </div>
                                <Switch
                                    isSelected={isDark}
                                    onValueChange={toggleTheme}
                                    size="md"
                                    color="secondary"
                                    classNames={{ wrapper: 'group-data-[selected=true]:bg-indigo-500' }}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Language Setting */}
                    <Card className={`border shadow-lg rounded-[28px] overflow-hidden ${isDark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-100'}`}>
                        <CardBody className="p-7">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <h3 className="text-base font-bold flex items-center gap-2.5">
                                        <span>🌐</span>
                                        {t.language}
                                    </h3>
                                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.langDesc}</p>
                                </div>
                                <div className={`flex items-center p-1 rounded-2xl border shrink-0 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                                    <button
                                        onClick={() => !isArabic && toggleLanguage()}
                                        className={`rounded-xl font-bold h-9 px-5 text-sm transition-all ${isArabic ? 'bg-indigo-500 text-white shadow-md' : 'bg-transparent text-slate-500'}`}
                                    >
                                        العربية
                                    </button>
                                    <button
                                        onClick={() => isArabic && toggleLanguage()}
                                        className={`rounded-xl font-bold h-9 px-5 text-sm transition-all ${!isArabic ? 'bg-indigo-500 text-white shadow-md' : 'bg-transparent text-slate-500'}`}
                                    >
                                        English
                                    </button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </main>
        </div>
    );
}


