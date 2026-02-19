import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import AutismSupportBot from '../components/AutismSupportBot';

const modules = [
    { key: 'pecs', emoji: '🗣️', color: '#6C63FF', gradient: ['#6C63FF', '#8B83FF'], path: '/pecs' },
    { key: 'routine', emoji: '📅', color: '#8BC99A', gradient: ['#8BC99A', '#A8E6CF'], path: '/routine' },
    { key: 'emotions', emoji: '😊', color: '#7EB6D8', gradient: ['#7EB6D8', '#A8D8EA'], path: '/emotions' },
    { key: 'calming', emoji: '🧘', color: '#B8A9E8', gradient: ['#B8A9E8', '#D4C5F9'], path: '/calming' },
    { key: 'bot', emoji: '🤖', color: '#FF6584', gradient: ['#FF6584', '#FF8FA3'], path: 'modal' }, // New Bot Module
    { key: 'profile', emoji: '👤', color: '#F5C7A9', gradient: ['#F5C7A9', '#F9DCC4'], path: '/profile' },
];

const labels = {
    pecs: { en: 'PECS Communication', ar: 'التواصل بالصور' },
    routine: { en: 'Daily Routine', ar: 'الروتين اليومي' },
    emotions: { en: 'Emotions', ar: 'المشاعر' },
    calming: { en: 'Calming Zone', ar: 'منطقة الهدوء' },
    bot: { en: 'My Robot Friend', ar: 'صديقي الروبوت' },
    profile: { en: 'Profile', ar: 'الملف الشخصي' },
};

export default function ChildHomePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();
    const { currentChild, logoutChild } = useAuth();
    const [showBot, setShowBot] = useState(false);

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const text = isDark ? '#E0E0E0' : '#2D3436';

    // Redirect if not logged in
    if (!currentChild) {
        return (
            <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr' }}>
                <div style={{ textAlign: 'center', padding: 32 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
                    <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                    <button onClick={() => navigate('/child-login')} style={{ marginTop: 16, padding: '14px 32px', borderRadius: 16, background: '#6C63FF', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>{isArabic ? 'تسجيل الدخول' : 'Log In'}</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: 16, color: isDark ? '#999' : '#666' }}>{isArabic ? `مرحباً ${currentChild.name}! 👋` : `Hello ${currentChild.name}! 👋`}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 2 }}>LearnNeur</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={toggleTheme} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer', background: isDark ? '#1F2940' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <button onClick={toggleLanguage} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer', background: isDark ? '#1F2940' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isArabic ? '🇬🇧' : '🇪🇬'}
                    </button>
                </div>
            </div>

            {/* Quick Calming Banner */}
            <div style={{ margin: '20px 24px', padding: '14px 20px', borderRadius: 18, background: `linear-gradient(135deg, rgba(184,169,232,0.3), rgba(126,182,216,0.2))`, border: '1px solid rgba(184,169,232,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => navigate('/calming')}>
                <span style={{ fontSize: 28 }}>🧘</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: text }}>{isArabic ? 'هل تحتاج استراحة؟' : 'Need a break?'}</div>
                    <div style={{ fontSize: 12, color: isDark ? '#999' : '#666' }}>{isArabic ? 'اضغط لوضع الهدوء' : 'Tap for Calming Mode'}</div>
                </div>
                <span style={{ color: '#B8A9E8', fontSize: 18 }}>→</span>
            </div>

            {/* Module Grid */}
            <div style={{ padding: '0 20px 32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {modules.map((mod, i) => (
                    <button
                        key={mod.key}
                        onClick={() => mod.path === 'modal' ? setShowBot(true) : navigate(mod.path)}
                        style={{
                            padding: '24px 16px', borderRadius: 28, border: `1.5px solid ${mod.color}40`, cursor: 'pointer',
                            background: isDark
                                ? `linear-gradient(135deg, ${mod.gradient[0]}40, ${mod.gradient[1]}26)`
                                : `linear-gradient(135deg, ${mod.gradient[0]}26, ${mod.gradient[1]}14)`,
                            boxShadow: `0 4px 12px ${mod.color}26`, transition: 'all 0.3s',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', aspectRatio: '1',
                            justifyContent: 'center',
                            animation: `fadeInScale 0.4s ease-out ${i * 0.1}s both`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 8px 24px ${mod.color}40`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 12px ${mod.color}26`; }}
                    >
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${mod.gradient[0]}, ${mod.gradient[1]})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 4px 12px ${mod.color}4D`, marginBottom: 14,
                        }}>
                            <span style={{ fontSize: 36 }}>{mod.emoji}</span>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: text, textAlign: 'center' }}>
                            {isArabic ? labels[mod.key].ar : labels[mod.key].en}
                        </span>
                    </button>
                ))}
            </div>

            {/* Child Bot Modal */}
            {showBot && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(5px)', padding: 20
                }} onClick={() => setShowBot(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{ width: '100%', maxWidth: 500, animation: 'fadeInScale 0.3s ease-out', position: 'relative' }}
                    >
                        <button
                            onClick={() => setShowBot(false)}
                            style={{
                                position: 'absolute', top: -15, right: -10,
                                width: 40, height: 40, borderRadius: '50%', background: '#FF6584',
                                color: '#fff', border: '2px solid #fff', fontSize: 18,
                                cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                        >✕</button>
                        <AutismSupportBot mode="child" />
                    </div>
                </div>
            )}
        </div>
    );
}
