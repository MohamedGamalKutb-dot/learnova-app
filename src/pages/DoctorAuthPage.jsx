import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function DoctorAuthPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { loginDoctor, registerDoctor } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        email: '',
        gender: 'Male',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const bg = isDark ? '#1A1A2E' : '#eef2f5';
    const cardBg = isDark ? 'rgba(31,41,64,0.95)' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const inputBg = isDark ? '#16213E' : '#f8f9fa';
    const border = isDark ? '#444' : '#eee';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (isLogin) {
            // LOGIN LOGIC
            const res = loginDoctor(formData.email, formData.password);
            if (res.success) {
                navigate('/doctor-dashboard'); // Redirect to doctor dashboard
            } else {
                setError(isArabic
                    ? (res.error === 'not_found' ? 'البريد الإلكتروني غير موجود' : 'كلمة المرور غير صحيحة')
                    : (res.error === 'not_found' ? 'Email not found' : 'Incorrect password'));
            }
        } else {
            // REGISTER LOGIC
            if (formData.password !== formData.confirmPassword) {
                setError(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
                setLoading(false);
                return;
            }
            if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                setError(isArabic ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
                setLoading(false);
                return;
            }

            const res = registerDoctor(formData);
            if (res.success) {
                navigate('/doctor-dashboard');
            } else {
                setError(isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists');
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Cairo, sans-serif',
            direction: isArabic ? 'rtl' : 'ltr',
            padding: 20
        }}>
            <div style={{
                width: '100%',
                maxWidth: 450,
                background: cardBg,
                borderRadius: 24,
                padding: '40px 30px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <div style={{ fontSize: 50, marginBottom: 10 }}>👨‍⚕️</div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: text, margin: 0 }}>
                        {isLogin
                            ? (isArabic ? 'تسجيل دخول الطبيب' : 'Doctor Login')
                            : (isArabic ? 'إنشاء حساب طبيب' : 'Doctor Registration')}
                    </h1>
                    <p style={{ color: '#999', fontSize: 14, marginTop: 8 }}>
                        {isLogin
                            ? (isArabic ? 'مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة' : 'Welcome back! Please login to continue')
                            : (isArabic ? 'انضم إلينا لمساعدة الأطفال المميزين' : 'Join us to help special children')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {!isLogin && (
                        <>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <input
                                    name="name" placeholder={isArabic ? 'الاسم الكامل' : 'Full Name'}
                                    value={formData.name} onChange={handleChange}
                                    style={inputStyle(inputBg, border, text)} required
                                />
                                <input
                                    name="age" type="number" placeholder={isArabic ? 'العمر' : 'Age'}
                                    value={formData.age} onChange={handleChange}
                                    style={{ ...inputStyle(inputBg, border, text), width: 80 }} required
                                />
                            </div>

                            <select
                                name="gender"
                                value={formData.gender} onChange={handleChange}
                                style={inputStyle(inputBg, border, text)}
                            >
                                <option value="Male">{isArabic ? 'ذكر' : 'Male'}</option>
                                <option value="Female">{isArabic ? 'أنثى' : 'Female'}</option>
                            </select>

                            <input
                                name="phone" type="tel" placeholder={isArabic ? 'رقم الهاتف' : 'Phone Number'}
                                value={formData.phone} onChange={handleChange}
                                style={inputStyle(inputBg, border, text)} required
                            />
                        </>
                    )}

                    <input
                        name="email" type="email" placeholder={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                        value={formData.email} onChange={handleChange}
                        style={inputStyle(inputBg, border, text)} required
                    />

                    <input
                        name="password" type="password" placeholder={isArabic ? 'كلمة المرور' : 'Password'}
                        value={formData.password} onChange={handleChange}
                        style={inputStyle(inputBg, border, text)} required
                    />

                    {!isLogin && (
                        <input
                            name="confirmPassword" type="password" placeholder={isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                            value={formData.confirmPassword} onChange={handleChange}
                            style={inputStyle(inputBg, border, text)} required
                        />
                    )}

                    {error && <div style={{ color: '#FF6584', fontSize: 13, textAlign: 'center', background: 'rgba(255,101,132,0.1)', padding: 10, borderRadius: 8 }}>{error}</div>}

                    <button type="submit" disabled={loading} style={{
                        marginTop: 10,
                        background: 'linear-gradient(135deg, #6C63FF 0%, #4834D4 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '14px',
                        borderRadius: 16,
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: loading ? 'wait' : 'pointer',
                        boxShadow: '0 4px 15px rgba(108,99,255,0.3)',
                        transition: 'transform 0.2s',
                    }}>
                        {loading
                            ? (isArabic ? 'جاري التحميل...' : 'Loading...')
                            : (isLogin ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء حساب' : 'Create Account'))}
                    </button>
                </form>

                {/* Footer Toggle */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <p style={{ color: '#999', fontSize: 13 }}>
                        {isLogin
                            ? (isArabic ? 'ليس لديك حساب؟' : "Don't have an account?")
                            : (isArabic ? 'لديك حساب بالفعل؟' : "Already have an account?")}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{
                                background: 'none', border: 'none', color: '#6C63FF',
                                fontWeight: 700, cursor: 'pointer', marginInlineStart: 5,
                                textDecoration: 'underline'
                            }}
                        >
                            {isLogin
                                ? (isArabic ? 'سجل الآن' : 'Sign Up')
                                : (isArabic ? 'سجل الدخول' : 'Sign In')}
                        </button>
                    </p>
                </div>

                {/* Back Home */}
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: text, fontSize: 12, opacity: 0.6, cursor: 'pointer' }}>
                        {isArabic ? '← العودة للرئيسية' : '← Back Home'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const inputStyle = (bg, border, text) => ({
    width: '100%',
    padding: '14px 16px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 12,
    fontSize: 14,
    color: text,
    outline: 'none',
    transition: 'border 0.3s'
});
