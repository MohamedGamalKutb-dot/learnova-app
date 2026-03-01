import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { loginParent } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const accent = '#4ECDC4';

    const handleLogin = () => {
        if (!email.trim() || !email.includes('@')) { setError(isArabic ? 'أدخل إيميل صحيح' : 'Enter a valid email'); return; }
        if (!password) { setError(isArabic ? 'أدخل كلمة المرور' : 'Enter your password'); return; }
        setError('');
        const result = loginParent(email.trim(), password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            if (result.error === 'not_found') setError(isArabic ? 'هذا الإيميل غير مسجل' : 'This email is not registered');
            else if (result.error === 'wrong_password') setError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
        }
    };

    const inputCls = `w-full py-3.5 px-4 rounded-xl text-sm border outline-none transition-[border] duration-300 font-[inherit] box-border ${isDark ? 'bg-bg-dark text-text-dark border-border-dark focus:border-accent3' : 'bg-[#F9FAFB] text-text border-border focus:border-accent3'}`;

    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding Panel */}
            <div className="flex-[0_0_45%] hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent3 to-[#44B09E] relative overflow-hidden p-10">
                <div className="absolute top-[10%] left-[10%] text-5xl opacity-15" style={{ animation: 'float 6s ease-in-out infinite' }}>📊</div>
                <div className="absolute bottom-[15%] right-[10%] text-[40px] opacity-[0.12]" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>👨‍👩‍👧</div>
                <div className="absolute top-[60%] left-[5%] text-[35px] opacity-10" style={{ animation: 'float 8s ease-in-out infinite 2s' }}>💜</div>

                <div className="text-[80px] mb-5 z-[1]">📋</div>
                <h2 className="text-white text-3xl font-extrabold text-center z-[1] mb-2.5">
                    {isArabic ? 'مرحباً بعودتك' : 'Welcome Back'}
                </h2>
                <p className="text-white/85 text-[15px] text-center z-[1] max-w-[320px] leading-relaxed">
                    {isArabic ? 'تابع تقدم طفلك واحصل على تقارير مفصلة ونصائح ذكية' : "Track your child's progress with detailed reports and AI-powered insights"}
                </p>

                <div className="mt-10 flex gap-3 z-[1]">
                    {['📊', '🗺️', '🤖', '📝'].map((em, i) => (
                        <div key={i} className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center text-[22px] backdrop-blur-sm">{em}</div>
                    ))}
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6">
                <div className="w-full max-w-[420px]">
                    {/* Back */}
                    <button onClick={() => navigate('/choice')}
                        className={`flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[13px] font-medium mb-8 p-0 font-[inherit] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        ← {isArabic ? 'رجوع' : 'Back'}
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-[10px] bg-accent3/[0.07] mb-4 border border-accent3/[0.12]">
                            <span className="text-base">👨‍👩‍👧</span>
                            <span className="text-accent3 text-xs font-semibold">{isArabic ? 'ولي الأمر' : 'Parent Portal'}</span>
                        </div>
                        <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            {isArabic ? 'تسجيل الدخول' : 'Log In'}
                        </h1>
                        <p className={`text-sm m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isArabic ? 'سجل دخول لمتابعة تقدم طفلك' : "Sign in to track your child's progress"}
                        </p>
                    </div>

                    {/* Email */}
                    <label className={`text-[13px] font-semibold mb-1.5 block ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        📧 {isArabic ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com" className={inputCls} />

                    {/* Password */}
                    <label className={`text-[13px] font-semibold mb-1.5 block mt-4 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        🔒 {isArabic ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
                            className={inputCls} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                        <button onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-lg p-0 end-3.5">
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 mt-3.5 border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                            <span className="text-red-500 text-[13px] font-semibold">⚠️ {error}</span>
                        </div>
                    )}

                    {/* Login Button */}
                    <button onClick={handleLogin}
                        className="w-full py-4 rounded-xl border-none cursor-pointer bg-gradient-to-br from-accent3 to-[#44B09E] text-white font-bold text-base mt-6 shadow-[0_4px_16px_rgba(78,205,196,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(78,205,196,0.35)]">
                        {isArabic ? '🚀 تسجيل الدخول' : '🚀 Log In'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <div className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />
                    </div>

                    {/* Signup Link */}
                    <button onClick={() => navigate('/signup')}
                        className="w-full py-3.5 rounded-xl border-[1.5px] border-accent3 bg-transparent text-accent3 cursor-pointer font-bold text-[15px] transition-all duration-300 hover:bg-accent3/[0.06]">
                        {isArabic ? '✨ إنشاء حساب جديد' : '✨ Create New Account'}
                    </button>

                    {/* Info */}
                    <div className={`rounded-xl p-3.5 mt-4 text-center border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-green-50 border-green-200'}`}>
                        <p className={`text-xs m-0 ${isDark ? 'text-subtext-dark' : 'text-green-800'}`}>
                            💡 {isArabic ? 'للتسجيل كولي أمر، ستحتاج كود الطفل (LN-XXXXXX)' : "To sign up, you'll need your child's code (LN-XXXXXX)"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
