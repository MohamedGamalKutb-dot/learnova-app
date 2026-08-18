import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/shared/context/AppContext';
import { useAuth } from '@/shared/context/AuthContext';
import { Button, Card, CardBody } from '@heroui/react';
import { useGlobalData } from '@/shared/context/GlobalDataContext';
import { toast } from 'react-hot-toast';

import ProfileNavbar from './components/ProfileNavbar';
import ProfileHeaderCard from './components/ProfileHeaderCard';
import ProfileIdentityCard from './components/ProfileIdentityCard';
import ProfileChildSettings from './components/ProfileChildSettings';
import ProfileAccountSettings from './components/ProfileAccountSettings';
import ProfileAvatarModal from './components/ProfileAvatarModal';

export default function Profile() {
    const navigate = useNavigate();
    const { isDark, isArabic } = useApp();
    const {
        currentChild, updateChildProfile, logoutChild,
        currentParent, logoutParent,
        currentDoctor, logoutDoctor
    } = useAuth();

    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string | number>('');

    const activeUser = currentChild || currentParent || currentDoctor;
    const userRole = currentChild ? 'child' : currentParent ? 'parent' : currentDoctor ? 'doctor' : null;
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const { profile } = useGlobalData();

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

    const startEdit = (field: string, currentValue: any) => {
        if (userRole !== 'child') return;
        setEditingField(field);
        setEditValue(currentValue || '');
    };

    const saveEdit = () => {
        if (editingField && editValue !== undefined && userRole === 'child') {
            updateChildProfile({ [editingField]: editingField === 'age' ? parseInt(editValue as string) : editValue });
        }
        setEditingField(null); setEditValue('');
    };

    const togglePref = (pref: string) => {
        if (userRole !== 'child' || !activeUser || !('sensoryPreferences' in activeUser)) return;
        const prefs = (activeUser as any).sensoryPreferences || [];
        updateChildProfile({ sensoryPreferences: prefs.includes(pref) ? prefs.filter((p: string) => p !== pref) : [...prefs, pref] });
    };

    const handleLogout = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
        if (userRole === 'child') logoutChild();
        else if (userRole === 'parent') logoutParent();
        else if (userRole === 'doctor') logoutDoctor();
        navigate('/');
    };

    const sensoryOptions = profile?.sensoryOptions || [];
    const avatarOptions = profile?.avatarOptions || [];

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const doUpload = async () => {
            setIsUploadingAvatar(true);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                
                const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const json = await res.json();
                if (json.secure_url) {
                    await updateChildProfile({ avatar: json.secure_url });
                    setShowAvatarPicker(false);
                    return json.secure_url;
                } else {
                    throw new Error("Failed to upload image");
                }
            } finally {
                setIsUploadingAvatar(false);
            }
        };

        toast.promise(doUpload(), {
            loading: isArabic ? 'جاري رفع الصورة...' : 'Uploading image...',
            success: isArabic ? 'تم تحديث الصورة بنجاح!' : 'Avatar updated successfully!',
            error: isArabic ? 'حدث خطأ أثناء الرفع' : 'Failed to upload image'
        });
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

            <ProfileNavbar 
                isDark={isDark} 
                isArabic={isArabic} 
            />

            <main className="relative max-w-[800px] mx-auto px-8 pt-32 pb-20">
                <ProfileHeaderCard 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    userRole={userRole as any} 
                    activeUser={activeUser as any} 
                    setShowAvatarPicker={setShowAvatarPicker} 
                />

                <ProfileIdentityCard 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    userRole={userRole as any} 
                    activeUser={activeUser as any} 
                    editingField={editingField} 
                    editValue={editValue as string} 
                    setEditValue={setEditValue as any} 
                    setEditingField={setEditingField} 
                    startEdit={startEdit} 
                    saveEdit={saveEdit} 
                />

                <ProfileChildSettings 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    userRole={userRole as any} 
                    activeUser={activeUser as any} 
                    sensoryOptions={sensoryOptions} 
                    togglePref={togglePref} 
                    updateChildProfile={updateChildProfile} 
                />

                <ProfileAccountSettings 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    activeUser={activeUser as any}
                    userRole={userRole as any}
                />
            </main>

            {userRole === 'child' && (
                <ProfileAvatarModal 
                    isDark={isDark} 
                    isArabic={isArabic} 
                    showAvatarPicker={showAvatarPicker} 
                    setShowAvatarPicker={setShowAvatarPicker} 
                    isUploadingAvatar={isUploadingAvatar} 
                    activeUser={activeUser as any} 
                    avatarOptions={avatarOptions} 
                    updateChildProfile={updateChildProfile} 
                    handleImageUpload={handleImageUpload}
                />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
                
                @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(2deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
