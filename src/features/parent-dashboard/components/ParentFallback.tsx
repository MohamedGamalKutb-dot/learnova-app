import { Button, Input } from '@heroui/react';
import { useState } from 'react';
import MainNavbar from '../../../shared/components/MainNavbar';
import { toast } from 'react-hot-toast';

interface ParentFallbackProps {
    isDark: boolean;
    isArabic: boolean;
    auraBg: string;
    auraCard: string;
    logoutParent: () => void;
    addChildToParent: (id: string) => Promise<any>;
}

export default function ParentFallback({
    isDark,
    isArabic,
    auraBg,
    auraCard,
    logoutParent,
    addChildToParent
}: ParentFallbackProps) {
    const [newChildId, setNewChildId] = useState('');

    const handleLinkChild = async () => {
        if (!newChildId.trim()) return;
        
        const promise = addChildToParent(newChildId.trim());
        toast.promise(promise, {
            loading: isArabic ? 'جاري إضافة الطفل...' : 'Adding child...',
            success: (res) => {
                if (res.success) {
                    setNewChildId('');
                    return isArabic ? `تم ربط الطفل ${res.childName} بنجاح!` : `Successfully linked child ${res.childName}!`;
                } else {
                    if (res.error === 'child_not_found') throw new Error(isArabic ? 'كود الطفل غير صحيح أو غير موجود' : 'Child code not found');
                    if (res.error === 'already_exists') throw new Error(isArabic ? 'هذا الطفل مرتبط بالفعل بحسابك' : 'This child is already linked to your account');
                    throw new Error(isArabic ? 'حدث خطأ ما' : 'An error occurred');
                }
            },
            error: (err: any) => err.message
        });
    };

    return (
        <div className={`min-h-screen relative ${isArabic ? 'font-[Cairo,sans-serif]' : "font-['Plus_Jakarta_Sans',sans-serif]"} ${auraBg} transition-colors duration-1000`} dir={isArabic ? 'rtl' : 'ltr'}>
            {isDark && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-500/15 blur-[130px] animate-pulse" />
                    <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[110px]" />
                </div>
            )}
            <MainNavbar userType="parent" />
            <div className="flex relative pt-[72px] justify-center items-center h-[calc(100vh-72px)] px-4">
                <div className={`w-full max-w-[480px] p-8 rounded-3xl border text-center ${auraCard}`} style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                    <div className="text-6xl mb-4">👶</div>
                    <h2 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                        {isArabic ? 'أهلاً بك في لوحة تحكم ولي الأمر!' : 'Welcome to the Parent Dashboard!'}
                    </h2>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isArabic ? 'للبدء في متابعة طفلك وتحليل أدائه، يرجى ربط حسابه عن طريق إدخال كود الطفل المتاح في الملف الشخصي للطفل.' : "To start monitoring your child's progress and reports, please link their account by entering their unique child code found in their profile."}
                    </p>
                    
                    <div className={`p-4 rounded-2xl mb-4 border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <label className={`block text-xs mb-2 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isArabic ? 'كود الطفل (LN-XXXXXX)' : 'Child Code (LN-XXXXXX)'}
                        </label>
                        <div className="flex gap-2">
                            <Input variant="bordered" radius="lg"
                                value={newChildId} onChange={e => setNewChildId(e.target.value.toUpperCase())}
                                placeholder="LN-XXXXXX" className="flex-1"
                                classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-white border-slate-200'} focus-within:!border-indigo-500` }} />
                            <Button className="bg-indigo-600 text-white font-bold radius-lg" onPress={handleLinkChild}>
                                {isArabic ? 'ربط' : 'Link'}
                            </Button>
                        </div>
                    </div>
                    
                    <Button fullWidth variant="bordered" className={`mt-2 ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-700'}`} onPress={logoutParent}>
                        {isArabic ? 'تسجيل الخروج' : 'Logout'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
