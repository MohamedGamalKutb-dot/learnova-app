import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useGlobalData } from '../../shared/context/GlobalDataContext';
import { Button, Chip, Divider } from '@heroui/react';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../../shared/components/GoogleAuthButton';
import { FaUsers, FaClipboardList, FaTheaterMasks, FaFileAlt } from 'react-icons/fa';
import SharedAuthForm from '../../shared/components/SharedAuthForm';
import { loginSchema, doctorRegisterSchema, DoctorRegisterFormData, LoginFormData, getPasswordStrength } from './schemas/auth.schema';
import { getErrorMessage } from '../../shared/utils/errorHandler';
import { ROUTES } from '../../constants/routes';

export default function DoctorLoginPage({ initialIsLogin = true }: { initialIsLogin?: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, isArabic } = useApp();
    const { loginDoctor, registerDoctor } = useAuth();

    const [isLogin, setIsLogin] = useState(() => {
        if (location.pathname.includes(ROUTES.DOCTOR_SIGNUP)) return false;
        if (location.pathname.includes(ROUTES.DOCTOR_LOGIN)) return true;
        return initialIsLogin;
    });

    const [loading, setLoading] = useState(false);

    const schema = isLogin ? loginSchema : doctorRegisterSchema;
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<any>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (location.pathname.includes(ROUTES.DOCTOR_SIGNUP)) {
            setIsLogin(false);
        } else if (location.pathname.includes(ROUTES.DOCTOR_LOGIN)) {
            setIsLogin(true);
        }
        reset();
    }, [location.pathname, reset]);

    const { appData } = useGlobalData();
    const { features, strengthColors } = appData ? appData[isArabic ? 'ar' : 'en'].doctorData : { features: [], strengthColors: ['#E11D48', '#EA580C', '#D97706', '#059669', '#10B981'] };
    const featureIcons = [<FaUsers />, <FaClipboardList />, <FaTheaterMasks />, <FaFileAlt />];

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            if (isLogin) {
                const loginData = data as LoginFormData;
                const res = await loginDoctor(loginData.email.trim(), loginData.password);
                if (res.success) {
                    toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                    navigate(ROUTES.DOCTOR_DASHBOARD);
                } else {
                    toast.error(getErrorMessage(res.error, isArabic));
                }
            } else {
                const regData = data as DoctorRegisterFormData;
                const res = await registerDoctor(regData);
                if (res.success) {
                    toast.success(isArabic ? 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.' : 'Account created successfully! Please log in.');
                    setIsLogin(true);
                    navigate(ROUTES.DOCTOR_LOGIN);
                } else {
                    toast.error(getErrorMessage(res.error, isArabic));
                }
            }
        } catch (error) {
            toast.error(getErrorMessage(error, isArabic));
        } finally {
            setLoading(false);
        }
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
                        {features.map((f: any, i: number) => (
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
                        onPress={() => navigate(ROUTES.CHOICE)}>← {isArabic ? 'العودة' : 'Back'}</Button>

                    <h1 className={`mb-1.5 text-[28px] font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        {isLogin ? (isArabic ? 'تسجيل الدخول' : 'Welcome Back') : (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
                    </h1>
                    <p className={`mb-7 text-sm leading-relaxed ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isLogin ? (isArabic ? 'أدخل بياناتك للوصول إلى بوابة الطبيب' : 'Enter your credentials to access the Doctor Portal') : (isArabic ? 'انضم إلينا لمساعدة الأطفال المميزين' : 'Join us to help special children grow')}
                    </p>

                    <SharedAuthForm 
                        isLogin={isLogin}
                        role="doctor"
                        register={register}
                        errors={errors}
                        watch={watch}
                        onSubmit={handleSubmit(onSubmit)}
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
                            toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                            navigate(ROUTES.DOCTOR_DASHBOARD);
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
                                    navigate(nextState ? ROUTES.DOCTOR_LOGIN : ROUTES.DOCTOR_SIGNUP);
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
