import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { registerParent, getChildById } = useAuth();

    const [step, setStep] = useState(0); // 0=child code, 1=name, 2=email, 3=password, 4=phone, 5=review
    const [form, setForm] = useState({ childId: '', name: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [linkedChild, setLinkedChild] = useState(null);

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = '#6C63FF';
    const inputStyle = {
        width: '100%', padding: '14px 16px', borderRadius: 16, fontSize: 15,
        border: `1.5px solid ${isDark ? '#3a4a6a' : '#ddd'}`, background: isDark ? '#2a3654' : '#fff',
        color: text, outline: 'none',
    };

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

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

    const validateStep = () => {
        switch (step) {
            case 0:
                if (!form.childId.trim()) return isArabic ? 'أدخل كود الطفل' : 'Enter child code';
                const child = getChildById(form.childId.trim());
                if (!child) return isArabic ? 'هذا الكود غير موجود! تأكد من الكود أو اطلبه من الطفل' : 'This code does not exist! Verify the code or ask the child';
                setLinkedChild(child);
                return null;
            case 1:
                if (!form.name.trim()) return isArabic ? 'الاسم مطلوب' : 'Name is required';
                return null;
            case 2:
                if (!form.email.trim() || !form.email.includes('@')) return isArabic ? 'إيميل غير صحيح' : 'Invalid email';
                return null;
            case 3:
                if (form.password.length < 6) return isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters';
                return null;
            case 4:
                return null; // phone optional
            default: return null;
        }
    };

    const nextStep = () => {
        const err = validateStep();
        if (err) { setError(err); return; }
        setError('');
        if (step < 5) setStep(step + 1);
    };

    const prevStep = () => {
        setError('');
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = () => {
        const result = registerParent({ ...form, childId: form.childId.trim() });
        if (result.success) {
            navigate('/dashboard');
        } else {
            if (result.error === 'email_exists') setError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already exists');
            else if (result.error === 'child_not_found') setError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found');
        }
    };

    const stepLabels = isArabic
        ? ['كود الطفل', 'الاسم', 'البريد', 'كلمة المرور', 'الهاتف', 'مراجعة']
        : ['Child Code', 'Name', 'Email', 'Password', 'Phone', 'Review'];

    const strength = passwordStrength();

    const renderStep = () => {
        switch (step) {
            case 0: // Child Code
                return (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 56 }}>🔗</div>
                            <h2 style={{ color: text, fontSize: 22, fontWeight: 700, margin: '12px 0 4px' }}>{isArabic ? 'ربط حسابك بالطفل' : 'Link to Your Child'}</h2>
                            <p style={{ color: '#999', fontSize: 13 }}>{isArabic ? 'أدخل كود الطفل الذي تريد متابعته' : 'Enter the child code you want to monitor'}</p>
                        </div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 6, display: 'block' }}>🆔 {isArabic ? 'كود الطفل' : 'Child Code'}</label>
                        <input
                            value={form.childId}
                            onChange={e => set('childId', e.target.value.toUpperCase())}
                            placeholder="LN-XXXXXX"
                            maxLength={9}
                            style={{ ...inputStyle, textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: 3, fontFamily: 'monospace' }}
                        />
                        <div style={{ textAlign: 'center', marginTop: 6 }}>
                            <span style={{ fontSize: 11, color: '#B8A9E8' }}>{isArabic ? 'الكود موجود في حساب الطفل' : 'The code is in the child\'s profile'}</span>
                        </div>
                        {linkedChild && (
                            <div style={{ marginTop: 16, padding: 14, background: 'rgba(139,201,154,0.1)', borderRadius: 16, border: '1px solid rgba(139,201,154,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 28 }}>{linkedChild.avatar}</span>
                                <div>
                                    <div style={{ fontWeight: 700, color: text }}>{linkedChild.name}</div>
                                    <div style={{ fontSize: 12, color: '#8BC99A' }}>{linkedChild.age} {isArabic ? 'سنوات' : 'years'} • {linkedChild.gender}</div>
                                </div>
                                <span style={{ marginInlineStart: 'auto', color: '#8BC99A', fontSize: 20 }}>✓</span>
                            </div>
                        )}
                    </div>
                );
            case 1: // Name
                return (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 56 }}>👤</div>
                            <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'ما اسمك؟' : "What's your name?"}</h2>
                        </div>
                        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder={isArabic ? 'الاسم الكامل' : 'Full Name'} style={inputStyle} autoFocus />
                    </div>
                );
            case 2: // Email
                return (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 56 }}>📧</div>
                            <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'بريدك الإلكتروني' : 'Your Email'}</h2>
                        </div>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} autoFocus />
                    </div>
                );
            case 3: // Password
                return (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 56 }}>🔒</div>
                            <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'كلمة المرور' : 'Create Password'}</h2>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter password'} style={inputStyle} autoFocus />
                            <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: isArabic ? 'auto' : 14, left: isArabic ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</button>
                        </div>
                        {form.password && (
                            <div style={{ marginTop: 8 }}>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: strength.level >= i ? strength.color : isDark ? '#333' : '#eee' }} />
                                    ))}
                                </div>
                                <span style={{ fontSize: 12, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                            </div>
                        )}
                    </div>
                );
            case 4: // Phone
                return (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 56 }}>📱</div>
                            <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'رقم الهاتف' : 'Phone Number'}</h2>
                            <p style={{ color: '#999', fontSize: 13 }}>{isArabic ? '(اختياري)' : '(Optional)'}</p>
                        </div>
                        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={isArabic ? '01xxxxxxxxx' : '01xxxxxxxxx'} style={inputStyle} autoFocus />
                    </div>
                );
            case 5: // Review
                return (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 56 }}>✅</div>
                            <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'مراجعة البيانات' : 'Review Details'}</h2>
                        </div>
                        <div style={{ background: isDark ? '#16213E' : '#f5f3ff', borderRadius: 16, padding: 16 }}>
                            {[
                                { label: isArabic ? 'كود الطفل' : 'Child Code', value: form.childId, emoji: '🆔' },
                                { label: isArabic ? 'الطفل المرتبط' : 'Linked Child', value: linkedChild?.name || '—', emoji: linkedChild?.avatar || '👶' },
                                { label: isArabic ? 'اسمك' : 'Your Name', value: form.name, emoji: '👤' },
                                { label: isArabic ? 'البريد' : 'Email', value: form.email, emoji: '📧' },
                                { label: isArabic ? 'الهاتف' : 'Phone', value: form.phone || (isArabic ? 'لم يُحدد' : 'Not set'), emoji: '📱' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${isDark ? '#333' : '#e8e8f0'}` }}>
                                    <span style={{ fontSize: 20 }}>{item.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, color: '#999' }}>{item.label}</div>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr', padding: 16 }}>
            <div style={{ background: cardBg, borderRadius: 32, padding: '32px 28px', boxShadow: '0 8px 40px rgba(108,99,255,0.12)', maxWidth: 440, width: '100%', animation: 'fadeSlideUp 0.4s ease-out' }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                    {stepLabels.map((_, i) => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? accent : isDark ? '#333' : '#eee', transition: 'background 0.3s' }} />
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{step + 1}/{stepLabels.length} — {stepLabels[step]}</span>
                </div>

                {/* Step Content */}
                {renderStep()}

                {/* Error */}
                {error && <div style={{ background: 'rgba(255,101,132,0.1)', borderRadius: 12, padding: '10px 14px', marginTop: 12 }}><span style={{ color: '#FF6584', fontSize: 13, fontWeight: 600 }}>⚠️ {error}</span></div>}

                {/* Nav Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    {step > 0 && (
                        <button onClick={prevStep} style={{ flex: 1, padding: 14, borderRadius: 16, border: `1.5px solid ${isDark ? '#444' : '#ddd'}`, background: 'transparent', color: text, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>← {isArabic ? 'رجوع' : 'Back'}</button>
                    )}
                    {step < 5 ? (
                        <button onClick={nextStep} style={{ flex: 1, padding: 14, borderRadius: 16, border: 'none', background: accent, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>{isArabic ? 'التالي →' : 'Next →'}</button>
                    ) : (
                        <button onClick={handleSubmit} style={{ flex: 1, padding: 14, borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #4ECDC4, #8BC99A)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>🎉 {isArabic ? 'إنشاء الحساب' : 'Create Account'}</button>
                    )}
                </div>

                {/* Login Link */}
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <span style={{ color: '#999', fontSize: 13 }}>{isArabic ? 'عندك حساب؟ ' : 'Already have an account? '}</span>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>{isArabic ? 'سجل دخول' : 'Log In'}</button>
                </div>

                {/* Back to Home */}
                <button onClick={() => navigate('/')} style={{ width: '100%', padding: 12, marginTop: 10, borderRadius: 14, background: 'transparent', border: `1px solid ${isDark ? '#444' : '#ddd'}`, color: text, cursor: 'pointer', fontSize: 14 }}>← {isArabic ? 'الرئيسية' : 'Home'}</button>
            </div>
        </div>
    );
}
