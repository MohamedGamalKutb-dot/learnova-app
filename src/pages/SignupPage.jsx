import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, CardBody, Divider } from '@heroui/react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { getAuthData } from '../data/authData';

export default function SignupPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { registerParent, getChildById } = useAuth();

    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ childId: '', name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [linkedChild, setLinkedChild] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const accent = '#4ECDC4';
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

    const validateStep = () => {
        switch (step) {
            case 0:
                if (!form.childId.trim()) return isArabic ? 'أدخل كود الطفل' : 'Enter child code';
                const child = getChildById(form.childId.trim());
                if (!child) return isArabic ? 'هذا الكود غير موجود! تأكد من الكود أو اطلبه من الطفل' : 'This code does not exist! Verify the code or ask the child';
                setLinkedChild(child); return null;
            case 1: if (!form.name.trim()) return isArabic ? 'الاسم مطلوب' : 'Name is required'; return null;
            case 2: if (!form.email.trim() || !form.email.includes('@')) return isArabic ? 'إيميل غير صحيح' : 'Invalid email'; return null;
            case 3: if (form.password.length < 6) return isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'; return null;
            default: return null;
        }
    };

    const nextStep = () => { const err = validateStep(); if (err) { setError(err); return; } setError(''); if (step < 5) setStep(step + 1); };
    const prevStep = () => { setError(''); if (step > 0) setStep(step - 1); };

    const handleSubmit = () => {
        const result = registerParent({ ...form, childId: form.childId.trim() });
        if (result.success) setIsSuccess(true);
        else { if (result.error === 'email_exists') setError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already exists'); else if (result.error === 'child_not_found') setError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found'); }
    };

    const { parentStepLabels: stepLabels, parentStepIcons: stepIcons } = getAuthData(isArabic);
    const strength = passwordStrength();

    const inputWrapperCls = `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`;

    const renderStep = () => {
        if (isSuccess) {
            return (
                <div className="text-center py-10" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                    <div className="w-24 h-24 mb-4 mx-auto overflow-hidden"><img src="/icons/rewards.png" className="w-full h-full object-contain" /></div>
                    <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!'}
                    </h2>
                    <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? 'تم تسجيل حسابك بنجاح في LearnNeur. يرجى تسجيل الدخول للوصول إلى لوحة التحكم.' : 'Your account has been successfully registered. Please log in to access your dashboard.'}
                    </p>
                    <Button fullWidth radius="lg" className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-base py-4 shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
                        onPress={() => navigate('/login')}
                        startContent={<div className="w-6 h-6 overflow-hidden"><img src="/icons/quiz_excellent.png" className="w-full h-full object-contain" /></div>}>
                        {isArabic ? 'سجل دخولك الآن' : 'Log In Now'}
                    </Button>
                </div>
            );
        }

        const header = (emoji, title, sub) => (
            <div className="text-center mb-6">
                <div className="text-[56px] mb-2">{emoji}</div>
                <h2 className={`text-[22px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{title}</h2>
                {sub && <p className={`text-[13px] m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{sub}</p>}
            </div>
        );
        switch (step) {
            case 0: return (<div>
                {header('🔗', isArabic ? 'ربط حسابك بالطفل' : 'Link to Your Child', isArabic ? 'أدخل كود الطفل الذي تريد متابعته' : 'Enter the child code you want to monitor')}
                <Input label={`🆔 ${isArabic ? 'كود الطفل' : 'Child Code'}`} variant="bordered" radius="lg"
                    value={form.childId} onChange={e => set('childId', e.target.value.toUpperCase())}
                    placeholder="LN-XXXXXX" maxLength={9}
                    classNames={{ input: 'text-center text-[22px] font-bold tracking-[3px] font-mono', inputWrapper: inputWrapperCls }} />
                <div className={`text-center mt-1.5 text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'الكود موجود في حساب الطفل' : "The code is in the child's profile"}</div>
                {linkedChild && (
                    <div className={`mt-4 p-3.5 rounded-[14px] flex items-center gap-3 border ${isDark ? 'bg-emerald-500/[0.08] border-emerald-500/20' : 'bg-green-50 border-green-200'}`}>
                        <span className="text-[28px]">{linkedChild.avatar}</span>
                        <div className="flex-1">
                            <div className={`font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{linkedChild.name}</div>
                            <div className="text-xs text-emerald-500">{linkedChild.age} {isArabic ? 'سنوات' : 'years'} • {linkedChild.gender}</div>
                        </div>
                        <span className="text-emerald-500 text-xl">✓</span>
                    </div>
                )}
            </div>);
            case 1: return (<div>{header('👤', isArabic ? 'ما اسمك؟' : "What's your name?")}
                <Input label={isArabic ? 'الاسم الكامل' : 'Full Name'} variant="bordered" radius="lg" autoFocus
                    value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder={isArabic ? 'الاسم الكامل' : 'Full Name'}
                    classNames={{ inputWrapper: inputWrapperCls }} />
            </div>);
            case 2: return (<div>{header('📧', isArabic ? 'بريدك الإلكتروني' : 'Your Email')}
                <Input label="Email" type="email" variant="bordered" radius="lg" autoFocus
                    value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com"
                    classNames={{ inputWrapper: inputWrapperCls }} />
            </div>);
            case 3: return (<div>{header('🔒', isArabic ? 'كلمة المرور' : 'Create Password')}
                <Input label={isArabic ? 'كلمة المرور' : 'Password'} type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg" autoFocus
                    value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
                    classNames={{ inputWrapper: inputWrapperCls }}
                    endContent={<button onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} />
                {form.password && (<div className="mt-2.5">
                    <div className="flex gap-1 mb-1">{[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-sm transition-colors duration-300" style={{ background: strength.level >= i ? strength.color : (isDark ? '#21262D' : '#E5E7EB') }} />
                    ))}</div>
                    <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                </div>)}
            </div>);
            case 4: return (<div>{header('📱', isArabic ? 'رقم الهاتف' : 'Phone Number', isArabic ? '(اختياري)' : '(Optional)')}
                <Input label={isArabic ? 'رقم الهاتف' : 'Phone'} type="tel" variant="bordered" radius="lg" autoFocus
                    value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="01xxxxxxxxx"
                    classNames={{ inputWrapper: inputWrapperCls }} />
            </div>);
            case 5: return (<div>{header('✅', isArabic ? 'مراجعة البيانات' : 'Review Details')}
                <Card className={`${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} border`}>
                    <CardBody className="p-4">
                        {[
                            { label: isArabic ? 'كود الطفل' : 'Child Code', value: form.childId, emoji: '🆔' },
                            { label: isArabic ? 'الطفل المرتبط' : 'Linked Child', value: linkedChild?.name || '—', emoji: linkedChild?.avatar || '👶' },
                            { label: isArabic ? 'اسمك' : 'Your Name', value: form.name, emoji: '👤' },
                            { label: isArabic ? 'البريد' : 'Email', value: form.email, emoji: '📧' },
                            { label: isArabic ? 'الهاتف' : 'Phone', value: form.phone || (isArabic ? 'لم يُحدد' : 'Not set'), emoji: '📱' },
                        ].map(item => (
                            <div key={item.label} className={`flex items-center gap-3 py-3 border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-lg shrink-0 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>{item.emoji}</div>
                                <div className="flex-1">
                                    <div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{item.label}</div>
                                    <div className={`text-sm font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>);
        }
    };

    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding */}
            <div className="flex-[0_0_45%] hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent3 to-[#44B09E] to-[#3A9D8F] p-10 relative overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-20 h-20 opacity-15 overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite' }}><img src="/icons/parent_icon.png" className="w-full h-full object-cover" /></div>
                <div className="absolute bottom-[15%] right-[10%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 7s ease-in-out infinite 1s' }}><img src="/icons/quiz_stats.png" className="w-full h-full object-cover" /></div>
                <div className="absolute top-[60%] left-[5%] w-16 h-16 opacity-10 overflow-hidden" style={{ animation: 'float 8s ease-in-out infinite 2s' }}><img src="/icons/emotion_emo_love.png" className="w-full h-full object-cover" /></div>
                <div className="w-32 h-32 mb-5 z-[1] overflow-hidden rounded-3xl shadow-2xl"><img src="/icons/parent_icon.png" className="w-full h-full object-cover" /></div>
                <h2 className="text-white text-3xl font-extrabold text-center z-[1] mb-2.5">{isArabic ? 'إنشاء حساب ولي الأمر' : 'Create Parent Account'}</h2>
                <p className="text-white/85 text-[15px] text-center z-[1] max-w-[320px] leading-relaxed">{isArabic ? 'اربط حسابك بطفلك وابدأ متابعة تقدمه اليومي' : 'Link your account to your child and start tracking daily progress'}</p>
                <div className="mt-10 z-[1] flex flex-col gap-2">
                    {stepLabels.map((label, i) => (
                        <div key={i} className="flex items-center gap-2.5 transition-opacity duration-300" style={{ opacity: i <= step ? 1 : 0.4 }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden border border-white/20 backdrop-blur-sm"
                                style={{ background: i < step ? 'rgba(255,255,255,0.3)' : i === step ? '#fff' : 'rgba(255,255,255,0.1)' }}>
                                {i < step ? <span className="text-emerald-600 font-bold">✓</span> : <img src={stepIcons[i]} className="w-4 h-4 object-contain" />}
                            </div>
                            <span className={`text-white text-[13px] ${i === step ? 'font-bold' : ''}`}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6">
                <div className="w-full max-w-[440px]" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                    <div className="flex gap-1 mb-5">
                        {stepLabels.map((_, i) => (
                            <div key={i} className="flex-1 h-1 rounded-sm transition-colors duration-300"
                                style={{ background: i <= step ? accent : (isDark ? '#21262D' : '#E5E7EB') }} />
                        ))}
                    </div>
                    <div className="text-center mb-5"><span className="text-xs text-accent3 font-semibold">{step + 1}/{stepLabels.length} — {stepLabels[step]}</span></div>

                    {renderStep()}

                    {error && (
                        <div className={`rounded-[10px] py-2.5 px-3.5 mt-3.5 border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                            <span className="text-red-500 text-[13px] font-semibold">⚠️ {error}</span>
                        </div>
                    )}

                    {!isSuccess && (
                        <div className="flex gap-2.5 mt-6">
                            {step > 0 && (
                                <Button variant="bordered" radius="lg" className={`flex-1 font-semibold text-[15px] ${isDark ? 'border-border-dark text-text-dark' : 'border-border text-text'}`}
                                    onPress={prevStep}>← {isArabic ? 'رجوع' : 'Back'}</Button>
                            )}
                            {step < 5 ? (
                                <Button radius="lg" className="flex-1 bg-gradient-to-br from-accent3 to-[#44B09E] text-white font-bold text-[15px] shadow-[0_4px_12px_rgba(78,205,196,0.25)] hover:-translate-y-0.5"
                                    onPress={nextStep}>{isArabic ? 'التالي →' : 'Next →'}</Button>
                            ) : (
                                <Button radius="lg" className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-[15px] shadow-[0_4px_12px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                                    onPress={handleSubmit}>🎉 {isArabic ? 'إنشاء الحساب' : 'Create Account'}</Button>
                            )}
                        </div>
                    )}

                    {!isSuccess && (
                        <>
                            <div className="flex items-center gap-3 my-5">
                                <Divider className="flex-1" />
                                <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                                <Divider className="flex-1" />
                            </div>

                            <GoogleAuthButton 
                                role="parent" 
                                mode="signup" 
                                onSuccess={() => setIsSuccess(true)} 
                                text={isArabic ? 'التسجيل بجوجل' : 'Sign up with Google'}
                            />

                            <div className="text-center mt-5">
                                <span className={`text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'عندك حساب؟ ' : 'Already have an account? '}</span>
                                <Button variant="light" size="sm" className="text-accent3 font-bold text-[13px] p-0 min-w-0 h-auto"
                                    onPress={() => navigate('/login')}>{isArabic ? 'سجل دخول' : 'Log In'}</Button>
                            </div>

                            <Button fullWidth variant="bordered" radius="lg" size="sm" className={`mt-3 text-[13px] font-medium ${isDark ? 'border-border-dark text-subtext-dark' : 'border-border text-subtext'}`}
                                onPress={() => navigate('/choice')}>← {isArabic ? 'رجوع' : 'Back'}</Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
