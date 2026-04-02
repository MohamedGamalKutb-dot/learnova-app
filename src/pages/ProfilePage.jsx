import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardBody, Input, Navbar, NavbarContent, NavbarItem, Modal, ModalContent, ModalBody, ModalHeader, Textarea } from '@heroui/react';

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
                <Card className={`max-w-[380px] p-2 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="text-center p-8">
                        <div className="text-[56px] mb-4">🔒</div>
                        <h2 className={`text-[22px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                        <Button radius="lg" size="lg" className="mt-4 bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold text-[15px] shadow-[0_4px_16px_rgba(108,99,255,0.25)]"
                            onPress={() => navigate('/child-login')}>
                            {isArabic ? 'تسجيل الدخول' : 'Log In'}
                        </Button>
                    </CardBody>
                </Card>
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
            <Navbar maxWidth="lg" className={`py-1 border-b sticky top-0 z-50 ${isDark ? 'bg-card-dark/95 border-border-dark' : 'bg-white/95 border-border'}`} classNames={{ wrapper: 'px-6 max-w-[700px] flex justify-between' }}>
                <div className="flex items-center gap-3">
                    <Button isIconOnly size="sm" variant="bordered" className={`text-base ${isDark ? 'bg-card-dark border-border-dark text-text-dark' : 'bg-card border-border text-text'}`} onPress={() => navigate(-1)}>←</Button>
                    <h1 className={`m-0 text-lg font-bold flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                        👤 {isArabic ? 'الملف الشخصي' : 'Profile'}
                    </h1>
                </div>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button size="sm" variant="flat" color="danger" className="font-semibold" onPress={handleLogout}>
                            🚪 {isArabic ? 'خروج' : 'Logout'}
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <div className="max-w-[700px] mx-auto py-6 px-6 pb-10">
                {/* Avatar & Header */}
                <Card className={`mb-5 relative overflow-visible ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border shadow-[0_8px_30px_rgba(0,0,0,0.04)]'} border`}>
                    <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-br from-accent to-[#8B5CF6] to-pink-500 rounded-t-2xl opacity-90" />
                    <CardBody className="p-8 text-center pt-5">
                        <div onClick={() => setShowAvatarPicker(true)}
                            className={`w-[90px] h-[90px] rounded-[20px] mx-auto mb-3.5 flex items-center justify-center text-5xl cursor-pointer relative z-[1] border-[3px] transition-transform duration-300 hover:scale-105 ${isDark ? 'bg-card-dark border-card-dark' : 'bg-card border-card'}`}
                            style={{ boxShadow: `0 4px 16px ${accent}25` }}>{child.avatar}</div>
                        <h2 className={`text-[22px] font-extrabold m-0 ${isDark ? 'text-text-dark' : 'text-text'}`}>{child.name}</h2>
                        <div className={`inline-flex items-center gap-1.5 mt-2.5 py-1.5 px-4 rounded-lg border ${isDark ? 'bg-border-dark border-[#30363D]' : 'bg-[#F0F0FF] border-[#E0E0FF]'}`}>
                            <span className="font-mono text-[15px] font-bold text-accent tracking-wider">{child.childId}</span>
                        </div>
                        <p className={`text-xs mt-1.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{isArabic ? 'كود الطفل الخاص' : 'Your unique child code'}</p>
                    </CardBody>
                </Card>

                {/* Avatar Picker Modal */}
                <Modal isOpen={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} size="sm" backdrop="blur" classNames={{ base: isDark ? 'bg-card-dark border border-border-dark' : 'bg-card border border-border' }}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className={`flex flex-col gap-1 text-center justify-center w-full mt-2 font-bold text-lg ${isDark ? 'text-text-dark' : 'text-text'}`}>
                                    {isArabic ? '✨ اختر صورتك' : '✨ Choose Avatar'}
                                </ModalHeader>
                                <ModalBody className="pb-8 pt-2">
                                    <div className="grid grid-cols-4 gap-2.5">
                                        {['👦', '👧', '🧒', '👶', '🐱', '🐻', '🦊', '🐰', '🦁', '🐸', '🦄', '🐼'].map(em => (
                                            <Button key={em} isIconOnly size="lg" variant={child.avatar === em ? 'flat' : 'bordered'} color={child.avatar === em ? 'primary' : 'default'}
                                                className={`w-full h-auto aspect-square text-[28px] ${child.avatar !== em ? (isDark ? 'border-border-dark' : 'border-border') : ''}`}
                                                onPress={() => { updateChildProfile({ avatar: em }); onClose(); }}>
                                                {em}
                                            </Button>
                                        ))}
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* Personal Info */}
                <Card className={`mb-4 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="p-6">
                        <h3 className={`text-[15px] font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            📋 {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
                        </h3>
                        {[
                            { key: 'name', label: isArabic ? 'الاسم' : 'Name', value: child.name, emoji: '📛' },
                            { key: 'age', label: isArabic ? 'العمر' : 'Age', value: `${child.age} ${isArabic ? 'سنوات' : 'years'}`, emoji: '🎂' },
                            { key: 'email', label: isArabic ? 'البريد' : 'Email', value: child.email, emoji: '📧' },
                            { key: 'gender', label: isArabic ? 'الجنس' : 'Gender', value: child.gender === 'Male' ? (isArabic ? 'ذكر' : 'Male') : (isArabic ? 'أنثى' : 'Female'), emoji: child.gender === 'Male' ? '👦' : '👧', editable: false },
                        ].map(field => (
                            <div key={field.key} className={`flex items-center gap-3 py-3.5 border-b last:border-b-0 ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0 ${isDark ? 'bg-border-dark' : 'bg-[#F9FAFB]'}`}>{field.emoji}</div>
                                <div className="flex-1">
                                    <div className={`text-xs mb-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{field.label}</div>
                                    {editingField === field.key ? (
                                        <div className="flex gap-1.5">
                                            <Input
                                                value={editValue} onChange={e => setEditValue(e.target.value)} type={field.key === 'age' ? 'number' : 'text'}
                                                size="sm" variant="bordered" radius="md" autoFocus
                                                classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-accent` }}
                                            />
                                            <Button isIconOnly size="sm" radius="md" className="bg-accent text-white font-bold" onPress={saveEdit}>✓</Button>
                                            <Button isIconOnly size="sm" radius="md" color="danger" variant="flat" onPress={() => setEditingField(null)}>✕</Button>
                                        </div>
                                    ) : (
                                        <div className={`text-[15px] font-semibold ${isDark ? 'text-text-dark' : 'text-text'}`}>{field.value}</div>
                                    )}
                                </div>
                                {field.editable !== false && editingField !== field.key && (
                                    <Button isIconOnly size="sm" variant="bordered" className={`text-sm ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'}`}
                                        onPress={() => startEdit(field.key, field.key === 'age' ? child.age : child[field.key])}>✏️</Button>
                                )}
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* Diagnosis Level */}
                <Card className={`mb-4 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="p-6">
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
                    </CardBody>
                </Card>

                {/* Sensory Preferences */}
                <Card className={`mb-4 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="p-6">
                        <h3 className={`text-[15px] font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            🎨 {isArabic ? 'التفضيلات الحسية' : 'Sensory Preferences'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sensoryOptions.map(opt => {
                                const active = (child.sensoryPreferences || []).includes(opt.key);
                                return (
                                    <Button key={opt.key} radius="md" size="md" onPress={() => togglePref(opt.key)}
                                        className={`font-medium text-[13px] border ${active ? 'bg-accent/[0.07] border-accent text-accent font-bold' : `bg-transparent ${isDark ? 'border-border-dark text-text-dark' : 'border-border text-text'}`}`}
                                        startContent={<span>{opt.emoji}</span>}>
                                        {opt.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </CardBody>
                </Card>

                {/* Notes */}
                <Card className={`mb-4 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="p-6">
                        <h3 className={`text-[15px] font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            📝 {isArabic ? 'ملاحظات' : 'Notes'}
                        </h3>
                        <Textarea
                            value={child.notes || ''} onChange={e => updateChildProfile({ notes: e.target.value })}
                            placeholder={isArabic ? 'أضف ملاحظات عن الطفل...' : 'Add notes about the child...'}
                            minRows={3} variant="bordered" radius="lg"
                            classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-accent` }}
                        />
                    </CardBody>
                </Card>

                {/* Account */}
                <Card className={`mb-4 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="p-5 text-center items-center justify-center">
                        <p className={`text-[13px] mb-2.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                            {isArabic ? 'تاريخ التسجيل' : 'Registered'}: {new Date(child.createdAt).toLocaleDateString()}
                        </p>
                        <Button color="danger" variant="flat" radius="lg" className="font-bold text-sm min-w-[150px]" onPress={handleLogout}>
                            🚪 {isArabic ? 'تسجيل خروج' : 'Log Out'}
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
