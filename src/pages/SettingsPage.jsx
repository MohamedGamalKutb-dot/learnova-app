import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Card, CardBody, Switch, Divider } from '@heroui/react';
import MainNavbar from '../components/MainNavbar';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { currentChild, currentParent, currentDoctor } = useAuth();

    const userType = currentChild ? 'child' : currentDoctor ? 'doctor' : currentParent ? 'parent' : null;

    const t = {
        title: isArabic ? 'الإعدادات' : 'Settings',
        appearance: isArabic ? 'المظهر' : 'Appearance',
        darkMode: isArabic ? 'الوضع المظلم' : 'Dark Mode',
        language: isArabic ? 'اللغة' : 'Language',
        arabic: isArabic ? 'العربية' : 'Arabic',
        english: isArabic ? 'الإنجليزية' : 'English',
        back: isArabic ? 'رجوع' : 'Back',
        themeDesc: isArabic ? 'تغيير مظهر التطبيق بين الوضع الفاتح والمظلم' : 'Toggle between light and dark themes',
        langDesc: isArabic ? 'اختر لغتك المفضلة لاستخدام التطبيق' : 'Select your preferred language for the application'
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#080912] text-white' : 'bg-slate-50 text-slate-900'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <MainNavbar userType={userType} />
            
            <main className="max-w-4xl mx-auto px-6 pt-32 pb-12">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-black tracking-tight">{t.title}</h1>
                    <Button 
                        variant="flat" 
                        onPress={() => navigate(-1)}
                        className="font-bold rounded-2xl"
                    >
                        {t.back}
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Theme Setting */}
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-[#111322]' : 'bg-white'} rounded-[32px] overflow-hidden`}>
                        <CardBody className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <span>{isDark ? '🌙' : '☀️'}</span>
                                        {t.appearance}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.themeDesc}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-sm uppercase tracking-widest opacity-50">{t.darkMode}</span>
                                    <Switch 
                                        isSelected={isDark} 
                                        onValueChange={toggleTheme}
                                        size="lg"
                                        color="secondary"
                                        classNames={{
                                            wrapper: "bg-slate-200 group-data-[selected=true]:bg-indigo-500",
                                        }}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Language Setting */}
                    <Card className={`border-none shadow-xl ${isDark ? 'bg-[#111322]' : 'bg-white'} rounded-[32px] overflow-hidden`}>
                        <CardBody className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <span>🌐</span>
                                        {t.language}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.langDesc}</p>
                                </div>
                                <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <Button 
                                        onPress={() => !isArabic && toggleLanguage()}
                                        className={`rounded-xl font-bold h-10 px-6 ${isArabic ? 'bg-indigo-500 text-white shadow-lg' : 'bg-transparent text-slate-500 dark:text-slate-400'}`}
                                    >
                                        العربية
                                    </Button>
                                    <Button 
                                        onPress={() => isArabic && toggleLanguage()}
                                        className={`rounded-xl font-bold h-10 px-6 ${!isArabic ? 'bg-indigo-500 text-white shadow-lg' : 'bg-transparent text-slate-500 dark:text-slate-400'}`}
                                    >
                                        English
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <footer className="mt-20 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
                    LearnNeur Premium Experience • 2026
                </footer>
            </main>
        </div>
    );
}
