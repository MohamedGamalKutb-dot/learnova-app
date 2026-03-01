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

    const accent = '#6C63FF';

    if (!currentChild) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <div className={`text-center p-10 rounded-3xl border max-w-[380px] ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <div className="text-[56px] mb-4">🔒</div>
                    <h2 className={`text-[22px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                    <button onClick={() => navigate('/child-login')}
                        className="mt-4 py-3.5 px-8 rounded-xl bg-gradient-to-br from-accent to-[#8B5CF6] text-white border-none cursor-pointer font-bold text-[15px] shadow-[0_4px_16px_rgba(108,99,255,0.25)]">
                        {isArabic ? 'تسجيل الدخول' : 'Log In'}
                    </button>
                </div>
            </div>
        );
    }

    const child = currentChild;
    const startEdit = (field, currentValue) => { setEditingField(field); setEditValue(currentValue || ''); };
    const saveEdit = () => {
        if (editingField && editValue !== undefined) updateChildProfile({ [editingField]: editingField === 'age' ? parseInt(editValue) : editValue });
        setEditingField(null); setEditValue('');
    };
    const togglePref = (pref) => {
        const prefs = child.sensoryPreferences || [];
        updateChildProfile({ sensoryPreferences: prefs.includes(pref) ? prefs.filter(p => p !== pref) : [...prefs, pref] });
    };
    const handleLogout = () => { logoutChild(); navigate('/'); };

    const sensoryOptions = [
        { key: 'light_sensitive', label: isArabic ? 'حساسية للضوء' : 'Light Sensitive', emoji: '💡' },
        { key: 'sound_sensitive', label: isArabic ? 'حساسية للصوت' : 'Sound Sensitive', emoji: '🔊' },
        { key: 'touch_sensitive', label: isArabic ? 'حساسية للمس' : 'Touch Sensitive', emoji: '✋' },
        { key: 'visual_stimming', label: isArabic ? 'تحفيز بصري' : 'Visual Stimming', emoji: '👀' },
        { key: 'movement_seeking', label: isArabic ? 'يحب الحركة' : 'Movement Seeking', emoji: '🏃' },
        { key: 'calm_environment', label: isArabic ? 'يحب الهدوء' : 'Prefers Calm', emoji: '🧘' },
    ];

    return (
        <div className={`min-h-screen font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
            {/* Navbar */}
            <nav className={`flex items-center gap-3 py-3 px-6 max-w-[700px] mx-auto border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                <button onClick={() => navigate(-1)}
                    className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-base cursor-pointer ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`}>←</button>
                <h1 className={`flex-1 text-lg font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                    👤 {isArabic ? 'الملف الشخصي' : 'Profile'}
                </h1>
                <button onClick={handleLogout}
                    className={`py-2 px-4 rounded-[10px] text-[13px] font-semibold text-red-500 flex items-center gap-1 cursor-pointer border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-red-50 border-red-200'}`}>
                    🚪 {isArabic ? 'خروج' : 'Logout'}
                </button>
            </nav>

            <div className="max-w-[700px] mx-auto py-6 px-6 pb-10">
                {/* Avatar & Header */}
                <div className={`rounded-[20px] p-8 text-center mb-5 border relative ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.04)]'}`}>
                    <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-br from-accent to-[#8B5CF6] to-pink-500 rounded-t-[20px] opacity-90" />
                    <div onClick={() => setShowAvatarPicker(true)}
                        className={`w-[90px] h-[90px] rounded-[20px] mx-auto mt-5 mb-3.5 flex items-center justify-center text-5xl cursor-pointer relative z-[1] border-[3px] transition-transform duration-300 hover:scale-105 ${isDark ? 'bg-card-dark border-card-dark' : 'bg-card border-card'}`}
                        style={{ boxShadow: `0 4px 16px ${accent}25` }}>{child.avatar}</div>
                    <h2 className={`text-[22px] font-extrabold m-0 ${isDark ? 'text-text-dark' : 'text-text'}`}>{child.name}</h2>
                    <div className={`inline-flex items-center gap-1.5 mt-2.5 py-1.5 px-4 rounded-lg border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-[#F0F0FF] border-[#E0E0FF]'}`}>
                        <span className="font-mono text-[15px] font-bold text-accent tracking-wider">{child.childId}</span>
                    </div>
                    <p className={`text-xs mt-1.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'كود الطفل الخاص' : 'Your unique child code'}</p>
                </div>

                {/* Avatar Picker */}
                {showAvatarPicker && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-6" onClick={() => setShowAvatarPicker(false)}>
                        <div onClick={e => e.stopPropagation()}
                            className={`rounded-[20px] p-7 w-full max-w-[360px] border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}
                            style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                            <h3 className={`text-center mb-5 text-lg font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? '✨ اختر صورتك' : '✨ Choose Avatar'}</h3>
                            <div className="grid grid-cols-4 gap-2.5">
                                {['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰', '🦁', '🐸', '🦄', '🐼'].map(em => (
                                    <button key={em} onClick={() => { updateChildProfile({ avatar: em }); setShowAvatarPicker(false); }}
                                        className={`w-full aspect-square rounded-[14px] text-[28px] cursor-pointer flex items-center justify-center transition-all duration-200 border-2 ${child.avatar === em ? 'border-accent bg-accent/[0.08]' : `bg-transparent ${isDark ? 'border-border-dark' : 'border-border'}`
                                            }`}>{em}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Personal Info */}
                <div className={`rounded-[20px] p-6 mb-4 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <h3 className={`text-[15px] font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        📋 {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
                    </h3>
                    {[
                        { key: 'name', label: isArabic ? 'الاسم' : 'Name', value: child.name, emoji: '📛' },
                        { key: 'age', label: isArabic ? 'العمر' : 'Age', value: `${child.age} ${isArabic ? 'سنوات' : 'years'}`, emoji: '🎂' },
                        { key: 'email', label: isArabic ? 'البريد' : 'Email', value: child.email, emoji: '📧' },
                        { key: 'gender', label: isArabic ? 'الجنس' : 'Gender', value: child.gender === 'Male' ? (isArabic ? 'ذكر' : 'Male') : (isArabic ? 'أنثى' : 'Female'), emoji: child.gender === 'Male' ? '👦' : '👧', editable: false },
                    ].map(field => (
                        <div key={field.key} className={`flex items-center gap-3 py-3.5 border-b ${isDark ? 'border-border-dark' : 'border-border'}`}>
                            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0 ${isDark ? 'bg-border-dark' : 'bg-[#F9FAFB]'}`}>{field.emoji}</div>
                            <div className="flex-1">
                                <div className={`text-xs mb-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{field.label}</div>
                                {editingField === field.key ? (
                                    <div className="flex gap-1.5">
                                        <input value={editValue} onChange={e => setEditValue(e.target.value)} type={field.key === 'age' ? 'number' : 'text'}
                                            className={`flex-1 py-2 px-3 rounded-lg border border-accent outline-none text-sm font-[inherit] ${isDark ? 'bg-bg-dark text-text-dark' : 'bg-[#F9FAFB] text-text'}`} autoFocus />
                                        <button onClick={saveEdit} className="py-2 px-3 rounded-lg bg-accent text-white border-none cursor-pointer font-bold text-[13px]">✓</button>
                                        <button onClick={() => setEditingField(null)}
                                            className={`py-2 px-3 rounded-lg text-red-500 border cursor-pointer font-bold text-[13px] ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-red-50 border-red-200'}`}>✕</button>
                                    </div>
                                ) : (
                                    <div className={`text-[15px] font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{field.value}</div>
                                )}
                            </div>
                            {field.editable !== false && editingField !== field.key && (
                                <button onClick={() => startEdit(field.key, field.key === 'age' ? child.age : child[field.key])}
                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm cursor-pointer ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>✏️</button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Diagnosis Level */}
                <div className={`rounded-[20px] p-6 mb-4 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-[15px] font-bold m-0 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>🧠 {isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</h3>
                        <span className={`text-[11px] font-bold py-1 px-2.5 rounded-md text-red-500 border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-red-50 border-red-200'}`}>
                            {isArabic ? 'يحدده الطبيب' : 'Managed by Doctor'}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 opacity-80 pointer-events-none">
                        {[
                            { val: 'Level 1', label: isArabic ? 'المستوى 1' : 'Level 1', sublabel: isArabic ? 'يحتاج دعم' : 'Needs Support', color: '#10B981' },
                            { val: 'Level 2', label: isArabic ? 'المستوى 2' : 'Level 2', sublabel: isArabic ? 'دعم أكبر' : 'More Support', color: '#F59E0B' },
                            { val: 'Level 3', label: isArabic ? 'المستوى 3' : 'Level 3', sublabel: isArabic ? 'دعم كبير' : 'Most Support', color: '#EF4444' },
                        ].map(lv => (
                            <div key={lv.val} className="p-3.5 rounded-[14px] text-center border"
                                style={{
                                    background: child.diagnosisLevel === lv.val ? `${lv.color}12` : 'transparent',
                                    borderWidth: child.diagnosisLevel === lv.val ? 2 : 1,
                                    borderColor: child.diagnosisLevel === lv.val ? lv.color : (isDark ? '#21262D' : '#E5E7EB'),
                                }}>
                                <div className="text-sm font-bold" style={{ color: child.diagnosisLevel === lv.val ? lv.color : (isDark ? '#E6EDF3' : '#1F2937') }}>{lv.label}</div>
                                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{lv.sublabel}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sensory Preferences */}
                <div className={`rounded-[20px] p-6 mb-4 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <h3 className={`text-[15px] font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        🎨 {isArabic ? 'التفضيلات الحسية' : 'Sensory Preferences'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sensoryOptions.map(opt => {
                            const active = (child.sensoryPreferences || []).includes(opt.key);
                            return (
                                <button key={opt.key} onClick={() => togglePref(opt.key)}
                                    className={`py-2.5 px-4 rounded-[10px] cursor-pointer text-[13px] flex items-center gap-2 border transition-all duration-200 ${active ? 'bg-accent/[0.07] border-accent text-accent font-bold' : `bg-transparent font-medium ${isDark ? 'border-border-dark text-text-dark' : 'border-border text-text'}`
                                        }`}><span>{opt.emoji}</span> {opt.label}</button>
                            );
                        })}
                    </div>
                </div>

                {/* Notes */}
                <div className={`rounded-[20px] p-6 mb-4 border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <h3 className={`text-[15px] font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        📝 {isArabic ? 'ملاحظات' : 'Notes'}
                    </h3>
                    <textarea value={child.notes || ''} onChange={e => updateChildProfile({ notes: e.target.value })}
                        placeholder={isArabic ? 'أضف ملاحظات عن الطفل...' : 'Add notes about the child...'}
                        className={`w-full py-3.5 px-4 rounded-xl border text-sm min-h-[80px] resize-y outline-none font-[inherit] box-border ${isDark ? 'bg-bg-dark text-text-dark border-border-dark' : 'bg-[#F9FAFB] text-text border-border'}`} />
                </div>

                {/* Account */}
                <div className={`rounded-2xl p-5 text-center border ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}>
                    <p className={`text-[13px] mb-2.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                        {isArabic ? 'تاريخ التسجيل' : 'Registered'}: {new Date(child.createdAt).toLocaleDateString()}
                    </p>
                    <button onClick={handleLogout}
                        className={`py-3 px-7 rounded-xl text-red-500 cursor-pointer font-bold text-sm border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-red-50 border-red-200'}`}>
                        🚪 {isArabic ? 'تسجيل خروج' : 'Log Out'}
                    </button>
                </div>
            </div>
        </div>
    );
}
