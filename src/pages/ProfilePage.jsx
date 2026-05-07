import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardBody, Input, Navbar, NavbarContent, NavbarItem, Modal, ModalContent, ModalBody, ModalHeader, Textarea } from '@heroui/react';
import { getProfileData } from '../data/profileData';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const {
        currentChild, updateChildProfile, logoutChild,
        currentParent, logoutParent,
        currentDoctor, logoutDoctor
    } = useAuth();

    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    const accent = '#6C63FF';

    // Determine user session
    const activeUser = currentChild || currentParent || currentDoctor;
    const userRole = currentChild ? 'child' : currentParent ? 'parent' : currentDoctor ? 'doctor' : null;

    if (!activeUser) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-[Inter,'Segoe_UI',sans-serif] ${isDark ? 'bg-bg-dark' : 'bg-bg'}`}>
                <Card className={`max-w-[380px] p-2 ${isDark ? 'bg-card-dark border-border-dark' : 'bg-card border-border'} border`}>
                    <CardBody className="text-center p-8">
                        <div className="text-[56px] mb-4">🔒</div>
                        <h2 className={`text-[22px] font-bold ${isDark ? 'text-text-dark' : 'text-text'}`}>{isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first'}</h2>
                        <Button radius="lg" size="lg" className="mt-6 bg-gradient-to-br from-accent to-[#8B5CF6] text-white font-bold text-[15px] shadow-[0_4px_16px_rgba(108,99,255,0.25)]"
                            onPress={() => navigate('/choice')}>
                            {isArabic ? 'إلى صفحة الاختيار' : 'Back to Choice'}
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const startEdit = (field, currentValue) => {
        if (userRole !== 'child') return;
        setEditingField(field);
        setEditValue(currentValue || '');
    };

    const saveEdit = () => {
        if (editingField && editValue !== undefined && userRole === 'child') {
            updateChildProfile({ [editingField]: editingField === 'age' ? parseInt(editValue) : editValue });
        }
        setEditingField(null); setEditValue('');
    };

    const togglePref = (pref) => {
        if (userRole !== 'child') return;
        const prefs = activeUser.sensoryPreferences || [];
        updateChildProfile({ sensoryPreferences: prefs.includes(pref) ? prefs.filter(p => p !== pref) : [...prefs, pref] });
    };

    const handleLogout = () => {
        if (userRole === 'child') logoutChild();
        else if (userRole === 'parent') logoutParent();
        else if (userRole === 'doctor') logoutDoctor();
        navigate('/');
    };

    const { sensoryOptions, avatarOptions } = getProfileData(isArabic);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            updateChildProfile({ avatar: reader.result }); // Save Base64 string
            setShowAvatarPicker(false);
        };
        reader.readAsDataURL(file);
    };

    const renderAvatar = (avatar) => {
        if (!avatar) return '👤';
        const isImage = avatar.startsWith('data:image') || avatar.startsWith('http');
        if (isImage) {
            return <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-[17px]"  loading="lazy" decoding="async"/>;
        }
        return avatar;
    };

    return (
        <div className={`min-h-screen selection:bg-indigo-500/30 transition-all duration-1000 ${isArabic ? 'font-[Cairo,sans-serif]' : 'font-[Plus_Jakarta_Sans,sans-serif]'} ${isDark ? 'bg-[#0C0D17] text-slate-200' : 'bg-[#F5F8FF] text-slate-800'} overflow-x-hidden`} dir={isArabic ? 'rtl' : 'ltr'}>

            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />

            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'}`} />
                <div className={`absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/20'}`} />
                <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full blur-[150px] transition-all duration-1000 ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'}`} />
            </div>

            {/* MINIMALIST GLASS NAVBAR */}
            <nav className={`fixed top-0 inset-x-0 h-20 z-50 px-8 flex items-center justify-between backdrop-blur-xl border-b transition-all duration-500 ${isDark ? 'bg-[#0C0D17]/40 border-white/5' : 'bg-white/40 border-indigo-100'}`}>
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="bordered" radius="full" size="sm" className={`text-base ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-indigo-100 text-indigo-600 hover:bg-indigo-50'}`} onPress={() => navigate(-1)}>
                        {isArabic ? '→' : '←'}
                    </Button>
                    <h1 className={`text-xl font-black transition-all duration-1000 ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{isArabic ? 'ملفي الشخصي' : 'Profile'}</h1>
                </div>

                <div className="flex items-center gap-4">
                </div>
            </nav>

            <main className="relative max-w-[800px] mx-auto px-8 pt-32 pb-20">
                {/* Header Card */}
                <Card className={`mb-10 relative overflow-hidden rounded-[50px] border transition-all duration-700 backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
                    <CardBody className="p-12 text-center pt-8">
                        <div onClick={() => userRole === 'child' && setShowAvatarPicker(true)}
                            className={`w-32 h-32 rounded-[40px] mx-auto mb-6 flex items-center justify-center text-6xl cursor-pointer relative z-[1] border-[4px] transition-transform duration-500 hover:scale-110 overflow-hidden shadow-2xl ${isDark ? 'bg-[#0C0D17]/80 border-white/10' : 'bg-white border-indigo-100'}`}
                            style={{ boxShadow: isDark ? '0 10px 40px rgba(99, 102, 241, 0.2)' : '0 10px 40px rgba(99, 102, 241, 0.1)' }}>
                            {activeUser.avatar && (activeUser.avatar.startsWith('data:image') || activeUser.avatar.startsWith('http')) ? (
                                <img src={activeUser.avatar} className="w-full h-full object-cover" alt="Avatar"  loading="lazy" decoding="async"/>
                            ) : activeUser.avatar && activeUser.avatar.length <= 2 ? (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-50/10">
                                    {activeUser.avatar}
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img src="/icons/profile.png"
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                     loading="lazy" decoding="async"/>
                                </div>
                            )}
                        </div>
                        <h2 className={`text-3xl font-black mb-2 tracking-tighter ${isDark ? 'text-white' : 'text-indigo-900'}`}>{activeUser.name}</h2>
                        {userRole === 'child' && (
                            <div className="space-y-3">
                                <div className={`inline-flex items-center gap-1.5 py-2 px-6 rounded-[20px] border backdrop-blur-xl ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                                    <span className="font-mono text-lg font-black text-indigo-500 tracking-wider">{activeUser.childId}</span>
                                </div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40`}>{isArabic ? 'كود البطل الخاص' : 'Your Hero Code'}</p>
                            </div>
                        )}
                        {userRole !== 'child' && (
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">{userRole}</p>
                        )}
                    </CardBody>
                </Card>

                {/* Identity Information with Edit Support */}
                <Card className={`mb-10 rounded-[40px] border transition-all duration-700 backdrop-blur-3xl shadow-xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                    <CardBody className="p-10 space-y-8">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-1000 ${isDark ? 'opacity-30 text-white' : 'opacity-50 text-indigo-900'}`}>{isArabic ? 'بيانات الهوية' : 'Identity Hub'}</h3>
                        <div className="flex flex-col gap-6">
                            {[
                                { key: 'name', label: isArabic ? 'الاسم' : 'Name', value: activeUser.name, emoji: '📛', show: true },
                                { key: 'age', label: isArabic ? 'العمر' : 'Age', value: activeUser.age ? `${activeUser.age} ${isArabic ? 'سنوات' : 'years'}` : '--', emoji: '🎂', show: userRole === 'child' },
                                { key: 'email', label: isArabic ? 'البريد الإلكتروني' : 'Email Address', value: activeUser.email || '--', emoji: '📧', show: true },
                                { key: 'gender', label: isArabic ? 'الجنس' : 'Gender', value: activeUser.gender === 'Male' ? (isArabic ? 'ذكر' : 'Male') : (isArabic ? 'أنثى' : 'Female'), emoji: activeUser.gender === 'Male' ? '👦' : '👧', editable: false, show: userRole === 'child' },
                            ].filter(f => f.show).map(field => (
                                <div key={field.key} className={`flex items-start gap-4 group py-4 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-indigo-50'}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all duration-500 overflow-hidden ${isDark ? 'bg-white/5 border border-white/10' : 'bg-indigo-50 border border-indigo-100'}`}>
                                        <img src={`/icons/profile_${field.key}.png`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                        <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">{field.emoji}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-1`}>{field.label}</div>
                                        {editingField === field.key ? (
                                            <div className="flex gap-2">
                                                <Input
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    type={field.key === 'age' ? 'number' : 'text'}
                                                    variant="flat"
                                                    radius="full"
                                                    autoFocus
                                                    className="max-w-[400px]"
                                                    classNames={{ inputWrapper: `${isDark ? 'bg-white/10 border border-indigo-500/30' : 'bg-white border border-indigo-200'}` }}
                                                />
                                                <Button isIconOnly size="sm" radius="full" className="bg-indigo-500 text-white font-black" onPress={saveEdit}>✓</Button>
                                                <Button isIconOnly size="sm" radius="full" color="danger" variant="flat" onPress={() => setEditingField(null)}>✕</Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-bold">{field.value}</span>
                                                {userRole === 'child' && field.editable !== false && (
                                                    <Button isIconOnly size="sm" variant="light" radius="full" className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/10"
                                                        onPress={() => startEdit(field.key, field.key === 'age' ? activeUser.age : activeUser[field.key])}>
                                                        ✏️
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {userRole === 'child' && (
                    <div className="space-y-12">
                        {/* Diagnosis Level */}
                        <div className="space-y-5">
                            <div className="flex items-center justify-between px-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'مستوى التشخيص' : 'Diagnosis Level'}</h3>
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500/50">{isArabic ? 'بإشراف الطبيب' : 'Managed by Doctor'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { val: 'Level 1', label: isArabic ? '1' : '1', color: '#10B981', glow: 'shadow-emerald-500/20' },
                                    { val: 'Level 2', label: isArabic ? '2' : '2', color: '#F59E0B', glow: 'shadow-amber-500/20' },
                                    { val: 'Level 3', label: isArabic ? '3' : '3', color: '#EF4444', glow: 'shadow-red-500/20' },
                                ].map(lv => {
                                    const isActive = activeUser.diagnosisLevel === lv.val;
                                    return (
                                        <div key={lv.val} className={`p-6 rounded-[32px] text-center border transition-all duration-500 backdrop-blur-3xl ${isActive ? `opacity-100 border-opacity-100 ${lv.glow} scale-105 bg-white/5` : 'border-opacity-10 opacity-20 pointer-events-none shadow-none'}`}
                                            style={{ borderColor: isActive ? lv.color : 'transparent' }}>
                                            <div className="text-3xl font-black mb-1" style={{ color: lv.color }}>{lv.label}</div>
                                            <div className="text-[9px] uppercase tracking-[0.2em] font-black opacity-60">{isArabic ? 'مستوى' : 'Level'}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sensory Preferences */}
                        <div className="space-y-5">
                            <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'تفضيلات الحواس' : 'Sensory Vibes'}</h3>
                            <div className={`flex flex-wrap gap-3 p-10 rounded-[50px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-indigo-100'}`}>
                                {sensoryOptions.map(opt => {
                                    const active = (activeUser.sensoryPreferences || []).includes(opt.key);
                                    return (
                                        <Button key={opt.key} radius="full" variant={active ? 'flat' : 'bordered'} color={active ? 'primary' : 'default'}
                                            className={`font-black text-[12px] tracking-tight h-12 px-6 transition-all duration-500 ${active ? 'scale-105 shadow-indigo-500/10' : `opacity-40 ${isDark ? 'border-white/10' : 'border-indigo-100'}`}`}
                                            onPress={() => togglePref(opt.key)}>
                                            <div className="w-5 h-5 me-2 overflow-hidden rounded-md"><img src={opt.emoji} className="w-full h-full object-cover" alt=""  loading="lazy" decoding="async"/></div> {opt.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-5">
                            <h3 className={`px-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}>{isArabic ? 'مذكرات' : 'Hero Notes'}</h3>
                            <Card className={`rounded-[40px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/80 border-indigo-100'}`}>
                                <CardBody className="p-8">
                                    <textarea
                                        className={`w-full min-h-[140px] bg-transparent border-none outline-none font-bold text-lg leading-relaxed ${isDark ? 'text-white/80 placeholder:text-white/10' : 'text-indigo-900 placeholder:text-indigo-200'}`}
                                        placeholder={isArabic ? 'اكتب ملاحظاتك هنا...' : 'Add some notes...'}
                                        value={activeUser.notes || ''}
                                        onChange={(e) => userRole === 'child' && updateChildProfile({ notes: e.target.value })}
                                        disabled={userRole !== 'child'}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Account Settings */}
                <Card className={`mt-10 rounded-[30px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white/40 border-indigo-100'}`}>
                    <CardBody className="p-8 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{isArabic ? 'تاريخ الانضمام' : 'MEMBER SINCE'}</span>
                            <div className="flex items-center gap-2 mt-0.5" dir="ltr">
                                <span className="text-lg font-black text-indigo-500">
                                    {activeUser.createdAt ? new Date(activeUser.createdAt).getDate().toString().padStart(2, '0') : '--'}
                                </span>
                                <span className="text-lg font-black opacity-20">/</span>
                                <span className="text-lg font-black text-indigo-500">
                                    {activeUser.createdAt ? (new Date(activeUser.createdAt).getMonth() + 1).toString().padStart(2, '0') : '--'}
                                </span>
                                <span className="text-lg font-black opacity-20">/</span>
                                <span className="text-lg font-black text-indigo-500">
                                    {activeUser.createdAt ? new Date(activeUser.createdAt).getFullYear() : '----'}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </main>

            {/* Avatar Picker Modal - Only for Child */}
            {userRole === 'child' && (
                <Modal isOpen={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} size="sm" backdrop="blur"
                    classNames={{
                        base: `backdrop-blur-3xl border rounded-[50px] overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F101A]/95 border-white/10' : 'bg-white/95 border-indigo-100'}`,
                        backdrop: 'bg-indigo-950/40 backdrop-blur-sm'
                    }}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className={`flex flex-col gap-1 text-center justify-center w-full mt-6 font-black text-xl ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>
                                    {isArabic ? '✨ اختر مظهر بطلنا' : '✨ Choose Your Hero'}
                                </ModalHeader>
                                <ModalBody className="pb-12 pt-4 px-10">
                                    <div className="mb-6">
                                        <Button fullWidth radius="full" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black h-14 shadow-xl shadow-indigo-500/20"
                                            onPress={() => document.getElementById('avatar-upload').click()}
                                            startContent={<span className="text-xl">📸</span>}>
                                            {isArabic ? 'رفع صورة حقيقية' : 'UPLOAD PHOTO'}
                                        </Button>
                                    </div>
                                    <div className={`grid grid-cols-4 gap-4 border-t pt-8 transition-colors duration-1000 ${isDark ? 'border-white/5' : 'border-indigo-100'}`}>
                                        {avatarOptions.map(em => (
                                            <Button key={em} isIconOnly radius="2xl" variant={activeUser.avatar === em ? 'flat' : 'bordered'} color={activeUser.avatar === em ? 'primary' : 'default'}
                                                className={`w-full h-auto aspect-square text-3xl transition-transform hover:scale-110 ${activeUser.avatar !== em ? (isDark ? 'border-white/10' : 'border-indigo-100') : ''}`}
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
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(2deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
