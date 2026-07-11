import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

export default function ProfileNavbar({ isDark, isArabic }) {
    const navigate = useNavigate();

    return (
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
    );
}
