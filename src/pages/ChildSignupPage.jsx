import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

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

    const accent = '#6C63FF';
    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));
    const inputCls = `w-full py-3.5 px-4 rounded-xl text-[15px] border outline-none transition-[border] duration-300 font-[inherit] box-border ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;

    const passwordStrength = () => {
        const p = form.password;
        if (!p) return { level: 0, label: '', color: '#999' };
        let score = 0;
        if (p.length >= 6) score++; if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++; if (/[0-9]/.test(p)) score++; if (/[^A-Za-z0-9]/.test(p)) score++;
        const levels = [
            { label: isArabic ? 'ضعيفة جداً' : 'Very Weak', color: '#EF4444' },
            { label: isArabic ? 'ضعيفة' : 'Weak', color: '#EF4444' },
            { label: isArabic ? 'متوسطة' : 'Fair', color: '#F59E0B' },
            { label: isArabic ? 'جيدة' : 'Good', color: '#10B981' },
            { label: isArabic ? 'قوية' : 'Strong', color: '#059669' },
        ];
        return { level: score, ...levels[Math.min(score, 4)] };
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

    // SUCCESS SCREEN
    if (step === 2) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <div className={`rounded-3xl p-12 text-center max-w-[460px] w-full border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}`}
                    style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                    <div className="text-[72px] mb-4">🎉</div>
                    <h2 className={`text-[26px] font-extrabold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}</h2>
                    <p className={`text-sm ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'هذا هو كودك الخاص. احتفظ به!' : 'This is your unique code. Keep it safe!'}</p>

                    <div className="mx-auto my-6 py-5 px-8 rounded-2xl bg-gradient-to-br from-accent to-accent2 inline-block">
                        <div className="text-[11px] text-white/70 mb-1.5 font-semibold uppercase tracking-wider">{isArabic ? 'كود الطفل' : 'CHILD CODE'}</div>
                        <div className="text-4xl font-black text-white tracking-[4px] font-mono">{createdId}</div>
                    </div>

                    <div className={`rounded-xl p-3.5 my-4 border text-start ${isDark ? 'bg-[#1C2333] border-[#2D333B]' : 'bg-amber-50 border-amber-200'}`}>
                        <p className={`text-[13px] font-semibold m-0 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>
                            ⚠️ {isArabic ? 'مهم: شاركه مع ولي أمرك!' : 'Important: Share this code with your parent!'}
                        </p>
                    </div>

                    <button onClick={() => navigator.clipboard?.writeText(createdId)}
                        className={`w-full py-3.5 rounded-xl bg-transparent cursor-pointer font-semibold text-sm mb-2.5 border transition-all duration-200 ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>
                        📋 {isArabic ? 'نسخ الكود' : 'Copy Code'}
                    </button>
                    <button onClick={() => navigate('/child-home')}
                        className="w-full py-4 rounded-xl bg-gradient-to-br from-accent to-[#8B5CF6] text-white border-none cursor-pointer font-bold text-base shadow-[0_4px_16px_rgba(108,99,255,0.25)]">
                        🚀 {isArabic ? 'ابدأ التعلم!' : 'Start Learning!'}
                    </button>
                </div>
            </div>
        );
    }

    const strength = passwordStrength();
    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding */}
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent2 to-pink-500 to-accent p-10 relative overflow-hidden">
                <div className="absolute top-[10%] left-[10%] text-5xl opacity-15" style={{ animation: 'float 6s ease-in-out infinite' }}>✨</div>
                <div className="absolute bottom-[20%] right-[15%] text-[40px] opacity-[0.12]" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>🎮</div>
                <div className="text-[80px] mb-5 z-[1]">✨</div>
                <h2 className="text-white text-3xl font-extrabold text-center z-[1] mb-2.5">{isArabic ? 'إنشاء حساب جديد' : 'Create Account'}</h2>
                <p className="text-white/80 text-[15px] text-center max-w-[280px] z-[1] leading-relaxed">{isArabic ? 'سجل عشان تبدأ رحلة التعلم الممتعة!' : 'Sign up to start your fun learning journey!'}</p>
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer mt-10 z-[1] text-white/70 text-sm">
                    <span>🧩</span><span className="font-bold text-white">LearnNeur</span>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 overflow-y-auto">
                <div className="max-w-[440px] w-full">
                    <button onClick={() => navigate('/choice')}
                        className={`bg-transparent border-none cursor-pointer text-sm font-medium mb-6 flex items-center gap-1.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        ← {isArabic ? 'رجوع' : 'Back'}
                    </button>

                    <h1 className={`text-[26px] font-extrabold mb-1 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? '✨ تسجيل طفل جديد' : '✨ New Child Account'}</h1>
                    <p className={`text-[13px] mb-6 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'سجل عشان تبدأ رحلة التعلم' : 'Sign up to start your learning journey'}</p>

                    {/* Avatars */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                        {['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰'].map(em => (
                            <button key={em} onClick={() => setAvatar(em)}
                                className={`w-11 h-11 rounded-xl cursor-pointer text-[22px] flex items-center justify-center transition-all duration-200 border-2 ${avatar === em ? 'border-accent bg-accent/[0.08]' : `bg-transparent ${isDark ? 'border-border-dark' : 'border-border'}`
                                    }`}>{em}</button>
                        ))}
                    </div>

                    <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'الاسم' : 'Name'}</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={isArabic ? 'اسم الطفل' : "Child's name"} className={inputCls} />

                    <div className="flex gap-3 my-4">
                        <div className="flex-1">
                            <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'العمر' : 'Age'}</label>
                            <input type="number" value={form.age} onChange={e => set('age', e.target.value)} min="2" max="18" placeholder={isArabic ? 'العمر' : 'Age'} className={inputCls} />
                        </div>
                        <div className="flex-1">
                            <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'الجنس' : 'Gender'}</label>
                            <div className="flex gap-1.5">
                                {[{ val: 'Male', em: '👦' }, { val: 'Female', em: '👧' }].map(g => (
                                    <button key={g.val} onClick={() => set('gender', g.val)}
                                        className={`flex-1 py-3 px-2 rounded-xl cursor-pointer text-lg font-bold border transition-all duration-200 ${form.gender === g.val ? 'bg-accent text-white border-accent' : `bg-transparent ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`
                                            }`}>{g.em}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" className={inputCls} />
                    <div className="mb-4" />

                    <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'كلمة المرور' : 'Password'}</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'} className={inputCls} />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-lg end-3">
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
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
                    <div className="mb-4" />

                    <label className={`text-[13px] font-semibold mb-1 block ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter password'} className={inputCls} />
                        {form.confirmPassword && <span className="absolute top-1/2 -translate-y-1/2 text-base end-3">{form.password === form.confirmPassword ? '✅' : '❌'}</span>}
                    </div>

                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 my-3 border ${isDark ? 'bg-[rgba(255,101,132,0.1)]' : 'bg-red-50'} border-red-500/20`}>
                            <span className="text-red-500 text-[13px] font-semibold">⚠️ {error}</span>
                        </div>
                    )}

                    <button onClick={handleRegister}
                        className="w-full py-4 rounded-xl border-none cursor-pointer bg-gradient-to-br from-accent2 to-pink-500 text-white font-bold text-base mt-5 shadow-[0_4px_16px_rgba(255,101,132,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,101,132,0.45)]">
                        {isArabic ? '🎮 سجل وابدأ!' : '🎮 Register & Start!'}
                    </button>

                    <div className="text-center mt-5">
                        <span className={`text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'عندك حساب؟ ' : 'Already have an account? '}</span>
                        <button onClick={() => navigate('/child-login')} className="bg-transparent border-none text-accent cursor-pointer font-bold text-[13px]">{isArabic ? 'سجل دخول' : 'Log In'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
