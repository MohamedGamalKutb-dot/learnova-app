import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { Button, Input, Divider, Chip } from '@heroui/react';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../../../components/GoogleAuthButton/GoogleAuthButton';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheckCircle, FaChartBar, FaMapMarkerAlt, FaRobot, FaBookOpen } from 'react-icons/fa';
import SharedAuthForm from '../../../components/SharedAuthForm/SharedAuthForm';

export default function ParentLoginPage({ initialIsLogin = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, isArabic } = useApp();
    const { loginParent, registerParent } = useAuth();

    const [isLogin, setIsLogin] = useState(() => {
        if (location.pathname.includes('/parent-signup')) return false;
        if (location.pathname.includes('/parent-login')) return true;
        return initialIsLogin;
    });
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', confirmPassword: '', gender: 'Male' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('/parent-signup')) {
            setIsLogin(false);
        } else if (location.pathname.includes('/parent-login')) {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getPasswordStrength = () => {
        const p = formData.password; if (!p) return 0; let s = 0;
        if (p.length >= 6) s++; if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };

    const strengthColors = ['#E11D48', '#EA580C', '#D97706', '#059669', '#10B981'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (isLogin) {
            if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
                toast.error(isArabic ? 'أدخل بريداً إلكترونياً صحيحاً' : 'Enter a valid email');
                setLoading(false);
                return;
            }
            if (!formData.password) {
                toast.error(isArabic ? 'أدخل كلمة المرور' : 'Enter your password');
                setLoading(false);
                return;
            }

            const res = await loginParent(formData.email.trim(), formData.password);
            if (res.success) {
                toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                navigate('/parent-dashboard');
            } else {
                if (res.error === 'not_found') {
                    toast.error(isArabic ? 'البريد الإلكتروني غير مسجل' : 'Email not registered');
                } else {
                    toast.error(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
                }
            }
        } else {
            if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
                toast.error(isArabic ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
                setLoading(false);
                return;
            }
            if (!emailRegex.test(formData.email.trim())) {
                toast.error(isArabic ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format');
                setLoading(false);
                return;
            }
            if (formData.phone.trim()) {
                const phoneRegex = /^01[0-9]{9}$/;
                if (!phoneRegex.test(formData.phone.trim())) {
                    toast.error(isArabic ? 'رقم الهاتف يجب أن يتكون من 11 رقماً ويبدأ بـ 01' : 'Phone number must be exactly 11 digits starting with 01');
                    setLoading(false);
                    return;
                }
            }
            if (formData.password.length < 6) {
                toast.error(isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
                setLoading(false);
                return;
            }

            const res = await registerParent(formData);
            if (res.success) {
                toast.success(isArabic ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' : 'Account created successfully! You can now log in.');
                setIsLogin(true);
                setFormData({ name: '', email: formData.email, password: '', phone: '' });
                navigate('/parent-login');
            } else {
                toast.error(isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists');
            }
        }
        setLoading(false);
    };


    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Left: Branding Panel */}
            <div className="flex-[0_0_45%] hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent3 to-[#44B09E] relative overflow-hidden p-10">
                <div className="absolute top-[10%] left-[10%] w-20 h-20 opacity-15 overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite' }}><img src="/icons/quiz_stats.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <div className="absolute bottom-[15%] right-[10%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 7s ease-in-out infinite 1s' }}><img src="/icons/daily_rhythm.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <div className="absolute top-[60%] left-[5%] w-16 h-16 opacity-10 overflow-hidden" style={{ animation: 'float 8s ease-in-out infinite 2s' }}><img src="/icons/emotion_emo_love.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <div className="w-32 h-32 mb-5 z-[1] overflow-hidden rounded-3xl shadow-2xl"><img src="/icons/parent_icon.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <h2 className="text-white text-3xl font-extrabold text-center z-[1] mb-2.5">
                    {isLogin ? (isArabic ? 'مرحباً بعودتك' : 'Welcome Back') : (isArabic ? 'انضم إلينا كولي أمر' : 'Join as a Parent')}
                </h2>
                <p className="text-white/85 text-[15px] text-center z-[1] max-w-[320px] leading-relaxed">
                    {isLogin ? (isArabic ? 'تابع تقدم طفلك واحصل على تقارير مفصلة ونصائح ذكية' : 'سجل حساباً جديداً لمتابعة تقدم أطفالك وإدارة أنشطتهم اليومية بسهولة') : (isArabic ? 'سجل حساباً جديداً لمتابعة تقدم أطفالك وإدارة أنشطتهم اليومية بسهولة' : "Sign up to track your children's progress and seamlessly manage their daily activities")}
                </p>
                <div className="mt-10 flex gap-3 z-[1]">
                    {[FaChartBar, FaMapMarkerAlt, FaRobot, FaBookOpen].map((Icon, i) => (
                        <div key={i} className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/25 transition-all">
                            <Icon className="text-white text-xl" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6">
                <div className="w-full max-w-[420px]">
                    <Button variant="light" size="sm" className={`mb-8 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                        onPress={() => navigate('/choice')}>← {isArabic ? 'رجوع' : 'Back'}</Button>

                    <div className="mb-6">
                        <Chip variant="bordered" className="bg-accent3/[0.07] border-accent3/[0.12] text-accent3 mb-4">
                            <div className="w-4 h-4 me-2 overflow-hidden rounded-sm inline-block align-middle"><img src="/icons/parent_icon.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                            <span className="text-xs font-semibold">{isArabic ? 'ولي الأمر' : 'Parent Dashboard'}</span>
                        </Chip>
                        <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            {isLogin ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
                        </h1>
                        <p className={`text-sm m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isLogin ? (isArabic ? 'سجل دخول لمتابعة تقدم أطفالك' : 'املأ البيانات لإنشاء حساب ولي أمر جديد') : (isArabic ? 'املأ البيانات لإنشاء حساب ولي أمر جديد' : 'Fill details to create a parent account')}
                        </p>
                    </div>

                    <SharedAuthForm 
                        isLogin={isLogin}
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        buttonText={isLogin ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء الحساب' : 'Create Account')}
                        buttonColorClass="bg-gradient-to-br from-accent3 to-[#44B09E] shadow-[0_4px_16px_rgba(78,205,196,0.25)] hover:shadow-[0_8px_25px_rgba(78,205,196,0.35)]"
                        strengthColors={strengthColors}
                        getPasswordStrength={getPasswordStrength}
                    />

                    <div className="flex items-center gap-3 my-5">
                        <Divider className="flex-1" />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <Divider className="flex-1" />
                    </div>

                    <GoogleAuthButton 
                        role="parent" 
                        mode={isLogin ? 'login' : 'signup'} 
                        onSuccess={() => {
                            toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                            navigate('/parent-dashboard');
                        }} 
                        text={isLogin ? (isArabic ? 'الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'التسجيل بجوجل' : 'Sign up with Google')}
                    />

                    <div className="text-center mt-6">
                        <p className={`text-[13px] m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isLogin ? (isArabic ? 'ليس لديك حساب؟' : "Don't have an account?") : (isArabic ? 'لديك حساب بالفعل؟' : "Already have an account?")}
                            <Button variant="light" size="sm" className="text-accent3 font-bold text-[13px] ms-1.5 p-0 min-w-0 h-auto"
                                onPress={() => {
                                    const nextState = !isLogin;
                                    setIsLogin(nextState);
                                    setFormData({ name: '', email: '', password: '', phone: '' });
                                    navigate(nextState ? '/parent-login' : '/parent-signup');
                                }}>
                                {isLogin ? (isArabic ? 'سجل الآن' : 'Sign Up') : (isArabic ? 'سجل الدخول' : 'Sign In')}
                            </Button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

