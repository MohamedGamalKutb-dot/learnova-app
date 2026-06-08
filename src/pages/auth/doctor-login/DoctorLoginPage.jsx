import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { Button, Input, Chip, Divider } from '@heroui/react';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../../../components/GoogleAuthButton/GoogleAuthButton';
import { FaUserMd, FaStethoscope, FaHospital, FaNotesMedical, FaUsers, FaClipboardList, FaTheaterMasks, FaFileAlt } from 'react-icons/fa';
import { useGlobalData } from '../../../context/GlobalDataContext';
import SharedAuthForm from '../../../components/SharedAuthForm/SharedAuthForm';

export default function DoctorLoginPage({ initialIsLogin = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, isArabic } = useApp();
    const { loginDoctor, registerDoctor } = useAuth();

    const [isLogin, setIsLogin] = useState(() => {
        if (location.pathname.includes('/doctor-signup')) return false;
        if (location.pathname.includes('/doctor-login')) return true;
        return initialIsLogin;
    });
    const [formData, setFormData] = useState({ name: '', age: '', email: '', gender: 'Male', phone: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('/doctor-signup')) {
            setIsLogin(false);
        } else if (location.pathname.includes('/doctor-login')) {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const getPasswordStrength = () => {
        const p = formData.password; if (!p) return 0; let s = 0;
        if (p.length >= 6) s++; if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };
    
    const { appData } = useGlobalData();
    const { features, strengthColors } = appData ? appData[isArabic ? 'ar' : 'en'].doctorData : { features: [], strengthColors: [] };
    const featureIcons = [<FaUsers />, <FaClipboardList />, <FaTheaterMasks />, <FaFileAlt />];

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (isLogin) {
            if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) { toast.error(isArabic ? 'أدخل بريداً إلكترونياً صحيحاً' : 'Enter a valid email'); setLoading(false); return; }
            if (!formData.password) { toast.error(isArabic ? 'أدخل كلمة المرور' : 'Enter your password'); setLoading(false); return; }
            const res = await loginDoctor(formData.email.trim(), formData.password);
            if (res.success) {
                toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                navigate('/doctor-dashboard');
            }
            else toast.error(isArabic ? (res.error === 'not_found' ? 'البريد الإلكتروني غير موجود' : 'كلمة المرور غير صحيحة') : (res.error === 'not_found' ? 'Email not found' : 'Incorrect password'));
        } else {
            if (!formData.name || !formData.email || !formData.password || !formData.phone) { toast.error(isArabic ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields'); setLoading(false); return; }
            if (!emailRegex.test(formData.email.trim())) { toast.error(isArabic ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format'); setLoading(false); return; }
            const phoneRegex = /^01[0-9]{9}$/;
            if (!phoneRegex.test(formData.phone.trim())) { toast.error(isArabic ? 'رقم الهاتف يجب أن يتكون من 11 رقماً ويبدأ بـ 01' : 'Phone number must be exactly 11 digits starting with 01'); setLoading(false); return; }
            if (formData.password !== formData.confirmPassword) { toast.error(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'); setLoading(false); return; }
            const res = await registerDoctor(formData);
            if (res.success) {
                toast.success(isArabic ? 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.' : 'Account created successfully! Please log in.');
                setIsLogin(true);
                setFormData({ ...formData, password: '', confirmPassword: '' });
                navigate('/doctor-login');
            }
            else toast.error(isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists');
        }
        setLoading(false);
    };


    return (
        <div className={`min-h-screen flex font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* LEFT */}
            <div className="flex-[0_0_420px] hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-accent to-[#4834D4] p-12 relative overflow-hidden">
                <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-white/[0.04]" />
                <div className="absolute top-[15%] left-[12%] w-16 h-16 opacity-20" style={{ animation: 'float 6s ease-in-out infinite' }}>
                    <img src="/icons/doctor_consultation.png" alt="" className="w-full h-full object-contain"  loading="lazy" decoding="async"/>
                </div>
                <div className="absolute bottom-[20%] right-[15%] w-14 h-14 opacity-15" style={{ animation: 'float 7s ease-in-out infinite 1s' }}>
                    <img src="/icons/pecs_body_hurt.png" alt="" className="w-full h-full object-contain"  loading="lazy" decoding="async"/>
                </div>
                <div className="absolute top-[60%] left-[8%] w-12 h-12 opacity-15" style={{ animation: 'float 8s ease-in-out infinite 2s' }}>
                    <img src="/icons/pecs_place_hospital.png" alt="" className="w-full h-full object-contain"  loading="lazy" decoding="async"/>
                </div>
                <div className="relative z-[1] text-center">
                    <div className="w-24 h-24 mx-auto mb-6">
                        <img src="/icons/doctor_icon.png" alt="" className="w-full h-full object-contain"  loading="lazy" decoding="async"/>
                    </div>
                    <h2 className="text-white text-[28px] font-extrabold mb-2.5">{isArabic ? 'بوابة الطبيب' : 'Doctor Portal'}</h2>
                    <p className="text-white/80 text-[15px] leading-relaxed mb-8">{isArabic ? 'منصة متكاملة لإدارة ومتابعة حالات الأطفال' : "A comprehensive platform for managing and tracking children's cases"}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-[14px] py-3.5 px-3 text-center border border-white/15"
                                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}>
                                <div className="w-10 h-10 mx-auto mb-2 overflow-hidden rounded-lg flex items-center justify-center bg-white/10 border border-white/10 text-white text-xl">
                                    {featureIcons[i] || f.text[0]}
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

                    <SharedAuthForm 
                        isLogin={isLogin}
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        buttonText={isLogin ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء الحساب' : 'Create Account')}
                        buttonColorClass="bg-gradient-to-br from-accent to-[#4834D4] shadow-[0_4px_16px_rgba(108,99,255,0.25)] hover:shadow-[0_8px_25px_rgba(108,99,255,0.35)]"
                        strengthColors={strengthColors}
                        getPasswordStrength={getPasswordStrength}
                    />

                    <div className="flex items-center gap-3 my-5">
                        <Divider className="flex-1" />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <Divider className="flex-1" />
                    </div>

                    <GoogleAuthButton 
                        role="doctor" 
                        mode={isLogin ? 'login' : 'signup'} 
                        onSuccess={() => {
                            if (isLogin) {
                                toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                                navigate('/doctor-dashboard');
                            } else {
                                toast.success(isArabic ? 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.' : 'Account created successfully! Please log in.');
                                setIsLogin(true);
                                setFormData({ ...formData, password: '', confirmPassword: '' });
                                navigate('/doctor-login');
                            }
                        }} 
                        text={isLogin ? (isArabic ? 'الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'التسجيل بجوجل' : 'Sign up with Google')}
                    />

                    <div className="text-center mt-6">
                        <p className={`text-[13px] m-0 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isLogin ? (isArabic ? 'ليس لديك حساب؟' : "Don't have an account?") : (isArabic ? 'لديك حساب بالفعل؟' : "Already have an account?")}
                            <Button variant="light" size="sm" className="text-accent font-bold text-[13px] ms-1.5 p-0 min-w-0 h-auto"
                                onPress={() => {
                                    const nextState = !isLogin;
                                    setIsLogin(nextState);
                                    setFormData({ ...formData, confirmPassword: '' });
                                    navigate(nextState ? '/doctor-login' : '/doctor-signup');
                                }}>
                                {isLogin ? (isArabic ? 'سجل الآن' : 'Sign Up') : (isArabic ? 'سجل الدخول' : 'Sign In')}
                            </Button>
                        </p>
                    </div>

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

