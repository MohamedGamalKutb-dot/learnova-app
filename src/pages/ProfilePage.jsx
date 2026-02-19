import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const { currentChild, updateChildProfile, logoutChild } = useAuth();

    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    const bg = isDark ? '#1A1A2E' : '#F7F9FC';
    const cardBg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = '#6C63FF';

    // If not logged in
    if (!currentChild) {
        return (
            <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: isArabic ? 'rtl' : 'ltr' }}>
                <div style={{ textAlign: 'center', padding: 32 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
                    <h2 style={{ color: text, fontSize: 22, fontWeight: 700 }}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                    <button onClick={() => navigate('/child-login')} style={{ marginTop: 16, padding: '14px 32px', borderRadius: 16, background: accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>{isArabic ? 'تسجيل الدخول' : 'Log In'}</button>
                </div>
            </div>
        );
    }

    const child = currentChild;

    const startEdit = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue || '');
    };

    const saveEdit = () => {
        if (editingField && editValue !== undefined) {
            updateChildProfile({ [editingField]: editingField === 'age' ? parseInt(editValue) : editValue });
        }
        setEditingField(null);
        setEditValue('');
    };

    const togglePref = (pref) => {
        const prefs = child.sensoryPreferences || [];
        const updated = prefs.includes(pref) ? prefs.filter(p => p !== pref) : [...prefs, pref];
        updateChildProfile({ sensoryPreferences: updated });
    };

    const sensoryOptions = [
        { key: 'light_sensitive', label: isArabic ? 'حساسية للضوء' : 'Light Sensitive', emoji: '💡' },
        { key: 'sound_sensitive', label: isArabic ? 'حساسية للصوت' : 'Sound Sensitive', emoji: '🔊' },
        { key: 'touch_sensitive', label: isArabic ? 'حساسية للمس' : 'Touch Sensitive', emoji: '✋' },
        { key: 'visual_stimming', label: isArabic ? 'تحفيز بصري' : 'Visual Stimming', emoji: '👀' },
        { key: 'movement_seeking', label: isArabic ? 'يحب الحركة' : 'Movement Seeking', emoji: '🏃' },
        { key: 'calm_environment', label: isArabic ? 'يحب الهدوء' : 'Prefers Calm', emoji: '🧘' },
    ];

    const handleLogout = () => {
        logoutChild();
        navigate('/');
    };

    return (
        <div style={{ minHeight: '100vh', background: bg, direction: isArabic ? 'rtl' : 'ltr', paddingBottom: 40 }}>
            {/* AppBar */}
            <div style={{ background: isDark ? '#16213E' : 'linear-gradient(135deg, #B8A9E8, #6C63FF)', color: '#fff', padding: '16px 20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
                <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, margin: 0 }}>{isArabic ? 'الملف الشخصي' : 'Profile'}</h1>
                <button onClick={handleLogout} title={isArabic ? 'تسجيل خروج' : 'Logout'} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>🚪</button>
            </div>

            <div style={{ padding: 16, maxWidth: 500, margin: '0 auto' }}>
                {/* Avatar & Child ID */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div onClick={() => setShowAvatarPicker(true)} style={{
                        width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px',
                        background: `linear-gradient(135deg, ${accent}, #FF6584)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 52, cursor: 'pointer', boxShadow: '0 6px 20px rgba(108,99,255,0.25)',
                        transition: 'transform 0.3s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >{child.avatar}</div>
                    <h2 style={{ color: text, fontSize: 24, fontWeight: 700, margin: 0 }}>{child.name}</h2>

                    {/* Child ID Badge */}
                    <div style={{
                        display: 'inline-block', marginTop: 8, padding: '6px 18px', borderRadius: 14,
                        background: `linear-gradient(135deg, ${accent}30, #FF658420)`,
                        border: `1px solid ${accent}40`,
                    }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: accent, letterSpacing: 2 }}>{child.childId}</span>
                    </div>
                    <p style={{ color: '#999', fontSize: 12, marginTop: 4 }}>{isArabic ? 'كود الطفل الخاص' : 'Your unique child code'}</p>
                </div>

                {/* Avatar Picker Modal */}
                {showAvatarPicker && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowAvatarPicker(false)}>
                        <div onClick={e => e.stopPropagation()} style={{ background: cardBg, borderRadius: 24, padding: 24, width: '85%', maxWidth: 360 }}>
                            <h3 style={{ color: text, textAlign: 'center', marginBottom: 16 }}>{isArabic ? 'اختر صورتك' : 'Choose Avatar'}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                                {['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰', '🦁', '🐸', '🦄', '🐼'].map(em => (
                                    <button key={em} onClick={() => { updateChildProfile({ avatar: em }); setShowAvatarPicker(false); }} style={{
                                        width: 60, height: 60, borderRadius: '50%', fontSize: 30, cursor: 'pointer',
                                        border: `${child.avatar === em ? 3 : 1}px solid ${child.avatar === em ? accent : isDark ? '#444' : '#ddd'}`,
                                        background: child.avatar === em ? `${accent}20` : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>{em}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Personal Info Card */}
                <div style={{ background: cardBg, borderRadius: 22, padding: 20, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📋 {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}</h3>

                    {[
                        { key: 'name', label: isArabic ? 'الاسم' : 'Name', value: child.name, emoji: '📛' },
                        { key: 'age', label: isArabic ? 'العمر' : 'Age', value: `${child.age} ${isArabic ? 'سنوات' : 'years'}`, emoji: '🎂' },
                        { key: 'email', label: isArabic ? 'البريد' : 'Email', value: child.email, emoji: '📧' },
                        { key: 'gender', label: isArabic ? 'الجنس' : 'Gender', value: child.gender === 'Male' ? (isArabic ? 'ذكر' : 'Male') : (isArabic ? 'أنثى' : 'Female'), emoji: child.gender === 'Male' ? '👦' : '👧', editable: false },
                    ].map(field => (
                        <div key={field.key} style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                            borderBottom: `1px solid ${isDark ? '#333' : '#f0f0f0'}`,
                        }}>
                            <span style={{ fontSize: 22 }}>{field.emoji}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: '#999' }}>{field.label}</div>
                                {editingField === field.key ? (
                                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                        <input value={editValue} onChange={e => setEditValue(e.target.value)} type={field.key === 'age' ? 'number' : 'text'} style={{
                                            flex: 1, padding: '8px 12px', borderRadius: 10, border: `1px solid ${accent}`,
                                            background: isDark ? '#2a3654' : '#fff', color: text, fontSize: 14, outline: 'none',
                                        }} autoFocus />
                                        <button onClick={saveEdit} style={{ padding: '8px 14px', borderRadius: 10, background: accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>✓</button>
                                        <button onClick={() => setEditingField(null)} style={{ padding: '8px 14px', borderRadius: 10, background: '#FF658420', color: '#FF6584', border: 'none', cursor: 'pointer', fontWeight: 600 }}>✕</button>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{field.value}</div>
                                )}
                            </div>
                            {field.editable !== false && editingField !== field.key && (
                                <button onClick={() => startEdit(field.key, field.key === 'age' ? child.age : child[field.key])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#999' }}>✏️</button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Diagnosis Level */}
                <div style={{ background: cardBg, borderRadius: 22, padding: 20, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h3 style={{ color: text, fontSize: 16, fontWeight: 700, margin: 0 }}>🧠 {isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</h3>
                        <span style={{ fontSize: 10, background: '#FF658420', color: '#FF6584', padding: '4px 8px', borderRadius: 8, fontWeight: 700 }}>
                            {isArabic ? 'يحدده الطبيب' : 'Managed by Doctor'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8, opacity: 0.8, pointerEvents: 'none', filter: 'grayscale(0.2)' }}>
                        {[
                            { val: 'Level 1', label: isArabic ? 'المستوى 1' : 'Level 1', sublabel: isArabic ? 'يحتاج دعم' : 'Needs Support', color: '#8BC99A' },
                            { val: 'Level 2', label: isArabic ? 'المستوى 2' : 'Level 2', sublabel: isArabic ? 'دعم أكبر' : 'More Support', color: '#F9E4A7' },
                            { val: 'Level 3', label: isArabic ? 'المستوى 3' : 'Level 3', sublabel: isArabic ? 'دعم كبير' : 'Most Support', color: '#F8B4B4' },
                        ].map(lv => (
                            <button key={lv.val} disabled style={{
                                flex: 1, padding: 12, borderRadius: 16, cursor: 'not-allowed', textAlign: 'center',
                                background: child.diagnosisLevel === lv.val ? `${lv.color}26` : 'transparent',
                                border: `${child.diagnosisLevel === lv.val ? 2 : 1}px solid ${child.diagnosisLevel === lv.val ? lv.color : isDark ? '#444' : '#ddd'}`,
                                transition: 'all 0.25s',
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: child.diagnosisLevel === lv.val ? lv.color : text }}>{lv.label}</div>
                                <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{lv.sublabel}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sensory Preferences */}
                <div style={{ background: cardBg, borderRadius: 22, padding: 20, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎨 {isArabic ? 'التفضيلات الحسية' : 'Sensory Preferences'}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {sensoryOptions.map(opt => {
                            const active = (child.sensoryPreferences || []).includes(opt.key);
                            return (
                                <button key={opt.key} onClick={() => togglePref(opt.key)} style={{
                                    padding: '10px 16px', borderRadius: 16, cursor: 'pointer', fontSize: 13,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: active ? `${accent}20` : 'transparent',
                                    border: `${active ? 2 : 1}px solid ${active ? accent : isDark ? '#444' : '#ddd'}`,
                                    color: active ? accent : text, fontWeight: active ? 700 : 400,
                                    transition: 'all 0.25s',
                                }}>
                                    <span>{opt.emoji}</span> {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Notes */}
                <div style={{ background: cardBg, borderRadius: 22, padding: 20, marginBottom: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📝 {isArabic ? 'ملاحظات' : 'Notes'}</h3>
                    <textarea
                        value={child.notes || ''}
                        onChange={e => updateChildProfile({ notes: e.target.value })}
                        placeholder={isArabic ? 'أضف ملاحظات عن الطفل...' : 'Add notes about the child...'}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: 14, border: `1px solid ${isDark ? '#3a4a6a' : '#ddd'}`,
                            background: isDark ? '#2a3654' : '#fff', color: text, fontSize: 14, minHeight: 80, resize: 'vertical', outline: 'none',
                        }}
                    />
                </div>

                {/* Account Info */}
                <div style={{ background: isDark ? '#16213E' : '#f5f3ff', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: '#999' }}>{isArabic ? 'تاريخ التسجيل' : 'Registered'}: {new Date(child.createdAt).toLocaleDateString()}</p>
                    <button onClick={handleLogout} style={{
                        marginTop: 8, padding: '10px 24px', borderRadius: 12,
                        background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)',
                        color: '#FF6584', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                    }}>🚪 {isArabic ? 'تسجيل خروج' : 'Log Out'}</button>
                </div>
            </div>
        </div>
    );
}
