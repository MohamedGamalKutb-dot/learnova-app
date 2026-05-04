import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Divider, Card, CardBody } from '@heroui/react';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function ChildLoginPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { loginChild } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!email.trim()) { setError(isArabic ? 'أدخل البريد الإلكتروني' : 'Enter your email'); return; }
        if (!password) { setError(isArabic ? 'أدخل كلمة المرور' : 'Enter your password'); return; }
        setError('');
        const result = loginChild(email.trim(), password);
        if (result.success) {
            navigate('/child-home');
        } else {
            if (result.error === 'not_found') setError(isArabic ? 'البريد الإلكتروني غير مسجل' : 'Email not found');
            else if (result.error === 'wrong_password') setError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
        }
    };

    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding */}
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent to-[#8B5CF6] to-[#FF6584] p-10 relative overflow-hidden min-h-screen">
                <div className="absolute top-[10%] left-[10%] w-20 h-20 opacity-15 overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite' }}><img src="/icons/games.png" className="w-full h-full object-cover" /></div>
                <div className="absolute top-[30%] right-[15%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 8s ease-in-out infinite 1s' }}><img src="/icons/rewards.png" className="w-full h-full object-cover" /></div>
                <div className="absolute bottom-[15%] left-[20%] w-20 h-20 opacity-10 overflow-hidden" style={{ animation: 'float 7s ease-in-out infinite 2s' }}><img src="/icons/pecs_module.png" className="w-full h-full object-cover" /></div>
                <div className="absolute bottom-[30%] right-[10%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}><img src="/icons/emotion_emo_happy.png" className="w-full h-full object-cover" /></div>
                <div className="w-32 h-32 mb-5 z-[1] overflow-hidden rounded-3xl shadow-2xl"><img src="/icons/games.png" className="w-full h-full object-cover" /></div>
                <h2 className="text-white text-[32px] font-extrabold text-center z-[1] mb-2.5">
                    {isArabic ? 'مرحباً بعودتك!' : 'Welcome Back!'}
                </h2>
                <p className="text-white/80 text-base text-center max-w-[300px] z-[1] leading-relaxed">
                    {isArabic ? 'سجل دخولك عشان ترجع تلعب وتتعلم حاجات جديدة!' : 'Log in to continue playing and learning new things!'}
                </p>
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer mt-10 z-[1] text-white/70 text-sm">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-white">LearnNeur</span>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 min-h-screen">
                <div className="max-w-[420px] w-full">
                    <Button variant="light" size="sm" className={`mb-8 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                        onPress={() => navigate('/choice')}>← {isArabic ? 'رجوع' : 'Back'}</Button>

                    <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'} flex items-center gap-3`}>
                        <div className="w-10 h-10 overflow-hidden rounded-xl"><img src="/icons/games.png" className="w-full h-full object-cover" /></div> {isArabic ? 'تسجيل دخول الطفل' : 'Child Login'}
                    </h1>
                    <p className={`text-sm mb-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? 'أدخل بياناتك عشان تلعب وتتعلم' : 'Enter your details to play and learn'}
                    </p>

                    <Input label={isArabic ? 'البريد الإلكتروني' : 'Email Address'} type="email" variant="bordered" radius="lg"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="example@email.com" className="mb-5"
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }} />

                    <Input label={isArabic ? 'كلمة المرور' : 'Password'} type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg"
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }}
                        endContent={<button onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} />

                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 mt-3 border ${isDark ? 'bg-[rgba(255,101,132,0.1)]' : 'bg-red-50'} border-[rgba(255,101,132,0.2)] flex items-center gap-2`}>
                            <img src="/icons/quiz_wrong.png" className="w-5 h-5 object-contain" />
                            <span className="text-red-500 text-[13px] font-semibold">{error}</span>
                        </div>
                    )}

                    <Button fullWidth radius="lg" className="bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold text-base mt-6 shadow-[0_4px_16px_rgba(108,99,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(108,99,255,0.35)]"
                        onPress={handleLogin}
                        startContent={<div className="w-6 h-6 overflow-hidden rounded-md"><img src="/icons/quiz_excellent.png" className="w-full h-full object-contain" /></div>}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}</Button>

                    <div className="flex items-center gap-3 my-6">
                        <Divider className="flex-1" />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <Divider className="flex-1" />
                    </div>

                    <GoogleAuthButton 
                        role="child" 
                        mode="login" 
                        onSuccess={() => navigate('/child-home')} 
                    />

                    <div className="mt-5">
                        <Button fullWidth variant="bordered" radius="lg"
                            className={`font-semibold text-sm hover:border-accent hover:text-accent ${isDark ? 'border-border-dark text-text-dark' : 'border-border text-text'}`}
                            onPress={() => navigate('/child-signup')}
                            startContent={<div className="w-5 h-5 overflow-hidden rounded-md"><img src="/icons/rewards.png" className="w-full h-full object-contain" /></div>}>
                            {isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
