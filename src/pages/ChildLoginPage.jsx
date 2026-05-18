import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Divider } from '@heroui/react';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { getAuthData } from '../data/authData';
import SharedAuthForm from '../components/SharedAuthForm';

export default function ChildLoginPage({ initialIsLogin = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, isArabic } = useApp();
    const { loginChild, registerChild } = useAuth();

    const [isLogin, setIsLogin] = useState(() => {
        if (location.pathname.includes('/child-signup')) return false;
        if (location.pathname.includes('/child-login')) return true;
        return initialIsLogin;
    });
    
    const [formData, setFormData] = useState({ name: '', age: '', email: '', gender: 'Male', phone: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('/child-signup')) {
            setIsLogin(false);
        } else if (location.pathname.includes('/child-login')) {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
                toast.error(isArabic ? 'أدخل بريداً إلكترونياً صحيحاً' : 'Enter a valid email'); setLoading(false); return;
            }
            if (!formData.password) {
                toast.error(isArabic ? 'أدخل كلمة المرور' : 'Enter your password'); setLoading(false); return;
            }
            
            const result = loginChild(formData.email.trim(), formData.password);
            if (result.success) {
                toast.success(isArabic ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
                navigate('/child-home');
            } else {
                if (result.error === 'not_found') toast.error(isArabic ? 'البريد الإلكتروني غير مسجل' : 'Email not found');
                else if (result.error === 'wrong_password') toast.error(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
            }
        } else {
            if (!formData.name.trim()) { toast.error(isArabic ? 'الاسم مطلوب' : 'Name is required'); setLoading(false); return; }
            if (!formData.phone.trim()) { toast.error(isArabic ? 'رقم الهاتف مطلوب' : 'Phone number is required'); setLoading(false); return; }
            if (!formData.age || parseInt(formData.age) < 2 || parseInt(formData.age) > 18) { toast.error(isArabic ? 'العمر يجب أن يكون بين 2 و 18' : 'Age must be between 2 and 18'); setLoading(false); return; }
            if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) { toast.error(isArabic ? 'إيميل غير صحيح' : 'Invalid email'); setLoading(false); return; }
            if (formData.password.length < 6) { toast.error(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); setLoading(false); return; }
            if (formData.password !== formData.confirmPassword) { toast.error(isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords do not match'); setLoading(false); return; }

            const result = registerChild({ ...formData, avatar: '👦' });
            if (result.success) {
                toast.success(isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!');
                navigator.clipboard?.writeText(result.childId);
                toast(isArabic ? `كود طفلك هو: ${result.childId} (تم نسخه الحافظة)` : `Your child code: ${result.childId} (Copied to clipboard)`, { icon: '🆔', duration: 10000 });
                navigate('/child-login');
            } else if (result.error === 'email_exists') {
                toast.error(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'This email is already registered');
            }
        }
        setLoading(false);
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
                <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer mt-10 z-[1] text-white/70 text-sm">
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
                        onPress={() => navigate('/choice')}>← {isArabic ? 'رجوع' : 'Back'}</Button>

                    <h1 className={`text-[28px] font-extrabold mb-1.5 ${isDark ? 'text-text-dark' : 'text-text'} flex items-center gap-3`}>
                        <div className="w-10 h-10 overflow-hidden rounded-xl"><img src="/icons/child.png" className="w-full h-full object-cover"  loading="lazy" decoding="async" alt=""/></div> 
                        {isLogin ? (isArabic ? 'تسجيل دخول الطفل' : 'Child Login') : (isArabic ? 'تسجيل طفل جديد' : 'New Child Account')}
                    </h1>
                    <p className={`text-sm mb-6 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isLogin ? (isArabic ? 'أدخل بياناتك عشان تلعب وتتعلم' : 'Enter your details to play and learn') : (isArabic ? 'سجل عشان تبدأ رحلة التعلم' : 'Sign up to start your learning journey')}
                    </p>


                    <SharedAuthForm 
                        isLogin={isLogin}
                        formData={formData}
                        handleChange={handleChange}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
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
                        onSuccess={(result) => {
                            if (!isLogin) {
                                toast.success(isArabic ? 'تم إنشاء الحساب بنجاح!' : 'Account Created Successfully!');
                                navigator.clipboard?.writeText(result.childId);
                                toast(isArabic ? `كود طفلك هو: ${result.childId} (تم نسخه الحافظة)` : `Your child code: ${result.childId} (Copied to clipboard)`, { icon: '🆔', duration: 10000 });
                            }
                            navigate('/child-home');
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
                                    setFormData({ name: '', age: '', email: '', gender: 'Male', phone: '', password: '', confirmPassword: '' });
                                    navigate(nextState ? '/child-login' : '/child-signup');
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
