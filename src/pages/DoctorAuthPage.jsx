import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Chip, Divider } from '@heroui/react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { getDoctorData } from '../data/doctorData';

export default function DoctorAuthPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { loginDoctor, registerDoctor } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({ name: '', age: '', email: '', gender: 'Male', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

    const getPasswordStrength = () => {
        const p = formData.password; if (!p) return 0; let s = 0;
        if (p.length >= 6) s++; if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };
    
    const { features, strengthColors } = getDoctorData(isArabic);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        if (isLogin) {
            const res = loginDoctor(formData.email, formData.password);
            if (res.success) navigate('/doctor-dashboard');
            else setError(isArabic ? (res.error === 'not_found' ? 'البريد الإلكتروني غير موجود' : 'كلمة المرور غير صحيحة') : (res.error === 'not_found' ? 'Email not found' : 'Incorrect password'));
        } else {
            if (formData.password !== formData.confirmPassword) { setError(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'); setLoading(false); return; }
            if (!formData.name || !formData.email || !formData.password || !formData.phone) { setError(isArabic ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields'); setLoading(false); return; }
            const res = registerDoctor(formData);
            if (res.success) { setIsSuccess(true); setIsLogin(true); setFormData({ ...formData, password: '', confirmPassword: '' }); }
            else setError(isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists');
        }
        setLoading(false);
    };

    const inputWrapperCls = `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`;

    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* LEFT */}
            <div className="flex-[0_0_420px] hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-accent to-[#4834D4] p-12 relative overflow-hidden">
                <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-white/[0.04]" />
                <div className="absolute top-[15%] left-[12%] w-16 h-16 opacity-20" style={{ animation: 'float 6s ease-in-out infinite' }}>
                    <img src="/icons/doctor_consultation.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="absolute bottom-[20%] right-[15%] w-14 h-14 opacity-15" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>
                    <img src="/icons/pecs_body_hurt.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-[60%] left-[8%] w-12 h-12 opacity-15" style={{ animation: 'float 8s ease-in-out infinite 2s' }}>
                    <img src="/icons/pecs_place_hospital.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="relative z-[1] text-center">
                    <div className="w-24 h-24 mx-auto mb-6">
                        <img src="/icons/doctor_consultation.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="text-white text-[28px] font-extrabold mb-2.5">{isArabic ? 'بوابة الطبيب' : 'Doctor Portal'}</h2>
                    <p className="text-white/80 text-[15px] leading-relaxed mb-8">{isArabic ? 'منصة متكاملة لإدارة ومتابعة حالات الأطفال' : "A comprehensive platform for managing and tracking children's cases"}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-[14px] py-3.5 px-3 text-center border border-white/15"
                                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}>
                                <div className="w-10 h-10 mx-auto mb-2 overflow-hidden rounded-lg flex items-center justify-center bg-white/10 border border-white/10">
                                    <img src={f.icon} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-white/90 text-xs font-semibold">{f.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 overflow-y-auto">
                <div className="w-full max-w-[440px]">
                    <Button variant="light" size="sm" className={`mb-6 font-medium hover:text-accent ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                        onPress={() => navigate('/choice')}>← {isArabic ? 'العودة' : 'Back'}</Button>

                    <h1 className={`mb-1.5 text-[28px] font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isLogin ? (isArabic ? 'تسجيل الدخول' : 'Welcome Back') : (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
                    </h1>
                    <p className={`mb-7 text-sm leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isLogin ? (isArabic ? 'أدخل بياناتك للوصول إلى بوابة الطبيب' : 'Enter your credentials to access the Doctor Portal') : (isArabic ? 'انضم إلينا لمساعدة الأطفال المميزين' : 'Join us to help special children grow')}
                    </p>

                    {isSuccess && (
                        <div className={`py-6 px-6 rounded-[22px] mb-6 text-center border-2 border-emerald-500/20 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}
                            style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                            <div className="text-[54px] mb-3">🎉</div>
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                {isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account Created!'}
                            </h3>
                            <p className={`text-[13px] mb-5 leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                                {isArabic ? 'لقد سجلت بنجاح كطبيب في منصة LearnNeur. يرجى تسجيل الدخول للبدء.' : 'You have successfully registered as a doctor. Please log in to continue.'}
                            </p>
                            <Button fullWidth radius="lg" className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold py-3.5 shadow-lg"
                                onPress={() => setIsSuccess(false)}>
                                {isArabic ? 'سجل دخولك الآن' : 'Log In Now'}
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className={`py-3 px-4 rounded-xl mb-4 text-[13px] text-red-500 flex items-center gap-2 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
                            style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {!isSuccess && (
                        <>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                                {!isLogin && (<>
                                    <div className="flex gap-2.5">
                                        <Input label={`${isArabic ? 'الاسم الكامل' : 'Full Name'} *`} name="name" variant="bordered" radius="lg"
                                            value={formData.name} onChange={handleChange}
                                            placeholder={isArabic ? 'د. أحمد محمد' : 'Dr. John Doe'} className="flex-1" isRequired
                                            classNames={{ inputWrapper: inputWrapperCls }} />
                                        <Input label={isArabic ? 'العمر' : 'Age'} name="age" type="number" variant="bordered" radius="lg"
                                            value={formData.age} onChange={handleChange} className="w-[90px]"
                                            classNames={{ inputWrapper: inputWrapperCls }} />
                                    </div>
                                    <div>
                                        <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'الجنس' : 'Gender'}</label>
                                        <div className="flex gap-2.5">
                                            {[{ val: 'Male', label: isArabic ? 'ذكر' : 'Male', emoji: '👨‍⚕️' }, { val: 'Female', label: isArabic ? 'أنثى' : 'Female', emoji: '👩‍⚕️' }].map(g => (
                                                <Button key={g.val} type="button" variant={formData.gender === g.val ? 'solid' : 'bordered'} radius="lg"
                                                    className={`flex-1 font-semibold text-[13px] ${formData.gender === g.val ? 'bg-accent/[0.06] border-accent text-accent border-[1.5px]' : `${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`}`}
                                                    onPress={() => setFormData({ ...formData, gender: g.val })}><span>{g.emoji}</span> {g.label}</Button>
                                            ))}
                                        </div>
                                    </div>
                                    <Input label={`${isArabic ? 'رقم الهاتف' : 'Phone Number'} *`} name="phone" type="tel" variant="bordered" radius="lg"
                                        value={formData.phone} onChange={handleChange} placeholder="01x xxxx xxxx" isRequired
                                        classNames={{ inputWrapper: inputWrapperCls }} />
                                </>)}

                                <Input label={`${isArabic ? 'البريد الإلكتروني' : 'Email Address'} *`} name="email" type="email" variant="bordered" radius="lg"
                                    value={formData.email} onChange={handleChange} placeholder="doctor@clinic.com" isRequired
                                    classNames={{ inputWrapper: inputWrapperCls }} />

                                <Input label={`${isArabic ? 'كلمة المرور' : 'Password'} *`} name="password" type={showPassword ? 'text' : 'password'} variant="bordered" radius="lg"
                                    value={formData.password} onChange={handleChange} placeholder="••••••••" isRequired
                                    classNames={{ inputWrapper: inputWrapperCls }}
                                    endContent={<button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none cursor-pointer text-lg">{showPassword ? '🙈' : '👁️'}</button>} />
                                {!isLogin && formData.password && (
                                    <div className="flex gap-1 mt-[-8px]">{[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex-1 h-1 rounded-sm transition-all duration-300"
                                            style={{ background: i < getPasswordStrength() ? strengthColors[getPasswordStrength() - 1] : (isDark ? '#21262D' : '#E5E7EB') }} />
                                    ))}</div>
                                )}

                                {!isLogin && (
                                    <Input label={`${isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} *`} name="confirmPassword" type={showConfirm ? 'text' : 'password'} variant="bordered" radius="lg"
                                        value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" isRequired
                                        classNames={{ inputWrapper: inputWrapperCls }}
                                        endContent={<button type="button" onClick={() => setShowConfirm(!showConfirm)} className="bg-transparent border-none cursor-pointer text-lg">{showConfirm ? '🙈' : '👁️'}</button>}
                                        isInvalid={formData.confirmPassword && formData.confirmPassword !== formData.password}
                                        errorMessage={formData.confirmPassword && formData.confirmPassword !== formData.password ? (isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match') : ''} />
                                )}

                                <Button type="submit" fullWidth radius="lg" isLoading={loading}
                                    className="bg-gradient-to-br from-accent to-[#4834D4] text-white font-bold text-base mt-2 shadow-[0_4px_16px_rgba(108,99,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(108,99,255,0.35)]">
                                    {loading ? (isArabic ? '⏳ جاري التحميل...' : '⏳ Loading...') : isLogin ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء الحساب' : 'Create Account')}
                                </Button>
                            </form>

                            <div className="flex items-center gap-3 my-5">
                                <Divider className="flex-1" />
                                <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                                <Divider className="flex-1" />
                            </div>

                            <GoogleAuthButton 
                                role="doctor" 
                                mode={isLogin ? 'login' : 'signup'} 
                                onSuccess={(res) => { if(isLogin) navigate('/doctor-dashboard'); else { setIsSuccess(true); setIsLogin(true); setFormData({ ...formData, password: '', confirmPassword: '' }); } }} 
                                text={isLogin ? (isArabic ? 'الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'التسجيل بجوجل' : 'Sign up with Google')}
                            />

                            <div className="text-center mt-6">
                                <p className={`text-[13px] m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                                    {isLogin ? (isArabic ? 'ليس لديك حساب؟' : "Don't have an account?") : (isArabic ? 'لديك حساب بالفعل؟' : "Already have an account?")}
                                    <Button variant="light" size="sm" className="text-accent font-bold text-[13px] ms-1.5 p-0 min-w-0 h-auto"
                                        onPress={() => { setIsLogin(!isLogin); setError(''); setFormData({ ...formData, confirmPassword: '' }); }}>
                                        {isLogin ? (isArabic ? 'سجل الآن' : 'Sign Up') : (isArabic ? 'سجل الدخول' : 'Sign In')}
                                    </Button>
                                </p>
                            </div>
                        </>
                    )}

                    <Chip variant="bordered" className={`mt-5 w-full justify-start ${isDark ? 'bg-accent/[0.06] border-accent/[0.12]' : 'bg-accent/[0.04] border-accent/[0.08]'}`}
                        startContent={<span className="text-lg">💡</span>}>
                        <span className={`text-xs leading-normal ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isArabic ? 'يمكنك البحث عن المرضى باستخدام كود الطفل أو رقم هاتف ولي الأمر' : 'Search for patients using Child Code or Parent Phone number'}
                        </span>
                    </Chip>
                </div>
            </div>
        </div>
    );
}
