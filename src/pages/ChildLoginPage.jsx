import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

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

    const inputCls = `w-full py-3.5 px-4 rounded-xl text-[15px] border outline-none transition-[border] duration-300 font-[inherit] box-border ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;

    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding */}
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent to-[#8B5CF6] to-[#FF6584] p-10 relative overflow-hidden min-h-screen">
                <div className="absolute top-[10%] left-[10%] text-5xl opacity-15" style={{ animation: 'float 6s ease-in-out infinite' }}>🎮</div>
                <div className="absolute top-[30%] right-[15%] text-[40px] opacity-[0.12]" style={{ animation: 'float 8s ease-in-out infinite 1s' }}>⭐</div>
                <div className="absolute bottom-[15%] left-[20%] text-[45px] opacity-10" style={{ animation: 'float 7s ease-in-out infinite 2s' }}>🧩</div>
                <div className="absolute bottom-[30%] right-[10%] text-[35px] opacity-[0.12]" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}>🎈</div>

                <div className="text-[80px] mb-5 z-[1]">🎮</div>
                <h2 className="text-white text-[32px] font-extrabold text-center z-[1] mb-2.5">
                    {isArabic ? 'مرحباً بعودتك!' : 'Welcome Back!'}
                </h2>
                <p className="text-white/80 text-base text-center max-w-[300px] z-[1] leading-relaxed">
                    {isArabic ? 'سجل دخولك عشان ترجع تلعب وتتعلم حاجات جديدة!' : 'Log in to continue playing and learning new things!'}
                </p>
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer mt-10 z-[1] text-white/70 text-sm">
                    <span>🧩</span>
                    <span className="font-bold text-white">LearnNeur</span>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 min-h-screen">
                <div className="max-w-[420px] w-full">
                    <button onClick={() => navigate('/choice')}
                        className={`bg-transparent border-none cursor-pointer text-sm font-medium mb-8 flex items-center gap-1.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        ← {isArabic ? 'رجوع' : 'Back'}
                    </button>

                    <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isArabic ? '🎮 تسجيل دخول الطفل' : '🎮 Child Login'}
                    </h1>
                    <p className={`text-sm mb-8 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? 'أدخل بياناتك عشان تلعب وتتعلم' : 'Enter your details to play and learn'}
                    </p>

                    {/* Email */}
                    <label className={`text-[13px] font-semibold mb-1.5 block ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="example@email.com" className={inputCls} />

                    <div className="mb-5" />

                    {/* Password */}
                    <label className={`text-[13px] font-semibold mb-1.5 block ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isArabic ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
                            className={inputCls} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                        <button onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-lg end-3.5">
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 mt-3 border ${isDark ? 'bg-[rgba(255,101,132,0.1)]' : 'bg-red-50'} border-[rgba(255,101,132,0.2)]`}>
                            <span className="text-red-500 text-[13px] font-semibold">⚠️ {error}</span>
                        </div>
                    )}

                    {/* Login Button */}
                    <button onClick={handleLogin}
                        className="w-full py-4 rounded-xl border-none cursor-pointer bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold text-base mt-6 shadow-[0_4px_16px_rgba(108,99,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(108,99,255,0.35)]">
                        {isArabic ? '🚀 تسجيل الدخول' : '🚀 Log In'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <div className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />
                    </div>

                    {/* Signup */}
                    <button onClick={() => navigate('/child-signup')}
                        className={`w-full py-3.5 rounded-xl bg-transparent cursor-pointer font-semibold text-sm transition-all duration-200 border hover:border-accent hover:text-accent ${isDark ? 'border-border-dark text-text-dark' : 'border-border text-text'}`}>
                        {isArabic ? '✨ إنشاء حساب جديد' : '✨ Create New Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}
