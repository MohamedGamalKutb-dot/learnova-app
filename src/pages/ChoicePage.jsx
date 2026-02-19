import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ChoicePage() {
    const navigate = useNavigate();
    const { isDark, isArabic, toggleTheme, toggleLanguage } = useApp();

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const text = isDark ? '#E0E0E0' : '#2D3436';

    return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${isDark ? '#1A1A2E' : '#F7F9FC'} 0%, ${isDark ? '#16213E' : '#EDE7F6'} 100%)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Toggle Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', padding: '16px 20px', gap: 10 }}>
                <button onClick={toggleTheme} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer', background: isDark ? '#1F2940' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {isDark ? '☀️' : '🌙'}
                </button>
                <button onClick={toggleLanguage} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: 'pointer', background: isDark ? '#1F2940' : '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {isArabic ? '🇬🇧' : '🇪🇬'}
                </button>
            </div>

            {/* Title */}
            <div style={{ marginTop: 80, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24, color: text }}>{isArabic ? 'مرحباً في' : 'Welcome to'}</span>
                    <span style={{ fontSize: 39, fontWeight: 800, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LearnNeur</span>
                </div>
                <p style={{ color: isDark ? '#aaa' : '#666', fontSize: 16, marginTop: 8 }}>
                    {isArabic ? 'اختر طريقة الاستخدام' : 'Choose how to continue'}
                </p>
            </div>

            {/* Choice Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 40, padding: '0 20px', maxWidth: 700, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Child */}
                <button
                    onClick={() => navigate('/child-login')}
                    style={{
                        flex: '1 1 180px', maxWidth: 220, padding: '32px 16px', borderRadius: 28, border: '2px solid rgba(255,101,132,0.3)',
                        background: isDark ? 'linear-gradient(135deg, rgba(255,101,132,0.15), rgba(255,101,132,0.05))' : 'linear-gradient(135deg, rgba(255,101,132,0.1), rgba(255,101,132,0.03))',
                        cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,101,132,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <div style={{ fontSize: 48, marginBottom: 10 }}>🎮</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 4 }}>{isArabic ? 'الطفل' : 'Child'}</div>
                    <div style={{ fontSize: 12, color: isDark ? '#aaa' : '#888' }}>{isArabic ? 'التعلم واللعب' : 'Learn & Play'}</div>
                </button>

                {/* Parent */}
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        flex: '1 1 180px', maxWidth: 220, padding: '32px 16px', borderRadius: 28, border: '2px solid rgba(78,205,196,0.3)',
                        background: isDark ? 'linear-gradient(135deg, rgba(78,205,196,0.15), rgba(78,205,196,0.05))' : 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(78,205,196,0.03))',
                        cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(78,205,196,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <div style={{ fontSize: 48, marginBottom: 10 }}>👨‍👩‍👧</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 4 }}>{isArabic ? 'ولي الأمر' : 'Parent'}</div>
                    <div style={{ fontSize: 12, color: isDark ? '#aaa' : '#888' }}>{isArabic ? 'متابعة ولوحة التحكم' : 'Track & Dashboard'}</div>
                </button>

                {/* Doctor */}
                <button
                    onClick={() => navigate('/doctor-auth')}
                    style={{
                        flex: '1 1 180px', maxWidth: 220, padding: '32px 16px', borderRadius: 28, border: '2px solid rgba(108,99,255,0.3)',
                        background: isDark ? 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))' : 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(108,99,255,0.03))',
                        cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,99,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <div style={{ fontSize: 48, marginBottom: 10 }}>🩺</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 4 }}>{isArabic ? 'الطبيب' : 'Doctor'}</div>
                    <div style={{ fontSize: 12, color: isDark ? '#aaa' : '#888' }}>{isArabic ? 'أخصائي التوحد' : 'Autism Specialist'}</div>
                </button>
            </div>
        </div>
    );
}
