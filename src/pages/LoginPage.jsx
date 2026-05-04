import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Divider, Chip } from '@heroui/react';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function LoginPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { loginParent } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [childId, setChildId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email.trim() || !email.includes('@')) { setError(isArabic ? 'أدخل إيميل صحيح' : 'Enter a valid email'); return; }
        if (!password) { setError(isArabic ? 'أدخل كلمة المرور' : 'Enter your password'); return; }
        if (!childId.trim()) { setError(isArabic ? 'أدخل كود الطفل الخاص بك' : 'Enter your child code'); return; }
        
        setError('');
        const result = loginParent(email.trim(), password, childId.trim());
        if (result.success) {
            navigate('/parent-dashboard');
        } else {
            if (result.error === 'not_found') setError(isArabic ? 'هذا الإيميل غير مسجل' : 'This email is not registered');
            else if (result.error === 'wrong_password') setError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
            else if (result.error === 'child_id_mismatch') setError(isArabic ? 'كود الطفل غير مطابق لهذا الحساب' : 'Child code does not match this account');
            else setError(isArabic ? 'حدث خطأ في تسجيل الدخول' : 'Login failed');
        }
    };
    
    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding Panel */}
            <div className="flex-[0_0_45%] hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent3 to-[#44B09E] relative overflow-hidden p-10">
                <div className="absolute top-[10%] left-[10%] w-20 h-20 opacity-15 overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite' }}><img src="/icons/quiz_stats.png" className="w-full h-full object-cover" /></div>
                <div className="absolute bottom-[15%] right-[10%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 7s ease-in-out infinite 1s' }}><img src="/icons/parent_icon.png" className="w-full h-full object-cover" /></div>
                <div className="absolute top-[60%] left-[5%] w-16 h-16 opacity-10 overflow-hidden" style={{ animation: 'float 8s ease-in-out infinite 2s' }}><img src="/icons/emotion_emo_love.png" className="w-full h-full object-cover" /></div>
                <div className="w-32 h-32 mb-5 z-[1] overflow-hidden rounded-3xl shadow-2xl"><img src="/icons/daily_rhythm.png" className="w-full h-full object-cover" /></div>
                <h2 className="text-white text-3xl font-extrabold text-center z-[1] mb-2.5">
                    {isArabic ? 'مرحباً بعودتك' : 'Welcome Back'}
                </h2>
                <p className="text-white/85 text-[15px] text-center z-[1] max-w-[320px] leading-relaxed">
                    {isArabic ? 'تابع تقدم طفلك واحصل على تقارير مفصلة ونصائح ذكية' : "Track your child's progress with detailed reports and AI-powered insights"}
                </p>
                <div className="mt-10 flex gap-3 z-[1]">
                    {['/icons/quiz_stats.png', '/icons/support_circles.png', '/icons/assistant_aura.png', '/icons/journal_entry.png'].map((icon, i) => (
                        <div key={i} className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center overflow-hidden backdrop-blur-sm border border-white/10"><img src={icon} className="w-full h-full object-cover" /></div>
                    ))}
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6">
                <div className="w-full max-w-[420px]">
                    <Button variant="light" size="sm" className={`mb-8 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                        onPress={() => navigate('/choice')}>← {isArabic ? 'رجوع' : 'Back'}</Button>

                    <div className="mb-8">
                        <Chip variant="bordered" className="bg-accent3/[0.07] border-accent3/[0.12] text-accent3 mb-4">
                            <div className="w-4 h-4 me-2 overflow-hidden rounded-sm inline-block align-middle"><img src="/icons/parent_icon.png" className="w-full h-full object-cover" /></div>
                            <span className="text-xs font-semibold">{isArabic ? 'ولي الأمر' : 'Parent Dashboard'}</span>
                        </Chip>
                        <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            {isArabic ? 'تسجيل الدخول' : 'Log In'}
                        </h1>
                        <p className={`text-sm m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isArabic ? 'سجل دخول لمتابعة تقدم طفلك' : "Sign in to track your child's progress"}
                        </p>
                    </div>

                    <Input label={`📧 ${isArabic ? 'البريد الإلكتروني' : 'Email'}`} type="email" variant="bordered" radius="lg"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com" className="mb-4"
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }} />

                    <Input label={`🔒 ${isArabic ? 'كلمة المرور' : 'Password'}`} type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg"
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder={isArabic ? 'كلمة المرور' : 'Password'} className="mb-4"
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }}
                        endContent={<button onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} />

                    <Input label={`🆔 ${isArabic ? 'كود الطفل (LN-XXXXXX)' : 'Child Code (LN-XXXXXX)'}`} variant="bordered" radius="lg"
                        value={childId} onChange={e => setChildId(e.target.value.toUpperCase())}
                        placeholder="LN-ABCDEF"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }} />

                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 mt-3.5 border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} flex items-center gap-2`}>
                            <img src="/icons/quiz_wrong.png" className="w-5 h-5 object-contain" />
                            <span className="text-red-500 text-[13px] font-semibold">{error}</span>
                        </div>
                    )}

                    <Button fullWidth radius="lg" className="bg-gradient-to-br from-accent3 to-[#44B09E] text-white font-bold text-base mt-6 shadow-[0_4px_16px_rgba(78,205,196,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(78,205,196,0.35)]"
                        onPress={handleLogin}
                        startContent={<div className="w-6 h-6 overflow-hidden rounded-md"><img src="/icons/quiz_excellent.png" className="w-full h-full object-contain" /></div>}>
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}</Button>

                    <div className="flex items-center gap-3 my-6">
                        <Divider className="flex-1" />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <Divider className="flex-1" />
                    </div>

                    <GoogleAuthButton 
                        role="parent" 
                        mode="login" 
                        onSuccess={() => navigate('/parent-dashboard')} 
                    />

                    <div className="mt-5">
                        <Button fullWidth variant="bordered" radius="lg"
                            className="border-accent3 text-accent3 font-bold text-[15px] hover:bg-accent3/[0.06]"
                            onPress={() => navigate('/signup')}
                            startContent={<div className="w-5 h-5 overflow-hidden rounded-md"><img src="/icons/rewards.png" className="w-full h-full object-contain" /></div>}>
                            {isArabic ? 'إنشاء حساب جديد' : 'Create New Account'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
