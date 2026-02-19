import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { loginParent } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = '#4ECDC4';
    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: 16, fontSize: 15,
        border: `1.5px solid ${isDark ? '#3a4a6a' : '#ddd'}`, background: isDark ? '#2a3654' : '#fff',
        color: text, outline: 'none', transition: 'border 0.3s',
    };

    const handleLogin = () => {
        if (!email.trim() || !email.includes('@')) { setError(isArabic ? 'أدخل إيميل صحيح' : 'Enter a valid email'); return; }
        if (!password) { setError(isArabic ? 'أدخل كلمة المرور' : 'Enter your password'); return; }
        setError('');

        const result = loginParent(email.trim(), password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            if (result.error === 'not_found') setError(isArabic ? 'هذا الإيميل غير مسجل' : 'This email is not registered');
            else if (result.error === 'wrong_password') setError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr', padding: 16 }}>
            <div style={{ background: cardBg, borderRadius: 32, padding: '40px 28px', boxShadow: '0 8px 40px rgba(78,205,196,0.12)', maxWidth: 420, width: '100%', animation: 'fadeSlideUp 0.4s ease-out' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, #8BC99A)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 40 }}>👨‍👩‍👧</div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: text, margin: 0 }}>{isArabic ? 'دخول ولي الأمر' : 'Parent Login'}</h1>
                    <p style={{ color: '#999', fontSize: 14, marginTop: 6 }}>{isArabic ? 'سجل دخول لمتابعة تقدم طفلك' : 'Log in to track your child\'s progress'}</p>
                </div>

                {/* Email */}
                <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 6, display: 'block' }}>📧 {isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
                <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={isArabic ? 'your@email.com' : 'your@email.com'}
                    style={inputStyle}
                />

                {/* Password */}
                <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 6, display: 'block', marginTop: 16 }}>🔒 {isArabic ? 'كلمة المرور' : 'Password'}</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'}
                        style={inputStyle}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} style={{
                        position: 'absolute', right: isArabic ? 'auto' : 14, left: isArabic ? 14 : 'auto',
                        top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18,
                    }}>{showPassword ? '🙈' : '👁️'}</button>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: 'rgba(255,101,132,0.1)', borderRadius: 12, padding: '10px 14px', marginTop: 12 }}>
                        <span style={{ color: '#FF6584', fontSize: 13, fontWeight: 600 }}>⚠️ {error}</span>
                    </div>
                )}

                {/* Login Button */}
                <button onClick={handleLogin} style={{
                    width: '100%', padding: 16, borderRadius: 18, border: 'none', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${accent}, #8BC99A)`,
                    color: '#fff', fontWeight: 700, fontSize: 17, marginTop: 20,
                    boxShadow: '0 4px 16px rgba(78,205,196,0.3)', transition: 'transform 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >{isArabic ? '🚀 دخول' : '🚀 Log In'}</button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                    <div style={{ flex: 1, height: 1, background: isDark ? '#333' : '#eee' }} />
                    <span style={{ color: '#999', fontSize: 12 }}>{isArabic ? 'أو' : 'OR'}</span>
                    <div style={{ flex: 1, height: 1, background: isDark ? '#333' : '#eee' }} />
                </div>

                {/* Signup Link */}
                <button onClick={() => navigate('/signup')} style={{
                    width: '100%', padding: 14, borderRadius: 16,
                    border: `2px solid ${accent}`, background: 'transparent',
                    color: accent, cursor: 'pointer', fontWeight: 700, fontSize: 15,
                }}>{isArabic ? '✨ إنشاء حساب جديد' : '✨ Create New Account'}</button>

                {/* Info */}
                <div style={{ background: isDark ? '#16213E' : '#E8F5E9', borderRadius: 14, padding: 12, marginTop: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: isDark ? '#ccc' : '#2E7D32', margin: 0 }}>💡 {isArabic ? 'للتسجيل كولي أمر، ستحتاج كود الطفل (LN-XXXXXX) الخاص بطفلك' : "To sign up, you'll need your child's code (LN-XXXXXX)"}</p>
                </div>

                {/* Back */}
                <button onClick={() => navigate('/')} style={{ width: '100%', padding: 12, marginTop: 10, borderRadius: 14, background: 'transparent', border: `1px solid ${isDark ? '#444' : '#ddd'}`, color: text, cursor: 'pointer', fontSize: 14 }}>← {isArabic ? 'رجوع' : 'Back'}</button>
            </div>
        </div>
    );
}
