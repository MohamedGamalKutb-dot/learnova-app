import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, CardBody, Divider } from '@heroui/react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { getAuthData } from '../data/authData';

export default function ChildSignupPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { registerChild } = useAuth();

    const [form, setForm] = useState({ name: '', age: '', email: '', password: '', confirmPassword: '', gender: 'Male' });
    const [avatar, setAvatar] = useState('👦');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [createdId, setCreatedId] = useState(null);
    const [step, setStep] = useState(1);

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return { level: 0, label: '', color: '#999' };
        let score = 0;
        if (p.length >= 6) score++; if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++; if (/[0-9]/.test(p)) score++; if (/[^A-Za-z0-9]/.test(p)) score++;
        const { passwordLevels } = getAuthData(isArabic);
        return { level: score, ...passwordLevels[Math.min(score, 4)] };
    };

    const validate = () => {
        if (!form.name.trim()) return isArabic ? 'الاسم مطلوب' : 'Name is required';
        if (!form.age || parseInt(form.age) < 2 || parseInt(form.age) > 18) return isArabic ? 'العمر يجب أن يكون بين 2 و 18' : 'Age must be between 2 and 18';
        if (!form.email.trim() || !form.email.includes('@')) return isArabic ? 'إيميل غير صحيح' : 'Invalid email';
        if (form.password.length < 6) return isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) return isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords do not match';
        return null;
    };

    const handleRegister = () => {
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        const result = registerChild({ ...form, avatar });
        if (result.success) { setCreatedId(result.childId); setStep(2); }
        else if (result.error === 'email_exists') setError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'This email is already registered');
    };

    if (step === 2) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <Card className={`max-w-[460px] w-full ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)]'} border`}
                    style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                    <CardBody className="p-12 text-center">
                        <div className="w-24 h-24 mb-4 mx-auto overflow-hidden"><img src="/icons/rewards.png" className="w-full h-full object-contain" /></div>
                        <h2 className={`text-[26px] font-extrabold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}</h2>
                        <p className={`text-sm ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'هذا هو كودك الخاص. احتفظ به!' : 'This is your unique code. Keep it safe!'}</p>
                        <div className="mx-auto my-6 py-5 px-8 rounded-2xl bg-gradient-to-br from-accent to-accent2 inline-block">
                            <div className="text-[11px] text-white/70 mb-1.5 font-semibold uppercase tracking-wider">{isArabic ? 'كود الطفل' : 'CHILD CODE'}</div>
                            <div className="text-4xl font-black text-white tracking-[4px] font-mono">{createdId}</div>
                        </div>
                        <div className={`rounded-xl p-3.5 my-4 border text-start ${isDark ? 'bg-[#1C2333] border-[#2D333B]' : 'bg-amber-50 border-amber-200'} flex items-center gap-2`}>
                            <img src="/icons/quiz_wrong.png" className="w-5 h-5 object-contain" />
                            <p className={`text-[13px] font-semibold m-0 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>
                                {isArabic ? 'مهم: شاركه مع ولي أمرك!' : 'Important: Share this code with your parent!'}
                            </p>
                        </div>
                        <Button fullWidth variant="bordered" radius="lg" className={`mb-2.5 ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}
                            onPress={() => navigator.clipboard?.writeText(createdId)}
                            startContent={<div className="w-5 h-5 overflow-hidden"><img src="/icons/daily_rhythm.png" className="w-full h-full object-contain" /></div>}>
                            {isArabic ? 'نسخ الكود' : 'Copy Code'}</Button>
                        <Button fullWidth radius="lg" className="bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold shadow-[0_4px_16px_rgba(108,99,255,0.25)]"
                            onPress={() => navigate('/child-login')}
                            startContent={<div className="w-6 h-6 overflow-hidden"><img src="/icons/quiz_excellent.png" className="w-full h-full object-contain" /></div>}>
                            {isArabic ? 'سجل دخولك الآن' : 'Log In Now'}</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const strength = passwordStrength();
    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding */}
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent2 to-pink-500 to-accent p-10 relative overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-20 h-20 opacity-15 overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite' }}><img src="/icons/rewards.png" className="w-full h-full object-cover" /></div>
                <div className="absolute bottom-[20%] right-[15%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 7s ease-in-out infinite 1s' }}><img src="/icons/games.png" className="w-full h-full object-cover" /></div>
                <div className="w-32 h-32 mb-5 z-[1] overflow-hidden rounded-3xl shadow-2xl"><img src="/icons/rewards.png" className="w-full h-full object-cover" /></div>
                <h2 className="text-white text-3xl font-extrabold text-center z-[1] mb-2.5">{isArabic ? 'إنشاء حساب جديد' : 'Create Account'}</h2>
                <p className="text-white/80 text-[15px] text-center max-w-[280px] z-[1] leading-relaxed">{isArabic ? 'سجل عشان تبدأ رحلة التعلم الممتعة!' : 'Sign up to start your fun learning journey!'}</p>
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer mt-10 z-[1] text-white/70 text-sm">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-white">LearnNeur</span>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 overflow-y-auto">
                <div className="max-w-[440px] w-full">
                    <Button variant="light" size="sm" className={`mb-6 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                        onPress={() => navigate('/choice')}>← {isArabic ? 'رجوع' : 'Back'}</Button>

                    <h1 className={`text-[26px] font-extrabold mb-1 ${isDark ? 'text-text-dark' : 'text-text'} flex items-center gap-3`}>
                        <div className="w-10 h-10 overflow-hidden rounded-xl"><img src="/icons/rewards.png" className="w-full h-full object-cover" /></div> {isArabic ? 'تسجيل طفل جديد' : 'New Child Account'}
                    </h1>
                    <p className={`text-[13px] mb-6 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'سجل عشان تبدأ رحلة التعلم' : 'Sign up to start your learning journey'}</p>

                    {/* Avatars */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                        {getAuthData(isArabic).childAvatars.map(em => (
                            <Button key={em} isIconOnly size="sm" variant={avatar === em ? 'solid' : 'bordered'}
                                className={`w-11 h-11 text-[22px] ${avatar === em ? 'bg-accent/[0.15] border-accent border-2' : `${isDark ? 'border-border-dark' : 'border-border'}`}`}
                                onPress={() => setAvatar(em)}>{em}</Button>
                        ))}
                    </div>

                    <Input label={isArabic ? 'الاسم' : 'Name'} variant="bordered" radius="lg"
                        value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder={isArabic ? 'اسم الطفل' : "Child's name"} className="mb-4"
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }} />

                    <div className="flex gap-3 mb-4">
                        <Input label={isArabic ? 'العمر' : 'Age'} type="number" variant="bordered" radius="lg"
                            value={form.age} onChange={e => set('age', e.target.value)} min="2" max="18"
                            placeholder={isArabic ? 'العمر' : 'Age'} className="flex-1"
                            classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }} />
                        <div className="flex-1">
                            <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'الجنس' : 'Gender'}</label>
                            <div className="flex gap-1.5">
                                {[{ val: 'Male', em: '👦' }, { val: 'Female', em: '👧' }].map(g => (
                                    <Button key={g.val} variant={form.gender === g.val ? 'solid' : 'bordered'} radius="lg"
                                        className={`flex-1 text-lg font-bold ${form.gender === g.val ? 'bg-accent text-white border-accent' : `${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}`}
                                        onPress={() => set('gender', g.val)}>{g.em}</Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Input label={isArabic ? 'البريد الإلكتروني' : 'Email'} type="email" variant="bordered" radius="lg"
                        value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="your@email.com" className="mb-4"
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }} />

                    <Input label={isArabic ? 'كلمة المرور' : 'Password'} type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg"
                        value={form.password} onChange={e => set('password', e.target.value)}
                        placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }}
                        endContent={<button onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} />
                    {form.password && (
                        <div className="mt-1.5">
                            <div className="flex gap-[3px] mb-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex-1 h-[3px] rounded-sm transition-colors duration-300"
                                        style={{ background: strength.level >= i ? strength.color : (isDark ? '#21262D' : '#E5E7EB') }} />
                                ))}
                            </div>
                            <span className="text-[11px] font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                        </div>
                    )}

                    <Input label={isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg"
                        value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                        placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter password'} className="mt-4"
                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}` }}
                        endContent={form.confirmPassword && <span className="text-base">{form.password === form.confirmPassword ? '✅' : '❌'}</span>} />

                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 my-3 border ${isDark ? 'bg-[rgba(255,101,132,0.1)]' : 'bg-red-50'} border-red-500/20 flex items-center gap-2`}>
                            <img src="/icons/quiz_wrong.png" className="w-5 h-5 object-contain" />
                            <span className="text-red-500 text-[13px] font-semibold">{error}</span>
                        </div>
                    )}

                    <Button fullWidth radius="lg" className="bg-gradient-to-br from-accent2 to-pink-500 text-white font-bold text-base mt-5 shadow-[0_4px_16px_rgba(255,101,132,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,101,132,0.45)]"
                        onPress={handleRegister}
                        startContent={<div className="w-6 h-6 overflow-hidden rounded-md"><img src="/icons/games.png" className="w-full h-full object-contain" /></div>}>
                        {isArabic ? 'سجل وابدأ!' : 'Register & Start!'}</Button>

                    <div className="flex items-center gap-3 my-5">
                        <Divider className="flex-1" />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <Divider className="flex-1" />
                    </div>

                    <GoogleAuthButton 
                        role="child" 
                        mode="signup" 
                        onSuccess={(result) => { setCreatedId(result.childId); setStep(2); }} 
                        text={isArabic ? 'التسجيل بجوجل' : 'Sign up with Google'}
                    />

                    <div className="text-center mt-5">
                        <span className={`text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'عندك حساب؟ ' : 'Already have an account? '}</span>
                        <Button variant="light" size="sm" className="text-accent font-bold text-[13px] p-0 min-w-0 h-auto"
                            onPress={() => navigate('/child-login')}>{isArabic ? 'سجل دخول' : 'Log In'}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
