import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function ChildSignupPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { registerChild } = useAuth();

    const [form, setForm] = useState({ name: '', age: '', email: '', password: '', confirmPassword: '', gender: 'Male' });
    const [avatar, setAvatar] = useState('👦');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [createdId, setCreatedId] = useState(null);
    const [step, setStep] = useState(1); // 1=form, 2=success

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = '#6C63FF';
    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: 16, fontSize: 15,
        border: `1.5px solid ${isDark ? '#3a4a6a' : '#ddd'}`, background: isDark ? '#2a3654' : '#fff',
        color: text, outline: 'none', transition: 'border 0.3s',
    };

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    // Password strength
    const passwordStrength = () => {
        const p = form.password;
        if (!p) return { level: 0, label: '', color: '#999' };
        let score = 0;
        if (p.length >= 6) score++;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        const levels = [
            { label: isArabic ? 'ضعيفة جداً' : 'Very Weak', color: '#FF6584' },
            { label: isArabic ? 'ضعيفة' : 'Weak', color: '#FF6584' },
            { label: isArabic ? 'متوسطة' : 'Fair', color: '#F9E4A7' },
            { label: isArabic ? 'جيدة' : 'Good', color: '#4ECDC4' },
            { label: isArabic ? 'قوية' : 'Strong', color: '#8BC99A' },
        ];
        return { level: score, ...levels[Math.min(score, 4)] };
    };

    const validate = () => {
        if (!form.name.trim()) return isArabic ? 'الاسم مطلوب' : 'Name is required';
        if (!form.age || parseInt(form.age) < 2 || parseInt(form.age) > 18) return isArabic ? 'العمر يجب أن يكون بين 2 و 18' : 'Age must be between 2 and 18';
        if (!form.email.trim() || !form.email.includes('@')) return isArabic ? 'إيميل غير صحيح' : 'Invalid email';
        if (form.password.length < 6) return isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters';
        if (form.password !== form.confirmPassword) return isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords do not match';
        return null;
    };

    const handleRegister = () => {
        const err = validate();
        if (err) { setError(err); return; }
        setError('');

        const result = registerChild({ ...form, avatar });
        if (result.success) {
            setCreatedId(result.childId);
            setStep(2);
        } else {
            if (result.error === 'email_exists') setError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'This email is already registered');
        }
    };

    // SUCCESS SCREEN
    if (step === 2) {
        return (
            <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr' }}>
                <div style={{ background: cardBg, borderRadius: 32, padding: 40, textAlign: 'center', boxShadow: '0 8px 40px rgba(108,99,255,0.12)', maxWidth: 420, width: '90%', animation: 'fadeInScale 0.5s ease-out' }}>
                    <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ color: text, fontSize: 26, fontWeight: 800 }}>{isArabic ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}</h2>
                    <p style={{ color: '#999', fontSize: 14, marginTop: 8 }}>{isArabic ? 'هذا هو الكود الخاص بك. احتفظ به!' : 'This is your unique code. Keep it safe!'}</p>

                    {/* Child ID Display */}
                    <div style={{
                        margin: '24px auto', padding: '20px 32px', borderRadius: 20,
                        background: `linear-gradient(135deg, ${accent}, #FF6584)`,
                        display: 'inline-block', position: 'relative',
                    }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontWeight: 600 }}>{isArabic ? 'كود الطفل' : 'CHILD CODE'}</div>
                        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: 4, fontFamily: 'monospace' }}>{createdId}</div>
                    </div>

                    <div style={{ background: isDark ? '#16213E' : '#FFF3E0', borderRadius: 14, padding: 14, margin: '16px 0', textAlign: 'start' }}>
                        <p style={{ fontSize: 13, color: isDark ? '#F9E4A7' : '#E65100', fontWeight: 600 }}>
                            ⚠️ {isArabic ? 'مهم: شاركه مع ولي أمرك عشان يقدر يتابع تقدمك!' : 'Important: Share this code with your parent so they can track your progress!'}
                        </p>
                    </div>

                    <button onClick={() => {
                        navigator.clipboard?.writeText(createdId);
                    }} style={{
                        width: '100%', padding: 14, borderRadius: 16, border: `2px solid ${accent}`,
                        background: 'transparent', color: accent, cursor: 'pointer', fontWeight: 700, fontSize: 15, marginBottom: 10,
                    }}>📋 {isArabic ? 'نسخ الكود' : 'Copy Code'}</button>

                    <button onClick={() => navigate('/child-home')} style={{
                        width: '100%', padding: 16, borderRadius: 16,
                        background: `linear-gradient(135deg, ${accent}, #4ECDC4)`,
                        color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16,
                    }}>🚀 {isArabic ? 'ابدأ التعلم!' : 'Start Learning!'}</button>
                </div>
            </div>
        );
    }

    // SIGNUP FORM
    const strength = passwordStrength();
    return (
        <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr', padding: 16 }}>
            <div style={{ background: cardBg, borderRadius: 32, padding: '32px 28px', boxShadow: '0 8px 40px rgba(108,99,255,0.12)', maxWidth: 440, width: '100%', animation: 'fadeSlideUp 0.4s ease-out' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🎮</div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: text, margin: 0 }}>{isArabic ? 'تسجيل طفل جديد' : 'Create Account'}</h1>
                    <p style={{ color: '#999', fontSize: 13, marginTop: 4 }}>{isArabic ? 'سجل عشان تبدأ رحلة التعلم' : 'Sign up to start your learning journey'}</p>
                </div>

                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                    {['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰'].map(em => (
                        <button key={em} onClick={() => setAvatar(em)} style={{
                            width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: 22,
                            border: `${avatar === em ? 2 : 1}px solid ${avatar === em ? accent : isDark ? '#444' : '#ddd'}`,
                            background: avatar === em ? `${accent}20` : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                        }}>{em}</button>
                    ))}
                </div>

                {/* Name */}
                <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4, display: 'block' }}>{isArabic ? '📛 الاسم' : '📛 Name'}</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={isArabic ? 'اسم الطفل' : "Child's name"} style={inputStyle} />

                {/* Age & Gender Row */}
                <div style={{ display: 'flex', gap: 10, margin: '12px 0' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4, display: 'block' }}>{isArabic ? '🎂 العمر' : '🎂 Age'}</label>
                        <input type="number" value={form.age} onChange={e => set('age', e.target.value)} min="2" max="18" placeholder={isArabic ? 'العمر' : 'Age'} style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4, display: 'block' }}>{isArabic ? '⚧ الجنس' : '⚧ Gender'}</label>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {[{ val: 'Male', label: isArabic ? 'ذكر' : 'Male', em: '👦' }, { val: 'Female', label: isArabic ? 'أنثى' : 'Female', em: '👧' }].map(g => (
                                <button key={g.val} onClick={() => set('gender', g.val)} style={{
                                    flex: 1, padding: '12px 8px', borderRadius: 14, cursor: 'pointer', fontSize: 13,
                                    background: form.gender === g.val ? accent : 'transparent',
                                    color: form.gender === g.val ? '#fff' : text,
                                    border: `1.5px solid ${form.gender === g.val ? accent : isDark ? '#3a4a6a' : '#ddd'}`,
                                    fontWeight: form.gender === g.val ? 700 : 400, transition: 'all 0.2s',
                                }}>{g.em}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Email */}
                <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4, display: 'block', marginTop: 12 }}>{isArabic ? '📧 البريد الإلكتروني' : '📧 Email'}</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder={isArabic ? 'your@email.com' : 'your@email.com'} style={inputStyle} />

                {/* Password */}
                <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4, display: 'block', marginTop: 12 }}>{isArabic ? '🔒 كلمة المرور' : '🔒 Password'}</label>
                <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'} style={inputStyle} />
                    <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: isArabic ? 'auto' : 12, left: isArabic ? 12 : 'auto', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</button>
                </div>
                {/* Password Strength */}
                {form.password && (
                    <div style={{ marginTop: 6, marginBottom: 4 }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: strength.level >= i ? strength.color : isDark ? '#333' : '#eee', transition: 'background 0.3s' }} />
                            ))}
                        </div>
                        <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                    </div>
                )}

                {/* Confirm Password */}
                <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4, display: 'block', marginTop: 12 }}>{isArabic ? '🔒 تأكيد كلمة المرور' : '🔒 Confirm Password'}</label>
                <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter password'} style={inputStyle} />
                    {form.confirmPassword && (
                        <span style={{ position: 'absolute', right: isArabic ? 'auto' : 12, left: isArabic ? 12 : 'auto', top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>
                            {form.password === form.confirmPassword ? '✅' : '❌'}
                        </span>
                    )}
                </div>

                {/* Error */}
                {error && <div style={{ background: 'rgba(255,101,132,0.1)', borderRadius: 12, padding: '10px 14px', margin: '12px 0' }}><span style={{ color: '#FF6584', fontSize: 13, fontWeight: 600 }}>⚠️ {error}</span></div>}

                {/* Register Button */}
                <button onClick={handleRegister} style={{
                    width: '100%', padding: 16, borderRadius: 18, border: 'none', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${accent}, #4ECDC4)`,
                    color: '#fff', fontWeight: 700, fontSize: 17, marginTop: 16,
                    boxShadow: '0 4px 16px rgba(108,99,255,0.3)', transition: 'transform 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >{isArabic ? '🎮 سجل وابدأ!' : '🎮 Register & Start!'}</button>

                {/* Login Link */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <span style={{ color: '#999', fontSize: 13 }}>{isArabic ? 'عندك حساب؟ ' : 'Already have an account? '}</span>
                    <button onClick={() => navigate('/child-login')} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>{isArabic ? 'سجل دخول' : 'Log In'}</button>
                </div>

                {/* Back */}
                <button onClick={() => navigate('/')} style={{ width: '100%', padding: 12, marginTop: 10, borderRadius: 14, background: 'transparent', border: `1px solid ${isDark ? '#444' : '#ddd'}`, color: text, cursor: 'pointer', fontSize: 14 }}>← {isArabic ? 'رجوع' : 'Back'}</button>
            </div>
        </div>
    );
}
