import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../../shared/context/AppContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useGlobalData } from '../../shared/context/GlobalDataContext';
import { Button, Divider } from '@heroui/react';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../../shared/components/GoogleAuthButton';
import SharedAuthForm from '../../shared/components/SharedAuthForm';
import { loginSchema, childRegisterSchema, ChildRegisterFormData, LoginFormData, getPasswordStrength } from './schemas/auth.schema';
import { getErrorMessage } from '../../shared/utils/errorHandler';
import { ROUTES } from '../../constants/routes';

export default function ChildLogin({ initialIsLogin = true }: { initialIsLogin?: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, isArabic } = useApp();
    const { loginChild, registerChild } = useAuth();

    const [isLogin, setIsLogin] = useState(() => {
        if (location.pathname.includes(ROUTES.CHILD_SIGNUP)) return false;
        if (location.pathname.includes(ROUTES.CHILD_LOGIN)) return true;
        return initialIsLogin;
    });

    const [loading, setLoading] = useState(false);

    // Setup React Hook Form dynamically based on isLogin state
    const schema = isLogin ? loginSchema : childRegisterSchema;
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<any>({
        resolver: zodResolver(schema),
        defaultValues: { gender: 'Male' }
    });

    useEffect(() => {
        if (location.pathname.includes(ROUTES.CHILD_SIGNUP)) {
            setIsLogin(false);
        } else if (location.pathname.includes(ROUTES.CHILD_LOGIN)) {
            setIsLogin(true);
        }
        reset({ gender: 'Male' }); // Reset form when switching between login/signup
    }, [location.pathname, reset]);

    const { appData } = useGlobalData();
    const strengthColors = appData?.authData?.childStrengthColors || ['#E11D48', '#EA580C', '#D97706', '#059669', '#10B981'];

    const onSubmit = async (data: any) => {
        setLoading(true);
        
        try {
            if (isLogin) {
                const loginData = data as LoginFormData;
                const result = await loginChild(loginData.email.trim(), loginData.password);
                
                if (result.success) {
                    toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                    navigate(ROUTES.CHILD_HOME);
                } else {
                    toast.error(getErrorMessage(result.error, isArabic));
                }
            } else {
                const regData = data as ChildRegisterFormData;
                const result = await registerChild({ ...regData, avatar: '👦' });
                
                if (result.success) {
                    toast.success(isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!');
                    if (result.childId) {
                        navigator.clipboard?.writeText(result.childId);
                        toast(isArabic ? `كود طفلك هو: ${result.childId} (تم نسخه الحافظة)` : `Your child code: ${result.childId} (Copied to clipboard)`, { icon: '🆔', duration: 10000 });
                    }
                    navigate(ROUTES.CHILD_LOGIN);
                } else {
                     toast.error(getErrorMessage(result.error, isArabic));
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
            {/* Left: Branding */}
            <div className="flex-[0_0_45%] hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-accent2 to-[#FF6584] to-accent p-10 relative overflow-hidden min-h-screen">
                <div className="absolute top-[10%] left-[10%] w-20 h-20 opacity-15 overflow-hidden" style={{ animation: 'float 6s ease-in-out infinite' }}><img src="/icons/child.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <div className="absolute top-[30%] right-[15%] w-16 h-16 opacity-[0.12] overflow-hidden" style={{ animation: 'float 8s ease-in-out infinite 1s' }}><img src="/icons/rewards.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <div className="absolute bottom-[15%] left-[20%] w-20 h-20 opacity-10 overflow-hidden" style={{ animation: 'float 7s ease-in-out infinite 2s' }}><img src="/icons/pecs_module.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <div className="w-32 h-32 mb-5 z-[1] overflow-hidden rounded-3xl shadow-2xl"><img src="/icons/child.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div>
                <h2 className="text-white text-[32px] font-extrabold text-center z-[1] mb-2.5">
                    {isLogin ? (isArabic ? 'مرحباً بعودتك!' : 'Welcome Back!') : (isArabic ? 'إنشاء حساب جديد' : 'Create Account')}
                </h2>
                <p className="text-white/80 text-base text-center max-w-[300px] z-[1] leading-relaxed">
                    {isLogin ? (isArabic ? 'سجل دخولك عشان ترجع تلعب وتتعلم حاجات جديدة!' : 'Log in to continue playing and learning new things!') : (isArabic ? 'سجل عشان تبدأ رحلة التعلم الممتعة!' : 'Sign up to start your fun learning journey!')}
                </p>
                <div onClick={() => navigate(ROUTES.CHOICE)} className="flex items-center gap-2 cursor-pointer mt-10 z-[1] text-white/70 text-sm">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src="/icons/brain_logo.png" alt="LearnNeur" className="w-full h-full object-cover"  loading="lazy" decoding="async"/>
                    </div>
                    <span className="font-bold text-white">LearnNeur</span>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center py-10 px-6 overflow-y-auto min-h-screen">
                <div className="max-w-[420px] w-full">
                    <Button variant="light" size="sm" className={`mb-8 font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}
                        onPress={() => navigate(ROUTES.CHOICE)}>← {isArabic ? 'رجوع' : 'Back'}</Button>

                    <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'} flex items-center gap-3`}>
                        <div className="w-10 h-10 overflow-hidden rounded-xl"><img src="/icons/child.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div> 
                        {isLogin ? (isArabic ? 'تسجيل دخول الطفل' : 'Child Login') : (isArabic ? 'تسجيل طفل جديد' : 'New Child Account')}
                    </h1>
                    <p className={`text-sm mb-6 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isLogin ? (isArabic ? 'أدخل بياناتك عشان تلعب وتتعلم' : 'Enter your details to play and learn') : (isArabic ? 'سجل عشان تبدأ رحلة التعلم' : 'Sign up to start your learning journey')}
                    </p>

                    <SharedAuthForm 
                        isLogin={isLogin}
                        role="child"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        onSubmit={handleSubmit(onSubmit)}
                        loading={loading}
                        buttonText={isLogin ? (isArabic ? 'تسجيل الدخول' : 'Log In') : (isArabic ? 'سجل وابدأ!' : 'Register & Start!')}
                        buttonColorClass="bg-gradient-to-br from-accent2 to-pink-500 shadow-[0_4px_16px_rgba(255,101,132,0.35)] hover:shadow-[0_8px_25px_rgba(255,101,132,0.45)]"
                        strengthColors={strengthColors}
                        getPasswordStrength={getPasswordStrength}
                    />

                    <div className="flex items-center gap-3 my-6">
                        <Divider className="flex-1" />
                        <span className={`text-xs ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                        <Divider className="flex-1" />
                    </div>

                    <GoogleAuthButton 
                        role="child" 
                        mode={isLogin ? 'login' : 'signup'} 
                        onSuccess={(result: any) => {
                            if (!isLogin) {
                                toast.success(isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!');
                                if (result?.childId) {
                                    navigator.clipboard?.writeText(result.childId);
                                    toast(isArabic ? `كود طفلك هو: ${result.childId} (تم نسخه الحافظة)` : `Your child code: ${result.childId} (Copied to clipboard)`, { icon: '🆔', duration: 10000 });
                                }
                            }
                            navigate(ROUTES.CHILD_HOME);
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
                                    navigate(nextState ? ROUTES.CHILD_LOGIN : ROUTES.CHILD_SIGNUP);
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
