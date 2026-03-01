import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

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

    const accent = '#6C63FF';
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };
    const inputCls = `w-full py-3.5 px-4 rounded-xl text-sm border-[1.5px] outline-none font-[Inter,'Segoe_UI',sans-serif] transition-all duration-300 box-border focus:border-accent ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;
    const labelCls = `text-xs font-semibold mb-1.5 block ${isDark ? 'text-subtext-dark' : 'text-subtext'}`;

    const getPasswordStrength = () => {
        const p = formData.password; if (!p) return 0; let s = 0;
        if (p.length >= 6) s++; if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };
    const strengthColors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];

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
            if (res.success) navigate('/doctor-dashboard');
            else setError(isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists');
        }
        setLoading(false);
    };

    const features = [
        { emoji: '👥', text: isArabic ? 'إدارة المرضى' : 'Patient Management' },
        { emoji: '📋', text: isArabic ? 'تقييمات شاملة' : 'Comprehensive Assessments' },
        { emoji: '📊', text: isArabic ? 'تتبع السلوك' : 'Behavior Tracking' },
        { emoji: '📈', text: isArabic ? 'تقارير مفصلة' : 'Detailed Reports' },
    ];

    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* LEFT */}
            <div className="flex-[0_0_420px] hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-accent to-[#4834D4] p-12 relative overflow-hidden">
                <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-white/[0.04]" />
                <div className="absolute top-[15%] left-[12%] text-[44px] opacity-15" style={{ animation: 'float 6s ease-in-out infinite' }}>🩺</div>
                <div className="absolute bottom-[20%] right-[15%] text-4xl opacity-[0.12]" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>💊</div>
                <div className="absolute top-[60%] left-[8%] text-[30px] opacity-10" style={{ animation: 'float 8s ease-in-out infinite 2s' }}>🏥</div>

                <div className="relative z-[1] text-center">
                    <div className="text-[72px] mb-5">🩺</div>
                    <h2 className="text-white text-[28px] font-extrabold mb-2.5">{isArabic ? 'بوابة الطبيب' : 'Doctor Portal'}</h2>
                    <p className="text-white/80 text-[15px] leading-relaxed mb-8">{isArabic ? 'منصة متكاملة لإدارة ومتابعة حالات الأطفال' : "A comprehensive platform for managing and tracking children's cases"}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-[14px] py-3.5 px-3 text-center border border-white/15"
                                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}>
                                <div className="text-2xl mb-1">{f.emoji}</div>
                                <div className="text-white/90 text-xs font-semibold">{f.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 overflow-y-auto">
                <div className="w-full max-w-[440px]">
                    <button onClick={() => navigate('/choice')}
                        className={`flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[13px] mb-6 p-0 font-[inherit] transition-colors duration-200 hover:text-accent ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        <span className="text-base">←</span> {isArabic ? 'العودة' : 'Back'}
                    </button>

                    <h1 className={`mb-1.5 text-[28px] font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isLogin ? (isArabic ? 'تسجيل الدخول' : 'Welcome Back') : (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
                    </h1>
                    <p className={`mb-7 text-sm leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isLogin ? (isArabic ? 'أدخل بياناتك للوصول إلى بوابة الطبيب' : 'Enter your credentials to access the Doctor Portal') : (isArabic ? 'انضم إلينا لمساعدة الأطفال المميزين' : 'Join us to help special children grow')}
                    </p>

                    {error && (
                        <div className={`py-3 px-4 rounded-xl mb-4 text-[13px] text-red-500 flex items-center gap-2 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
                            style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                        {!isLogin && (<>
                            <div className="flex gap-2.5">
                                <div className="flex-1">
                                    <label className={labelCls}>{isArabic ? 'الاسم الكامل' : 'Full Name'} *</label>
                                    <input name="name" value={formData.name} onChange={handleChange} placeholder={isArabic ? 'د. أحمد محمد' : 'Dr. John Doe'} className={inputCls} required />
                                </div>
                                <div className="w-[90px]">
                                    <label className={labelCls}>{isArabic ? 'العمر' : 'Age'}</label>
                                    <input name="age" type="number" value={formData.age} onChange={handleChange} className={inputCls} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>{isArabic ? 'الجنس' : 'Gender'}</label>
                                <div className="flex gap-2.5">
                                    {[{ val: 'Male', label: isArabic ? 'ذكر' : 'Male', emoji: '👨‍⚕️' }, { val: 'Female', label: isArabic ? 'أنثى' : 'Female', emoji: '👩‍⚕️' }].map(g => (
                                        <button type="button" key={g.val} onClick={() => setFormData({ ...formData, gender: g.val })}
                                            className={`flex-1 py-3 rounded-xl cursor-pointer font-semibold text-[13px] font-[inherit] flex items-center justify-center gap-1.5 border-[1.5px] transition-all duration-200 ${formData.gender === g.val ? 'bg-accent/[0.06] border-accent text-accent' : `${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`
                                                }`}><span>{g.emoji}</span> {g.label}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>{isArabic ? 'رقم الهاتف' : 'Phone Number'} *</label>
                                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="01x xxxx xxxx" className={inputCls} required />
                            </div>
                        </>)}

                        <div>
                            <label className={labelCls}>{isArabic ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="doctor@clinic.com" className={inputCls} required />
                        </div>

                        <div>
                            <label className={labelCls}>{isArabic ? 'كلمة المرور' : 'Password'} *</label>
                            <div className="relative">
                                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="••••••••" className={`${inputCls} !pe-11`} required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base end-3 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{showPassword ? '🙈' : '👁️'}</button>
                            </div>
                            {!isLogin && formData.password && (
                                <div className="flex gap-1 mt-2">{[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex-1 h-1 rounded-sm transition-all duration-300"
                                        style={{ background: i < getPasswordStrength() ? strengthColors[getPasswordStrength() - 1] : (isDark ? '#21262D' : '#E5E7EB') }} />
                                ))}</div>
                            )}
                        </div>

                        {!isLogin && (
                            <div>
                                <label className={labelCls}>{isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} *</label>
                                <div className="relative">
                                    <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                                        className={`${inputCls} !pe-11`} required
                                        style={{ borderColor: formData.confirmPassword && formData.confirmPassword !== formData.password ? '#EF4444' : undefined }} />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className={`absolute top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base end-3 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{showConfirm ? '🙈' : '👁️'}</button>
                                </div>
                                {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                    <p className="text-[11px] text-red-500 mt-1">{isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'}</p>
                                )}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className={`w-full py-4 rounded-xl border-none cursor-pointer bg-gradient-to-br from-accent to-[#4834D4] text-white font-bold text-base mt-2 shadow-[0_4px_16px_rgba(108,99,255,0.25)] transition-all duration-300 font-[Inter,'Segoe_UI',sans-serif] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(108,99,255,0.35)] ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                            {loading ? (isArabic ? '⏳ جاري التحميل...' : '⏳ Loading...') : isLogin ? (isArabic ? '🩺 تسجيل الدخول' : '🩺 Sign In') : (isArabic ? '🩺 إنشاء الحساب' : '🩺 Create Account')}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className={`text-[13px] m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isLogin ? (isArabic ? 'ليس لديك حساب؟' : "Don't have an account?") : (isArabic ? 'لديك حساب بالفعل؟' : "Already have an account?")}
                            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ ...formData, confirmPassword: '' }); }}
                                className="bg-transparent border-none text-accent font-bold cursor-pointer ms-1.5 text-[13px] font-[inherit] hover:opacity-80 transition-opacity duration-200">
                                {isLogin ? (isArabic ? 'سجل الآن' : 'Sign Up') : (isArabic ? 'سجل الدخول' : 'Sign In')}
                            </button>
                        </p>
                    </div>

                    <div className={`mt-5 py-3 px-4 rounded-xl flex items-center gap-2.5 border ${isDark ? 'bg-accent/[0.06] border-accent/[0.12]' : 'bg-accent/[0.04] border-accent/[0.08]'}`}>
                        <span className="text-lg">💡</span>
                        <span className={`text-xs leading-normal ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isArabic ? 'يمكنك البحث عن المرضى باستخدام كود الطفل أو رقم هاتف ولي الأمر' : 'Search for patients using Child Code or Parent Phone number'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
