import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function ChoicePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { registerChild, loginChild, registerParent, loginParent, registerDoctor, loginDoctor, getChildById } = useAuth();
    const [hoveredCard, setHoveredCard] = useState(null);

    const [activeModal, setActiveModal] = useState(null);
    const [modalMode, setModalMode] = useState('signup');
    const [quickForm, setQuickForm] = useState({ email: '', password: '', name: '', childId: '', phone: '' });
    const [quickError, setQuickError] = useState('');
    const [quickLoading, setQuickLoading] = useState(false);
    const [quickSuccess, setQuickSuccess] = useState(null);

    const [googleStep, setGoogleStep] = useState(0);
    const [googleEmail, setGoogleEmail] = useState('');
    const [googlePassword, setGooglePassword] = useState('');
    const [googleError, setGoogleError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleChildId, setGoogleChildId] = useState('');

    const GoogleIcon = () => (
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    );

    const inputCls = `w-full py-[13px] px-4 rounded-xl text-sm border-[1.5px] outline-none transition-all duration-300 box-border font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`;
    const labelCls = `text-xs font-semibold mb-1.5 block ${isDark ? 'text-subtext-dark' : 'text-subtext'}`;

    const resetModal = () => { setActiveModal(null); setModalMode('signup'); setQuickForm({ email: '', password: '', name: '', childId: '', phone: '' }); setQuickError(''); setQuickLoading(false); setQuickSuccess(null); setGoogleStep(0); setGoogleEmail(''); setGooglePassword(''); setGoogleError(''); setGoogleLoading(false); setGoogleChildId(''); };
    const openModal = (roleId) => { setQuickForm({ email: '', password: '', name: '', childId: '', phone: '' }); setQuickError(''); setQuickSuccess(null); setModalMode('signup'); setActiveModal(roleId); };

    const handleQuickSubmit = () => {
        setQuickError(''); setQuickLoading(true);
        const { email, password, name, childId, phone } = quickForm;
        if (!email.trim() || !email.includes('@')) { setQuickError(isArabic ? 'أدخل إيميل صحيح' : 'Enter a valid email'); setQuickLoading(false); return; }
        if (!password || password.length < 6) { setQuickError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); setQuickLoading(false); return; }
        if (modalMode === 'login') {
            let result;
            if (activeModal === 'child') { result = loginChild(email.trim(), password); if (result.success) { navigate('/child-home'); return; } }
            else if (activeModal === 'parent') { result = loginParent(email.trim(), password); if (result.success) { navigate('/dashboard'); return; } }
            else if (activeModal === 'doctor') { result = loginDoctor(email.trim(), password); if (result.success) { navigate('/doctor-dashboard'); return; } }
            if (result) { if (result.error === 'not_found') setQuickError(isArabic ? 'الإيميل غير مسجل' : 'Email not found'); else if (result.error === 'wrong_password') setQuickError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password'); }
            setQuickLoading(false); return;
        }
        if (!name.trim()) { setQuickError(isArabic ? 'أدخل الاسم' : 'Enter your name'); setQuickLoading(false); return; }
        if (activeModal === 'child') {
            const result = registerChild({ name: name.trim(), age: 8, email: email.trim(), password, gender: 'Male', avatar: '👦' });
            if (result.success) setQuickSuccess({ childId: result.childId });
            else if (result.error === 'email_exists') setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        } else if (activeModal === 'parent') {
            if (!childId.trim()) { setQuickError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)'); setQuickLoading(false); return; }
            const child = getChildById(childId.trim());
            if (!child) { setQuickError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found'); setQuickLoading(false); return; }
            const result = registerParent({ name: name.trim(), email: email.trim(), password, phone: phone.trim(), childId: childId.trim() });
            if (result.success) { navigate('/dashboard'); return; }
            else if (result.error === 'email_exists') setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        } else if (activeModal === 'doctor') {
            const result = registerDoctor({ name: name.trim(), email: email.trim(), password, phone: phone.trim(), age: '', gender: 'Male' });
            if (result.success) { navigate('/doctor-dashboard'); return; }
            else if (result.error === 'email_exists') setQuickError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
        }
        setQuickLoading(false);
    };

    const roles = [
        { id: 'child', icon: '🎮', title: isArabic ? 'الطفل' : 'Child', subtitle: isArabic ? 'منطقة التعلم واللعب' : 'Learning & Play Zone', description: isArabic ? 'مساحة آمنة وممتعة مليانة ألعاب تعليمية، تواصل بالصور، تعرف على المشاعر، وصديق روبوت ذكي!' : 'A safe and fun space full of educational games, picture communication, emotion learning, and a smart robot friend!', features: isArabic ? ['🗣️ تواصل بالصور PECS', '😊 ألعاب المشاعر', '📅 روتيني اليومي', '🤖 صاحبي الروبوت'] : ['🗣️ PECS Communication', '😊 Emotion Games', '📅 My Daily Routine', '🤖 Robot Buddy'], gradient: 'linear-gradient(135deg, #FF6584, #FF8E9E)', shadowColor: 'rgba(255,101,132,0.35)', borderColor: '#FF6584', btnText: isArabic ? 'سجل بالإيميل' : 'Sign Up with Email', loginPath: '/child-login' },
        { id: 'parent', icon: '👨‍👩‍👧', title: isArabic ? 'ولي الأمر' : 'Parent', subtitle: isArabic ? 'لوحة المتابعة والتحكم' : 'Dashboard & Tracking', description: isArabic ? 'تابع تقدم طفلك لحظة بلحظة، احصل على نصائح من الذكاء الاصطناعي، وتواصل مع أطباء متخصصين.' : "Track your child's progress in real-time, get AI-powered advice, and connect with specialized doctors.", features: isArabic ? ['📊 لوحة تحكم ذكية', '🤖 مساعد AI للتوحد', '🗺️ خريطة المراكز', '📝 تقارير يومية'] : ['📊 Smart Dashboard', '🤖 AI Autism Assistant', '🗺️ Centers Map', '📝 Daily Reports'], gradient: 'linear-gradient(135deg, #4ECDC4, #44B09E)', shadowColor: 'rgba(78,205,196,0.35)', borderColor: '#4ECDC4', btnText: isArabic ? 'سجل بالإيميل' : 'Sign Up with Email', loginPath: '/login' },
        { id: 'doctor', icon: '🩺', title: isArabic ? 'الطبيب' : 'Doctor', subtitle: isArabic ? 'إدارة الحالات والتقارير' : 'Case Management & Reports', description: isArabic ? 'أدر حالات مرضاك بكفاءة، اكتب تقارير مفصلة، وتواصل مع أولياء الأمور بسهولة.' : "Efficiently manage your patients' cases, write detailed reports, and easily communicate with parents.", features: isArabic ? ['👥 إدارة المرضى', '📋 تقارير طبية', '💬 تواصل مع الأهل', '📈 متابعة التقدم'] : ['👥 Patient Management', '📋 Medical Reports', '💬 Parent Communication', '📈 Progress Tracking'], gradient: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', shadowColor: 'rgba(108,99,255,0.35)', borderColor: '#6C63FF', btnText: isArabic ? 'سجل بالإيميل' : 'Sign Up with Email', loginPath: '/doctor-auth' },
    ];

    const getModalConfig = () => {
        switch (activeModal) {
            case 'child': return { title: isArabic ? '🎮 تسجيل الطفل' : '🎮 Child Sign Up', loginTitle: isArabic ? '🎮 دخول الطفل' : '🎮 Child Log In', gradient: 'linear-gradient(135deg, #FF6584, #FF8E9E)', accent: '#FF6584', shadowColor: 'rgba(255,101,132,0.35)', namePlaceholder: isArabic ? 'اسم الطفل' : "Child's name", showChildId: false, showPhone: false };
            case 'parent': return { title: isArabic ? '👨‍👩‍👧 تسجيل ولي الأمر' : '👨‍👩‍👧 Parent Sign Up', loginTitle: isArabic ? '👨‍👩‍👧 دخول ولي الأمر' : '👨‍👩‍👧 Parent Log In', gradient: 'linear-gradient(135deg, #4ECDC4, #44B09E)', accent: '#4ECDC4', shadowColor: 'rgba(78,205,196,0.35)', namePlaceholder: isArabic ? 'اسم ولي الأمر' : 'Parent name', showChildId: true, showPhone: true };
            case 'doctor': return { title: isArabic ? '🩺 تسجيل الطبيب' : '🩺 Doctor Sign Up', loginTitle: isArabic ? '🩺 دخول الطبيب' : '🩺 Doctor Log In', gradient: 'linear-gradient(135deg, #6C63FF, #8B5CF6)', accent: '#6C63FF', shadowColor: 'rgba(108,99,255,0.35)', namePlaceholder: isArabic ? 'اسم الطبيب' : 'Doctor name', showChildId: false, showPhone: true };
            default: return null;
        }
    };

    const renderModal = () => {
        if (!activeModal) return null;
        const config = getModalConfig();
        if (!config) return null;

        if (quickSuccess) {
            return (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-lg" style={{ animation: 'modalFadeIn 0.3s ease-out' }} onClick={resetModal}>
                    <div className={`rounded-[28px] py-9 px-8 max-w-[420px] w-[90%] text-center border shadow-[0_25px_60px_rgba(0,0,0,0.3)] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}
                        style={{ animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                        <div className="text-[64px] mb-3">🎉</div>
                        <h2 className={`text-2xl font-extrabold mb-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'تم التسجيل بنجاح!' : 'Registration Successful!'}</h2>
                        <p className={`text-sm mb-5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'ده كود الطفل الخاص بيك. احتفظ بيه!' : 'This is your unique child code. Keep it safe!'}</p>
                        <div className="py-4 px-7 rounded-2xl inline-block mb-5" style={{ background: config.gradient }}>
                            <div className="text-[10px] text-white/70 mb-1 font-bold uppercase tracking-wider">{isArabic ? 'كود الطفل' : 'CHILD CODE'}</div>
                            <div className="text-[32px] font-black text-white tracking-[4px] font-mono">{quickSuccess.childId}</div>
                        </div>
                        <div className={`rounded-xl p-3 mb-4 border text-start ${isDark ? 'bg-[#1C2333] border-[#2D333B]' : 'bg-amber-50 border-amber-200'}`}>
                            <p className={`text-xs font-semibold m-0 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>⚠️ {isArabic ? 'مهم: شارك الكود مع ولي أمرك!' : 'Important: Share this code with your parent!'}</p>
                        </div>
                        <button onClick={() => navigator.clipboard?.writeText(quickSuccess.childId)} className={`w-full py-[13px] rounded-xl bg-transparent font-semibold text-sm mb-2.5 transition-all duration-200 font-[inherit] border ${isDark ? 'text-text-dark border-border-dark' : 'text-text border-border'}`}>📋 {isArabic ? 'نسخ الكود' : 'Copy Code'}</button>
                        <button onClick={() => { resetModal(); navigate('/child-home'); }} className="w-full py-3.5 rounded-xl border-none cursor-pointer text-white font-bold text-base font-[inherit]" style={{ background: config.gradient, boxShadow: `0 4px 16px ${config.shadowColor}` }}>🚀 {isArabic ? 'ابدأ التعلم!' : 'Start Learning!'}</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-lg" style={{ animation: 'modalFadeIn 0.3s ease-out' }} onClick={resetModal}>
                <div className={`rounded-[28px] overflow-hidden max-w-[440px] w-[90%] border shadow-[0_25px_60px_rgba(0,0,0,0.3)] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`} style={{ animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="py-7 px-7 text-center relative" style={{ background: config.gradient }}>
                        <button onClick={resetModal} className="absolute top-3.5 end-3.5 bg-white/20 border-none text-white w-8 h-8 rounded-[10px] cursor-pointer text-base flex items-center justify-center backdrop-blur-lg">✕</button>
                        <h2 className="text-white text-[22px] font-extrabold m-0">{modalMode === 'login' ? config.loginTitle : config.title}</h2>
                        <p className="text-white/80 text-[13px] mt-1.5 mb-0">{modalMode === 'login' ? (isArabic ? 'سجل دخولك بالإيميل وكلمة المرور' : 'Log in with your email and password') : (isArabic ? 'سجل بسرعة بالإيميل بتاعك' : 'Quick sign up with your email')}</p>
                    </div>
                    {/* Modal Body */}
                    <div className="py-6 px-7">
                        <div className={`flex gap-1 mb-5 p-1 rounded-[14px] ${isDark ? 'bg-bg-dark' : 'bg-gray-100'}`}>
                            {['signup', 'login'].map(m => (
                                <button key={m} onClick={() => { setModalMode(m); setQuickError(''); }}
                                    className={`flex-1 py-2.5 rounded-[11px] border-none cursor-pointer font-bold text-[13px] transition-all duration-300 font-[inherit] ${modalMode === m ? 'text-white' : `${isDark ? 'text-subtext-dark' : 'text-subtext'} bg-transparent`}`}
                                    style={modalMode === m ? { background: config.accent } : undefined}>
                                    {m === 'signup' ? (isArabic ? 'حساب جديد' : 'Sign Up') : (isArabic ? 'تسجيل دخول' : 'Log In')}
                                </button>
                            ))}
                        </div>

                        {modalMode === 'signup' && (<div className="mb-3"><label className={labelCls}>👤 {isArabic ? 'الاسم' : 'Name'} *</label><input value={quickForm.name} onChange={e => setQuickForm(p => ({ ...p, name: e.target.value }))} placeholder={config.namePlaceholder} className={inputCls} /></div>)}
                        <div className="mb-3"><label className={labelCls}>📧 {isArabic ? 'البريد الإلكتروني' : 'Email'} *</label><input type="email" value={quickForm.email} onChange={e => setQuickForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" className={inputCls} /></div>
                        <div className="mb-3"><label className={labelCls}>🔒 {isArabic ? 'كلمة المرور' : 'Password'} *</label><input type="password" value={quickForm.password} onChange={e => setQuickForm(p => ({ ...p, password: e.target.value }))} placeholder={isArabic ? '6 أحرف على الأقل' : 'At least 6 characters'} className={inputCls} onKeyDown={e => e.key === 'Enter' && handleQuickSubmit()} /></div>
                        {modalMode === 'signup' && config.showChildId && (<div className="mb-3"><label className={labelCls}>🆔 {isArabic ? 'كود الطفل' : 'Child Code'} *</label><input value={quickForm.childId} onChange={e => setQuickForm(p => ({ ...p, childId: e.target.value.toUpperCase() }))} placeholder="LN-XXXXXX" maxLength={9} className={`${inputCls} font-mono tracking-[2px] !font-bold`} /></div>)}
                        {modalMode === 'signup' && config.showPhone && (<div className="mb-3"><label className={labelCls}>📱 {isArabic ? 'رقم الهاتف' : 'Phone'} ({isArabic ? 'اختياري' : 'Optional'})</label><input type="tel" value={quickForm.phone} onChange={e => setQuickForm(p => ({ ...p, phone: e.target.value }))} placeholder="01xxxxxxxxx" className={inputCls} /></div>)}

                        {quickError && (<div className={`rounded-[10px] py-2.5 px-3.5 mb-3 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`} style={{ animation: 'modalSlideUp 0.2s ease-out' }}><span className="text-red-500 text-[13px] font-semibold">⚠️ {quickError}</span></div>)}

                        <button onClick={handleQuickSubmit} disabled={quickLoading}
                            className={`w-full py-3.5 rounded-[14px] border-none cursor-pointer text-white font-bold text-[15px] mt-1 font-[Inter,'Segoe_UI',sans-serif] transition-all duration-300 hover:-translate-y-0.5 ${quickLoading ? 'opacity-70 cursor-wait' : ''}`}
                            style={{ background: config.gradient, boxShadow: `0 6px 20px ${config.shadowColor}` }}>
                            {quickLoading ? (isArabic ? '⏳ جاري...' : '⏳ Loading...') : modalMode === 'login' ? (isArabic ? '🚀 تسجيل الدخول' : '🚀 Log In') : (isArabic ? '✨ إنشاء حساب' : '✨ Create Account')}
                        </button>

                        <div className="flex items-center gap-3 my-4">
                            <div className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />
                            <span className={`text-xs font-medium ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'أو' : 'OR'}</span>
                            <div className={`flex-1 h-px ${isDark ? 'bg-border-dark' : 'bg-border'}`} />
                        </div>

                        <button onClick={() => { setGoogleStep(1); setGoogleError(''); setGoogleEmail(''); setGooglePassword(''); setGoogleChildId(''); }}
                            className={`w-full py-[13px] rounded-[14px] cursor-pointer font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 font-[Inter,'Segoe_UI',sans-serif] border-[1.5px] hover:border-accent ${isDark ? 'bg-border-dark text-text-dark border-border-dark' : 'bg-white text-text border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)]'}`}>
                            <GoogleIcon />{modalMode === 'login' ? (isArabic ? 'تسجيل الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'التسجيل بجوجل' : 'Sign up with Google')}
                        </button>

                        <div className="text-center mt-4">
                            <button onClick={() => { resetModal(); const role = roles.find(r => r.id === activeModal); if (role) navigate(role.loginPath); }}
                                className={`bg-transparent border-none cursor-pointer text-xs font-[inherit] underline transition-colors duration-200 hover:text-accent ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                                {isArabic ? '← التسجيل بالطريقة الكاملة' : '← Full registration form'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleGoogleSubmit = () => {
        setGoogleError(''); setGoogleLoading(true);
        if (googleStep === 1) {
            if (!googleEmail.trim() || !googleEmail.includes('@')) { setGoogleError(isArabic ? 'أدخل إيميل جوجل صحيح' : 'Enter a valid Google email'); setGoogleLoading(false); return; }
            setTimeout(() => { setGoogleStep(2); setGoogleLoading(false); }, 600); return;
        }
        if (googleStep === 2) {
            if (!googlePassword || googlePassword.length < 6) { setGoogleError(isArabic ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); setGoogleLoading(false); return; }
            const nameFromEmail = googleEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            if (modalMode === 'login') {
                let result;
                if (activeModal === 'child') { result = loginChild(googleEmail.trim(), googlePassword); if (result.success) { resetModal(); navigate('/child-home'); return; } }
                else if (activeModal === 'parent') { result = loginParent(googleEmail.trim(), googlePassword); if (result.success) { resetModal(); navigate('/dashboard'); return; } }
                else if (activeModal === 'doctor') { result = loginDoctor(googleEmail.trim(), googlePassword); if (result.success) { resetModal(); navigate('/doctor-dashboard'); return; } }
                if (result) { if (result.error === 'not_found') setGoogleError(isArabic ? 'الإيميل غير مسجل' : 'Email not found'); else if (result.error === 'wrong_password') setGoogleError(isArabic ? 'كلمة المرور غير صحيحة' : 'Incorrect password'); }
                setGoogleLoading(false); return;
            }
            if (activeModal === 'child') { const result = registerChild({ name: nameFromEmail, age: 8, email: googleEmail.trim(), password: googlePassword, gender: 'Male', avatar: '👦' }); if (result.success) { setQuickSuccess({ childId: result.childId }); setGoogleStep(0); } else if (result.error === 'email_exists') setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered'); }
            else if (activeModal === 'parent') {
                if (!googleChildId.trim()) { setGoogleError(isArabic ? 'أدخل كود الطفل (LN-XXXXXX)' : 'Enter child code (LN-XXXXXX)'); setGoogleLoading(false); return; }
                const child = getChildById(googleChildId.trim()); if (!child) { setGoogleError(isArabic ? 'كود الطفل غير موجود' : 'Child code not found'); setGoogleLoading(false); return; }
                const result = registerParent({ name: nameFromEmail, email: googleEmail.trim(), password: googlePassword, phone: '', childId: googleChildId.trim() });
                if (result.success) { resetModal(); navigate('/dashboard'); return; } else if (result.error === 'email_exists') setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered');
            } else if (activeModal === 'doctor') { const result = registerDoctor({ name: nameFromEmail, email: googleEmail.trim(), password: googlePassword, phone: '', age: '', gender: 'Male' }); if (result.success) { resetModal(); navigate('/doctor-dashboard'); return; } else if (result.error === 'email_exists') setGoogleError(isArabic ? 'هذا الإيميل مسجل بالفعل' : 'Email already registered'); }
            setGoogleLoading(false);
        }
    };

    const renderGoogleModal = () => {
        if (googleStep === 0 || !activeModal) return null;
        const config = getModalConfig(); if (!config) return null;
        const gInputCls = `${inputCls} !border-[${isDark ? '#3D444D' : '#D1D5DB'}] focus:!border-[#4285F4]`;

        return (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-[10px]" style={{ animation: 'modalFadeIn 0.25s ease-out' }} onClick={() => setGoogleStep(0)}>
                <div className={`rounded-3xl max-w-[400px] w-[90%] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.4)] ${isDark ? 'bg-[#1E1E2E]' : 'bg-white'}`} style={{ animation: 'modalSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }} onClick={e => e.stopPropagation()}>
                    <div className={`py-8 px-8 text-center border-b ${isDark ? 'border-[#2D333B]' : 'border-border'}`}>
                        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${isDark ? 'bg-[#2D333B]' : 'bg-gray-100'}`}><GoogleIcon /></div>
                        <h2 className={`m-0 mb-1.5 text-xl font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>{googleStep === 1 ? (isArabic ? 'تسجيل الدخول بجوجل' : 'Sign in with Google') : (isArabic ? 'إنشاء كلمة مرور' : 'Set Your Password')}</h2>
                        <p className={`m-0 text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{googleStep === 1 ? (isArabic ? 'أدخل إيميل جوجل بتاعك' : 'Enter your Google email to continue') : (isArabic ? `مرحباً بك ${googleEmail}` : `Welcome ${googleEmail}`)}</p>
                    </div>
                    <div className="py-6 px-8">
                        {googleStep === 1 && (<><label className={labelCls}>{isArabic ? 'إيميل جوجل' : 'Google Email'}</label><input type="email" value={googleEmail} onChange={e => setGoogleEmail(e.target.value)} placeholder="example@gmail.com" autoFocus className={gInputCls} onKeyDown={e => e.key === 'Enter' && handleGoogleSubmit()} /></>)}
                        {googleStep === 2 && (<>
                            <div className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl mb-4 border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                                <GoogleIcon />
                                <div className="flex-1"><div className={`text-[13px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{googleEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div><div className={`text-[11px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{googleEmail}</div></div>
                                <span className="text-blue-500 text-base">✓</span>
                            </div>
                            <label className={labelCls}>🔒 {isArabic ? 'كلمة المرور للحساب' : 'Account Password'}</label>
                            <input type="password" value={googlePassword} onChange={e => setGooglePassword(e.target.value)} placeholder={isArabic ? '6 أحرف على الأقل' : 'At least 6 characters'} autoFocus className={gInputCls} onKeyDown={e => e.key === 'Enter' && handleGoogleSubmit()} />
                            {modalMode === 'signup' && activeModal === 'parent' && (<div className="mt-3"><label className={labelCls}>🆔 {isArabic ? 'كود الطفل' : 'Child Code'} *</label><input value={googleChildId} onChange={e => setGoogleChildId(e.target.value.toUpperCase())} placeholder="LN-XXXXXX" maxLength={9} className={`${gInputCls} font-mono tracking-[2px] !font-bold`} /></div>)}
                        </>)}
                        {googleError && (<div className={`rounded-[10px] py-2.5 px-3.5 mt-3 border border-red-500/20 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`} style={{ animation: 'modalSlideUp 0.2s ease-out' }}><span className="text-red-500 text-[13px] font-semibold">⚠️ {googleError}</span></div>)}
                        <div className="flex gap-2.5 mt-5">
                            <button onClick={() => { if (googleStep === 2) { setGoogleStep(1); setGoogleError(''); } else setGoogleStep(0); }}
                                className={`flex-1 py-3 rounded-xl bg-transparent cursor-pointer font-semibold text-sm font-[inherit] transition-all duration-200 border hover:bg-gray-100 dark:hover:bg-border-dark ${isDark ? 'border-[#3D444D] text-text-dark' : 'border-gray-300 text-text'}`}>
                                {isArabic ? 'رجوع' : 'Back'}
                            </button>
                            <button onClick={handleGoogleSubmit} disabled={googleLoading}
                                className={`flex-[1.5] py-3 rounded-xl border-none cursor-pointer text-white font-bold text-sm font-[inherit] transition-all duration-300 bg-[#4285F4] shadow-[0_4px_14px_rgba(66,133,244,0.4)] flex items-center justify-center gap-2 hover:bg-[#3367D6] hover:-translate-y-px ${googleLoading ? 'opacity-70 cursor-wait' : ''}`}>
                                {googleLoading ? (isArabic ? '✅ جاري التحقق...' : '✅ Verifying...') : googleStep === 1 ? (isArabic ? 'التالي →' : 'Next →') : modalMode === 'login' ? (isArabic ? 'تسجيل الدخول' : 'Sign In') : (isArabic ? 'إنشاء الحساب' : 'Create Account')}
                            </button>
                        </div>
                        <p className={`text-center text-[11px] mt-4 mb-0 ${isDark ? 'text-[#4D5563]' : 'text-gray-400'}`}>{isArabic ? 'سيتم استخدام إيميل جوجل لإنشاء حسابك تلقائياً' : 'Your Google email will be used to auto-create your account'}</p>
                    </div>
                </div>
            </div>
        );
    };

    const gradientText = "bg-gradient-to-br from-accent to-accent2 bg-clip-text [-webkit-text-fill-color:transparent]";
    const btnCls = `w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-200 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F9FAFB] border-border'}`;

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] flex flex-col items-center px-5 ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}
            style={{ background: isDark ? `radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255,101,132,0.06) 0%, transparent 50%)` : `radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255,101,132,0.04) 0%, transparent 50%)` }}>
            {/* Navbar */}
            <nav className="w-full max-w-[1100px] flex justify-between items-center py-5">
                <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer">
                    <span className="text-[26px]">🧩</span>
                    <span className={`text-xl font-extrabold ${gradientText}`}>LearnNeur</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={toggleTheme} className={`${btnCls} text-lg`}>{isDark ? '☀️' : '🌙'}</button>
                    <button onClick={toggleLanguage} className={`${btnCls} text-sm font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'EN' : 'ع'}</button>
                </div>
            </nav>

            {/* Header */}
            <div className="text-center mt-10 mb-12">
                <div className={`inline-block py-1.5 px-4 rounded-[20px] mb-4 text-[13px] font-semibold text-accent border ${isDark ? 'bg-accent/10 border-accent/20' : 'bg-accent/[0.06] border-accent/[0.15]'}`}>
                    {isArabic ? '👋 مرحباً بك في LearnNeur' : '👋 Welcome to LearnNeur'}
                </div>
                <h1 className={`text-[clamp(28px,4vw,42px)] font-black leading-snug mb-3 ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'اختر طريقة الدخول' : 'Choose Your Role'}</h1>
                <p className={`text-base max-w-[500px] mx-auto ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'اضغط على الدور المناسب وسجّل بالإيميل فوراً' : 'Click your role and sign up instantly with your email'}</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 w-full max-w-[1100px] mb-[60px]">
                {roles.map((role) => {
                    const isHovered = hoveredCard === role.id;
                    return (
                        <div key={role.id} onMouseEnter={() => setHoveredCard(role.id)} onMouseLeave={() => setHoveredCard(null)} onClick={() => openModal(role.id)}
                            className={`rounded-3xl overflow-hidden cursor-pointer relative transition-all duration-400 ${isDark ? 'bg-card-dark' : 'bg-card'}`}
                            style={{
                                border: `1px solid ${isHovered ? `${role.borderColor}50` : (isDark ? '#21262D' : '#E5E7EB')}`,
                                boxShadow: isHovered ? `0 20px 60px ${role.shadowColor}` : (isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.04)'),
                                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                            }}>
                            <div className="h-1 w-full transition-opacity duration-300" style={{ background: role.gradient, opacity: isHovered ? 1 : 0.5 }} />
                            <div className="py-7 px-7 pb-6">
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center text-[30px] transition-transform duration-400"
                                        style={{ background: role.gradient, boxShadow: `0 8px 24px ${role.shadowColor}`, transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1)' }}>{role.icon}</div>
                                    <div>
                                        <h2 className={`m-0 text-[22px] font-extrabold ${isDark ? 'text-text-dark' : 'text-text'}`}>{role.title}</h2>
                                        <p className="m-0 text-[13px] font-semibold" style={{ color: role.borderColor }}>{role.subtitle}</p>
                                    </div>
                                </div>
                                <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{role.description}</p>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {role.features.map((f, i) => (
                                        <div key={i} className={`py-2 px-3 rounded-[10px] text-xs font-medium border ${isDark ? 'text-text-dark' : 'text-text'}`}
                                            style={{ background: isDark ? `${role.borderColor}10` : `${role.borderColor}08`, border: `1px solid ${isDark ? `${role.borderColor}15` : `${role.borderColor}12`}` }}>{f}</div>
                                    ))}
                                </div>
                                <button className={`w-full py-3.5 px-6 rounded-[14px] cursor-pointer font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}
                                    style={{
                                        background: isHovered ? role.gradient : (isDark ? '#21262D' : '#F3F4F6'),
                                        color: isHovered ? '#fff' : undefined,
                                        border: isHovered ? 'none' : `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
                                        boxShadow: isHovered ? `0 6px 20px ${role.shadowColor}` : 'none',
                                    }}>
                                    📧 {role.btnText}
                                    <span className="text-lg transition-transform duration-300" style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)' }}>→</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Help */}
            <div className={`max-w-[1100px] w-full mb-10 py-6 px-7 rounded-[20px] flex items-center gap-4 flex-wrap justify-between border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-[#F8F5FF] border-border'}`}>
                <div className="flex items-center gap-3">
                    <span className="text-[32px]">🤔</span>
                    <div>
                        <div className={`font-bold text-[15px] ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'مش متأكد تبدأ منين؟' : 'Not sure where to start?'}</div>
                        <div className={`text-[13px] ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'اضغط على أي كارد وسجل بالإيميل على طول! لو ولي أمر هتحتاج كود الطفل' : 'Click any card and sign up with your email instantly! Parents will need the child code'}</div>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className={`py-2.5 px-5 rounded-xl bg-transparent border cursor-pointer font-semibold text-[13px] transition-all duration-200 whitespace-nowrap hover:border-accent hover:text-accent ${isDark ? 'border-[#30363D] text-subtext-dark' : 'border-gray-300 text-subtext'}`}>
                    ← {isArabic ? 'الرجوع للرئيسية' : 'Back to Home'}
                </button>
            </div>

            {/* Footer */}
            <div className="py-5 pb-[30px] text-center">
                <p className={`text-xs ${isDark ? 'text-[#30363D]' : 'text-gray-300'}`}>© 2026 LearnNeur • {isArabic ? 'منصة دعم أطفال التوحد' : 'Autism Support Platform'}</p>
            </div>

            {renderModal()}
            {renderGoogleModal()}

            <style>{`
                @keyframes modalFadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes modalSlideUp { from { opacity:0; transform:translateY(30px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
            `}</style>
        </div>
    );
}
