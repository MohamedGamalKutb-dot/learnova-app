import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useGlobalData } from '../../shared/context/GlobalDataContext';
import { Button, Divider, Chip } from '@heroui/react';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../../shared/components/GoogleAuthButton';
import { FaChartBar, FaMapMarkerAlt, FaRobot, FaBookOpen } from 'react-icons/fa';
import SharedAuthForm from '../../shared/components/SharedAuthForm';
import { loginSchema, parentRegisterSchema, ParentRegisterFormData, LoginFormData, getPasswordStrength } from './schemas/auth.schema';
import { getErrorMessage } from '../../shared/utils/errorHandler';
import { ROUTES } from '../../constants/routes';

export default function ParentLogin({ initialIsLogin = true }: { initialIsLogin?: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, isArabic } = useApp();
    const { loginParent, registerParent } = useAuth();

    const [isLogin, setIsLogin] = useState(() => {
        if (location.pathname.includes(ROUTES.PARENT_SIGNUP)) return false;
        if (location.pathname.includes(ROUTES.PARENT_LOGIN)) return true;
        return initialIsLogin;
    });

    const [loading, setLoading] = useState(false);

    const schema = isLogin ? loginSchema : parentRegisterSchema;
    
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
        if (location.pathname.includes(ROUTES.PARENT_SIGNUP)) {
            setIsLogin(false);
        } else if (location.pathname.includes(ROUTES.PARENT_LOGIN)) {
            setIsLogin(true);
        }
        reset();
    }, [location.pathname, reset]);

    const { appData } = useGlobalData();
    const strengthColors = appData?.authData?.parentStrengthColors || ['#E11D48', '#EA580C', '#D97706', '#059669', '#10B981'];

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            if (isLogin) {
                const loginData = data as LoginFormData;
                const res = await loginParent(loginData.email.trim(), loginData.password);
                if (res.success) {
                    toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                    navigate(ROUTES.PARENT_DASHBOARD);
                } else {
                    toast.error(getErrorMessage(res.error, isArabic));
                }
            } else {
                const regData = data as ParentRegisterFormData;
                const res = await registerParent(regData);
                if (res.success) {
                    toast.success(isArabic ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' : 'Account created successfully! You can now log in.');
                    setIsLogin(true);
                    navigate(ROUTES.PARENT_LOGIN);
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
                        onPress={() => navigate(ROUTES.CHOICE)}>← {isArabic ? 'رجوع' : 'Back'}</Button>

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
                        role="parent"
                        register={register}
                        errors={errors}
                        watch={watch}
                        onSubmit={handleSubmit(onSubmit)}
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
                            navigate(ROUTES.PARENT_DASHBOARD);
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
                                    navigate(nextState ? ROUTES.PARENT_LOGIN : ROUTES.PARENT_SIGNUP);
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
